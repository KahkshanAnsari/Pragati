from fastapi import APIRouter, Depends, HTTPException, Body, Query
from app.db.supabase import supabase_admin
from app.core.dependencies import get_current_user, require_role
from app.core.audit import log_audit
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import copy

router = APIRouter()

# Canonical 3 demo government projects linked 1-to-1 with existing Supabase records
DEFAULT_PROJECTS = [
    {
        "id": "gp000001-1111-4111-8111-000000000001",
        "project_number": "PROJ-AGR-2026-001",
        "project_name": "AI-Based Crop Disease Detection Deployment",
        "description": "Comprehensive statewide deployment of KrishiVision drone multi-spectral imaging and automated pest surveillance covering 2,500 hectares of farm land across Nashik and Baramati districts. Scaled following 100% successful pilot validation.",
        "sector": "Agriculture",
        "pilot_id": "0a000003-1111-4111-8111-000000000003",
        "validated_solution_id": "0b000002-1111-4111-8111-000000000002",
        "procurement_case_id": "0c000002-1111-4111-8111-000000000002",
        "startup_id": "b0000004-1111-4111-8111-000000000004",
        "department_id": "d0000004-1111-4111-8111-000000000004",
        "officer_id": "e0000004-1111-4111-8111-000000000004",
        "budget_allocated": 2600000,
        "budget_utilized": 2480000,
        "status": "completed",
        "progress_percent": 100.0,
        "start_date": "2026-01-15",
        "expected_end_date": "2026-07-15",
        "actual_end_date": "2026-07-10",
        "deployment_scope": "Statewide Farm Clusters, Nashik & Baramati",
        "deployment_target": 2500,
        "deployment_current": 2500,
        "deployment_unit": "Hectares",
        "kpi_achievement_percent": 96.0,
        "government_evaluation": 4.9,
        "officer_notes": "Full statewide agricultural deployment completed ahead of schedule. Drone telemetry and automated Marathi pest advisories successfully delivered to 1,500+ smallholder farmers with 96% satisfaction rate.",
        "procurement_reference": "DOA/MH/GEM/2026/0411",
        "work_order_number": "WO-DOA-2026-092",
        "scale_up_status": "scaled",
        "milestones": [
            {
                "id": "pm000001-1111-4111-8111-000000000001",
                "project_id": "gp000001-1111-4111-8111-000000000001",
                "title": "Contract Execution & GeM Work Order Issuance",
                "description": "Post-pilot procurement case approved under GFR Rule 149; formal work order issued to KrishiVision Technologies.",
                "sequence_order": 1,
                "due_date": "2026-01-20",
                "status": "completed",
                "completed_date": "2026-01-18",
                "government_notes": "Approved by Director of Agriculture Dr. Anita Desai. Mobilization advance released."
            },
            {
                "id": "pm000002-1111-4111-8111-000000000002",
                "project_id": "gp000001-1111-4111-8111-000000000001",
                "title": "Ground Calibration Stations & Base Station Setup",
                "description": "Installed 8 differential GPS ground calibration stations across Nashik and Baramati blocks.",
                "sequence_order": 2,
                "due_date": "2026-02-28",
                "status": "completed",
                "completed_date": "2026-02-25",
                "government_notes": "Sub-divisional Agriculture Officer inspected and certified all 8 calibration bases."
            },
            {
                "id": "pm000003-1111-4111-8111-000000000003",
                "project_id": "gp000001-1111-4111-8111-000000000001",
                "title": "Phase 1 Drone Scanning (1,200 Hectares)",
                "description": "Continuous multispectral scanning across onion and soybean clusters with automated NDVI and stress index generation.",
                "sequence_order": 3,
                "due_date": "2026-04-15",
                "status": "completed",
                "completed_date": "2026-04-12",
                "government_notes": "1,200 hectares mapped. Early fungal blight outbreak caught 8 days before visual onset."
            },
            {
                "id": "pm000004-1111-4111-8111-000000000004",
                "project_id": "gp000001-1111-4111-8111-000000000001",
                "title": "Full Area Scanning (2,500 Hectares) & WhatsApp Push",
                "description": "All 2,500 hectares covered with automated vernacular Marathi audio advisories sent to registered farmers.",
                "sequence_order": 4,
                "due_date": "2026-06-15",
                "status": "completed",
                "completed_date": "2026-06-10",
                "government_notes": "98.2% advisory delivery rate confirmed through SMS/WhatsApp gateway logs."
            },
            {
                "id": "pm000005-1111-4111-8111-000000000005",
                "project_id": "gp000001-1111-4111-8111-000000000001",
                "title": "Final Yield Verification & Project Sign-Off",
                "description": "Comprehensive third-party yield evaluation, audit report sign-off, and final contract completion certificate.",
                "sequence_order": 5,
                "due_date": "2026-07-15",
                "status": "completed",
                "completed_date": "2026-07-10",
                "government_notes": "Project declared 100% complete. Final settlement of Rs. 24.8 Lakhs authorized."
            }
        ],
        "updates": [
            {
                "id": "pu000001-1111-4111-8111-000000000001",
                "project_id": "gp000001-1111-4111-8111-000000000001",
                "author_role": "government_officer",
                "author_name": "Dr. Anita Desai, Director of Agriculture",
                "update_text": "Final contract closure signed. Total budget spent: Rs. 24,80,000 against allocated Rs. 26,00,000 (saving Rs. 1,20,000 for state exchequer). Farm coverage reached 2,500 hectares with zero crop loss from monitored pest vectors.",
                "update_type": "general",
                "created_at": "2026-07-10T14:30:00Z"
            },
            {
                "id": "pu000002-1111-4111-8111-000000000002",
                "project_id": "gp000001-1111-4111-8111-000000000001",
                "author_role": "startup",
                "author_name": "Rohit Patil, KrishiVision Technologies",
                "update_text": "Deployment Milestone 5 verified by district committee. Handed over seasonal pest maps and drone flight telemetry logs to district agri department.",
                "update_type": "milestone",
                "created_at": "2026-07-08T11:00:00Z"
            }
        ],
        "kpis": [
            {"metric_name": "Farm Coverage Area", "baseline_value": 0, "target_value": 2500, "current_value": 2500, "unit": "Hectares", "status": "achieved"},
            {"metric_name": "Pest Detection Precision", "baseline_value": 65, "target_value": 85, "current_value": 92.4, "unit": "%", "status": "achieved"},
            {"metric_name": "Farmer Advisory Delivery", "baseline_value": 0, "target_value": 90, "current_value": 98.2, "unit": "%", "status": "achieved"},
            {"metric_name": "Pest Crop Damage Reduction", "baseline_value": 0, "target_value": 30, "current_value": 34.5, "unit": "%", "status": "achieved"}
        ],
        "created_at": "2026-01-15T09:00:00Z"
    },
    {
        "id": "gp000002-1111-4111-8111-000000000002",
        "project_number": "PROJ-WRD-2026-002",
        "project_name": "Smart Water Quality Monitoring Deployment (AquaSense)",
        "description": "Comprehensive city-scale expansion of AquaSense AI hydro-acoustic leak telemetry and water quality IoT sensing across 25 municipal zones in Nagpur North and Central. Awarded post PILOT-001 (4.8/5 rating, 94% KPI) under government procurement guidelines.",
        "sector": "Water & Wastewater",
        "pilot_id": "0a000001-1111-4111-8111-000000000001",
        "validated_solution_id": "0b000001-1111-4111-8111-000000000001",
        "procurement_case_id": "0c000001-1111-4111-8111-000000000001",
        "startup_id": "b0000001-1111-4111-8111-000000000001",
        "department_id": "d0000001-1111-4111-8111-000000000001",
        "officer_id": "e0000001-1111-4111-8111-000000000001",
        "budget_allocated": 1000000,
        "budget_utilized": 720000,
        "status": "active",
        "progress_percent": 70.0,
        "start_date": "2026-08-01",
        "expected_end_date": "2026-11-30",
        "actual_end_date": None,
        "deployment_scope": "25 Municipal Monitoring Locations, Nagpur Urban Water Grid",
        "deployment_target": 25,
        "deployment_current": 18,
        "deployment_unit": "Locations",
        "kpi_achievement_percent": 92.5,
        "government_evaluation": 4.8,
        "officer_notes": "AquaSense has successfully deployed and commissioned 18 out of 25 municipal monitoring locations. Acoustic sensors operating with sub-8-meter leak pinpointing. Phase 4 installation across remaining 7 nodes scheduled for completion before 30 Nov 2026.",
        "procurement_reference": "WRD/NGP/GEM/2026/0188",
        "work_order_number": "WO-WRD-2026-044",
        "scale_up_status": "recommended",
        "milestones": [
            {
                "id": "pm000006-1111-4111-8111-000000000006",
                "project_id": "gp000002-1111-4111-8111-000000000002",
                "title": "Procurement Agreement & Initial Fund Release",
                "description": "Government contract executed post-pilot validation; initial mobilization tranche of Rs. 4,00,000 released.",
                "sequence_order": 1,
                "due_date": "2026-08-10",
                "status": "completed",
                "completed_date": "2026-08-08",
                "government_notes": "Executed by Rajesh Kumar, Joint Commissioner. Compliance with GFR Rule 149 confirmed."
            },
            {
                "id": "pm000007-1111-4111-8111-000000000007",
                "project_id": "gp000002-1111-4111-8111-000000000002",
                "title": "Phase 1 Hardware Rollout (Locations 1 to 8)",
                "description": "Installed acoustic clamp sensors and pressure transmitters across first 8 high-priority municipal water distribution points.",
                "sequence_order": 2,
                "due_date": "2026-09-05",
                "status": "completed",
                "completed_date": "2026-09-03",
                "government_notes": "Field inspected by WRD engineers. All 8 nodes streaming live telemetry to central command."
            },
            {
                "id": "pm000008-1111-4111-8111-000000000008",
                "project_id": "gp000002-1111-4111-8111-000000000002",
                "title": "Phase 2 Expansion (Locations 9 to 18)",
                "description": "Expanded deployment to secondary feeder mains. 18 of 25 locations now operational with automated anomaly detection.",
                "sequence_order": 3,
                "due_date": "2026-10-10",
                "status": "completed",
                "completed_date": "2026-10-05",
                "government_notes": "Milestone 3 verified. 18 operational nodes achieved. Budget utilized: Rs. 7,20,000."
            },
            {
                "id": "pm000009-1111-4111-8111-000000000009",
                "project_id": "gp000002-1111-4111-8111-000000000002",
                "title": "Phase 3 Final Node Installation (Locations 19 to 25)",
                "description": "Mounting acoustic loggers at the final 7 distribution branches and testing SCADA multi-ward failover.",
                "sequence_order": 4,
                "due_date": "2026-11-15",
                "status": "in_progress",
                "completed_date": None,
                "government_notes": "Installation commenced at nodes 19-21 in Sitabuldi ward. On track for mid-November completion."
            },
            {
                "id": "pm000010-1111-4111-8111-000000000010",
                "project_id": "gp000002-1111-4111-8111-000000000002",
                "title": "Integrated Verification & City-Scale Commissioning",
                "description": "Final 30-day continuous stress run, CPCB water quality compliance certification, and handover to municipal operations.",
                "sequence_order": 5,
                "due_date": "2026-11-30",
                "status": "pending",
                "completed_date": None,
                "government_notes": "Target completion date: 30 Nov 2026."
            }
        ],
        "updates": [
            {
                "id": "pu000003-1111-4111-8111-000000000003",
                "project_id": "gp000002-1111-4111-8111-000000000002",
                "author_role": "government_officer",
                "author_name": "Rajesh Kumar, Joint Commissioner",
                "update_text": "Milestone 3 verified. 18 of 25 monitoring locations are now fully operational. Pressure telemetry and acoustic sensors are active. Budget utilized stands at Rs. 7,20,000 of Rs. 10,00,000. Project progress is at 70% with expected completion on 30 Nov 2026.",
                "update_type": "progress",
                "created_at": "2026-10-06T09:30:00Z"
            },
            {
                "id": "pu000004-1111-4111-8111-000000000004",
                "project_id": "gp000002-1111-4111-8111-000000000002",
                "author_role": "startup",
                "author_name": "Dr. Anika Patel, AquaSense Technologies",
                "update_text": "Completed acoustic profiling for nodes 15 through 18. Detected minor flange weeping at Dharampeth reservoir feeder and notified maintenance engineers within 12 minutes.",
                "update_type": "field_visit",
                "created_at": "2026-10-04T16:15:00Z"
            },
            {
                "id": "pu000005-1111-4111-8111-000000000005",
                "project_id": "gp000002-1111-4111-8111-000000000002",
                "author_role": "government_officer",
                "author_name": "Rajesh Kumar, Joint Commissioner",
                "update_text": "Conducted random field inspection at Zone 4 monitoring node. Water quality sensors (pH, turbidity, residual chlorine) cross-calibrated with laboratory titrations; variance < 1.2%.",
                "update_type": "field_visit",
                "created_at": "2026-09-22T14:00:00Z"
            }
        ],
        "kpis": [
            {"metric_name": "Deployment Locations Live", "baseline_value": 0, "target_value": 25, "current_value": 18, "unit": "Locations", "status": "on_track"},
            {"metric_name": "Non-Revenue Water Loss", "baseline_value": 32, "target_value": 20, "current_value": 18.2, "unit": "%", "status": "achieved"},
            {"metric_name": "Automated Anomaly Precision", "baseline_value": 0, "target_value": 90, "current_value": 94.6, "unit": "%", "status": "achieved"},
            {"metric_name": "Alert Escalation Time", "baseline_value": 240, "target_value": 30, "current_value": 14, "unit": "Minutes", "status": "achieved"}
        ],
        "created_at": "2026-08-01T10:00:00Z"
    },
    {
        "id": "gp000003-1111-4111-8111-000000000003",
        "project_number": "PROJ-MNRE-2026-003",
        "project_name": "Smart Energy Monitoring Deployment",
        "description": "Phase 1 adoption of CleanGrid MicroBalancer intelligent solar feeder telemetry and predictive inverter health analytics across 20 state-run renewable power substations. Currently deployed across 6 initial pilot sites.",
        "sector": "Clean Energy",
        "pilot_id": "0a000004-1111-4111-8111-000000000004",
        "validated_solution_id": "0b000003-1111-4111-8111-000000000003",
        "procurement_case_id": "0c000003-1111-4111-8111-000000000003",
        "startup_id": "b0000005-1111-4111-8111-000000000005",
        "department_id": "d0000006-1111-4111-8111-000000000006",
        "officer_id": "e0000006-1111-4111-8111-000000000006",
        "budget_allocated": 1200000,
        "budget_utilized": 310000,
        "status": "active",
        "progress_percent": 30.0,
        "start_date": "2026-09-01",
        "expected_end_date": "2027-02-28",
        "actual_end_date": None,
        "deployment_scope": "20 Renewable Power Substations, Charanka Solar Corridor",
        "deployment_target": 20,
        "deployment_current": 6,
        "deployment_unit": "Substations",
        "kpi_achievement_percent": 84.0,
        "government_evaluation": 4.5,
        "officer_notes": "Phase 1 hardware deployment complete across 6 of 20 planned solar feeder sites. High-frequency 1Hz SCADA telemetry streaming reliably to MNRE national control portal. Budget utilized: Rs. 3,10,000 of Rs. 12,00,000.",
        "procurement_reference": "MNRE/SOLAR/2026/0772",
        "work_order_number": "WO-MNRE-2026-019",
        "scale_up_status": "not_ready",
        "milestones": [
            {
                "id": "pm000011-1111-4111-8111-000000000011",
                "project_id": "gp000003-1111-4111-8111-000000000003",
                "title": "Work Order Executed & Hardware Staging",
                "description": "Procurement case approved by MNRE. Contract signed and initial 20 IoT gateway modules calibrated in lab.",
                "sequence_order": 1,
                "due_date": "2026-09-10",
                "status": "completed",
                "completed_date": "2026-09-08",
                "government_notes": "Signed by Director Sanjay Patil. Tranche 1 funds released."
            },
            {
                "id": "pm000012-1111-4111-8111-000000000012",
                "project_id": "gp000003-1111-4111-8111-000000000003",
                "title": "Phase 1 Site Deployment (6 Substations)",
                "description": "Completed sensor installation and SCADA interface integration across first 6 renewable power substations.",
                "sequence_order": 2,
                "due_date": "2026-10-15",
                "status": "completed",
                "completed_date": "2026-10-12",
                "government_notes": "6 of 20 substations online. Current progress at 30% with Rs. 3,10,000 utilized."
            },
            {
                "id": "pm000013-1111-4111-8111-000000000013",
                "project_id": "gp000003-1111-4111-8111-000000000003",
                "title": "Phase 2 Rollout (Substations 7 to 14)",
                "description": "Deploying telemetry gateways across 8 additional solar power feeders in Rajasthan and Gujarat corridor.",
                "sequence_order": 3,
                "due_date": "2026-12-15",
                "status": "in_progress",
                "completed_date": None,
                "government_notes": "Site surveys underway for sites 7 to 10."
            },
            {
                "id": "pm000014-1111-4111-8111-000000000014",
                "project_id": "gp000003-1111-4111-8111-000000000003",
                "title": "Phase 3 Final Substation Cluster (Substations 15 to 20)",
                "description": "Final 6 substations integration with unified grid stability analytics.",
                "sequence_order": 4,
                "due_date": "2027-01-31",
                "status": "pending",
                "completed_date": None,
                "government_notes": None
            },
            {
                "id": "pm000015-1111-4111-8111-000000000015",
                "project_id": "gp000003-1111-4111-8111-000000000003",
                "title": "Comprehensive Grid Telemetry Verification & Closure",
                "description": "Final validation of inverter fault prediction accuracy and project sign-off.",
                "sequence_order": 5,
                "due_date": "2027-02-28",
                "status": "pending",
                "completed_date": None,
                "government_notes": None
            }
        ],
        "updates": [
            {
                "id": "pu000006-1111-4111-8111-000000000006",
                "project_id": "gp000003-1111-4111-8111-000000000003",
                "author_role": "government_officer",
                "author_name": "Sanjay Patil, Director (MNRE)",
                "update_text": "Milestone 2 completed. 6 of 20 substations online. SCADA telemetry verified with 99.8% uptime. Total budget utilized: Rs. 3,10,000. Project progress: 30%.",
                "update_type": "progress",
                "created_at": "2026-10-12T10:00:00Z"
            },
            {
                "id": "pu000007-1111-4111-8111-000000000007",
                "project_id": "gp000003-1111-4111-8111-000000000003",
                "author_role": "startup",
                "author_name": "Aditya Verma, CleanGrid Dynamics",
                "update_text": "Commissioned inverters at Site 5 and Site 6. Automated harmonic distortion filter deployed.",
                "update_type": "milestone",
                "created_at": "2026-10-10T12:00:00Z"
            }
        ],
        "kpis": [
            {"metric_name": "Substations Integrated", "baseline_value": 0, "target_value": 20, "current_value": 6, "unit": "Sites", "status": "on_track"},
            {"metric_name": "Predictive Failure Advance Warning", "baseline_value": 0, "target_value": 48, "current_value": 52, "unit": "Hours", "status": "achieved"},
            {"metric_name": "Unscheduled Downtime Reduction", "baseline_value": 0, "target_value": 25, "current_value": 21.5, "unit": "%", "status": "on_track"},
            {"metric_name": "Telemetry Gateway Uptime", "baseline_value": 0, "target_value": 99, "current_value": 99.8, "unit": "%", "status": "achieved"}
        ],
        "created_at": "2026-09-01T11:00:00Z"
    }
]

