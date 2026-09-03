import requests

base = 'http://127.0.0.1:8000'
res = requests.get(base + '/api/problems').json()
print("Checking matching per problem:")
for p in res:
    m = requests.get(f"{base}/api/problems/{p['id']}/matches").json()
    if len(m) > 0:
        print(f"  [OK] {p['title'][:40]} ({p['id'][:8]}...) -> {len(m)} matches")

print("\nChecking procurement cases:")
pilots = requests.get(base + '/api/pilots').json()
for pilot in pilots:
    p_id = pilot['id']
    proc = requests.get(f"{base}/api/procurement/{p_id}/procurement").json()
    if proc:
        print(f"  [OK] Pilot {pilot.get('pilot_number', p_id[:8])} -> Procurement Case Score: {proc.get('readiness_score')}% ({proc.get('readiness_level')})")
