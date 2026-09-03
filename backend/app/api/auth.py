import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.dependencies import get_current_user
from app.db.supabase import supabase_admin

logger = logging.getLogger(__name__)

router = APIRouter()


class StartupRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    sector: Optional[str] = "General"
    dpiit: Optional[str] = None
    phone: Optional[str] = None
    technologies: Optional[List[str]] = []
    capabilities: Optional[List[str]] = []


class GovernmentRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    department_id: Optional[str] = None
    designation: Optional[str] = None
    gov_id: Optional[str] = None


class AutoConfirmRequest(BaseModel):
    email: str


@router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user


@router.post("/auto-confirm")
async def auto_confirm_user(req: AutoConfirmRequest):
    """
    Auto-confirms a user's email so they are not blocked by email confirmation requirements.
    """
    try:
        users = supabase_admin.auth.admin.list_users()
        target = next((u for u in users if u.email and u.email.lower() == req.email.strip().lower()), None)
        if not target:
            raise HTTPException(status_code=404, detail="User not found")

        res = supabase_admin.auth.admin.update_user_by_id(target.id, {"email_confirm": True})
        return {
            "status": "success",
            "message": "User email confirmed successfully",
            "user_id": target.id,
            "email": req.email,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in auto_confirm_user: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/register-startup")
async def register_startup(req: StartupRegisterRequest):
    """
    Registers a startup user, sets role='startup', and automatically confirms the email
    to allow immediate sign-in without email confirmation roadblocks.
    """
    try:
        email = req.email.strip()
        user_metadata = {
            "role": "startup",
            "name": req.name,
            "sector": req.sector,
            "dpiit": req.dpiit,
        }

        # Create user via Supabase admin with email_confirm=True
        try:
            user_res = supabase_admin.auth.admin.create_user({
                "email": email,
                "password": req.password,
                "email_confirm": True,
                "user_metadata": user_metadata,
            })
            user_id = user_res.user.id
        except Exception as create_err:
            # If user already exists, find user and confirm them / update password
            err_msg = str(create_err)
            if "already exists" in err_msg.lower() or "unique" in err_msg.lower():
                users = supabase_admin.auth.admin.list_users()
                target = next((u for u in users if u.email and u.email.lower() == email.lower()), None)
                if target:
                    user_id = target.id
                    supabase_admin.auth.admin.update_user_by_id(user_id, {
                        "email_confirm": True,
                        "password": req.password,
                        "user_metadata": user_metadata,
                    })
                else:
                    raise HTTPException(status_code=400, detail="User already exists")
            else:
                raise HTTPException(status_code=400, detail=f"Registration failed: {err_msg}")

        # Insert or upsert into public.users if table exists
        try:
            supabase_admin.table("users").upsert({
                "id": user_id,
                "email": email,
                "role": "startup",
            }).execute()
        except Exception as db_err:
            logger.warning(f"Could not upsert into public.users: {db_err}")

        # Insert or upsert into public.startups if table exists
        try:
            supabase_admin.table("startups").upsert({
                "user_id": user_id,
                "name": req.name,
                "email": email,
                "sector": req.sector,
                "dpiit_recognition_number": req.dpiit,
                "technologies": req.technologies or [],
                "capabilities": req.capabilities or [],
                "verification_status": "draft",
            }).execute()
        except Exception as db_err:
            logger.warning(f"Could not upsert into public.startups: {db_err}")

        return {
            "status": "success",
            "message": "Startup registered and auto-confirmed successfully",
            "user_id": user_id,
            "role": "startup",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in register_startup: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/register-government")
async def register_government(req: GovernmentRegisterRequest):
    """
    Registers a government officer user, sets role='government_officer', and automatically confirms
    the email to allow immediate sign-in without email confirmation roadblocks.
    """
    try:
        email = req.email.strip()
        user_metadata = {
            "role": "government_officer",
            "name": req.name,
            "department_id": req.department_id,
            "designation": req.designation,
            "gov_id": req.gov_id,
        }

        # Create user via Supabase admin with email_confirm=True
        try:
            user_res = supabase_admin.auth.admin.create_user({
                "email": email,
                "password": req.password,
                "email_confirm": True,
                "user_metadata": user_metadata,
            })
            user_id = user_res.user.id
        except Exception as create_err:
            # If user already exists, find user and confirm them / update password
            err_msg = str(create_err)
            if "already exists" in err_msg.lower() or "unique" in err_msg.lower():
                users = supabase_admin.auth.admin.list_users()
                target = next((u for u in users if u.email and u.email.lower() == email.lower()), None)
                if target:
                    user_id = target.id
                    supabase_admin.auth.admin.update_user_by_id(user_id, {
                        "email_confirm": True,
                        "password": req.password,
                        "user_metadata": user_metadata,
                    })
                else:
                    raise HTTPException(status_code=400, detail="User already exists")
            else:
                raise HTTPException(status_code=400, detail=f"Registration failed: {err_msg}")

        # Insert or upsert into public.users if table exists
        try:
            supabase_admin.table("users").upsert({
                "id": user_id,
                "email": email,
                "role": "government_officer",
            }).execute()
        except Exception as db_err:
            logger.warning(f"Could not upsert into public.users: {db_err}")

        # Insert or upsert into public.government_officers if table exists
        try:
            officer_payload = {
                "user_id": user_id,
                "name": req.name,
                "official_email": email,
                "designation": req.designation,
                "gov_id": req.gov_id,
                "verification_status": "pending",
            }
            if req.department_id and req.department_id not in ("dept_1", "dept_2", ""):
                officer_payload["department_id"] = req.department_id

            supabase_admin.table("government_officers").upsert(officer_payload).execute()
        except Exception as db_err:
            logger.warning(f"Could not upsert into public.government_officers: {db_err}")

        return {
            "status": "success",
            "message": "Government officer registered and auto-confirmed successfully",
            "user_id": user_id,
            "role": "government_officer",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in register_government: {e}")
        raise HTTPException(status_code=500, detail=str(e))
