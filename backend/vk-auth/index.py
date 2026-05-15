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
    """Авторизация через VK ID 2.1: обмен кода на токен, сохранение пользователя в БД."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    code = body.get('code')
    device_id = body.get('device_id', '')
    code_verifier = body.get('code_verifier', '')
    state = body.get('state', '')
    redirect_uri = body.get('redirect_uri', 'https://zagadai.online/vk-callback')

    if not code:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'error': 'code required'}),
        }

    app_id = os.environ['VK_APP_ID']
    app_secret = os.environ['VK_APP_SECRET']

    # Обмен кода на access_token через VK ID OAuth 2.1
    token_params = {
        'grant_type': 'authorization_code',
        'code': code,
        'device_id': device_id,
        'client_id': app_id,
        'client_secret': app_secret,
        'redirect_uri': redirect_uri,
    }
    if code_verifier:
        token_params['code_verifier'] = code_verifier
    if state:
        token_params['state'] = state

    token_body = urllib.parse.urlencode(token_params).encode()
    req = urllib.request.Request('https://id.vk.com/oauth2/auth', data=token_body, method='POST')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    with urllib.request.urlopen(req) as resp:
        token_data = json.loads(resp.read())

    print("VK token_data:", json.dumps(token_data))

    if 'error' in token_data:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'error': token_data.get('error_description', token_data.get('error', 'vk error'))}),
        }

    access_token = token_data.get('access_token')
    id_token = token_data.get('id_token', '')

    # Получаем данные пользователя через VK ID API (токен в теле POST)
    user_info_body = urllib.parse.urlencode({
        'client_id': app_id,
        'access_token': access_token,
    }).encode()
    req2 = urllib.request.Request('https://id.vk.com/oauth2/user_info', data=user_info_body, method='POST')
    req2.add_header('Content-Type', 'application/x-www-form-urlencoded')
    with urllib.request.urlopen(req2) as resp2:
        user_info = json.loads(resp2.read())

    user = user_info.get('user', {})
    print("VK user_info:", json.dumps(user_info))
    vk_id = user.get('user_id') or token_data.get('user_id')
    first_name = user.get('first_name', '')
    last_name = user.get('last_name', '')
    name = f"{first_name} {last_name}".strip()
    # VK ID API может вернуть avatar, photo_200, photo_100, photo_50
    avatar_url = (
        user.get('avatar') or
        user.get('photo_200') or
        user.get('photo_100') or
        user.get('photo_50') or
        ''
    )

    if not vk_id:
        return {
            'statusCode': 400,
            'headers': CORS,
            'body': json.dumps({'error': 'could not get vk user_id'}),
        }

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
        (str(vk_id), name, avatar_url),
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