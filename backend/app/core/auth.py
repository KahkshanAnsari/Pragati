from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.db.supabase import supabase_admin
from typing import Dict, Any

security = HTTPBearer()


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Verify Supabase JWT token using the Supabase Admin client.
    This avoids needing the raw JWT secret — Supabase verifies its own tokens.
    """
    token = credentials.credentials
    try:
        # Use Supabase admin to validate the token and get user info
        user_response = supabase_admin.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = user_response.user
        return {
            "sub": user.id,
            "email": user.email,
            "user_metadata": user.user_metadata or {},
            "role": (user.user_metadata or {}).get("role", ""),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
