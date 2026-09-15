from fastapi import APIRouter, Depends, HTTPException, Body
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.core.audit import log_audit
from datetime import datetime, timezone, timedelta
from typing import Optional

router = APIRouter()


def populate_rejection_info(apps: list):
    if not apps:
        return
    app_ids = [a["id"] for a in apps if isinstance(a, dict) and "id" in a]
    if not app_ids:
        return
    try:
        evals_res = supabase_admin.table("evaluations").select("*").in_("application_id", app_ids).execute()
        eval_map = {e["application_id"]: e for e in (evals_res.data or [])}
        for app in apps:
            ev = eval_map.get(app["id"])
            if ev:
                app["evaluation"] = ev
                notes = ev.get("notes") or ""
                if not app.get("rejection_reason"):
                    if "Reason:" in notes:
                        parts = notes.split("Reason:", 1)[1]
                        if "Feedback:" in parts:
                            reason_part, fb_part = parts.split("Feedback:", 1)
                            app["rejection_reason"] = reason_part.strip()
                            app["rejection_feedback"] = fb_part.strip()
                        else:
                            app["rejection_reason"] = parts.strip()
                    elif app.get("status") == "rejected":
                        app["rejection_reason"] = "Solution not suitable for the current government requirement"
                        app["rejection_feedback"] = notes
                if not app.get("rejection_feedback") and notes:
                    if "Feedback:" in notes:
                        app["rejection_feedback"] = notes.split("Feedback:", 1)[1].strip()
                    elif app.get("status") == "rejected":
                        app["rejection_feedback"] = notes
    except Exception as err:
        print("Error populating evaluations:", err)


@router.get("")
async def list_applications(
    problem_id: str = None,
    startup_id: str = None,
    status: str = None,
    user: Optional[dict] = Depends(get_current_user),
):
    query = supabase_admin.table("applications").select(
        "*, startup:startups(*), problem:problems(*)"
    )

    if problem_id:
        query = query.eq("problem_id", problem_id)

    # Handle startup_id == "mine"
    if startup_id == "mine":
        if user:
            st = supabase_admin.table("startups").select("id").eq("user_id", user["id"]).execute()
            if not st.data and user.get("email"):
                st = supabase_admin.table("startups").select("id").eq("email", user["email"]).execute()
            if st.data:
                query = query.eq("startup_id", st.data[0]["id"])
            else:
                return []
        else:
            return []
    elif startup_id:
        query = query.eq("startup_id", startup_id)

    if status and status.lower() != "all":
        query = query.eq("status", status)

    response = query.order("created_at", desc=True).execute()
    data = response.data or []
    populate_rejection_info(data)
    return data


@router.post("")
async def submit_application(
    data: dict = Body(...),
    user: dict = Depends(require_role(["startup", "admin"])),
):
    problem_id = data.get("problem_id")
    if not problem_id:
        raise HTTPException(status_code=400, detail="problem_id is required")

    # 1. Resolve startup_id
    startup_id = data.get("startup_id")
    if not startup_id:
        st_res = supabase_admin.table("startups").select("id").eq("user_id", user["id"]).execute()
        if st_res.data:
            startup_id = st_res.data[0]["id"]
        elif user.get("email"):
            st_by_email = supabase_admin.table("startups").select("id").eq("email", user["email"]).execute()
            if st_by_email.data:
                startup_id = st_by_email.data[0]["id"]

    if not startup_id:
        raise HTTPException(
            status_code=400,
            detail="Could not find a startup profile associated with your account. Please complete startup registration before submitting proposals."
        )

    # 2. Check for duplicate application
    existing = (
        supabase_admin.table("applications")
        .select("id, status")
        .eq("problem_id", problem_id)
        .eq("startup_id", startup_id)
        .execute()
    )
    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="You have already submitted an application for this problem. You can check its status under My Applications."
        )

    # 3. Clean and map payload
    solution = data.get("solution")
    if not solution:
        title = data.get("solution_title", "")
        desc = data.get("solution_description", "")
        solution = f"{title}: {desc}" if title and desc else (title or desc or "Proposed Solution")

    team_details = data.get("team_details")
    if isinstance(team_details, str):
        team_details = {"description": team_details, "size": data.get("team_size") or 1}
    elif not isinstance(team_details, dict):
        team_details = {"size": data.get("team_size") or 1}

    cost_proposed = data.get("cost_proposed")
    try:
        cost_proposed = int(float(cost_proposed)) if cost_proposed is not None else None
    except (ValueError, TypeError):
        cost_proposed = None

    db_payload = {
        "problem_id": problem_id,
        "startup_id": startup_id,
        "solution": solution,
        "proposed_approach": data.get("proposed_approach", ""),
        "implementation_plan": data.get("implementation_plan", ""),
        "cost_proposed": cost_proposed,
        "team_details": team_details,
        "previous_work": data.get("previous_work", ""),
        "expected_outcome": data.get("expected_outcome", ""),
        "status": "submitted",
    }

    response = supabase_admin.table("applications").insert(db_payload).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to submit application")

    created_app = response.data[0]
    await log_audit(user["id"], user["role"], "create", "application", created_app["id"], new_value=db_payload)
    return created_app


