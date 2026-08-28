import json
import os
import random

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

MOCK_WISHES = []


def handler(event: dict, context) -> dict:
    """Возвращает желание по порядковому номеру (1-based), total или все звёзды (action=all)."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    params = event.get("queryStringParameters") or {}

    if params.get("action") == "all":
        db_url = os.environ.get("DATABASE_URL")
        schema = os.environ.get("MAIN_DB_SCHEMA", "public")
        if db_url:
            try:
                import psycopg2
                conn = psycopg2.connect(db_url)
                cur = conn.cursor()
                cur.execute(f"""
                    SELECT s.id, s.wish, s.amount, s.x, s.y, u.name, u.avatar_url, s.brightness, s.created_at, u.vk_id
                    FROM {schema}.stars s
                    JOIN {schema}.users u ON u.id = s.user_id
                    WHERE s.status = 'active'
                    ORDER BY s.created_at ASC
                """)
                rows = cur.fetchall()
                stars = [
                    {
                        "id": r[0], "wish": r[1], "amount": float(r[2]),
                        "x": float(r[3]) if r[3] else 50,
                        "y": float(r[4]) if r[4] else 50,
                        "name": r[5],
                        "avatar": r[6] or f"https://api.dicebear.com/7.x/adventurer/svg?seed={r[0]}",
                        "avatar_url": r[6] or f"https://api.dicebear.com/7.x/adventurer/svg?seed={r[0]}",
                        "brightness": float(r[7]) if r[7] is not None else 0.8,
                        "created_at": r[8].isoformat() if r[8] else None,
                        "vk_id": r[9],
                    }
                    for r in rows
                ]
                cur.execute(f"""
                    SELECT COALESCE(SUM(angel_fund), 0)
                    FROM {schema}.stars
                    WHERE status IN ('active', 'fulfilled')
                """)
                copilka_amount = float(cur.fetchone()[0])
                cur.execute(f"""
                    SELECT COUNT(*) FROM {schema}.stars WHERE status = 'fulfilled'
                """)
                fulfilled_count = cur.fetchone()[0]
                cur.close()
                conn.close()
                return {
                    "statusCode": 200,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({
                        "stars": stars,
                        "total": len(stars),
                        "copilka_amount": copilka_amount,
                        "fulfilled_count": fulfilled_count,
                    }),
                }
            except Exception as e:
                return {"statusCode": 500, "headers": CORS_HEADERS, "body": json.dumps({"error": str(e)})}
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"stars": [], "total": 0, "copilka_amount": 0, "fulfilled_count": 0})}

    number_str = params.get("number")

    db_url = os.environ.get("DATABASE_URL")
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")

    total = len(MOCK_WISHES)
    wishes = MOCK_WISHES

    if db_url:
        try:
            import psycopg2
            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            cur.execute(f"SELECT COUNT(*) FROM {schema}.stars WHERE status = 'active'")
            db_total = cur.fetchone()[0]
            if db_total > 0:
                total = db_total
                wishes = None  # будем делать отдельный запрос
            cur.close()
            conn.close()
        except Exception:
            pass

    if number_str is None:
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"total": total}),
        }

    try:
        number = int(number_str)
    except (ValueError, TypeError):
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "invalid_number", "total": total}),
        }

    if number < 1 or number > total:
        return {
            "statusCode": 404,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "out_of_range", "total": total}),
        }

    if db_url and wishes is None:
        try:
            import psycopg2
            conn = psycopg2.connect(db_url)
            cur = conn.cursor()
            cur.execute(f"""
                SELECT s.id, s.wish, s.amount, s.x, s.y, u.name, u.avatar_url
                FROM {schema}.stars s
                JOIN {schema}.users u ON u.id = s.user_id
                WHERE s.status = 'active'
                ORDER BY s.created_at ASC
                LIMIT 1 OFFSET {number - 1}
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
                        "number": number,
                        "total": total,
                        "wish": wish,
                        "amount": float(amount),
                        "name": name,
                        "avatar": avatar_url or f"https://api.dicebear.com/7.x/adventurer/svg?seed={star_id}",
                        "x": float(x) if x else 50,
                        "y": float(y) if y else 50,
                        "source": "db",
                    }),
                }
            return {
                "statusCode": 404,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "out_of_range", "total": total}),
            }
        except Exception as e:
            return {
                "statusCode": 500,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": str(e)}),
            }

    if 0 <= number - 1 < len(MOCK_WISHES):
        item = MOCK_WISHES[number - 1]
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({**item, "number": number, "total": total, "source": "mock"}),
        }

    return {
        "statusCode": 404,
        "headers": CORS_HEADERS,
        "body": json.dumps({"error": "out_of_range", "total": total}),
    }