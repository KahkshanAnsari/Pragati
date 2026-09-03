from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.models.solution import SolutionBase, SolutionResponse
from app.services.gemini import find_similar_solutions
from app.core.audit import log_audit

router = APIRouter()

@router.get("", response_model=list[SolutionResponse])
async def list_solutions(
    sector: str = None,
    department_id: str = None,
    tech: str = None,
    location: str = None,
    search: str = None,
):
    query = supabase_admin.table("validated_solutions").select(
        "*, startup:startups(id, name, sector), department:government_departments(id, name, location)"
    )
    if sector and sector.lower() != "all":
        query = query.ilike("sector", f"%{sector}%")
    if department_id:
        query = query.eq("department_id", department_id)
    if location:
        query = query.ilike("deployment_location", f"%{location}%")

    response = query.order("created_at", desc=True).execute()
    data = response.data or []
    if tech:
        data = [s for s in data if tech in s.get("technologies", [])]
    if search:
        s_term = search.lower()
        data = [
            s for s in data
            if s_term in (s.get("solution_name") or "").lower()
            or s_term in (s.get("problem_description") or "").lower()
            or s_term in (s.get("sector") or "").lower()
            or s_term in ((s.get("startup") or {}).get("name") or "").lower()
        ]
    return data

@router.post("", response_model=SolutionResponse)
async def create_solution(solution: SolutionBase, user: dict = Depends(require_role(["government_officer", "admin"]))):
    data = solution.model_dump(exclude_none=True)
    response = supabase_admin.table("validated_solutions").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create solution")
    return response.data[0]

@router.get("/{id}", response_model=SolutionResponse)
async def get_solution(id: str):
    response = supabase_admin.table("validated_solutions").select("*, startup:startups(*), department:government_departments(*)").eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Solution not found")
    return response.data[0]

@router.post("/search")
async def search_solutions(payload: dict = Body(...)):
    query = payload.get("query", "")
    solutions_resp = (
        supabase_admin.table("validated_solutions")
        .select("*, startup:startups(id, name, sector), department:government_departments(id, name, location)")
        .execute()
    )
    solutions = solutions_resp.data or []

    similar_solutions = await find_similar_solutions(query, solutions)
    sim_map = {s.get("solution_id"): s for s in similar_solutions if isinstance(s, dict)}

    # Map back to full solution objects with score
    enriched = []
    for sol in solutions:
        match_info = sim_map.get(sol["id"])
        if match_info:
            sol["relevance_score"] = match_info.get("relevance_score", 85)
            sol["relevance_reason"] = match_info.get("relevance_reason", "")
            enriched.append(sol)

    enriched.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)

    # Fallback to text matching if AI returned no specific IDs
    if not enriched:
        q_lower = query.lower().strip()
        enriched = [
            s for s in solutions
            if q_lower in (s.get("solution_name") or "").lower()
            or q_lower in (s.get("problem_description") or "").lower()
            or q_lower in (s.get("sector") or "").lower()
            or q_lower in ((s.get("startup") or {}).get("name") or "").lower()
        ]

    # Return full array directly so frontend receives ValidatedSolution[]
    return enriched if enriched else solutions

@router.post("/{id}/adopt")
async def create_adoption_request(id: str, context_notes: str = Body("", embed=True), user: dict = Depends(require_role(["government_officer"]))):
    solution = await get_solution(id)
    
    # Get officer's department
    officer_resp = supabase_admin.table("government_officers").select("id, department_id").eq("user_id", user["id"]).execute()
    if not officer_resp.data:
        raise HTTPException(status_code=400, detail="Officer profile not found")
    officer = officer_resp.data[0]
    
    adoption_data = {
        "validated_solution_id": id,
        "requesting_department_id": officer.get("department_id"),
        "requesting_officer_id": officer.get("id"),
        "context_notes": context_notes,
        "status": "pending"
    }
    
    response = supabase_admin.table("adoption_requests").insert(adoption_data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create adoption request")
        
    await log_audit(user["id"], user["role"], "create_adoption_request", "validated_solution", id, new_value=adoption_data)
    return response.data[0]
