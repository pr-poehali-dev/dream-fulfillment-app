import json
import os
import random

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

MOCK_WISHES = [
    {"id": 1, "wish": "Поехать с семьёй на море этим летом", "amount": 150, "name": "Алина К.", "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=alina", "x": 23, "y": 18},
    {"id": 2, "wish": "Открыть небольшую пекарню в родном городе", "amount": 500, "name": "Максим Г.", "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=maxim", "x": 67, "y": 32},
    {"id": 3, "wish": "Купить маме новый ноутбук для работы", "amount": 80, "name": "Света П.", "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=sveta", "x": 45, "y": 55},
    {"id": 4, "wish": "Научиться играть на гитаре и выступить на сцене", "amount": 1000, "name": "Дима В.", "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=dima", "x": 12, "y": 70},
    {"id": 5, "wish": "Отучиться на курсах дизайна и сменить профессию", "amount": 300, "name": "Катя Р.", "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=katya", "x": 80, "y": 15},
    {"id": 6, "wish": "Вылечить спину и снова начать бегать по утрам", "amount": 200, "name": "Игорь С.", "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=igor", "x": 55, "y": 40},
    {"id": 7, "wish": "Переехать в дом с садом и завести собаку", "amount": 750, "name": "Марина Д.", "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=marina", "x": 35, "y": 62},
]


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
                    SELECT s.id, s.wish, s.amount, s.x, s.y, u.name, u.avatar_url
                    FROM {schema}.stars s
                    JOIN {schema}.users u ON u.id = s.user_id
                    WHERE s.status = 'active'
                    ORDER BY s.created_at ASC
                """)
                rows = cur.fetchall()
                cur.close()
                conn.close()
                stars = [
                    {
                        "id": r[0], "wish": r[1], "amount": float(r[2]),
                        "x": float(r[3]) if r[3] else 50,
                        "y": float(r[4]) if r[4] else 50,
                        "name": r[5],
                        "avatar": r[6] or f"https://api.dicebear.com/7.x/adventurer/svg?seed={r[0]}",
                    }
                    for r in rows
                ]
                return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"stars": stars, "total": len(stars)})}
            except Exception as e:
                return {"statusCode": 500, "headers": CORS_HEADERS, "body": json.dumps({"error": str(e)})}
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps({"stars": [], "total": 0})}

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
        except Exception:
            pass

    item = MOCK_WISHES[number - 1]
    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({**item, "number": number, "total": total, "source": "mock"}),
    }