from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.core.audit import log_audit

router = APIRouter()

class MilestoneBase(BaseModel):
    title: str
    description: str
    due_date: str
    sequence_order: Optional[int] = 1

@router.get("/{pilot_id}")
async def list_milestones(pilot_id: str):
    response = supabase_admin.table("milestones").select("*").eq("pilot_id", pilot_id).order("sequence_order").execute()
    return response.data or []

@router.get("/{pilot_id}/milestones")
async def list_milestones_alt(pilot_id: str):
    response = supabase_admin.table("milestones").select("*").eq("pilot_id", pilot_id).order("sequence_order").execute()
    return response.data or []

@router.post("/{pilot_id}")
async def create_milestone(
    pilot_id: str,
    milestone: MilestoneBase,
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    data = milestone.model_dump()
    data["pilot_id"] = pilot_id
    data["status"] = "pending"

    response = supabase_admin.table("milestones").insert(data).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create milestone")
    return response.data[0]

@router.patch("/{id}/claim")
async def claim_milestone(
    id: str,
    payload: dict = Body(default={}),
    user: dict = Depends(get_current_user),
):
    """
    Startup claims milestone completion with evidence URL and notes.
    Uses valid enum 'startup_claimed'.
    """
    update_data = {
        "status": "startup_claimed",
        "startup_claimed_at": datetime.now(timezone.utc).isoformat(),
    }
    if payload.get("evidence_url"):
        update_data["startup_evidence_url"] = payload["evidence_url"]

    response = supabase_admin.table("milestones").update(update_data).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to claim milestone")

    if user:
        await log_audit(user["id"], user.get("role", "startup"), "claim", "milestone", id, new_value=update_data)
    return response.data[0]

@router.patch("/{id}/verify")
async def verify_milestone(
    id: str,
    payload: dict = Body(default={}),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    """
    Government officer or inspector verifies milestone.
    Uses valid enum 'inspector_verified'.
    """
    update_data = {
        "status": "inspector_verified",
        "verified_at": datetime.now(timezone.utc).isoformat(),
    }
    response = supabase_admin.table("milestones").update(update_data).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to verify milestone")

    # Update pilot progress percentage based on verified milestones
    milestone = response.data[0]
    pilot_id = milestone.get("pilot_id")
    if pilot_id:
        all_m = supabase_admin.table("milestones").select("id, status").eq("pilot_id", pilot_id).execute().data or []
        if all_m:
            verified_count = sum(1 for m in all_m if m.get("status") == "inspector_verified")
            new_pct = round((verified_count / len(all_m)) * 100, 1)
            supabase_admin.table("pilots").update({"progress_percent": new_pct}).eq("id", pilot_id).execute()

    await log_audit(user["id"], user["role"], "verify", "milestone", id)
    return response.data[0]
