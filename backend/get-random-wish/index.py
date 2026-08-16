import json
import os
import random

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

MOCK_WISHES = []


def get_cabinet_data(user_id: str, schema: str, db_url: str) -> dict:
    """Данные личного кабинета пользователя."""
    import psycopg2
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute(f"""
        SELECT id, wish, amount, status, created_at, fulfilled_at, x, y
        FROM {schema}.stars
        WHERE user_id = %s AND status IN ('active', 'fulfilled')
        ORDER BY created_at DESC
    """, (user_id,))
    wishes = []
    for row in cur.fetchall():
        star_id, wish, amount, status, created_at, fulfilled_at, x, y = row
        wishes.append({
            'id': star_id,
            'wish': wish,
            'amount': float(amount),
            'status': status,
            'created_at': created_at.isoformat() if created_at else None,
            'fulfilled_at': fulfilled_at.isoformat() if fulfilled_at else None,
            'x': float(x) if x is not None else 50.0,
            'y': float(y) if y is not None else 50.0,
        })

    cur.execute(f"SELECT COUNT(*) FROM {schema}.stars WHERE user_id = %s AND status = 'fulfilled'", (user_id,))
    fulfilled_count = int(cur.fetchone()[0])

    cur.execute(f"""
        SELECT COUNT(DISTINCT t.star_id)
        FROM {schema}.transactions t
        JOIN {schema}.stars s ON s.id = t.star_id
        WHERE t.user_id = %s AND s.user_id != %s AND t.status = 'completed'
    """, (user_id, user_id))
    altruist_count = int(cur.fetchone()[0])

    cur.execute(f"SELECT COALESCE(SUM(amount), 0) FROM {schema}.stars WHERE user_id = %s", (user_id,))
    total_donated = float(cur.fetchone()[0])

    cur.close()
    conn.close()

    return {
        'wishes': wishes,
        'fulfilled_count': fulfilled_count,
        'altruist_count': altruist_count,
        'total_donated': total_donated,
    }


def handler(event: dict, context) -> dict:
    """Возвращает случайное желание (GET /) или данные кабинета (GET /?action=cabinet&user_id=N)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    params = event.get("queryStringParameters") or {}
    db_url = os.environ.get("DATABASE_URL")
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")

    # Режим кабинета
    if params.get("action") == "cabinet":
        user_id = params.get("user_id")
        if not user_id:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "user_id required"})}
        if not db_url:
            return {"statusCode": 503, "headers": CORS_HEADERS, "body": json.dumps({"error": "db unavailable"})}
        data = get_cabinet_data(user_id, schema, db_url)
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(data)}

    # Режим случайного желания
    exclude_id = None
    if params.get("exclude"):
        try:
            exclude_id = int(params["exclude"])
        except Exception:
            pass

    if db_url:
        try:
            import psycopg2
            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            exclude_clause = f"AND s.id != {exclude_id}" if exclude_id else ""
            cur.execute(f"""
                SELECT s.id, s.wish, s.amount, s.x, s.y, u.name, u.avatar_url
                FROM {schema}.stars s
                JOIN {schema}.users u ON u.id = s.user_id
                WHERE s.status = 'active' {exclude_clause}
                ORDER BY RANDOM() LIMIT 1
            """)
            row = cur.fetchone()
            cur.close()
            conn.close()
            if row:
                star_id, wish, amount, x, y, name, avatar_url = row
                return {
                    "statusCode": 200,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({
                        "id": star_id,
                        "wish": wish,
                        "amount": float(amount),
                        "name": name,
                        "avatar": avatar_url or f"https://api.dicebear.com/7.x/adventurer/svg?seed={star_id}",
                        "x": float(x) if x else 50,
                        "y": float(y) if y else 50,
                        "source": "db",
                    }),
                }
        except Exception:
            pass

    candidates = [w for w in MOCK_WISHES if w["id"] != exclude_id]
    if not candidates:
        candidates = MOCK_WISHES

    if not candidates:
        return {
            "statusCode": 404,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "no_wishes"}),
        }

    wish_data = {**random.choice(candidates), "source": "mock"}
    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(wish_data)}