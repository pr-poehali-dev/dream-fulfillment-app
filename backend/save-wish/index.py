import json
import os

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def handler(event: dict, context) -> dict:
    """Сохраняет желание пользователя в таблицу stars."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
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

    # Случайные координаты если не переданы
    import random
    if x is None:
        x = round(5 + random.random() * 85, 2)
    if y is None:
        y = round(2 + random.random() * 45, 2)

    angel_fund = round(float(amount) * 0.7, 2)

    import psycopg2
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
        'body': json.dumps({
            'id': star_id,
            'x': float(star_x),
            'y': float(star_y),
        }),
    }