@router.get("/{id}")
async def get_application(id: str):
    response = supabase_admin.table("applications").select(
        "*, startup:startups(*), problem:problems(*)"
    ).eq("id", id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Application not found")
    app_data = response.data[0]
    populate_rejection_info([app_data])
    return app_data


@router.patch("/{id}/status")
async def update_status(
    id: str,
    payload: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    status = payload.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="status is required")

    existing = supabase_admin.table("applications").select("*").eq("id", id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Application not found")

    app_rec = existing.data[0]
    
    update_data = {"status": status}
    rejection_reason = payload.get("rejection_reason")
    rejection_feedback = payload.get("rejection_feedback")

    if rejection_reason:
        update_data["rejection_reason"] = rejection_reason
    if rejection_feedback is not None:
        update_data["rejection_feedback"] = rejection_feedback

    try:
        response = supabase_admin.table("applications").update(update_data).eq("id", id).execute()
    except Exception:
        # Fallback if rejection_reason / rejection_feedback columns don't exist yet
        response = supabase_admin.table("applications").update({"status": status}).eq("id", id).execute()

    # Save evaluation / rejection notes
    off_res = supabase_admin.table("government_officers").select("id").eq("user_id", user["id"]).execute()
    off_id = off_res.data[0]["id"] if off_res.data else None

    eval_data = payload.get("evaluation") or {}
    notes_text = rejection_feedback or eval_data.get("notes", "")
    if rejection_reason and "Reason:" not in (notes_text or ""):
        notes_text = f"Reason: {rejection_reason}\n{notes_text}".strip()

    eval_record = {
        "application_id": id,
        "officer_id": off_id,
        "technical_fit": eval_data.get("technical_fit", 5),
        "feasibility": eval_data.get("feasibility", 5),
        "cost_effectiveness": eval_data.get("cost_effectiveness", 5),
        "team_capability": eval_data.get("team_capability", 5),
        "expected_impact": eval_data.get("expected_impact", 5),
        "scalability": eval_data.get("scalability", 5),
        "decision": "reject" if status == "rejected" else eval_data.get("decision", "shortlist"),
        "notes": notes_text,
        "evaluated_at": datetime.now(timezone.utc).isoformat(),
    }
    try:
        supabase_admin.table("evaluations").upsert(eval_record, on_conflict="application_id").execute()
    except Exception:
        pass

    # If selected, auto-create pilot workspace if not already created
    if status == "selected":
        existing_pilot = supabase_admin.table("pilots").select("id").eq("application_id", id).execute()
        if not existing_pilot.data:
            prob_res = supabase_admin.table("problems").select("department_id, pilot_duration_days, budget_max, title").eq("id", app_rec["problem_id"]).execute()
            prob = prob_res.data[0] if prob_res.data else {}

            import uuid
            pilot_num = f"PILOT-{str(uuid.uuid4())[:8].upper()}"
            pilot_data = {
                "problem_id": app_rec["problem_id"],
                "application_id": id,
                "startup_id": app_rec["startup_id"],
                "department_id": prob.get("department_id"),
                "pilot_number": pilot_num,
                "duration_days": prob.get("pilot_duration_days") or 90,
                "budget_allocated": app_rec.get("cost_proposed") or prob.get("budget_max") or 1000000,
                "budget_released": int((app_rec.get("cost_proposed") or 1000000) * 0.4),
                "budget_utilized": 0,
                "target_outcome": f"Execution of pilot solution for {prob.get('title', 'problem')}",
                "success_criteria": {"milestone_completion": 100},
                "status": "active",
                "progress_percent": 10.0,
                "start_date": datetime.now(timezone.utc).date().isoformat(),
                "end_date": (datetime.now(timezone.utc) + timedelta(days=90)).date().isoformat(),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            try:
                p_created = supabase_admin.table("pilots").insert(pilot_data).execute()
                if p_created.data:
                    p_id = p_created.data[0]["id"]
                    supabase_admin.table("milestones").insert({
                        "pilot_id": p_id,
                        "title": "Phase 1: Kickoff & Technical Architecture Blueprint",
                        "description": "Finalize sensor specifications, system architecture, and telemetry interfaces.",
                        "due_date": (datetime.now(timezone.utc) + timedelta(days=20)).date().isoformat(),
                        "status": "pending",
                        "sequence_order": 1,
                    }).execute()
            except Exception:
                pass

    # Notify startup
    st_res = supabase_admin.table("startups").select("user_id, name").eq("id", app_rec["startup_id"]).execute()
    if st_res.data and st_res.data[0].get("user_id"):
        try:
            supabase_admin.table("notifications").insert({
                "user_id": st_res.data[0]["user_id"],
                "type": "application_status",
                "title": f"Application {status.upper()}",
                "body": f"Your pilot application has been marked as '{status.upper()}' by the reviewing department.",
                "reference_id": id,
                "reference_type": "application",
                "read": False,
            }).execute()
        except Exception:
            pass

    await log_audit(
        user["id"], user["role"], "update_status", "application", id,
        previous_value=app_rec, new_value={"status": status}
    )
    return response.data[0]
