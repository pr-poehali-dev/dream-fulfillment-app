import io
import json
import os
import textwrap

import boto3
import psycopg2
from PIL import Image, ImageDraw, ImageFilter, ImageFont

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

FONT_DIR = os.path.join(os.path.dirname(__file__), "fonts")
SITE_URL = "https://zagadai.online"


def get_tier(amount: float) -> str:
    """Название тарифа звезды по сумме доната (совпадает с фронтендом)."""
    if amount >= 1000:
        return "Звездопад"
    if amount >= 500:
        return "Созвездие"
    if amount >= 100:
        return "Яркая звезда"
    if amount >= 50:
        return "Звезда"
    return "Звёздочка"


def fetch_star(star_id: int):
    """Достаёт из БД желание, сумму и имя владельца звезды по id."""
    db_url = os.environ.get("DATABASE_URL")
    schema = os.environ.get("MAIN_DB_SCHEMA", "public")
    if not db_url:
        return None
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    cur.execute(
        f"""
        SELECT s.id, s.wish, s.amount, u.name
        FROM {schema}.stars s
        JOIN {schema}.users u ON u.id = s.user_id
        WHERE s.id = %s
        """,
        (star_id,),
    )
    row = cur.fetchone()
    cur.close()
    conn.close()
    if not row:
        return None
    sid, wish, amount, name = row
    return {"id": sid, "wish": wish, "amount": float(amount), "name": name}


def generate_preview_image(star_id: int, wish: str, tier_label: str) -> bytes:
    """Рисует картинку-превью звезды для соцсетей (1200x630)."""
    w, h = 1200, 630
    bg_top = (5, 6, 13)
    bg_bottom = (10, 14, 26)
    img = Image.new("RGB", (w, h), bg_top)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h
        r = int(bg_top[0] + (bg_bottom[0] - bg_top[0]) * t)
        g = int(bg_top[1] + (bg_bottom[1] - bg_top[1]) * t)
        b = int(bg_top[2] + (bg_bottom[2] - bg_top[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    glow = Image.new("RGB", (w, h), (0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((w / 2 - 320, h / 2 - 260, w / 2 + 320, h / 2 + 260), fill=(70, 52, 12))
    glow = glow.filter(ImageFilter.GaussianBlur(140))
    img = Image.blend(img, glow, 0.55)
    draw = ImageDraw.Draw(img)

    gold = (201, 168, 76)
    white = (240, 232, 208)
    grey = (200, 210, 240)

    f_logo = ImageFont.truetype(f"{FONT_DIR}/NotoSans-Bold.ttf", 26)
    f_number = ImageFont.truetype(f"{FONT_DIR}/NotoSans-Bold.ttf", 68)
    f_tier = ImageFont.truetype(f"{FONT_DIR}/NotoSans-Bold.ttf", 22)
    f_wish = ImageFont.truetype(f"{FONT_DIR}/NotoSerif-Italic.ttf", 32)

    def center_text(y: int, text: str, font: ImageFont.FreeTypeFont, fill):
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) / 2, y), text, font=font, fill=fill)

    center_text(56, "ЗАГАДАЙ.ОНЛАЙН", f_logo, gold)
    center_text(130, f"№ {star_id}", f_number, gold)
    center_text(216, tier_label.upper(), f_tier, grey)

    clean_wish = " ".join(wish.split())
    if len(clean_wish) > 220:
        clean_wish = clean_wish[:217].rstrip() + "…"
    lines = textwrap.wrap(clean_wish, width=40)[:5]

    total_h = len(lines) * 46
    y = 630 // 2 - total_h // 2 + 40
    for i, line in enumerate(lines):
        text = f"«{line}»" if i == 0 and len(lines) == 1 else (f"«{line}" if i == 0 else line)
        if i == len(lines) - 1 and len(lines) > 1:
            text = f"{line}»"
        center_text(y, text, f_wish, white)
        y += 46

    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def get_or_create_image_url(star_id: int, wish: str, tier_label: str) -> str:
    """Возвращает CDN-ссылку на картинку превью, генерируя и загружая её при первом обращении."""
    access_key = os.environ["AWS_ACCESS_KEY_ID"]
    secret_key = os.environ["AWS_SECRET_ACCESS_KEY"]
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
    )
    key = f"og/star-{star_id}.png"
    cdn_url = f"https://cdn.poehali.dev/projects/{access_key}/bucket/{key}"

    try:
        s3.head_object(Bucket="files", Key=key)
        return cdn_url
    except Exception:
        pass

    image_bytes = generate_preview_image(star_id, wish, tier_label)
    s3.put_object(Bucket="files", Key=key, Body=image_bytes, ContentType="image/png")
    return cdn_url


def escape_html(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def render_html(star_id: int, wish: str, tier_label: str, image_url: str) -> str:
    star_url = f"{SITE_URL}/star/{star_id}"
    title = f"Звезда №{star_id} на Загадай.Онлайн"
    description = wish if len(wish) <= 300 else wish[:297].rstrip() + "…"
    title_e = escape_html(title)
    description_e = escape_html(description)
    star_url_e = escape_html(star_url)

    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<title>{title_e}</title>
<meta name="description" content="{description_e}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title_e}">
<meta property="og:description" content="{description_e}">
<meta property="og:image" content="{escape_html(image_url)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="{star_url_e}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title_e}">
<meta name="twitter:description" content="{description_e}">
<meta name="twitter:image" content="{escape_html(image_url)}">
<script>window.location.replace("{star_url_e}");</script>
</head>
<body style="background:#05060d;color:#f0e8d0;font-family:sans-serif;text-align:center;padding-top:80px;">
  <p>Переходим на страницу звезды №{star_id}…</p>
  <p><a href="{star_url_e}" style="color:#c9a84c;">Нажми, если не произошёл переход автоматически</a></p>
</body>
</html>"""


def handler(event: dict, context) -> dict:
    """Отдаёт HTML-страницу с og:title/og:description/og:image для конкретной звезды
    (нужно для корректного репоста ссылки в ВКонтакте) и мгновенно перенаправляет
    обычных посетителей на настоящую страницу zagadai.online/star/{id}."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    params = event.get("queryStringParameters") or {}
    star_id_raw = params.get("id")

    html_headers = {**CORS_HEADERS, "Content-Type": "text/html; charset=utf-8"}

    if not star_id_raw:
        return {"statusCode": 400, "headers": html_headers, "body": "<h1>Не указан id звезды</h1>"}

    try:
        star_id = int(star_id_raw)
    except (TypeError, ValueError):
        return {"statusCode": 400, "headers": html_headers, "body": "<h1>Некорректный id звезды</h1>"}

    star = fetch_star(star_id)
    if not star:
        return {
            "statusCode": 404,
            "headers": html_headers,
            "body": f"""<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8">
<title>Звезда не найдена — Загадай.Онлайн</title>
<script>window.location.replace("{SITE_URL}");</script></head>
<body style="background:#05060d;color:#f0e8d0;font-family:sans-serif;text-align:center;padding-top:80px;">
<p>Звезда №{star_id} не найдена.</p>
<p><a href="{SITE_URL}" style="color:#c9a84c;">На главную</a></p>
</body></html>""",
        }

    tier_label = get_tier(star["amount"])
    image_url = get_or_create_image_url(star_id, star["wish"], tier_label)
    html = render_html(star_id, star["wish"], tier_label, image_url)

    return {"statusCode": 200, "headers": html_headers, "body": html}
