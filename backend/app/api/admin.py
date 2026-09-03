from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase, supabase_admin
from app.core.dependencies import require_role
from app.core.audit import log_audit

router = APIRouter()

@router.get("/stats")
async def platform_stats(user: dict = Depends(require_role(["admin"]))):
    problems_count = len(supabase.table("problems").select("id").execute().data)
    pilots_count = len(supabase.table("pilots").select("id").execute().data)
    startups_count = len(supabase.table("startups").select("id").execute().data)
    
    return {
        "total_problems": problems_count,
        "total_pilots": pilots_count,
        "total_startups": startups_count
    }

@router.get("/users")
async def list_users(user: dict = Depends(require_role(["admin"]))):
    response = supabase_admin.table("users").select("*").execute()
    return response.data

@router.patch("/users/{id}/role")
async def update_user_role(id: str, role: str = Body(..., embed=True), user: dict = Depends(require_role(["admin"]))):
    response = supabase_admin.table("users").update({"role": role}).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update user role")
        
    await log_audit(user["id"], user["role"], "update_role", "user", id, new_value={"role": role})
    return response.data[0]

@router.get("/startups")
async def admin_list_startups(user: dict = Depends(require_role(["admin"]))):
    response = supabase.table("startups").select("*").execute()
    return response.data

@router.patch("/startups/{id}/verify")
async def verify_startup(id: str, is_verified: bool = Body(..., embed=True), user: dict = Depends(require_role(["admin"]))):
    response = supabase_admin.table("startups").update({"is_verified": is_verified}).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to verify startup")
        
    await log_audit(user["id"], user["role"], "verify", "startup", id, new_value={"is_verified": is_verified})
    return response.data[0]

@router.get("/analytics")
async def analytics(user: dict = Depends(require_role(["admin"]))):
    # Dummy mock analytics response as required for prototype
    return {
        "problems_by_sector": {"Health": 10, "Education": 5, "Transport": 8},
        "pilot_success_rate": 85.5
    }