# In-memory store initialized with deep copy of default projects
_PROJECTS_CACHE: Dict[str, Dict[str, Any]] = {p["id"]: copy.deepcopy(p) for p in DEFAULT_PROJECTS}

def _hydrate_project_relationships(proj: Dict[str, Any]) -> Dict[str, Any]:
    """Enrich project with live Supabase foreign key records if available."""
    result = copy.deepcopy(proj)
    try:
        if proj.get("startup_id"):
            st_resp = supabase_admin.table("startups").select("id, name, sector, founder_name, email, phone, verification_status, trust_score").eq("id", proj["startup_id"]).execute()
            if st_resp.data:
                result["startup"] = st_resp.data[0]
        if proj.get("department_id"):
            dp_resp = supabase_admin.table("government_departments").select("id, name, sector, location, head_name").eq("id", proj["department_id"]).execute()
            if dp_resp.data:
                result["department"] = dp_resp.data[0]
        if proj.get("pilot_id"):
            pl_resp = supabase_admin.table("pilots").select("id, pilot_number, status, progress_percent, overall_score, budget_allocated, budget_utilized, start_date, end_date, target_outcome").eq("id", proj["pilot_id"]).execute()
            if pl_resp.data:
                result["pilot"] = pl_resp.data[0]
        if proj.get("officer_id"):
            of_resp = supabase_admin.table("government_officers").select("id, name, designation, official_email, verification_status").eq("id", proj["officer_id"]).execute()
            if of_resp.data:
                result["officer"] = of_resp.data[0]
        if proj.get("validated_solution_id"):
            vs_resp = supabase_admin.table("validated_solutions").select("*").eq("id", proj["validated_solution_id"]).execute()
            if vs_resp.data:
                result["validated_solution"] = vs_resp.data[0]
        if proj.get("procurement_case_id"):
            pc_resp = supabase_admin.table("procurement_cases").select("*").eq("id", proj["procurement_case_id"]).execute()
            if pc_resp.data:
                result["procurement_case"] = pc_resp.data[0]
    except Exception:
        pass
    return result

