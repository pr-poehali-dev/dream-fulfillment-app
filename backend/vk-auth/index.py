import json
import os
import urllib.request
import urllib.parse
import psycopg2

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 'public')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    """Авторизация через VK: обмен кода на токен, сохранение пользователя в БД."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    code = body.get('code')
    redirect_uri = body.get('redirect_uri')

    if not code or not redirect_uri:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'error': 'code and redirect_uri required'}),
        }

    app_id = os.environ['VK_APP_ID']
    app_secret = os.environ['VK_APP_SECRET']

    # Обмен кода на access_token
    params = urllib.parse.urlencode({
        'client_id': app_id,
        'client_secret': app_secret,
        'redirect_uri': redirect_uri,
        'code': code,
    })
    token_url = f'https://id.vk.com/access_token?{params}'
    with urllib.request.urlopen(token_url) as resp:
        token_data = json.loads(resp.read())

    if 'error' in token_data:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'error': token_data.get('error_description', 'vk error')}),
        }

    access_token = token_data['access_token']
    vk_id = token_data['user_id']

    # Получаем данные пользователя из VK API
    user_params = urllib.parse.urlencode({
        'user_ids': vk_id,
        'fields': 'photo_200',
        'access_token': access_token,
        'v': '5.131',
    })
    user_url = f'https://api.vk.com/method/users.get?{user_params}'
    with urllib.request.urlopen(user_url) as resp:
        user_data = json.loads(resp.read())

    vk_user = user_data['response'][0]
    name = f"{vk_user.get('first_name', '')} {vk_user.get('last_name', '')}".strip()
    avatar_url = vk_user.get('photo_200', '')

    # Сохраняем / обновляем пользователя в БД
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        f"""
        INSERT INTO {SCHEMA}.users (vk_id, name, avatar_url)
        VALUES (%s, %s, %s)
        ON CONFLICT (vk_id) DO UPDATE SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
        RETURNING id
        """,
        (vk_id, name, avatar_url),
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS,
        'body': json.dumps({
            'id': user_id,
            'vk_id': vk_id,
            'name': name,
            'avatar_url': avatar_url,
        }),
    }