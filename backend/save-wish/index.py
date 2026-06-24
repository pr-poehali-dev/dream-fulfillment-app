import json
import os
import random
import psycopg2

SCHEMA = "t_p75577017_dream_fulfillment_ap"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Сохранение желания, проверка и подтверждение оплаты через WalletOne."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action")

    # --- Создание звезды (первый вызов без action) ---
    if not action:
        user_id = body.get("user_id")
        wish = body.get("wish", "").strip()
        story = body.get("story", "").strip()
        amount = body.get("amount")
        email = body.get("email", "").strip()

        if not user_id or not wish or not amount or not email:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Не хватает полей"})}

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Некорректная сумма"})}

        angel_fund = round(amount * 0.1, 2)
        x = round(random.uniform(2, 98), 2)
        y = round(random.uniform(2, 98), 2)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.stars (user_id, wish, story, amount, angel_fund, status, x, y) "
            f"VALUES (%s, %s, %s, %s, %s, 'pending', %s, %s) RETURNING id",
            (user_id, wish, story, amount, angel_fund, x, y),
        )
        star_id = cur.fetchone()[0]
        cur.execute(
            f"INSERT INTO {SCHEMA}.transactions (user_id, star_id, amount, angel_fund, status) "
            f"VALUES (%s, %s, %s, %s, 'pending')",
            (user_id, star_id, amount, angel_fund),
        )
        conn.commit()
        cur.close()
        conn.close()

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"id": star_id, "x": x, "y": y})}

    # --- Проверка статуса ---
    if action == "status":
        star_id = body.get("star_id")
        if not star_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "star_id обязателен"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT status FROM {SCHEMA}.stars WHERE id = %s", (star_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Звезда не найдена"})}

        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"status": row[0]})}

    # --- Подтверждение после возврата с оплаты ---
    if action == "confirm":
        star_id = body.get("star_id")
        if not star_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "star_id обязателен"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT s.status, s.x, s.y, s.amount, s.wish, u.name, u.avatar_url "
            f"FROM {SCHEMA}.stars s JOIN {SCHEMA}.users u ON u.id = s.user_id "
            f"WHERE s.id = %s",
            (star_id,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()

        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Звезда не найдена"})}

        status, x, y, amount, wish, name, avatar = row
        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({
                "status": status,
                "x": float(x),
                "y": float(y),
                "amount": float(amount),
                "wish": wish,
                "name": name,
                "avatar": avatar,
            }),
        }

    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестный action"})}
