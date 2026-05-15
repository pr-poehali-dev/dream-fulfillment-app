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
    """Возвращает случайное активное желание из БД (или моки если БД пустая)"""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    exclude_id = None
    params = event.get("queryStringParameters") or {}
    if params.get("exclude"):
        try:
            exclude_id = int(params["exclude"])
        except Exception:
            pass

    db_url = os.environ.get("DATABASE_URL")
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")

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
    wish_data = {**random.choice(candidates), "source": "mock"}
    return {"statusCode": 200, "headers": CORS_HEADERS, "body": json.dumps(wish_data)}