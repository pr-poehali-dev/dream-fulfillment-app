import json
import os
import re
import urllib.request
import urllib.error

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

STAR_PREVIEW_URL = "https://functions.poehali.dev/443189d2-cd36-46fb-a7b2-4f7221ef8fd2"

UA_BROWSER = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
UA_VK_BOT = "Mozilla/5.0 (compatible; VK Share Button/1.0; +https://vk.com/dev/Share)"

OG_TAGS = ["og:title", "og:description", "og:image", "og:url", "og:type"]


def fetch(url: str, user_agent: str, timeout: float = 8.0) -> dict:
    """Делает GET-запрос с указанным User-Agent и возвращает статус, заголовки и тело (обрезанное)."""
    req = urllib.request.Request(url, headers={"User-Agent": user_agent})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read(20000).decode("utf-8", errors="replace")
            return {
                "ok": True,
                "status": resp.status,
                "content_type": resp.headers.get("Content-Type", ""),
                "final_url": resp.geturl(),
                "body_snippet": body[:4000],
                "body_length": len(body),
            }
    except urllib.error.HTTPError as e:
        body = e.read(4000).decode("utf-8", errors="replace") if e.fp else ""
        return {
            "ok": False,
            "status": e.code,
            "error": str(e),
            "body_snippet": body,
        }
    except Exception as e:
        return {"ok": False, "status": None, "error": str(e)}


def extract_og_tags(html: str) -> dict:
    """Вытаскивает og:* meta-теги из HTML простым regex-парсингом."""
    found = {}
    for tag in OG_TAGS:
        m = re.search(
            rf'<meta[^>]+property=["\']' + re.escape(tag) + r'["\'][^>]+content=["\']([^"\']*)["\']',
            html,
            re.IGNORECASE,
        )
        if not m:
            m = re.search(
                rf'<meta[^>]+content=["\']([^"\']*)["\'][^>]+property=["\']' + re.escape(tag) + r'["\']',
                html,
                re.IGNORECASE,
            )
        found[tag] = m.group(1) if m else None
    return found


def check_image(url: str) -> dict:
    """Проверяет, что картинка og:image реально доступна."""
    if not url:
        return {"ok": False, "error": "og:image не найден в HTML"}
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA_BROWSER})
    try:
        with urllib.request.urlopen(req, timeout=8.0) as resp:
            return {
                "ok": resp.status == 200,
                "status": resp.status,
                "content_type": resp.headers.get("Content-Type", ""),
                "content_length": resp.headers.get("Content-Length", ""),
            }
    except Exception as e:
        return {"ok": False, "error": str(e)}


def handler(event: dict, context) -> dict:
    """Отладочная диагностика репоста звезды в ВКонтакте: делает запросы
    к zagadai.online/star/{id} с разными User-Agent (обычный браузер и VK-бот),
    проверяет ответ функции star-preview напрямую и доступность og:image,
    возвращает подробный отчёт — что именно видит каждый из них."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    params = event.get("queryStringParameters") or {}
    star_id_raw = params.get("id", "1")

    try:
        star_id = int(star_id_raw)
    except (TypeError, ValueError):
        return {
            "statusCode": 400,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"error": "Некорректный id звезды"}),
        }

    domain_url = f"https://zagadai.online/star/{star_id}"
    function_url = f"{STAR_PREVIEW_URL}?id={star_id}"

    result_browser = fetch(domain_url, UA_BROWSER)
    result_vk_bot = fetch(domain_url, UA_VK_BOT)
    result_function = fetch(function_url, UA_VK_BOT)

    vk_bot_is_spa = False
    if result_vk_bot.get("ok"):
        snippet = result_vk_bot.get("body_snippet", "")
        vk_bot_is_spa = '<script type="module"' in snippet or 'id="root"' in snippet

    og_from_domain_vk = extract_og_tags(result_vk_bot.get("body_snippet", "")) if result_vk_bot.get("ok") else {}
    og_from_function = extract_og_tags(result_function.get("body_snippet", "")) if result_function.get("ok") else {}

    image_check = check_image(og_from_function.get("og:image"))

    diagnosis = []
    if vk_bot_is_spa:
        diagnosis.append(
            "ПРОБЛЕМА: zagadai.online/star/{id} с User-Agent VK-бота отдаёт обычный SPA (index.html), "
            "а не HTML с og-тегами от функции star-preview. Значит на уровне домена/CDN НЕ настроено "
            "правило маршрутизации ботов на cloud-функцию star-preview — это нужно донастроить в поддержке поехали.dev."
        )
    else:
        diagnosis.append("OK: VK-бот на домене получает HTML с og-тегами (не SPA).")

    if not image_check.get("ok"):
        diagnosis.append(f"ПРОБЛЕМА: og:image недоступен или отсутствует — {image_check.get('error', image_check)}")
    else:
        diagnosis.append("OK: og:image доступен и отдаёт картинку.")

    if og_from_function.get("og:title") and og_from_function.get("og:image"):
        diagnosis.append("OK: сама функция star-preview формирует корректные og-теги при прямом вызове.")

    report = {
        "star_id": star_id,
        "checked_urls": {
            "domain_star_url": domain_url,
            "function_url": function_url,
        },
        "domain_as_browser": {
            "user_agent": UA_BROWSER,
            "status": result_browser.get("status"),
            "looks_like_spa": '<script type="module"' in result_browser.get("body_snippet", ""),
        },
        "domain_as_vk_bot": {
            "user_agent": UA_VK_BOT,
            "status": result_vk_bot.get("status"),
            "looks_like_spa": vk_bot_is_spa,
            "og_tags_found": og_from_domain_vk,
        },
        "function_direct_call": {
            "user_agent": UA_VK_BOT,
            "status": result_function.get("status"),
            "og_tags_found": og_from_function,
        },
        "og_image_check": image_check,
        "diagnosis": diagnosis,
    }

    return {
        "statusCode": 200,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(report, ensure_ascii=False, indent=2),
    }
