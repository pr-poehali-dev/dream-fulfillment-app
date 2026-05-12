import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = "smtp.yandex.ru"
SMTP_PORT = 465
FROM_EMAIL = "zagadai.online@yandex.ru"
TO_EMAIL = "zagadai.online@yandex.ru"

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    """Отправляет письмо с формы обратной связи на zagadai.online@yandex.ru"""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    message = body.get("message", "").strip()

    if not name or not email or not message:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"error": "Заполните все поля"}),
        }

    smtp_password = os.environ["SMTP_PASSWORD"]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Сообщение с сайта от {name}"
    msg["From"] = FROM_EMAIL
    msg["To"] = TO_EMAIL
    msg["Reply-To"] = email

    text = f"Имя: {name}\nEmail: {email}\n\nСообщение:\n{message}"
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px;">
      <h2 style="color: #c9a84c;">Новое сообщение с zagadai.online</h2>
      <p><b>Имя:</b> {name}</p>
      <p><b>Email:</b> <a href="mailto:{email}">{email}</a></p>
      <hr style="border-color: #c9a84c33;" />
      <p style="white-space: pre-wrap;">{message}</p>
    </div>
    """

    msg.attach(MIMEText(text, "plain", "utf-8"))
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(FROM_EMAIL, smtp_password)
        server.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"ok": True}),
    }
