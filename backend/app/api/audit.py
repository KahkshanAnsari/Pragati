from fastapi import APIRouter, Depends
from app.db.supabase import supabase_admin
from app.core.dependencies import require_role

router = APIRouter()

@router.get("")
async def list_audit_logs(user: dict = Depends(require_role(["admin", "government_officer"]))):
    # Depending on requirements, govt officers might only see specific logs. Returning all for now.
    response = supabase_admin.table("audit_logs").select("*").order("created_at", desc=True).limit(100).execute()
    return response.data