@router.get("")
async def list_projects(
    startup_id: Optional[str] = None,
    department_id: Optional[str] = None,
    status: Optional[str] = None,
    user: Optional[dict] = Depends(get_current_user),
):
    """List all government projects, optionally filtered."""
    try:
        query = supabase_admin.table("government_projects").select(
            "*, startup:startups(*), department:government_departments(*), pilot:pilots(*), officer:government_officers(*)"
        )
        if department_id:
            query = query.eq("department_id", department_id)
        if startup_id == "mine" and user:
            st = supabase_admin.table("startups").select("id").eq("user_id", user["id"]).execute()
            if not st.data and user.get("email"):
                st = supabase_admin.table("startups").select("id").eq("email", user["email"]).execute()
            if st.data:
                query = query.eq("startup_id", st.data[0]["id"])
        elif startup_id:
            query = query.eq("startup_id", startup_id)
        if status and status.lower() != "all":
            query = query.eq("status", status)

        resp = query.order("created_at", desc=True).execute()
        if resp.data:
            projects = resp.data
            for p in projects:
                ms = supabase_admin.table("project_milestones").select("*").eq("project_id", p["id"]).order("sequence_order").execute().data or []
                up = supabase_admin.table("project_updates").select("*").eq("project_id", p["id"]).order("created_at", desc=True).execute().data or []
                p["milestones"] = ms
                p["updates"] = up
            return projects
    except Exception:
        pass

    resolved_startup_id = None
    if startup_id == "mine":
        if user:
            try:
                st = supabase_admin.table("startups").select("id").eq("user_id", user["id"]).execute()
                if not st.data and user.get("email"):
                    st = supabase_admin.table("startups").select("id").eq("email", user["email"]).execute()
                if st.data:
                    resolved_startup_id = st.data[0]["id"]
            except Exception:
                pass
        if not resolved_startup_id:
            resolved_startup_id = "b0000001-1111-4111-8111-000000000001"
    elif startup_id:
        resolved_startup_id = startup_id

    projects = list(_PROJECTS_CACHE.values())

    if resolved_startup_id:
        projects = [p for p in projects if p.get("startup_id") == resolved_startup_id]

    if department_id:
        projects = [p for p in projects if p.get("department_id") == department_id]

    if status and status.lower() != "all":
        projects = [p for p in projects if p.get("status", "").lower() == status.lower()]

    enriched = [_hydrate_project_relationships(p) for p in projects]
    return enriched

