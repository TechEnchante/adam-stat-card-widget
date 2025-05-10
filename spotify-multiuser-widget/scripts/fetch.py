import json, requests, os

# Spotify credentials stored in GH secrets
CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

def refresh_access(refresh_token):
    r = requests.post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    })
    return r.json().get('access_token')


def get_current(token):
    r = requests.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        headers={'Authorization': f'Bearer {token}'}
    )
    if r.status_code==200 and r.json().get('item'):
        item = r.json()['item']
        return {
          'track': item['name'],
          'artist': ', '.join(a['name'] for a in item['artists']),
          'albumArt': item['album']['images'][0]['url'],
          'uri': item['id']
        }
    return None


def main():
    users = json.load(open('config.json'))
    out = []
    for u in users:
        token = refresh_access(u['refreshToken'])
        current = get_current(token)
        out.append({'name': u['name'], 'current': current})
    json.dump(out, open('data.json','w'), indent=2)

if __name__=='__main__':
    main()