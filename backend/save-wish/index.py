import base64
import hashlib
import json
import os
import random
import urllib.parse
import psycopg2

SCHEMA = "t_p75577017_dream_fulfillment_ap"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

W1_CURRENCY_RUB = "643"
SUCCESS_URL = "https://zagadai.online/?paid=1"
FAIL_URL = "https://zagadai.online/?paid=0"


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def w1_signature(params: dict, secret: str) -> str:
    """Считает подпись WalletOne: сортируем WMI_*-параметры по имени, склеиваем
    значения, добавляем секретный ключ, берём MD5 и кодируем в Base64."""
    keys = sorted(k for k in params if k.startswith("WMI_") and k != "WMI_SIGNATURE")
    raw = "".join(str(params[k]) for k in keys) + secret
    digest = hashlib.md5(raw.encode("utf-8")).digest()
    return base64.b64encode(digest).decode("utf-8")


def is_form_urlencoded(event: dict) -> bool:
    headers = event.get("headers") or {}
    ctype = ""
    for k, v in headers.items():
        if k.lower() == "content-type":
            ctype = (v or "").lower()
            break
    return "x-www-form-urlencoded" in ctype


def handler(event: dict, context) -> dict:
    """Сохранение желания, создание подписанного платежа WalletOne и приём
    уведомлений об оплате (ResultURL) от WalletOne."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    raw_body = event.get("body") or ""

    # --- Уведомление об оплате от WalletOne (ResultURL, form-urlencoded) ---
    if event.get("httpMethod") == "POST" and is_form_urlencoded(event) and "WMI_" in raw_body:
        params = dict(urllib.parse.parse_qsl(raw_body))
        secret = os.environ["WALLETONE_SECRET_KEY"]
        expected_sig = w1_signature(params, secret)
        got_sig = params.get("WMI_SIGNATURE", "")

        if expected_sig != got_sig:
            return {
                "statusCode": 200,
                "headers": {**CORS, "Content-Type": "text/plain"},
                "body": "WMI_RESULT=RETRY&WMI_DESCRIPTION=bad_signature",
            }

        star_id = params.get("WMI_PAYMENT_NO")
        payment_id = params.get("WMI_ORDER_ID", "")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.stars SET status = 'active', paid_at = now() WHERE id = %s",
            (star_id,),
        )
        cur.execute(
            f"UPDATE {SCHEMA}.transactions SET status = 'paid', payment_id = %s WHERE star_id = %s",
            (payment_id, star_id),
        )
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "text/plain"},
            "body": "WMI_RESULT=OK",
        }

    body = json.loads(raw_body or "{}")
    action = body.get("action")

    # --- Создание звезды + подписанная платёжная форма WalletOne ---
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

        merchant_id = os.environ["WALLETONE_MERCHANT_ID"]
        secret = os.environ["WALLETONE_SECRET_KEY"]
        description_b64 = base64.b64encode(wish[:150].encode("utf-8")).decode("utf-8")

        payment_params = {
            "WMI_MERCHANT_ID": merchant_id,
            "WMI_PAYMENT_AMOUNT": f"{amount:.2f}",
            "WMI_CURRENCY_ID": W1_CURRENCY_RUB,
            "WMI_PAYMENT_NO": str(star_id),
            "WMI_DESCRIPTION": description_b64,
            "WMI_SUCCESS_URL": SUCCESS_URL,
            "WMI_FAIL_URL": FAIL_URL,
            "WMI_CUSTOMER_EMAIL": email,
        }
        payment_params["WMI_SIGNATURE"] = w1_signature(payment_params, secret)

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({
                "id": star_id,
                "x": x,
                "y": y,
                "payment": payment_params,
            }),
        }

    # --- Проверка статуса (ручной фолбэк, если уведомление не пришло) ---
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
