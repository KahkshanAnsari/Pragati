from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase, supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.models.problem import ProblemCreate, ProblemUpdate, ProblemResponse
from app.services.gemini import structure_problem as ai_structure_problem
from app.core.audit import log_audit
from datetime import datetime, timezone

router = APIRouter()


@router.get("", response_model=list[ProblemResponse])
async def list_problems(
    status: str = None,
    department_id: str = None,
    sector: str = None,
    location: str = None,
    search: str = None,
):
    query = supabase_admin.table("problems").select(
        "*, department:government_departments(id, name, sector, location), officer:government_officers(id, name, designation)"
    )
    if status and status.lower() != "all":
        query = query.eq("status", status)
    if department_id:
        query = query.eq("department_id", department_id)
    if sector and sector.lower() != "all sectors":
        query = query.ilike("sector", f"%{sector}%")
    if location:
        query = query.ilike("location", f"%{location}%")

    response = query.order("created_at", desc=True).execute()
    data = response.data or []

    # If text search query provided, filter on server side as well
    if search:
        s = search.lower().strip()
        data = [
            p for p in data
            if s in (p.get("title") or "").lower()
            or s in (p.get("description") or "").lower()
            or s in (p.get("location") or "").lower()
            or s in ((p.get("department") or {}).get("name") or "").lower()
            or any(s in t.lower() for t in (p.get("required_technologies") or []))
            or any(s in c.lower() for c in (p.get("required_capabilities") or []))
        ]

    return data


