from fastapi import APIRouter, Depends, HTTPException
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user
from app.services.matching_engine import rank_startups_for_problem
from app.core.audit import log_audit
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/problems/{id}/match")
async def run_matching(id: str, user: dict = Depends(get_current_user)):
    # 1. Fetch problem
    problem_resp = supabase_admin.table("problems").select("*").eq("id", id).execute()
    if not problem_resp.data:
        raise HTTPException(status_code=404, detail="Problem not found")
    problem = problem_resp.data[0]

    # 2. Fetch all verified startups (or all startups)
    startups_resp = supabase_admin.table("startups").select("*").execute()
    startups = startups_resp.data or []

    if not startups:
        return []

    # 3. Compute deterministic 6-dimension match scores
    matches = rank_startups_for_problem(problem, startups)

    # 4. Save to startup_matches table (clean previous, then insert)
    try:
        supabase_admin.table("startup_matches").delete().eq("problem_id", id).execute()
        
        insert_records = []
        for m in matches:
            insert_records.append({
                "problem_id": id,
                "startup_id": m["startup_id"],
                "match_percent": m["match_percent"],
                "match_rating": m["match_rating"],
                "explainability": m["explainability"],
                "created_at": datetime.now(timezone.utc).isoformat(),
            })

        if insert_records:
            supabase_admin.table("startup_matches").insert(insert_records).execute()
    except Exception as e:
        logger.warning(f"Could not persist matches to DB: {e}")

    # 5. Log audit
    if user:
        try:
            await log_audit(user["id"], user.get("role", "government_officer"), "run_matching", "problem", id)
        except Exception:
            pass

    # 6. Return problem and ranked matches
    return {
        "problem": problem,
        "matches": matches
    }


@router.get("/problems/{id}/matches")
async def get_matches(id: str):
    problem_resp = supabase_admin.table("problems").select("*").eq("id", id).execute()
    if not problem_resp.data:
        raise HTTPException(status_code=404, detail="Problem not found")
    problem = problem_resp.data[0]

    # Fetch all startups
    startups_resp = supabase_admin.table("startups").select("*").execute()
    startups = startups_resp.data or []
    if not startups:
        return {"problem": problem, "matches": []}

    matches = rank_startups_for_problem(problem, startups)
    return {
        "problem": problem,
        "matches": matches
    }
