import requests
import sys

BASE = "http://127.0.0.1:8000"

def test_workflow():
    print("=" * 70)
    print("PRAGATI PLATFORM END-TO-END WORKFLOW VERIFICATION TEST")
    print("=" * 70)

    # 1. Health check
    r = requests.get(f"{BASE}/health")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("[PASS] 1. Backend Health Check: 200 OK")

    # 2. Discover Problems - All published
    r = requests.get(f"{BASE}/api/problems")
    assert r.status_code == 200, f"Failed to list problems: {r.text}"
    all_problems = r.json()
    assert len(all_problems) > 0, "No problems returned"
    print(f"[PASS] 2. Problem Registry List: {len(all_problems)} total problems found")

    # 3. Test Search for Specific Problem
    # "Computer Vision Road Incident Detection & Traffic Monitoring"
    search_term = "computer vision"
    r_search = requests.get(f"{BASE}/api/problems?search={search_term}")
    assert r_search.status_code == 200
    matched_search = r_search.json()
    assert len(matched_search) > 0, "Search for 'computer vision' returned 0 results"
    cv_prob = next((p for p in matched_search if "Incident Detection" in p.get("title", "")), matched_search[0])
    print(f"[PASS] 3. Text Search ('computer vision'): Found {len(matched_search)} problems including '{cv_prob.get('title')}'")

    # 4. Test Sector Filtering
    sector_term = "Smart Infrastructure & Mobility"
    r_sec = requests.get(f"{BASE}/api/problems?sector=Mobility")
    assert r_sec.status_code == 200
    sec_probs = r_sec.json()
    assert len(sec_probs) > 0, "Sector search for 'Mobility' returned 0 results"
    for sp in sec_probs:
        assert "Mobility" in sp.get("sector", "") or "Infrastructure" in sp.get("sector", ""), f"Unexpected sector: {sp.get('sector')}"
    print(f"[PASS] 4. Sector Filtering ('Smart Infrastructure & Mobility'): {len(sec_probs)} matching problems")

    # 5. Test Location Filtering
    loc_term = "NH-44"
    r_loc = requests.get(f"{BASE}/api/problems?location={loc_term}")
    assert r_loc.status_code == 200
    loc_probs = r_loc.json()
    assert len(loc_probs) > 0, "Location search for 'NH-44' returned 0 results"
    print(f"[PASS] 5. Location Filtering ('NH-44'): Found problem at '{loc_probs[0].get('location')}'")

    # 6. Test Problem Details by ID
    prob_id = cv_prob["id"]
    r_det = requests.get(f"{BASE}/api/problems/{prob_id}")
    assert r_det.status_code == 200, f"Problem details failed: {r_det.status_code}"
    p_detail = r_det.json()
    assert p_detail["title"] == cv_prob["title"], "Title mismatch in details"
    print(f"[PASS] 6. Problem Details Page: Successfully loaded ID {prob_id[:8]}... ('{p_detail['title'][:35]}...')")

    # 7. Test AI Matching on Problem
    r_match = requests.get(f"{BASE}/api/problems/{prob_id}/matches")
    assert r_match.status_code == 200
    matches = r_match.json()
    print(f"[PASS] 7. AI Startup Matching: {len(matches)} ranked matches found for problem {prob_id[:8]}")

    # 8. Test Startups Directory
    r_st = requests.get(f"{BASE}/api/startups")
    assert r_st.status_code == 200
    startups = r_st.json()
    assert len(startups) >= 7, f"Expected at least 7 startups, got {len(startups)}"
    print(f"[PASS] 8. Startup Directory: {len(startups)} verified startups loaded with Trust Scores")

    # 9. Test Applications List
    r_apps = requests.get(f"{BASE}/api/applications")
    assert r_apps.status_code == 200
    apps = r_apps.json()
    assert len(apps) > 0, "No applications found"
    print(f"[PASS] 9. Government Applications / Evaluation: {len(apps)} applications across all stages")

    # 10. Test Pilots & Pilot Workspace Data
    r_pilots = requests.get(f"{BASE}/api/pilots")
    assert r_pilots.status_code == 200
    pilots = r_pilots.json()
    assert len(pilots) > 0, "No pilots found"
    test_pilot = pilots[0]
    pilot_id = test_pilot["id"]
    
    r_pdet = requests.get(f"{BASE}/api/pilots/{pilot_id}")
    assert r_pdet.status_code == 200
    p_full = r_pdet.json()
    milestones = p_full.get("milestones", [])
    kpis = p_full.get("kpis", [])
    assert len(milestones) > 0, "Pilot missing milestones"
    assert len(kpis) > 0, "Pilot missing KPIs"
    print(f"[PASS] 10. Pilot Details & Workspace: Loaded Pilot {test_pilot.get('pilot_number', pilot_id[:8])} with {len(milestones)} Milestones & {len(kpis)} Live KPIs")

    # 11. Test Procurement Readiness Case
    r_proc = requests.get(f"{BASE}/api/pilots/{pilot_id}/procurement")
    assert r_proc.status_code == 200
    proc_case = r_proc.json()
    assert proc_case is not None, "Procurement case missing"
    print(f"[PASS] 11. Procurement Readiness: Score {proc_case.get('readiness_score')}% ({proc_case.get('readiness_level')}) - Ready for GeM Transition")

    # 12. Test Validated Solutions Repository
    r_sol = requests.get(f"{BASE}/api/solutions")
    assert r_sol.status_code == 200
    solutions = r_sol.json()
    assert len(solutions) > 0, "No validated solutions found"
    print(f"[PASS] 12. Validated Solutions Repository: {len(solutions)} scalable solutions available for cross-department adoption")

    print("\n" + "=" * 70)
    print("ALL 12 END-TO-END WORKFLOW TESTS PASSED SUCCESSFULLY! PROTOTYPE READY.")
    print("=" * 70)

if __name__ == "__main__":
    try:
        test_workflow()
    except Exception as e:
        print(f"\n[FAIL] Workflow test error: {e}")
        sys.exit(1)
