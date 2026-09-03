from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.core.audit import log_audit
from datetime import datetime, timezone

router = APIRouter()

@router.get("")
async def list_issues(pilot_id: str = None):
    query = supabase_admin.table("issue_reports").select("*")
    if pilot_id:
        query = query.eq("pilot_id", pilot_id)
    response = query.order("report_date", desc=True).execute()
    return response.data or []

@router.post("")
async def report_issue(
    payload: dict = Body(...),
    user: dict = Depends(get_current_user),
):
    data = dict(payload)
    if user:
        data["reporter_id"] = user["id"]
    if "report_date" not in data:
        data["report_date"] = datetime.now(timezone.utc).date().isoformat()
    data["status"] = "reported"
    if "category" not in data:
        data["category"] = "other"

    response = supabase_admin.table("issue_reports").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to report issue")

    if user:
        await log_audit(user["id"], user.get("role", "government_officer"), "report", "issue_report", response.data[0]["id"], new_value=data)
    return response.data[0]

@router.get("/{id}")
async def get_issue(id: str):
    response = supabase_admin.table("issue_reports").select("*").eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Issue not found")
    return response.data[0]

@router.patch("/{id}/status")
async def update_issue_status(
    id: str,
    status: str = Body(..., embed=True),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    response = supabase_admin.table("issue_reports").update({"status": status}).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update issue status")
    await log_audit(user["id"], user["role"], "update_status", "issue_report", id, new_value={"status": status})
    return response.data[0]
