from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.core.audit import log_audit
from datetime import datetime, timezone

router = APIRouter()

@router.get("/{pilot_id}")
async def list_inspections(pilot_id: str):
    response = supabase_admin.table("field_inspections").select("*").eq("pilot_id", pilot_id).order("inspection_date", desc=True).execute()
    return response.data or []

@router.post("/{pilot_id}")
async def create_inspection(
    pilot_id: str,
    payload: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    data = dict(payload)
    data["pilot_id"] = pilot_id
    if "scheduled_date" not in data:
        data["scheduled_date"] = datetime.now(timezone.utc).date().isoformat()
    data["status"] = "scheduled"

    response = supabase_admin.table("field_inspections").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to schedule inspection")
    return response.data[0]

@router.patch("/{id}")
async def update_inspection(
    id: str,
    payload: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    response = supabase_admin.table("field_inspections").update(payload).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update inspection")
    return response.data[0]

@router.post("/{id}/submit")
async def submit_inspection_report(
    id: str,
    payload: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    """
    Submits a completed field inspection with verified progress % and notes.
    """
    notes = payload.get("notes") or payload.get("report_text") or "Field inspection completed."
    pct = payload.get("verified_completion_percent") or 100.0

    update_data = {
        "notes": notes,
        "verified_completion_percent": float(pct),
        "status": "submitted",
        "submitted_at": datetime.now(timezone.utc).isoformat(),
        "inspection_date": datetime.now(timezone.utc).isoformat(),
    }
    response = supabase_admin.table("field_inspections").update(update_data).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to submit inspection report")

    await log_audit(user["id"], user["role"], "submit_inspection", "field_inspection", id, new_value=update_data)
    return response.data[0]
