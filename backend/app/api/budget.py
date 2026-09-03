from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.core.audit import log_audit
from datetime import datetime, timezone
from typing import Optional

router = APIRouter()


@router.get("/{pilot_id}/transactions")
async def get_pilot_budget_transactions(pilot_id: str):
    response = (
        supabase_admin.table("budget_transactions")
        .select("*")
        .eq("pilot_id", pilot_id)
        .order("recorded_at", desc=True)
        .execute()
    )
    return response.data or []


@router.post("/{pilot_id}/transactions")
async def record_budget_transaction(
    pilot_id: str,
    payload: dict = Body(...),
    user: dict = Depends(get_current_user),
):
    amount = payload.get("amount")
    transaction_type = payload.get("transaction_type", "utilized")
    if not amount:
        raise HTTPException(status_code=400, detail="amount is required")

    tx_data = {
        "pilot_id": pilot_id,
        "transaction_type": transaction_type,
        "amount": int(float(amount)),
        "milestone_id": payload.get("milestone_id"),
        "recorded_by": user["id"] if user else None,
        "recorded_at": datetime.now(timezone.utc).isoformat(),
        "notes": payload.get("notes", "Budget update recorded"),
        "risk_flagged": payload.get("risk_flagged", False),
        "risk_reason": payload.get("risk_reason"),
    }

    res = supabase_admin.table("budget_transactions").insert(tx_data).execute()
    if not res.data:
        raise HTTPException(status_code=400, detail="Failed to record budget transaction")

    # If utilized, increment pilot utilized budget
    if transaction_type == "utilized":
        pilot_res = supabase_admin.table("pilots").select("budget_utilized").eq("id", pilot_id).execute()
        if pilot_res.data:
            current_util = pilot_res.data[0].get("budget_utilized") or 0
            new_util = current_util + int(float(amount))
            supabase_admin.table("pilots").update({"budget_utilized": new_util}).eq("id", pilot_id).execute()

    return res.data[0]
