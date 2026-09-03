import requests

base = 'http://127.0.0.1:8000'

endpoints = [
    '/api/problems',
    '/api/problems?status=published',
    '/api/startups',
    '/api/applications',
    '/api/pilots',
    '/api/solutions',
]

for ep in endpoints:
    r = requests.get(base + ep)
    data = r.json()
    count = len(data) if isinstance(data, list) else (len(data.get('data', [])) if isinstance(data, dict) else 'obj')
    print(f"{ep:35s} -> Status: {r.status_code} | Count: {count}")

prob_res = requests.get(base + '/api/problems').json()
if prob_res:
    p_id = prob_res[0]['id']
    r_detail = requests.get(f"{base}/api/problems/{p_id}")
    print(f"/api/problems/{p_id[:8]}... (detail) -> Status: {r_detail.status_code}")
    r_match = requests.get(f"{base}/api/problems/{p_id}/matches")
    print(f"/api/problems/{p_id[:8]}.../matches  -> Status: {r_match.status_code} | Count: {len(r_match.json())}")

pilot_res = requests.get(base + '/api/pilots').json()
if pilot_res:
    pilot_id = pilot_res[0]['id']
    r_pilot = requests.get(f"{base}/api/pilots/{pilot_id}")
    p_data = r_pilot.json()
    print(f"/api/pilots/{pilot_id[:8]}... (detail)   -> Status: {r_pilot.status_code} | Milestones: {len(p_data.get('milestones', []))} | KPIs: {len(p_data.get('kpis', []))}")
    
    r_proc = requests.get(f"{base}/api/procurement/{pilot_id}/procurement")
    print(f"/api/procurement/{pilot_id[:8]}...         -> Status: {r_proc.status_code} | Data: {bool(r_proc.json())}")
