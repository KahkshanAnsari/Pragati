from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.models.startup import StartupResponse, StartupBase
from app.core.audit import log_audit
from datetime import datetime, timezone

router = APIRouter()

@router.get("", response_model=list[StartupResponse])
async def list_startups(sector: str = None, verification_status: str = None):
    query = supabase_admin.table("startups").select("*")
    if sector and sector.lower() != "all" and sector.strip() != "":
        query = query.ilike("sector", f"%{sector}%")
    if verification_status and verification_status.lower() != "all" and verification_status.strip() != "":
        query = query.eq("verification_status", verification_status)
        
    response = query.order("trust_score", desc=True).execute()
    return response.data or []

@router.post("", response_model=StartupResponse)
async def create_startup(startup: StartupBase, user: dict = Depends(get_current_user)):
    data = startup.model_dump(exclude_none=True)
    if user:
        data["user_id"] = user["id"]
    response = supabase_admin.table("startups").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create startup")
    
    if user:
        await log_audit(user["id"], user.get("role", "startup"), "create", "startup", response.data[0]["id"], new_value=data)
    return response.data[0]

@router.get("/{id}")
async def get_startup(id: str, user: dict = Depends(get_current_user)):
    if id in ["mine", "me"]:
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required")
        st = supabase_admin.table("startups").select("*").eq("user_id", user["id"]).execute()
        if not st.data and user.get("email"):
            st = supabase_admin.table("startups").select("*").eq("email", user["email"]).execute()
        if not st.data:
            raise HTTPException(status_code=404, detail="Startup profile not found")
        return st.data[0]

    response = supabase_admin.table("startups").select("*").eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Startup not found")
    return response.data[0]

@router.patch("/{id}")
async def update_startup(id: str, payload: dict = Body(...), user: dict = Depends(get_current_user)):
    target_id = id
    if id in ["mine", "me"]:
        if not user:
            raise HTTPException(status_code=401, detail="Authentication required")
        st = supabase_admin.table("startups").select("id").eq("user_id", user["id"]).execute()
        if not st.data and user.get("email"):
            st = supabase_admin.table("startups").select("id").eq("email", user["email"]).execute()
        if not st.data:
            raise HTTPException(status_code=404, detail="Startup profile not found")
        target_id = st.data[0]["id"]

    res = supabase_admin.table("startups").update(payload).eq("id", target_id).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to update startup profile")
    return res.data[0]

@router.get("/{id}/documents")
async def get_startup_documents(id: str):
    try:
        response = supabase_admin.table("startup_documents").select("*").eq("startup_id", id).execute()
        return response.data or []
    except Exception:
        return []

@router.get("/{id}/pilots")
async def get_startup_pilots(id: str):
    response = supabase_admin.table("pilots").select("*, problem:problems(id, title, sector), department:government_departments(id, name)").eq("startup_id", id).execute()
    return response.data or []

@router.get("/{id}/applications")
async def get_startup_applications(id: str):
    response = supabase_admin.table("applications").select("*, problem:problems(id, title, sector)").eq("startup_id", id).execute()
    return response.data or []
