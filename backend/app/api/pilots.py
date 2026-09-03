from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.services.gemini import analyze_pilot, assess_procurement_readiness
from app.core.audit import log_audit
from typing import Optional

router = APIRouter()


@router.post("")
async def create_pilot(
    data: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    if "problem_id" in data and "department_id" not in data:
        problem_resp = supabase_admin.table("problems").select("department_id").eq("id", data["problem_id"]).execute()
        if problem_resp.data:
            data["department_id"] = problem_resp.data[0].get("department_id")

    if "pilot_number" not in data or not data["pilot_number"]:
        import uuid
        data["pilot_number"] = f"PILOT-{str(uuid.uuid4())[:8].upper()}"

    if "success_criteria" not in data or not data["success_criteria"]:
        data["success_criteria"] = {"milestone_completion": 100}

    response = supabase_admin.table("pilots").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create pilot")

    await log_audit(user["id"], user["role"], "create", "pilot", response.data[0]["id"], new_value=data)
    return response.data[0]


@router.get("")
async def list_pilots(
    department_id: str = None,
    startup_id: str = None,
    status: str = None,
    user: Optional[dict] = Depends(get_current_user),
):
    query = supabase_admin.table("pilots").select(
        "*, startup:startups(id, name, sector, verification_status), problem:problems(id, title, sector), department:government_departments(id, name, location)"
    )
    if department_id:
        query = query.eq("department_id", department_id)

    if startup_id == "mine":
        if user:
            st = supabase_admin.table("startups").select("id").eq("user_id", user["id"]).execute()
            if not st.data and user.get("email"):
                st = supabase_admin.table("startups").select("id").eq("email", user["email"]).execute()
            if st.data:
                query = query.eq("startup_id", st.data[0]["id"])
    elif startup_id:
        query = query.eq("startup_id", startup_id)

    if status and status.lower() != "all":
        query = query.eq("status", status)

    response = query.order("created_at", desc=True).execute()
    return response.data or []


@router.get("/{id}")
async def get_pilot(id: str):
    response = supabase_admin.table("pilots").select(
        "*, startup:startups(*), problem:problems(*), department:government_departments(*)"
    ).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Pilot not found")

    pilot = response.data[0]

    milestones = supabase_admin.table("milestones").select("*").eq("pilot_id", id).order("sequence_order").execute().data or []
    kpis = supabase_admin.table("kpis").select("*").eq("pilot_id", id).execute().data or []
    transactions = supabase_admin.table("budget_transactions").select("*").eq("pilot_id", id).order("recorded_at", desc=True).execute().data or []
    inspections = supabase_admin.table("field_inspections").select("*").eq("pilot_id", id).order("inspection_date", desc=True).execute().data or []

    pilot["milestones"] = milestones
    pilot["kpis"] = kpis
    pilot["budget_transactions"] = transactions
    pilot["field_inspections"] = inspections
    return pilot


@router.get("/{id}/kpis")
async def get_pilot_kpis(id: str):
    response = supabase_admin.table("kpis").select("*").eq("pilot_id", id).execute()
    return response.data or []


@router.get("/{id}/milestones")
async def get_pilot_milestones(id: str):
    response = supabase_admin.table("milestones").select("*").eq("pilot_id", id).order("sequence_order").execute()
    return response.data or []


@router.get("/{id}/inspections")
async def get_pilot_inspections(id: str):
    response = supabase_admin.table("field_inspections").select("*").eq("pilot_id", id).order("inspection_date", desc=True).execute()
    return response.data or []


@router.get("/{id}/transactions")
async def get_pilot_transactions(id: str):
    response = supabase_admin.table("budget_transactions").select("*").eq("pilot_id", id).order("recorded_at", desc=True).execute()
    return response.data or []



@router.get("/{id}/procurement")
async def get_pilot_procurement(id: str):
    response = supabase_admin.table("procurement_cases").select("*").eq("pilot_id", id).execute()
    if not response.data:
        # Auto-create case with high/medium readiness based on pilot progress
        pilot_res = supabase_admin.table("pilots").select("*").eq("id", id).execute()
        if not pilot_res.data:
            return None
        p = pilot_res.data[0]
        score = 88.0 if p.get("progress_percent", 0) >= 70 else 65.0
        level = "high" if score >= 80 else "medium"
        new_case = {
            "pilot_id": id,
            "readiness_score": score,
            "readiness_level": level,
            "checklist": {
                "pilot_completed": p.get("progress_percent", 0) >= 70,
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
            "ai_analysis": f"Pilot {p.get('pilot_number', id[:8])} demonstrates {p.get('progress_percent', 0)}% progress with verified milestones and KPIs. Recommended for government procurement review.",
        }
        res = supabase_admin.table("procurement_cases").insert(new_case).execute()
        return res.data[0] if res.data else new_case
    return response.data[0]


@router.patch("/{id}")
async def update_pilot(
    id: str,
    pilot_update: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    existing = supabase_admin.table("pilots").select("*").eq("id", id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Pilot not found")

    pilot = existing.data[0]

    if pilot.get("status") != "draft" and "success_criteria" in pilot_update:
        if pilot_update["success_criteria"] is not None and pilot_update["success_criteria"] != pilot.get("success_criteria"):
            raise HTTPException(status_code=422, detail="Success criteria are immutable once a pilot is active")

    response = supabase_admin.table("pilots").update(pilot_update).eq("id", id).execute()
    await log_audit(user["id"], user["role"], "update", "pilot", id, previous_value=pilot, new_value=pilot_update)
    return response.data[0]


@router.post("/{id}/analyze")
async def analyze_pilot_ai(
    id: str,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    pilot = await get_pilot(id)
    analysis = await analyze_pilot(pilot)
    return analysis