@router.get("/{id}")
async def get_project(id: str):
    """Get complete details of a single government project."""
    try:
        resp = supabase_admin.table("government_projects").select(
            "*, startup:startups(*), department:government_departments(*), pilot:pilots(*), officer:government_officers(*)"
        ).eq("id", id).execute()
        if resp.data:
            p = resp.data[0]
            ms = supabase_admin.table("project_milestones").select("*").eq("project_id", id).order("sequence_order").execute().data or []
            up = supabase_admin.table("project_updates").select("*").eq("project_id", id).order("created_at", desc=True).execute().data or []
            p["milestones"] = ms
            p["updates"] = up
            return p
    except Exception:
        pass

    if id not in _PROJECTS_CACHE:
        raise HTTPException(status_code=404, detail="Government Project not found")

    proj = _PROJECTS_CACHE[id]
    return _hydrate_project_relationships(proj)

@router.patch("/{id}")
@router.put("/{id}")
async def update_project(
    id: str,
    data: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    """Update government project progress, status, budget, or officer notes."""
    now_iso = datetime.now(timezone.utc).isoformat()
    data["updated_at"] = now_iso

    try:
        resp = supabase_admin.table("government_projects").update(data).eq("id", id).execute()
        if resp.data:
            await log_audit(user["id"], user["role"], "update", "government_project", id, new_value=data)
            return await get_project(id)
    except Exception:
        pass

    if id not in _PROJECTS_CACHE:
        raise HTTPException(status_code=404, detail="Government Project not found")

    proj = _PROJECTS_CACHE[id]
    for k, v in data.items():
        if k not in ["id", "pilot_id", "startup_id", "department_id"]:
            proj[k] = v

    await log_audit(user["id"], user["role"], "update", "government_project", id, new_value=data)
    return _hydrate_project_relationships(proj)

@router.post("/{id}/milestones")
async def add_milestone(
    id: str,
    data: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin"])),
):
    """Add a project milestone."""
    import uuid
    m_id = data.get("id", f"pm-{str(uuid.uuid4())[:8]}")
    data["id"] = m_id
    data["project_id"] = id

    try:
        resp = supabase_admin.table("project_milestones").insert(data).execute()
        if resp.data:
            return resp.data[0]
    except Exception:
        pass

    if id not in _PROJECTS_CACHE:
        raise HTTPException(status_code=404, detail="Project not found")

    proj = _PROJECTS_CACHE[id]
    milestones = proj.get("milestones", [])
    milestones.append(data)
    proj["milestones"] = milestones
    return data

@router.patch("/{id}/milestones/{milestone_id}")
async def update_milestone_status(
    id: str,
    milestone_id: str,
    data: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "admin", "startup"])),
):
    """Update a milestone (e.g. mark completed or in_progress)."""
    now_iso = datetime.now(timezone.utc).date().isoformat()
    if data.get("status") == "completed" and "completed_date" not in data:
        data["completed_date"] = now_iso

    try:
        resp = supabase_admin.table("project_milestones").update(data).eq("id", milestone_id).execute()
        if resp.data:
            return resp.data[0]
    except Exception:
        pass

    if id not in _PROJECTS_CACHE:
        raise HTTPException(status_code=404, detail="Project not found")

    proj = _PROJECTS_CACHE[id]
    for ms in proj.get("milestones", []):
        if ms.get("id") == milestone_id:
            for k, v in data.items():
                ms[k] = v
            total_m = len(proj.get("milestones", []))
            comp_m = len([m for m in proj.get("milestones", []) if m.get("status") == "completed"])
            if total_m > 0:
                proj["progress_percent"] = round((comp_m / total_m) * 100.0, 1)
                if proj["progress_percent"] >= 100.0:
                    proj["status"] = "completed"
            return ms

    raise HTTPException(status_code=404, detail="Milestone not found")

@router.post("/{id}/updates")
async def add_project_update(
    id: str,
    data: dict = Body(...),
    user: dict = Depends(require_role(["government_officer", "startup", "admin"])),
):
    """Add a government update, field observation, or progress report."""
    import uuid
    u_id = data.get("id", f"pu-{str(uuid.uuid4())[:8]}")
    now_iso = datetime.now(timezone.utc).isoformat()
    record = {
        "id": u_id,
        "project_id": id,
        "author_role": user.get("role", "government_officer"),
        "author_name": data.get("author_name") or user.get("name") or user.get("email", "Officer"),
        "update_text": data.get("update_text", ""),
        "update_type": data.get("update_type", "progress"),
        "created_at": now_iso
    }

    try:
        resp = supabase_admin.table("project_updates").insert(record).execute()
        if resp.data:
            return resp.data[0]
    except Exception:
        pass

    if id not in _PROJECTS_CACHE:
        raise HTTPException(status_code=404, detail="Project not found")

    proj = _PROJECTS_CACHE[id]
    updates = proj.get("updates", [])
    updates.insert(0, record)
    proj["updates"] = updates
    return record