@router.post("", response_model=ProblemResponse)
async def create_problem(
    problem: ProblemCreate,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    data = problem.model_dump(exclude_none=True)

    # 1. Resolve officer_id and department_id from government_officers
    officer_res = supabase_admin.table("government_officers").select("id, department_id").eq("user_id", user["id"]).execute()
    if not officer_res.data and user.get("email"):
        officer_res = supabase_admin.table("government_officers").select("id, department_id").eq("official_email", user["email"]).execute()

    if officer_res.data:
        data["officer_id"] = officer_res.data[0]["id"]
        if not data.get("department_id"):
            data["department_id"] = officer_res.data[0].get("department_id")
    else:
        # Fallback to first officer and department in database if unlinked
        first_officer = supabase_admin.table("government_officers").select("id, department_id").limit(1).execute()
        if first_officer.data:
            data["officer_id"] = first_officer.data[0]["id"]
            if not data.get("department_id"):
                data["department_id"] = first_officer.data[0].get("department_id")
        else:
            data.pop("officer_id", None)

    # 2. Ensure department_id exists
    if not data.get("department_id"):
        first_dept = supabase_admin.table("government_departments").select("id").limit(1).execute()
        if first_dept.data:
            data["department_id"] = first_dept.data[0]["id"]

    # 3. Ensure description is populated
    if not data.get("description"):
        data["description"] = data.get("refined_description") or data.get("title") or "Government problem statement"

    # 4. Clean extra fields not in DB schema
    # Schema columns: id, department_id, officer_id, title, description, ai_structured, sector,
    # location, required_capabilities, required_technologies, budget_min, budget_max, timeline_days,
    # pilot_duration_days, expected_outcome, kpis, eligibility_requirements, status, created_at, updated_at
    valid_cols = {
        "department_id", "officer_id", "title", "description", "ai_structured",
        "sector", "location", "required_capabilities", "required_technologies",
        "budget_min", "budget_max", "timeline_days", "pilot_duration_days",
        "expected_outcome", "kpis", "eligibility_requirements", "status",
    }
    cleaned_data = {k: v for k, v in data.items() if k in valid_cols}
    cleaned_data["created_at"] = datetime.now(timezone.utc).isoformat()
    cleaned_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    response = supabase_admin.table("problems").insert(cleaned_data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create problem")

    created_problem = response.data[0]
    await log_audit(user["id"], user["role"], "create", "problem", created_problem["id"], new_value=cleaned_data)
    
    # Return with joined department and officer for response model
    full_resp = supabase_admin.table("problems").select(
        "*, department:government_departments(id, name, sector, location), officer:government_officers(id, name, designation)"
    ).eq("id", created_problem["id"]).execute()
    
    return full_resp.data[0] if full_resp.data else created_problem


@router.get("/{problem_id}", response_model=ProblemResponse)
async def get_problem(problem_id: str):
    response = supabase_admin.table("problems").select(
        "*, department:government_departments(id, name, sector, location), officer:government_officers(id, name, designation)"
    ).eq("id", problem_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Problem not found")
    data = response.data[0]
    dept = data.get("department") or {}
    if not data.get("authority"):
        data["authority"] = dept.get("name") or "Government Authority"
    if not data.get("jurisdiction"):
        data["jurisdiction"] = data.get("location") or dept.get("location") or "India"
    if not data.get("pilot_duration"):
        data["pilot_duration"] = data.get("pilot_duration_days") or data.get("timeline_days") or 90
    return data


@router.patch("/{problem_id}", response_model=ProblemResponse)
async def update_problem(
    problem_id: str,
    problem: ProblemUpdate,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    update_data = problem.model_dump(exclude_none=True)
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()

    old_data = supabase_admin.table("problems").select("*").eq("id", problem_id).execute()
    response = supabase_admin.table("problems").update(update_data).eq("id", problem_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update problem")

    await log_audit(
        user["id"], user["role"], "update", "problem", problem_id,
        previous_value=old_data.data[0] if old_data.data else None,
        new_value=update_data,
    )
    
    full_resp = supabase_admin.table("problems").select(
        "*, department:government_departments(id, name, sector, location), officer:government_officers(id, name, designation)"
    ).eq("id", problem_id).execute()
    return full_resp.data[0] if full_resp.data else response.data[0]


@router.post("/{problem_id}/publish")
async def publish_problem(
    problem_id: str,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    response = supabase_admin.table("problems").update({
        "status": "published",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", problem_id).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to publish problem")

    await log_audit(user["id"], user["role"], "publish", "problem", problem_id)
    return {"message": "Problem published successfully", "data": response.data[0]}


@router.post("/structure")
async def structure_problem_route(
    description: str = Body(..., embed=True),
    user: dict = Depends(get_current_user),
):
    result = await ai_structure_problem(description)
    return result


@router.post("/{problem_id}/close")
async def close_problem(
    problem_id: str,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    response = supabase_admin.table("problems").update({
        "status": "completed",
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", problem_id).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to close problem")

    await log_audit(user["id"], user["role"], "close", "problem", problem_id)
    return {"message": "Problem closed successfully", "data": response.data[0]}


@router.post("/{problem_id}/invite")
async def invite_startup(
    problem_id: str,
    payload: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    startup_id = payload.get("startup_id")
    if not startup_id:
        raise HTTPException(status_code=400, detail="startup_id is required")

    # Fetch startup details to notify
    st_res = supabase_admin.table("startups").select("id, name, user_id, email").eq("id", startup_id).execute()
    if not st_res.data:
        raise HTTPException(status_code=404, detail="Startup not found")

    # Fetch problem title
    prob_res = supabase_admin.table("problems").select("id, title").eq("id", problem_id).execute()
    prob_title = prob_res.data[0]["title"] if prob_res.data else "Government Challenge"

    # Create notification for startup
    if st_res.data[0].get("user_id"):
        try:
            supabase_admin.table("notifications").insert({
                "user_id": st_res.data[0]["user_id"],
                "type": "invitation",
                "title": f"Invitation to Apply: {prob_title}",
                "body": f"A government department has reviewed your profile and invited your startup to submit a pilot application for '{prob_title}'.",
                "reference_id": problem_id,
                "reference_type": "problem",
                "read": False,
            }).execute()
        except Exception:
            pass

    await log_audit(user["id"], user["role"], "invite_startup", "problem", problem_id, new_value={"startup_id": startup_id})
    return {"message": "Invitation sent successfully to startup", "startup_id": startup_id, "problem_id": problem_id}

