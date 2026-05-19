import json
import os
import hashlib
import random
import psycopg2
import urllib.request

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')
TBANK_API = 'https://securepay.tinkoff.ru/v2'

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def make_token(params: dict, secret: str) -> str:
    filtered = {k: v for k, v in params.items() if k not in ('Token', 'Receipt', 'DATA') and v is not None}
    filtered['Password'] = secret
    sorted_vals = ''.join(str(v) for k, v in sorted(filtered.items()))
    return hashlib.sha256(sorted_vals.encode()).hexdigest()


def handle_save(body: dict) -> dict:
    """Старая логика: сохраняет желание без оплаты (статус active сразу)."""
    user_id = body.get('user_id')
    wish = (body.get('wish') or '').strip()
    story = (body.get('story') or '').strip()
    amount = body.get('amount', 0)
    x = body.get('x')
    y = body.get('y')

    if not user_id or not wish or not amount or float(amount) < 10:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'error': 'user_id, wish и amount (>=10) обязательны'}),
        }

    if x is None:
        x = round(5 + random.random() * 85, 2)
    if y is None:
        y = round(2 + random.random() * 45, 2)

    angel_fund = round(float(amount) * 0.7, 2)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.stars (user_id, wish, story, amount, angel_fund, status, x, y)
        VALUES (%s, %s, %s, %s, %s, 'active', %s, %s)
        RETURNING id, x, y
        """,
        (user_id, wish, story or None, float(amount), angel_fund, x, y),
    )
    row = cur.fetchone()
    star_id, star_x, star_y = row
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'id': star_id, 'x': float(star_x), 'y': float(star_y)}),
    }


def handle_create_payment(body: dict) -> dict:
    """Создаёт звезду (pending) и возвращает URL оплаты Т-Банка."""
    user_id = body.get('user_id')
    wish = (body.get('wish') or '').strip()
    story = (body.get('story') or '').strip()
    amount = body.get('amount', 0)

    if not user_id or not wish or not amount or float(amount) < 10:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'error': 'user_id, wish и amount (>=10) обязательны'}),
        }

    terminal_key = os.environ['TBANK_TERMINAL_KEY']
    secret_key = os.environ['TBANK_SECRET_KEY']

    x = round(5 + random.random() * 85, 2)
    y = round(2 + random.random() * 45, 2)
    angel_fund = round(float(amount) * 0.7, 2)
    amount_kopecks = int(float(amount) * 100)

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.stars (user_id, wish, story, amount, angel_fund, status, x, y)
        VALUES (%s, %s, %s, %s, %s, 'pending', %s, %s)
        RETURNING id
        """,
        (user_id, wish, story or None, float(amount), angel_fund, x, y),
    )
    star_id = cur.fetchone()[0]
    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.transactions (user_id, star_id, amount, angel_fund, status)
        VALUES (%s, %s, %s, %s, 'pending')
        RETURNING id
        """,
        (user_id, star_id, float(amount), angel_fund),
    )
    transaction_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    order_id = f"star-{star_id}-tx-{transaction_id}"
    description = f"Зажечь звезду: {wish[:50]}"
    success_url = body.get('success_url', 'https://zagadai.online/?paid=ok')
    fail_url = body.get('fail_url', 'https://zagadai.online/?paid=fail')

    params = {
        'TerminalKey': terminal_key,
        'Amount': amount_kopecks,
        'OrderId': order_id,
        'Description': description,
        'SuccessURL': f"{success_url}&star_id={star_id}",
        'FailURL': fail_url,
    }
    params['Token'] = make_token(params, secret_key)

    req = urllib.request.Request(
        f'{TBANK_API}/Init',
        data=json.dumps(params).encode(),
        headers={'Content-Type': 'application/json'},
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        result = json.loads(resp.read().decode())

    if not result.get('Success'):
        return {
            'statusCode': 502,
            'headers': CORS,
            'body': json.dumps({'error': result.get('Message', 'Ошибка Т-Банка')}),
        }

    payment_url = result.get('PaymentURL')
    payment_id = str(result.get('PaymentId', ''))

    conn2 = psycopg2.connect(os.environ['DATABASE_URL'])
    cur2 = conn2.cursor()
    cur2.execute(
        f"UPDATE {SCHEMA}.transactions SET payment_id = %s WHERE id = %s",
        (payment_id, transaction_id),
    )
    conn2.commit()
    cur2.close()
    conn2.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'payment_url': payment_url,
            'star_id': star_id,
            'x': x,
            'y': y,
        }),
    }


def handle_webhook(body: dict) -> dict:
    """Webhook от Т-Банка: при CONFIRMED переводит звезду в статус active."""
    terminal_key = os.environ['TBANK_TERMINAL_KEY']
    secret_key = os.environ['TBANK_SECRET_KEY']

    if body.get('TerminalKey') != terminal_key:
        return {'statusCode': 403, 'headers': CORS, 'body': 'Forbidden'}

    received_token = body.get('Token', '')
    expected_token = make_token(body, secret_key)
    if received_token != expected_token:
        return {'statusCode': 403, 'headers': CORS, 'body': 'Invalid token'}

    status = body.get('Status')
    payment_id = str(body.get('PaymentId', ''))
    order_id = body.get('OrderId', '')

    if status != 'CONFIRMED':
        return {'statusCode': 200, 'headers': CORS, 'body': 'OK'}

    star_id = None
    try:
        parts = order_id.split('-')
        star_idx = parts.index('star')
        star_id = int(parts[star_idx + 1])
    except (ValueError, IndexError):
        pass

    if not star_id:
        return {'statusCode': 400, 'headers': CORS, 'body': 'Bad OrderId'}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"""
        UPDATE {SCHEMA}.stars SET status = 'active', paid_at = now()
        WHERE id = %s AND status = 'pending'
        """,
        (star_id,),
    )
    cur.execute(
        f"""
        UPDATE {SCHEMA}.transactions SET status = 'paid', payment_id = %s
        WHERE star_id = %s AND status = 'pending'
        """,
        (payment_id, star_id),
    )
    conn.commit()
    cur.close()
    conn.close()

    return {'statusCode': 200, 'headers': CORS, 'body': 'OK'}


def handle_status(body: dict) -> dict:
    """Проверяет статус звезды по star_id."""
    star_id = body.get('star_id')
    if not star_id:
        return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'star_id required'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(f"SELECT status, x, y, wish, amount FROM {SCHEMA}.stars WHERE id = %s", (star_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'not found'})}

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({'status': row[0], 'x': float(row[1]), 'y': float(row[2]), 'wish': row[3], 'amount': float(row[4])}),
    }


def handler(event: dict, context) -> dict:
    """Управляет желаниями и платежами. action=pay — создать платёж, action=webhook — колбек Т-Банка, action=status — статус звезды, иначе — сохранить."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    action = body.get('action', 'save')

    if action == 'pay':
        return handle_create_payment(body)
    elif action == 'webhook':
        return handle_webhook(body)
    elif action == 'status':
        return handle_status(body)
    else:
        return handle_save(body)