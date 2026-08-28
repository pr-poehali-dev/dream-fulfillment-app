import base64
import hashlib
import json
import os
import random  # noqa: F401 restart trigger
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
    """Считает подпись WalletOne (метод ЭЦП в кабинете W1 — MD5): сортируем
    WMI_*-параметры по имени без учёта регистра, склеиваем значения,
    добавляем секретный ключ, кодируем строку в Windows-1251, берём MD5 (hex),
    затем как в официальном примере W1 — pack("H*", md5_hex) (hex -> байты)
    и результат кодируем в Base64.

    ЗАМЕТКА: WMI_ORDER_ITEMS обязателен всегда — без него Wcheck от W1
    отклоняет форму (подтверждено поддержкой W1)."""
    keys = sorted(
        (k for k in params if k.startswith("WMI_") and k != "WMI_SIGNATURE"),
        key=lambda k: k.lower(),
    )
    raw = "".join(str(params[k]) for k in keys) + secret
    encoded = raw.encode("cp1251", errors="replace")
    md5_hex = hashlib.md5(encoded).hexdigest()
    packed = bytes.fromhex(md5_hex)
    return base64.b64encode(packed).decode("utf-8")


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
    if event.get("isBase64Encoded"):
        try:
            raw_body = base64.b64decode(raw_body).decode("utf-8", errors="replace")
        except Exception:
            pass

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

        pending_id = params.get("WMI_PAYMENT_NO")
        payment_id = params.get("WMI_ORDER_ID", "")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, user_id, wish, story, amount, angel_fund, x, y "
            f"FROM {SCHEMA}.pending_payments WHERE id = %s",
            (pending_id,),
        )
        row = cur.fetchone()

        if not row:
            # Уже обработано ранее (повторное уведомление) — просто подтверждаем
            cur.close()
            conn.close()
            return {
                "statusCode": 200,
                "headers": {**CORS, "Content-Type": "text/plain"},
                "body": "WMI_RESULT=OK",
            }

        star_id, user_id, wish, story, amount, angel_fund, x, y = row

        cur.execute(
            f"INSERT INTO {SCHEMA}.stars (id, user_id, wish, story, amount, angel_fund, status, x, y, paid_at) "
            f"VALUES (%s, %s, %s, %s, %s, %s, 'active', %s, %s, now())",
            (star_id, user_id, wish, story, amount, angel_fund, x, y),
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.transactions (user_id, star_id, amount, angel_fund, status, payment_id) "
            f"VALUES (%s, %s, %s, %s, 'paid', %s)",
            (user_id, star_id, amount, angel_fund, payment_id),
        )
        cur.execute(f"DELETE FROM {SCHEMA}.pending_payments WHERE id = %s", (pending_id,))
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "text/plain"},
            "body": "WMI_RESULT=OK",
        }

    try:
        body = json.loads(raw_body or "{}")
    except json.JSONDecodeError:
        # Неожиданный формат тела (например, form-urlencoded без WMI_ или
        # уже обработанный запрос) — отвечаем OK, чтобы W1 не повторял вебхук.
        if "WMI_" in raw_body:
            return {
                "statusCode": 200,
                "headers": {**CORS, "Content-Type": "text/plain"},
                "body": "WMI_RESULT=RETRY&WMI_DESCRIPTION=unparsable_body",
            }
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Некорректный запрос"})}
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
            f"DELETE FROM {SCHEMA}.pending_payments WHERE created_at < now() - interval '24 hours'"
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.pending_payments (user_id, wish, story, amount, angel_fund, email, x, y) "
            f"VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (user_id, wish, story, amount, angel_fund, email, x, y),
        )
        star_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        merchant_id = os.environ["WALLETONE_MERCHANT_ID"]
        secret = os.environ["WALLETONE_SECRET_KEY"]
        amount_str = f"{amount:.2f}"

        # WMI_ORDER_ITEMS обязателен для Wcheck (требование W1)
        order_items = json.dumps(
            [
                {
                    "Title": "Цифровой актив на zagadai.online",
                    "Quantity": "1.000",
                    "UnitPrice": amount_str,
                    "SubTotal": amount_str,
                    "TaxType": "tax_ru_1",
                    "Tax": "0.00",
                }
            ],
            ensure_ascii=False,
            separators=(",", ":"),
        )
        description = urllib.parse.quote(f"Заказ №{star_id}", safe="")

        payment_params = {
            "WMI_MERCHANT_ID": merchant_id,
            "WMI_PAYMENT_AMOUNT": amount_str,
            "WMI_CURRENCY_ID": W1_CURRENCY_RUB,
            "WMI_PAYMENT_NO": str(star_id),
            "WMI_DESCRIPTION": description,
            "WMI_SUCCESS_URL": SUCCESS_URL,
            "WMI_FAIL_URL": FAIL_URL,
            "WMI_CUSTOMER_EMAIL": email,
            "WMI_ORDER_ITEMS": order_items,
            # Пока у мерчанта подключён только СБП (карты отклонены, ЮMoney
            # в процессе подключения) — форсируем единственный способ оплаты
            "WMI_PTENABLED": "SbpRub",
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
        if row:
            cur.close()
            conn.close()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"status": row[0]})}

        cur.execute(f"SELECT 1 FROM {SCHEMA}.pending_payments WHERE id = %s", (star_id,))
        pending_row = cur.fetchone()
        cur.close()
        conn.close()

        if pending_row:
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"status": "pending"})}

        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Звезда не найдена"})}

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