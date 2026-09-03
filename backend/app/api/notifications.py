from fastapi import APIRouter, Depends, HTTPException
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user

router = APIRouter()

@router.get("")
async def get_notifications(user: dict = Depends(get_current_user)):
    if not user:
        return []
    response = supabase_admin.table("notifications").select("*").eq("user_id", user["id"]).order("created_at", desc=True).execute()
    return response.data or []

@router.patch("/{id}/read")
async def mark_read(id: str, user: dict = Depends(get_current_user)):
    if not user:
        return {"status": "ok"}
    response = supabase_admin.table("notifications").update({"read": True}).eq("id", id).eq("user_id", user["id"]).execute()
    if not response.data:
        return {"status": "ok"}
    return response.data[0]

@router.post("/mark-all-read")
async def mark_all_read(user: dict = Depends(get_current_user)):
    if not user:
        return {"message": "All notifications marked as read"}
    supabase_admin.table("notifications").update({"read": True}).eq("user_id", user["id"]).eq("read", False).execute()
    return {"message": "All notifications marked as read"}
