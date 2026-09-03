import httpx, sys

c = httpx.Client(timeout=10)

def q(name, url):
    try:
        r = c.get("http://localhost:8000" + url)
        d = r.json()
        cnt = len(d) if isinstance(d, list) else "obj"
        icon = "PASS" if r.status_code < 400 else "FAIL"
        print(f"[{icon}] {name}: HTTP {r.status_code} | {cnt}")
        return d
    except Exception as e:
        print(f"[FAIL] {name}: {e}")
        return None

q("Health", "/health")
probs = q("Problems all", "/api/problems")
q("Problems published", "/api/problems?status=published")
q("Problems sector=Water", "/api/problems?sector=Water")
q("Problems search=leakage", "/api/problems?search=leakage")
starts = q("Startups all", "/api/startups")
apps = q("Applications all", "/api/applications")
q("Apps submitted", "/api/applications?status=submitted")
q("Apps shortlisted", "/api/applications?status=shortlisted")
q("Apps selected", "/api/applications?status=selected")
q("Apps rejected", "/api/applications?status=rejected")
pilots = q("Pilots all", "/api/pilots")

if pilots:
    pid = pilots[0]["id"]
    q("Pilot detail", f"/api/pilots/{pid}")
    q("Pilot milestones", f"/api/pilots/{pid}/milestones")
    q("Pilot kpis", f"/api/pilots/{pid}/kpis")
    q("Pilot transactions", f"/api/pilots/{pid}/transactions")
    q("Pilot inspections", f"/api/pilots/{pid}/inspections")
    q("Pilot procurement", f"/api/pilots/{pid}/procurement")

if probs:
    wlp = next((p for p in probs if "leakage" in (p.get("title","") or "").lower()), probs[0])
    wid = wlp["id"]
    print(f"\nWater problem: {wid} | {wlp['title'][:50]}")
    wm = q("Water Leakage Matches", f"/api/problems/{wid}/matches")
    if wm and isinstance(wm, list):
        for m in wm[:5]:
            st = m.get("startup") or {}
            sname = st.get("name", m.get("startup_id", "?")[:8])
            print(f"  Startup: {sname} | Score: {m.get('match_percent')}%")

if starts:
    sid = starts[0]["id"]
    q("Startup pilots", f"/api/startups/{sid}/pilots")
    q("Startup applications", f"/api/startups/{sid}/applications")
    q("Startup documents", f"/api/startups/{sid}/documents")

q("Solutions", "/api/solutions")
q("Procurement cases", "/api/procurement")

print("\nDONE")
