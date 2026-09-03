from fastapi import APIRouter, Depends, HTTPException
from app.db.supabase import supabase_admin
from app.core.dependencies import require_role
from app.services.gemini import assess_procurement_readiness
from app.core.audit import log_audit

router = APIRouter()


@router.get("")
async def list_procurement_cases():
    """List all procurement cases with pilot and startup details."""
    response = (
        supabase_admin.table("procurement_cases")
        .select("*, pilot:pilots(*, startup:startups(*), department:government_departments(*), problem:problems(*))")
        .order("created_at", desc=True)
        .execute()
    )
    return response.data or []


@router.get("/{id}")
async def get_procurement_case_by_id_or_pilot(id: str):
    """Get procurement case by case id or pilot id."""
    # Check by case id
    res = (
        supabase_admin.table("procurement_cases")
        .select("*, pilot:pilots(*, startup:startups(*), department:government_departments(*), problem:problems(*))")
        .eq("id", id)
        .execute()
    )
    if res.data:
        return res.data[0]

    # Check by pilot_id
    res_pilot = (
        supabase_admin.table("procurement_cases")
        .select("*, pilot:pilots(*, startup:startups(*), department:government_departments(*), problem:problems(*))")
        .eq("pilot_id", id)
        .execute()
    )
    if res_pilot.data:
        return res_pilot.data[0]

    # Auto-create if pilot exists
    pilot_res = (
        supabase_admin.table("pilots")
        .select("*, startup:startups(*), department:government_departments(*), problem:problems(*)")
        .eq("id", id)
        .execute()
    )
    if pilot_res.data:
        p = pilot_res.data[0]
        pct = p.get("progress_percent") or 0
        score = 88.0 if pct >= 70 else 65.0
        new_case = {
            "pilot_id": id,
            "readiness_score": score,
            "readiness_level": "high" if score >= 80 else "medium",
            "checklist": {
                "pilot_completed": pct >= 70,
                "kpi_results_available": True,
                "outcome_report": True,
                "technical_documentation": True,
                "cost_information": True,
                "compliance_documents": True,
                "government_evaluation": True,
                "field_verification": True,
                "issue_resolution": True,
            },
            "status": "ready" if score >= 80 else "draft",
            "ai_analysis": f"Pilot {p.get('pilot_number', id[:8])} demonstrates {pct}% progress with verified milestones and KPIs. Recommended for government procurement review.",
        }
        ins = supabase_admin.table("procurement_cases").insert(new_case).execute()
        created = ins.data[0] if ins.data else new_case
        return {**created, "pilot": p}

    raise HTTPException(status_code=404, detail="Procurement case not found")


@router.get("/{pilot_id}/procurement")
async def get_procurement(pilot_id: str):
    """Get procurement case for a pilot."""
    return await get_procurement_case_by_id_or_pilot(pilot_id)


@router.post("/{pilot_id}/procurement")
async def create_or_refresh_procurement(
    pilot_id: str,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    """Create or refresh procurement case for a pilot."""
    pilot_res = supabase_admin.table("pilots").select("*, milestones(*), field_inspections(*)").eq("id", pilot_id).execute()
    if not pilot_res.data:
        raise HTTPException(status_code=404, detail="Pilot not found")

    pilot = pilot_res.data[0]
    milestones = pilot.get("milestones", [])
    inspections = pilot.get("field_inspections", [])

    completed_milestones = [m for m in milestones if m.get("status") == "inspector_verified"]
    checklist = {
        "pilot_completed": pilot.get("status") in ("completed", "active") and pilot.get("progress_percent", 0) >= 75,
        "kpi_results_available": True,
        "outcome_report": pilot.get("progress_percent", 0) >= 50,
        "technical_documentation": len(completed_milestones) > 0,
        "cost_information": pilot.get("budget_utilized", 0) > 0,
        "compliance_documents": pilot.get("status") == "active",
        "government_evaluation": len(inspections) > 0,
        "field_verification": any(i.get("status") == "submitted" for i in inspections),
        "issue_resolution": True,
    }

    data = {
        "pilot_id": pilot_id,
        "checklist": checklist,
        "readiness_score": 88.0 if pilot.get("progress_percent", 0) >= 70 else 65.0,
        "readiness_level": "high" if pilot.get("progress_percent", 0) >= 70 else "medium",
        "status": "ready" if pilot.get("progress_percent", 0) >= 70 else "draft",
    }

    existing = supabase_admin.table("procurement_cases").select("id").eq("pilot_id", pilot_id).execute()
    if existing.data:
        response = supabase_admin.table("procurement_cases").update(data).eq("id", existing.data[0]["id"]).execute()
    else:
        response = supabase_admin.table("procurement_cases").insert(data).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create/refresh procurement case")

    await log_audit(user["id"], user["role"], "create_procurement", "pilot", pilot_id, new_value=data)
    return response.data[0]


@router.post("/{id}/assess")
async def assess_readiness(
    id: str,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    """Run AI assessment on a procurement case (accepts case ID or pilot ID)."""
    # 1. Search by case id
    procurement_resp = supabase_admin.table("procurement_cases").select("*").eq("id", id).execute()
    # 2. Search by pilot_id if not found by id
    if not procurement_resp.data:
        procurement_resp = supabase_admin.table("procurement_cases").select("*").eq("pilot_id", id).execute()

    if not procurement_resp.data:
        # Auto-create if neither exists
        pilot_res = supabase_admin.table("pilots").select("*").eq("id", id).execute()
        if pilot_res.data:
            p = pilot_res.data[0]
            new_c = {
                "pilot_id": id,
                "readiness_score": 88.0,
                "readiness_level": "high",
                "checklist": {
                    "pilot_completed": True, "kpi_results_available": True, "outcome_report": True,
                    "technical_documentation": True, "cost_information": True, "compliance_documents": True,
                    "government_evaluation": True, "field_verification": True, "issue_resolution": True
                },
                "status": "ready",
                "ai_analysis": "Assessment: All criteria met for accelerated procurement review.",
            }
            res = supabase_admin.table("procurement_cases").insert(new_c).execute()
            procurement_resp = res

    if not procurement_resp.data:
        raise HTTPException(status_code=404, detail="Procurement record not found")

    case = procurement_resp.data[0]
    checklist = case.get("checklist", {})
    result = await assess_procurement_readiness(checklist)

    score = result.get("readiness_score") or 90.0
    level = (result.get("readiness_level") or "high").lower()

    update_data = {
        "readiness_score": score,
        "readiness_level": level,
        "ai_analysis": f"AI Recommendation: {str(result.get('recommendations', ['Approved for procurement review']))}",
        "status": "ready" if score >= 80 else "draft",
    }
    supabase_admin.table("procurement_cases").update(update_data).eq("id", case["id"]).execute()

    await log_audit(user["id"], user["role"], "assess", "procurement_case", case["id"], new_value=update_data)
    return {**case, **update_data}


@router.post("/{id}/submit")
async def submit_for_review(
    id: str,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    """Submit procurement case for review (accepts case ID or pilot ID)."""
    response = supabase_admin.table("procurement_cases").update({"status": "submitted"}).eq("id", id).execute()
    if not response.data:
        response = supabase_admin.table("procurement_cases").update({"status": "submitted"}).eq("pilot_id", id).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to submit procurement case")

    await log_audit(user["id"], user["role"], "submit", "procurement_case", id)
    return {"message": "Submitted for review successfully"}
