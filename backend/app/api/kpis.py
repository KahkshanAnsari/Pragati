from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.core.audit import log_audit

router = APIRouter()

class KPIBase(BaseModel):
    metric_name: str
    target_value: float
    baseline_value: Optional[float] = 0
    unit: str
    measurement_method: Optional[str] = None

@router.get("/{pilot_id}")
async def list_kpis(pilot_id: str):
    response = supabase_admin.table("kpis").select("*").eq("pilot_id", pilot_id).execute()
    return response.data or []

@router.get("/{pilot_id}/kpis")
async def list_kpis_alt(pilot_id: str):
    response = supabase_admin.table("kpis").select("*").eq("pilot_id", pilot_id).execute()
    return response.data or []

@router.post("/{pilot_id}")
async def create_kpi(
    pilot_id: str,
    kpi: KPIBase,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    data = kpi.model_dump()
    data["pilot_id"] = pilot_id
    data["current_value"] = data.get("baseline_value", 0)
    data["status"] = "on_track"

    response = supabase_admin.table("kpis").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create KPI")
    return response.data[0]

@router.post("/{kpi_id}/update")
async def update_kpi(
    kpi_id: str,
    payload: dict = Body(...),
    user: dict = Depends(get_current_user),
):
    """
    Update KPI current value. Accepts payload:
    {"value": float, "notes": str} or {"current_value": float, "notes": str}
    """
    raw_val = payload.get("value") if "value" in payload else payload.get("current_value")
    if raw_val is None:
        raise HTTPException(status_code=400, detail="value is required")

    try:
        new_val = float(raw_val)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="value must be a number")

    notes = payload.get("notes", "")

    # Fetch existing KPI to evaluate status
    existing = supabase_admin.table("kpis").select("*").eq("id", kpi_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="KPI not found")

    kpi = existing.data[0]
    target = float(kpi.get("target_value") or 100)

    # Determine status
    if new_val >= target:
        new_status = "achieved"
    elif new_val >= target * 0.7:
        new_status = "on_track"
    else:
        new_status = "at_risk"

    update_payload = {
        "current_value": new_val,
        "status": new_status,
    }
    response = supabase_admin.table("kpis").update(update_payload).eq("id", kpi_id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update KPI")

    # Record history in kpi_updates table if exists
    try:
        kpi_update_rec = {
            "kpi_id": kpi_id,
            "pilot_id": kpi.get("pilot_id"),
            "current_value": new_val,
            "recorded_at": datetime.now(timezone.utc).isoformat(),
            "notes": notes,
        }
        if user:
            kpi_update_rec["recorded_by"] = user["id"]
        supabase_admin.table("kpi_updates").insert(kpi_update_rec).execute()
    except Exception:
        pass

    if user:
        await log_audit(user["id"], user.get("role", "startup"), "update", "kpi", kpi_id, new_value=update_payload)
    return response.data[0]

@router.get("/{kpi_id}/history")
async def get_kpi_history(kpi_id: str):
    response = supabase_admin.table("kpi_updates").select("*").eq("kpi_id", kpi_id).order("recorded_at", desc=True).execute()
    return response.data or []
