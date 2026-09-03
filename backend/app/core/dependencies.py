from typing import Callable, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.auth import verify_token
from app.db.supabase import supabase_admin

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[dict]:
    """Get the current authenticated user — returns None if no token present."""
    if not credentials or not credentials.credentials:
        return None

    try:
        payload = await verify_token(credentials)
    except HTTPException:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    # Try to get role from token metadata first (fastest path)
    role = payload.get("role") or payload.get("user_metadata", {}).get("role", "")

    # Optionally enrich with DB row (non-fatal if users table not yet populated)
    try:
        response = supabase_admin.table("users").select("*").eq("id", user_id).execute()
        if response.data:
            db_user = response.data[0]
            return {**db_user, "id": user_id, "email": payload.get("email", ""), "role": db_user.get("role") or role}
    except Exception:
        pass

    return {
        "id": user_id,
        "email": payload.get("email", ""),
        "role": role,
    }


def require_role(allowed_roles: list[str]) -> Callable:
    """Dependency factory: raises 403 if user role is not in allowed_roles."""
    async def role_checker(
        credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    ):
        if not credentials or not credentials.credentials:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
                headers={"WWW-Authenticate": "Bearer"},
            )
        try:
            payload = await verify_token(credentials)
        except HTTPException:
            raise

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        role = payload.get("role") or payload.get("user_metadata", {}).get("role", "")

        try:
            response = supabase_admin.table("users").select("*").eq("id", user_id).execute()
            if response.data:
                db_user = response.data[0]
                role = db_user.get("role") or role
                return {**db_user, "id": user_id, "email": payload.get("email", ""), "role": role}
        except Exception:
            pass

        user = {"id": user_id, "email": payload.get("email", ""), "role": role}

        if user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {allowed_roles}",
            )
        return user
    return role_checker
