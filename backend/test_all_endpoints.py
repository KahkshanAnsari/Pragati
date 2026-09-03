"""
Comprehensive API endpoint test - tests every frontend-facing endpoint
"""
import httpx
import json

BASE = "http://localhost:8000"

def test(name, url, method="GET", json_body=None, headers=None, expected_status=None):
    try:
        if method == "GET":
            r = httpx.get(f"{BASE}{url}", headers=headers or {}, timeout=10.0)
        elif method == "POST":
            r = httpx.post(f"{BASE}{url}", json=json_body, headers=headers or {}, timeout=10.0)
        
        status_icon = "PASS" if (r.status_code < 400) else "FAIL"
        data_preview = ""
        try:
            data = r.json()
            if isinstance(data, list):
                data_preview = f"[{len(data)} items]"
            elif isinstance(data, dict):
                data_preview = str(data)[:80]
        except Exception:
            data_preview = r.text[:80]
        
        print(f"[{status_icon}] {name}: HTTP {r.status_code} | {data_preview}")
        return r.status_code, r.json() if r.headers.get("content-type","").startswith("application/json") else r.text
    except Exception as e:
        print(f"[FAIL] {name}: Exception - {e}")
        return 0, None

print("=" * 70)
print("PRAGATI API ENDPOINT VERIFICATION")
print("=" * 70)

# Health
test("Health Check", "/health")
test("Root Check", "/")

# Problems
print("\n--- PROBLEMS ---")
_, problems = test("List All Problems", "/api/problems")
print(f"  Problem count: {len(problems) if isinstance(problems, list) else 'N/A'}")
_, pub_problems = test("List Published Problems", "/api/problems?status=published")
print(f"  Published: {len(pub_problems) if isinstance(pub_problems, list) else 'N/A'}")
_, water_probs = test("Filter by sector Water", "/api/problems?sector=Water")
print(f"  Water sector: {len(water_probs) if isinstance(water_probs, list) else 'N/A'}")
_, search_probs = test("Search problems: leakage", "/api/problems?search=leakage")
print(f"  Search 'leakage': {len(search_probs) if isinstance(search_probs, list) else 'N/A'}")

# Get first problem's ID for downstream tests
first_problem_id = None
if isinstance(problems, list) and problems:
    first_problem_id = problems[0]["id"]
    test(f"Get Problem by ID", f"/api/problems/{first_problem_id}")

# Startups
print("\n--- STARTUPS ---")
_, startups = test("List All Startups", "/api/startups")
print(f"  Startup count: {len(startups) if isinstance(startups, list) else 'N/A'}")
first_startup_id = None
if isinstance(startups, list) and startups:
    first_startup_id = startups[0]["id"]
    test(f"Get Startup by ID", f"/api/startups/{first_startup_id}")
    test(f"Startup Documents", f"/api/startups/{first_startup_id}/documents")
    test(f"Startup Pilots", f"/api/startups/{first_startup_id}/pilots")
    test(f"Startup Applications", f"/api/startups/{first_startup_id}/applications")
    
# Filter by sector
_, water_startups = test("Filter Startups by sector=Water", "/api/startups?sector=Water")
print(f"  Water sector startups: {len(water_startups) if isinstance(water_startups, list) else 'N/A'}")

# Applications
print("\n--- APPLICATIONS ---")
_, apps = test("List All Applications", "/api/applications")
print(f"  Total applications: {len(apps) if isinstance(apps, list) else 'N/A'}")
_, sub_apps = test("Filter Submitted Applications", "/api/applications?status=submitted")
_, short_apps = test("Filter Shortlisted Applications", "/api/applications?status=shortlisted")
_, sel_apps = test("Filter Selected Applications", "/api/applications?status=selected")
_, rej_apps = test("Filter Rejected Applications", "/api/applications?status=rejected")
print(f"  submitted: {len(sub_apps) if isinstance(sub_apps, list) else '?'}, shortlisted: {len(short_apps) if isinstance(short_apps, list) else '?'}, selected: {len(sel_apps) if isinstance(sel_apps, list) else '?'}, rejected: {len(rej_apps) if isinstance(rej_apps, list) else '?'}")

if first_problem_id:
    _, prob_apps = test(f"Applications for first problem", f"/api/applications?problem_id={first_problem_id}")
    print(f"  Applications for problem: {len(prob_apps) if isinstance(prob_apps, list) else 'N/A'}")

# Pilots
print("\n--- PILOTS ---")
_, pilots = test("List All Pilots", "/api/pilots")
print(f"  Pilot count: {len(pilots) if isinstance(pilots, list) else 'N/A'}")
first_pilot_id = None
if isinstance(pilots, list) and pilots:
    first_pilot_id = pilots[0]["id"]
    _, pilot_detail = test(f"Get Pilot Detail", f"/api/pilots/{first_pilot_id}")
    test(f"Get Pilot Milestones", f"/api/pilots/{first_pilot_id}/milestones")
    test(f"Get Pilot KPIs", f"/api/pilots/{first_pilot_id}/kpis")
    test(f"Get Pilot Transactions", f"/api/pilots/{first_pilot_id}/transactions")
    test(f"Get Pilot Inspections", f"/api/pilots/{first_pilot_id}/inspections")
    test(f"Get Pilot Procurement", f"/api/pilots/{first_pilot_id}/procurement")

# Matching
print("\n--- AI MATCHING ---")
if first_problem_id:
    _, matches_get = test(f"GET Existing Matches", f"/api/problems/{first_problem_id}/matches")
    print(f"  Matches returned: {len(matches_get) if isinstance(matches_get, list) else 'N/A'}")

# Water Leakage Problem specifically
print("\n--- WATER LEAKAGE PROBLEM MATCHING ---")
wl_problem = None
if isinstance(problems, list):
    for p in problems:
        if "leakage" in p.get("title","").lower() or "water" in p.get("title","").lower():
            wl_problem = p
            break
if wl_problem:
    wl_id = wl_problem["id"]
    print(f"  Found: {wl_problem['title'][:60]}")
    _, wl_matches = test(f"GET Matches for Water Leakage", f"/api/problems/{wl_id}/matches")
    if isinstance(wl_matches, list):
        print(f"  Match count: {len(wl_matches)}")
        for m in wl_matches[:3]:
            s = m.get("startup") or {}
            name = s.get("name", m.get("startup_id", "?"))
            print(f"    {name}: {m.get('match_percent')}%")

# Solutions
print("\n--- VALIDATED SOLUTIONS ---")
_, solutions = test("List Validated Solutions", "/api/solutions")
print(f"  Solutions count: {len(solutions) if isinstance(solutions, list) else 'N/A'}")

# Procurement
print("\n--- PROCUREMENT ---")
_, procurement = test("List Procurement Cases", "/api/procurement")
print(f"  Procurement count: {len(procurement) if isinstance(procurement, list) else 'N/A'}")

# Budget
print("\n--- BUDGET ---")
if first_pilot_id:
    test(f"Budget Transactions for pilot", f"/api/budget/{first_pilot_id}/transactions")

print("\n" + "=" * 70)
print("API VERIFICATION COMPLETE")
print("=" * 70)
