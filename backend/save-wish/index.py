import json
import os
import random
import hashlib
import psycopg2

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
TERMINAL_KEY = os.environ.get("TBANK_TERMINAL_KEY", "")
SECRET_KEY = os.environ.get("TBANK_SECRET_KEY", "")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def random_position(conn):
    cur = conn.cursor()
    cur.execute(f"SELECT x, y FROM {SCHEMA}.stars WHERE status = 'active'")
    occupied = cur.fetchall()
    cur.close()
    for _ in range(100):
        x = round(random.uniform(2, 98), 2)
        y = round(random.uniform(2, 98), 2)
        conflict = any(abs(x - ox) < 2 and abs(y - oy) < 2 for ox, oy in occupied)
        if not conflict:
            return x, y
    return round(random.uniform(2, 98), 2), round(random.uniform(2, 98), 2)


def tbank_token(params: dict) -> str:
    params_with_secret = {**params, "Password": SECRET_KEY}
    sorted_vals = "".join(str(v) for k, v in sorted(params_with_secret.items()) if k != "Token")
    return hashlib.sha256(sorted_vals.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """Сохранение желания: создание звезды, инициация оплаты, проверка статуса, вебхук от банка."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "save")

    if action == "save":
        user_id = body.get("user_id")
        wish = body.get("wish", "").strip()
        story = body.get("story", "").strip()
        amount = body.get("amount")
        email = body.get("email", "").strip()

        if not user_id or not wish or not amount or not email:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Не заполнены обязательные поля"})}

        amount = float(amount)
        if amount < 10:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Минимальная сумма 10 рублей"})}

        angel_fund = round(amount * 0.1, 2)

        conn = get_conn()
        x, y = random_position(conn)
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.stars (user_id, wish, story, amount, angel_fund, status, x, y) VALUES (%s, %s, %s, %s, %s, 'pending', %s, %s) RETURNING id",
            (user_id, wish, story, amount, angel_fund, x, y),
        )
        star_id = cur.fetchone()[0]

        cur.execute(
            f"INSERT INTO {SCHEMA}.transactions (user_id, star_id, amount, angel_fund, status) VALUES (%s, %s, %s, %s, 'pending') RETURNING id",
            (user_id, star_id, amount, angel_fund),
        )
        tx_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        order_id = f"star-{star_id}-tx-{tx_id}"
        pay_params = {
            "TerminalKey": TERMINAL_KEY,
            "Amount": int(amount * 100),
            "OrderId": order_id,
            "Description": f"Желание #{star_id}",
            "Email": email,
            "SuccessURL": f"https://zagadai.online/?paid=ok&star_id={star_id}",
            "FailURL": "https://zagadai.online/?paid=fail",
        }
        pay_params["Token"] = tbank_token(pay_params)

        import urllib.request
        req = urllib.request.Request(
            "https://securepay.tinkoff.ru/v2/Init",
            data=json.dumps(pay_params).encode(),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req) as resp:
            pay_data = json.loads(resp.read())

        if not pay_data.get("Success"):
            return {"statusCode": 502, "headers": CORS, "body": json.dumps({"error": pay_data.get("Message", "Ошибка платёжной системы")})}

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({
                "id": star_id,
                "x": float(x),
                "y": float(y),
                "payment_url": pay_data.get("PaymentURL"),
            }),
        }

    elif action == "status":
        star_id = body.get("star_id")
        if not star_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "star_id обязателен"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT s.status, s.x, s.y, s.amount, s.wish, u.first_name, u.avatar FROM {SCHEMA}.stars s JOIN {SCHEMA}.users u ON u.id = s.user_id WHERE s.id = %s",
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
                "x": float(x) if x else None,
                "y": float(y) if y else None,
                "amount": float(amount),
                "wish": wish,
                "name": name,
                "avatar": avatar,
            }),
        }

    elif action == "confirm":
        star_id = body.get("star_id")
        if not star_id:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "star_id обязателен"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT s.status, s.x, s.y, s.amount, s.wish, u.first_name, u.avatar FROM {SCHEMA}.stars s JOIN {SCHEMA}.users u ON u.id = s.user_id WHERE s.id = %s",
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
                "x": float(x) if x else None,
                "y": float(y) if y else None,
                "amount": float(amount),
                "wish": wish,
                "name": name,
                "avatar": avatar,
            }),
        }

    elif action == "webhook":
        terminal_key = body.get("TerminalKey")
        if terminal_key != TERMINAL_KEY:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Forbidden"})}

        status = body.get("Status")
        order_id = body.get("OrderId", "")
        payment_id = str(body.get("PaymentId", ""))

        if status != "CONFIRMED":
            return {"statusCode": 200, "headers": CORS, "body": "OK"}

        parts = order_id.split("-")
        if len(parts) < 4:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неверный OrderId"})}

        star_id = int(parts[1])
        tx_id = int(parts[3])

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.stars SET status = 'active', paid_at = now() WHERE id = %s AND status = 'pending'",
            (star_id,),
        )
        cur.execute(
            f"UPDATE {SCHEMA}.transactions SET status = 'paid', payment_id = %s WHERE id = %s",
            (payment_id, tx_id),
        )
        conn.commit()
        cur.close()
        conn.close()

        return {"statusCode": 200, "headers": CORS, "body": "OK"}

    return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неизвестное действие"})}
