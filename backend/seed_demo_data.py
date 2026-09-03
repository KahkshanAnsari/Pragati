#!/usr/bin/env python3
"""
Pragati Platform - Production-Ready Canonical Demo Data Seed Script
===================================================================
Features:
- Completely safe and idempotent (run as many times as you like)
- Syncs 15 Supabase Auth accounts with email_confirm=True
- 8 Government Departments & Officers across sectors
- 7 Canonical Unique Startups (0 duplicates)
- 10 Diverse Government Challenges & Problems
- 12 Realistic Applications (3 Submitted, 2 Shortlisted, 5 Selected, 2 Rejected)
- 5 Detailed Pilots (Active, At Risk, Completed, Paused/Delayed)
- 18 Milestones & 12 KPIs with real telemetry values
- Budget transactions (Allocated, Released, Utilized)
- Field inspections with inspector notes
- Procurement cases with GeM readiness checklists
- Validated Solutions for cross-department replication
- Inter-department Adoption Requests

Run:
    python seed_demo_data.py
"""

import os
import sys
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = (
    os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    or os.getenv("SUPABASE_SERVICE_KEY")
    or os.getenv("SERVICE_ROLE_KEY")
)

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Missing SUPABASE_URL or service role key in .env")
    sys.exit(1)

db = create_client(SUPABASE_URL, SUPABASE_KEY)

now = datetime.now(timezone.utc).isoformat()

# ─────────────────────────────────────────────────────────────────────────────
# 1. Deterministic UUID Architecture
# ─────────────────────────────────────────────────────────────────────────────

DEPT_IDS = {
    "water":     "d0000001-1111-4111-8111-000000000001",
    "pune":      "d0000002-1111-4111-8111-000000000002",
    "mobility":  "d0000003-1111-4111-8111-000000000003",
    "agri":      "d0000004-1111-4111-8111-000000000004",
    "health":    "d0000005-1111-4111-8111-000000000005",
    "energy":    "d0000006-1111-4111-8111-000000000006",
    "education": "d0000007-1111-4111-8111-000000000007",
    "bmc":       "d0000008-1111-4111-8111-000000000008",
}

STARTUP_IDS = {
    "aqua":       "b0000001-1111-4111-8111-000000000001",
    "safe":       "b0000002-1111-4111-8111-000000000002",
    "medi":       "b0000003-1111-4111-8111-000000000003",
    "krishi":     "b0000004-1111-4111-8111-000000000004",
    "cleangrid":  "b0000005-1111-4111-8111-000000000005",
    "edubridge":  "b0000006-1111-4111-8111-000000000006",
    "civicpulse": "b0000007-1111-4111-8111-000000000007",
}

PROBLEM_IDS = {
    "p1_water":      "c0000001-1111-4111-8111-000000000001",
    "p2_agri":       "c0000002-1111-4111-8111-000000000002",
    "p3_health":     "c0000003-1111-4111-8111-000000000003",
    "p4_energy":     "c0000004-1111-4111-8111-000000000004",
    "p5_edu":        "c0000005-1111-4111-8111-000000000005",
    "p6_mobility":   "c0000006-1111-4111-8111-000000000006",
    "p7_grievance":  "c0000007-1111-4111-8111-000000000007",
    "p8_waste":      "c0000008-1111-4111-8111-000000000008",
    "p9_pothole":    "c0000009-1111-4111-8111-000000000009",
    "p10_sewage":    "c0000010-1111-4111-8111-000000000010",
}

APP_IDS = {
    "sub_1":   "a0000001-1111-4111-8111-000000000001",
    "sub_2":   "a0000002-1111-4111-8111-000000000002",
    "sub_3":   "a0000003-1111-4111-8111-000000000003",
    "short_1": "a0000004-1111-4111-8111-000000000004",
    "short_2": "a0000005-1111-4111-8111-000000000005",
    "sel_1":   "a0000006-1111-4111-8111-000000000006",
    "sel_2":   "a0000007-1111-4111-8111-000000000007",
    "sel_3":   "a0000008-1111-4111-8111-000000000008",
    "sel_4":   "a0000009-1111-4111-8111-000000000009",
    "sel_5":   "a0000010-1111-4111-8111-000000000010",
    "rej_1":   "a0000011-1111-4111-8111-000000000011",
    "rej_2":   "a0000012-1111-4111-8111-000000000012",
}

PILOT_IDS = {
    "pilot_1_active":    "0a000001-1111-4111-8111-000000000001",
    "pilot_2_at_risk":   "0a000002-1111-4111-8111-000000000002",
    "pilot_3_completed": "0a000003-1111-4111-8111-000000000003",
    "pilot_4_energy":    "0a000004-1111-4111-8111-000000000004",
    "pilot_5_mobility":  "0a000005-1111-4111-8111-000000000005",
}

# ─────────────────────────────────────────────────────────────────────────────
# 2. Auth Credentials (15 Demo Accounts)
# ─────────────────────────────────────────────────────────────────────────────

AUTH_USERS = [
    # Government Officers
    {"email": "rajesh.kumar@waterresources.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Rajesh Kumar", "dept_key": "water", "designation": "Joint Commissioner (Water Works)"},
    {"email": "priya.sharma@smartcitypune.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Priya Sharma", "dept_key": "pune", "designation": "Chief Technology Officer"},
    {"email": "arjun.mehta@nhai.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Arjun Mehta", "dept_key": "mobility", "designation": "Superintending Engineer (ITS)"},
    {"email": "anita.desai@agri.maharashtra.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Dr. Anita Desai", "dept_key": "agri", "designation": "Director of Agriculture"},
    {"email": "kavya.health@karnataka.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Dr. Ramesh Hegde", "dept_key": "health", "designation": "Mission Director (NHM)"},
    {"email": "sanjay.patil@mnre.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Sanjay Patil", "dept_key": "energy", "designation": "Director (Solar Energy)"},
    {"email": "kavita.reddy@edu.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Kavita Reddy", "dept_key": "education", "designation": "Additional Secretary"},
    {"email": "suresh.bmc@mcgm.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Suresh More", "dept_key": "bmc", "designation": "Chief Information Officer"},

    # Startup Innovators (7 Canonical Startups)
    {"email": "anika@aquasense.ai", "password": "StartupDemo@2026", "role": "startup", "name": "Dr. Anika Patel", "company": "AquaSense Technologies", "st_key": "aqua"},
    {"email": "vikram@saferoute.in", "password": "StartupDemo@2026", "role": "startup", "name": "Vikram Malhotra", "company": "SafeRoute Mobility", "st_key": "safe"},
    {"email": "kavya@meditrack.ai", "password": "StartupDemo@2026", "role": "startup", "name": "Dr. Kavya Nair", "company": "MediTrack AI", "st_key": "medi"},
    {"email": "rohit@krishivision.in", "password": "StartupDemo@2026", "role": "startup", "name": "Rohit Patil", "company": "KrishiVision Technologies", "st_key": "krishi"},
    {"email": "aditya@cleangrid.in", "password": "StartupDemo@2026", "role": "startup", "name": "Aditya Verma", "company": "CleanGrid Dynamics", "st_key": "cleangrid"},
    {"email": "neha@edubridge.in", "password": "StartupDemo@2026", "role": "startup", "name": "Neha Tiwari", "company": "EduBridge Labs", "st_key": "edubridge"},
    {"email": "pooja@civicpulse.in", "password": "StartupDemo@2026", "role": "startup", "name": "Pooja Deshmukh", "company": "CivicPulse Technologies", "st_key": "civicpulse"},
]

def sync_auth_users():
    print("--- 1. Synchronizing Supabase Auth Users ---")
    email_to_uuid = {}
    try:
        all_users = db.auth.admin.list_users()
    except Exception as e:
        print(f"  [WARN] Failed to list auth users: {e}")
        all_users = []

    user_map = {u.email.lower(): u.id for u in all_users if getattr(u, 'email', None)}

    for cred in AUTH_USERS:
        email = cred["email"].lower()
        if email in user_map:
            u_id = user_map[email]
            email_to_uuid[email] = u_id
            try:
                db.auth.admin.update_user_by_id(u_id, {
                    "password": cred["password"],
                    "email_confirm": True,
                    "user_metadata": {"role": cred["role"], "name": cred["name"]},
                })
            except Exception:
                pass
            print(f"  [EXISTING] {email} -> {u_id}")
        else:
            try:
                created = db.auth.admin.create_user({
                    "email": email,
                    "password": cred["password"],
                    "email_confirm": True,
                    "user_metadata": {"role": cred["role"], "name": cred["name"]},
                })
                u_id = created.user.id
                email_to_uuid[email] = u_id
                print(f"  [CREATED]  {email} -> {u_id}")
            except Exception as e:
                print(f"  [ERR] {email}: {e}")

    return email_to_uuid

def clean_database():
    print("\n--- 2. Cleaning Transient Relational Data ---")
    tables = [
        "adoption_requests",
        "validated_solutions",
        "procurement_cases",
        "issue_reports",
        "field_inspections",
        "budget_transactions",
        "kpi_updates",
        "kpis",
        "milestones",
        "pilots",
        "evaluations",
        "applications",
        "startup_matches",
        "problems",
        "startups",
        "government_officers",
        "government_departments",
        "users",
    ]
    for table in tables:
        try:
            db.table(table).delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
            print(f"  Cleared {table}")
        except Exception as e:
            print(f"  Skipped/Ignored {table}: {e}")

def seed_all(user_ids):
    print("\n--- 3. Seeding Canonical Master Dataset ---")

    # (A) Public Users
    public_users = []
    for cred in AUTH_USERS:
        email = cred["email"].lower()
        uid = user_ids.get(email)
        if uid:
            public_users.append({
                "id": uid,
                "email": email,
                "role": cred["role"],
                "created_at": now,
            })
    db.table("users").upsert(public_users).execute()
    print(f"  [DONE] Inserted {len(public_users)} public users")

    # (B) 8 Government Departments
    depts = [
        {"id": DEPT_IDS["water"],     "name": "Water Resources Department, Nagpur",         "sector": "Water & Wastewater",      "location": "Nagpur, Maharashtra",  "head_name": "Dr. Sanjay Belsare IAS"},
        {"id": DEPT_IDS["pune"],      "name": "Pune Smart City Development Corp (PSCDCL)",  "sector": "Governance & Smart Cities", "location": "Pune, Maharashtra",    "head_name": "Sanjay Kolte IAS"},
        {"id": DEPT_IDS["mobility"],  "name": "National Highways Authority of India (NHAI)","sector": "Smart Infrastructure & Mobility", "location": "New Delhi",    "head_name": "Santosh Kumar Yadav IAS"},
        {"id": DEPT_IDS["agri"],      "name": "Department of Agriculture, Maharashtra",    "sector": "Agriculture",             "location": "Pune, Maharashtra",    "head_name": "Vikas Chandra Rastogi IAS"},
        {"id": DEPT_IDS["health"],    "name": "Health & Family Welfare Dept, Karnataka",    "sector": "Healthcare",              "location": "Bengaluru, Karnataka", "head_name": "Harsh Gupta IAS"},
        {"id": DEPT_IDS["energy"],    "name": "Ministry of New & Renewable Energy (MNRE)",  "sector": "Clean Energy",            "location": "New Delhi",            "head_name": "Bhupinder S. Bhalla IAS"},
        {"id": DEPT_IDS["education"], "name": "Department of School Education, Telangana",  "sector": "Education & Skilling",    "location": "Hyderabad, Telangana", "head_name": "A. Sridevasena IAS"},
        {"id": DEPT_IDS["bmc"],       "name": "Brihanmumbai Municipal Corporation (BMC)",   "sector": "Governance & Smart Cities", "location": "Mumbai, Maharashtra",  "head_name": "Bhushan Gagrani IAS"},
    ]
    db.table("government_departments").upsert(depts).execute()
    print(f"  [DONE] Inserted {len(depts)} government departments")

    # (C) 8 Government Officers
    officers = [
        {"id": "e0000001-1111-4111-8111-000000000001", "user_id": user_ids["rajesh.kumar@waterresources.gov.in"], "department_id": DEPT_IDS["water"],     "name": "Rajesh Kumar",     "designation": "Joint Commissioner (Water Works)", "official_email": "rajesh.kumar@waterresources.gov.in", "gov_id": "MH-WRD-001", "verification_status": "verified"},
        {"id": "e0000002-1111-4111-8111-000000000002", "user_id": user_ids["priya.sharma@smartcitypune.gov.in"],  "department_id": DEPT_IDS["pune"],      "name": "Priya Sharma",      "designation": "Chief Technology Officer",          "official_email": "priya.sharma@smartcitypune.gov.in",  "gov_id": "MH-PUN-002", "verification_status": "verified"},
        {"id": "e0000003-1111-4111-8111-000000000003", "user_id": user_ids["arjun.mehta@nhai.gov.in"],            "department_id": DEPT_IDS["mobility"],  "name": "Arjun Mehta",      "designation": "Superintending Engineer (ITS)",    "official_email": "arjun.mehta@nhai.gov.in",            "gov_id": "NHAI-HQ-003","verification_status": "verified"},
        {"id": "e0000004-1111-4111-8111-000000000004", "user_id": user_ids["anita.desai@agri.maharashtra.gov.in"], "department_id": DEPT_IDS["agri"],      "name": "Dr. Anita Desai",  "designation": "Director of Agriculture",           "official_email": "anita.desai@agri.maharashtra.gov.in", "gov_id": "MH-AGR-004", "verification_status": "verified"},
        {"id": "e0000005-1111-4111-8111-000000000005", "user_id": user_ids["kavya.health@karnataka.gov.in"],     "department_id": DEPT_IDS["health"],    "name": "Dr. Ramesh Hegde", "designation": "Mission Director (NHM)",           "official_email": "kavya.health@karnataka.gov.in",      "gov_id": "KA-HFW-005", "verification_status": "verified"},
        {"id": "e0000006-1111-4111-8111-000000000006", "user_id": user_ids["sanjay.patil@mnre.gov.in"],            "department_id": DEPT_IDS["energy"],    "name": "Sanjay Patil",     "designation": "Director (Solar Energy)",           "official_email": "sanjay.patil@mnre.gov.in",            "gov_id": "GOI-MNRE-006","verification_status": "verified"},
        {"id": "e0000007-1111-4111-8111-000000000007", "user_id": user_ids["kavita.reddy@edu.gov.in"],             "department_id": DEPT_IDS["education"], "name": "Kavita Reddy",     "designation": "Additional Secretary",              "official_email": "kavita.reddy@edu.gov.in",             "gov_id": "TS-EDU-007", "verification_status": "verified"},
        {"id": "e0000008-1111-4111-8111-000000000008", "user_id": user_ids["suresh.bmc@mcgm.gov.in"],              "department_id": DEPT_IDS["bmc"],       "name": "Suresh More",      "designation": "Chief Information Officer",         "official_email": "suresh.bmc@mcgm.gov.in",             "gov_id": "MH-BMC-008", "verification_status": "verified"},
    ]
    db.table("government_officers").upsert(officers).execute()
    print(f"  [DONE] Inserted {len(officers)} government officers")

    # (D) Exactly 7 Canonical Unique Startups
    startups = [
        {
            "id": STARTUP_IDS["aqua"],
            "user_id": user_ids["anika@aquasense.ai"],
            "name": "AquaSense Technologies",
            "founder_name": "Dr. Anika Patel",
            "email": "anika@aquasense.ai",
            "phone": "+91-9823011223",
            "sector": "Water & Wastewater",
            "technologies": ["IoT", "Acoustic Sensors", "Edge AI", "SCADA", "Pressure Telemetry"],
            "capabilities": ["Leak Detection", "Pressure Telemetry", "Acoustic Sensing", "GIS Mapping"],
            "team_size": 24,
            "experience_years": 5,
            "gst_number": "27AAACA9928P1Z8",
            "incorporation_number": "U72900MH2021PTC356789",
            "dpiit_recognition_number": "DIPP98762",
            "verification_status": "verified",
            "trust_score": 95,
            "pilot_success_rate": 96.0,
            "previous_projects": 8,
            "government_pilots": 3,
        },
        {
            "id": STARTUP_IDS["safe"],
            "user_id": user_ids["vikram@saferoute.in"],
            "name": "RoadVision AI",
            "founder_name": "Vikram Malhotra",
            "email": "vikram@saferoute.in",
            "phone": "+91-9811234567",
            "sector": "Smart Infrastructure & Mobility",
            "technologies": ["Computer Vision", "Edge AI", "GIS", "Accelerometer Telemetry", "Traffic Analytics", "LiDAR"],
            "capabilities": ["Pothole Detection", "Road Surface Analysis", "Defect Geotagging", "Road Condition Mapping", "Preventive Maintenance Prioritization", "Accident Detection", "Traffic Flow Optimization"],
            "team_size": 32,
            "experience_years": 6,
            "gst_number": "07AABCS4451M1ZQ",
            "incorporation_number": "U74999DL2020PTC362145",
            "dpiit_recognition_number": "DIPP87431",
            "verification_status": "verified",
            "trust_score": 92,
            "pilot_success_rate": 92.0,
            "previous_projects": 12,
            "government_pilots": 2,
        },
        {
            "id": STARTUP_IDS["medi"],
            "user_id": user_ids["kavya@meditrack.ai"],
            "name": "MediTrack AI",
            "founder_name": "Dr. Kavya Nair",
            "email": "kavya@meditrack.ai",
            "phone": "+91-9740112233",
            "sector": "Healthcare",
            "technologies": ["AI/ML", "IoT Sensors", "Computer Vision", "Edge Diagnostics", "Telemedicine"],
            "capabilities": ["Patient Monitoring", "Diagnostic AI", "Remote Tele-triage", "Vital Telemetry"],
            "team_size": 18,
            "experience_years": 4,
            "gst_number": "29AAGCM8834K1ZB",
            "incorporation_number": "U85100KA2022PTC158912",
            "dpiit_recognition_number": "DIPP76543",
            "verification_status": "verified",
            "trust_score": 88,
            "pilot_success_rate": 89.0,
            "previous_projects": 6,
            "government_pilots": 2,
        },
        {
            "id": STARTUP_IDS["krishi"],
            "user_id": user_ids["rohit@krishivision.in"],
            "name": "KrishiVision Technologies",
            "founder_name": "Rohit Patil",
            "email": "rohit@krishivision.in",
            "phone": "+91-9922334455",
            "sector": "Agriculture",
            "technologies": ["Computer Vision", "Drones", "Satellite Analytics", "Multispectral Imaging", "Edge AI"],
            "capabilities": ["Crop Monitoring", "Disease Detection", "Soil Moisture Telemetry", "Yield Prediction"],
            "team_size": 22,
            "experience_years": 5,
            "gst_number": "27AABCK6621R1ZM",
            "incorporation_number": "U01100MH2021PTC361289",
            "dpiit_recognition_number": "DIPP65432",
            "verification_status": "verified",
            "trust_score": 90,
            "pilot_success_rate": 94.0,
            "previous_projects": 9,
            "government_pilots": 3,
        },
        {
            "id": STARTUP_IDS["cleangrid"],
            "user_id": user_ids["aditya@cleangrid.in"],
            "name": "CleanGrid Dynamics",
            "founder_name": "Aditya Verma",
            "email": "aditya@cleangrid.in",
            "phone": "+91-9871122334",
            "sector": "Clean Energy",
            "technologies": ["IoT", "AI", "Energy Analytics", "SCADA", "Smart Inverter Firmware"],
            "capabilities": ["Energy Optimization", "Smart Grid Monitoring", "Peak Load Shifting", "Solar Telemetry"],
            "team_size": 16,
            "experience_years": 4,
            "gst_number": "08AABCC5532N1Z4",
            "incorporation_number": "U40106RJ2022PTC078901",
            "dpiit_recognition_number": "DIPP54321",
            "verification_status": "verified",
            "trust_score": 85,
            "pilot_success_rate": 88.0,
            "previous_projects": 5,
            "government_pilots": 2,
        },
        {
            "id": STARTUP_IDS["edubridge"],
            "user_id": user_ids["neha@edubridge.in"],
            "name": "EduBridge Labs",
            "founder_name": "Neha Tiwari",
            "email": "neha@edubridge.in",
            "phone": "+91-9810998877",
            "sector": "Education & Skilling",
            "technologies": ["NLP", "Generative AI", "Adaptive Learning Engine", "Speech Recognition"],
            "capabilities": ["Adaptive Learning", "Multilingual Vernacular Tutoring", "Student Analytics"],
            "team_size": 14,
            "experience_years": 3,
            "gst_number": "36AABCE3321L1ZK",
            "incorporation_number": "U80900TG2023PTC172345",
            "dpiit_recognition_number": "DIPP43210",
            "verification_status": "verified",
            "trust_score": 89,
            "pilot_success_rate": 91.0,
            "previous_projects": 4,
            "government_pilots": 1,
        },
        {
            "id": STARTUP_IDS["civicpulse"],
            "user_id": user_ids["pooja@civicpulse.in"],
            "name": "CivicPulse Technologies",
            "founder_name": "Pooja Deshmukh",
            "email": "pooja@civicpulse.in",
            "phone": "+91-9820556677",
            "sector": "Governance & Smart Cities",
            "technologies": ["AI", "NLP", "Workflow Automation", "GIS Integration", "Omnichannel API"],
            "capabilities": ["Citizen Grievance Auto-Triaging", "Municipal Work Order Automation", "Service SLA Tracking"],
            "team_size": 28,
            "experience_years": 5,
            "gst_number": "27AABCU1123F1ZF",
            "incorporation_number": "U72200MH2021PTC359012",
            "dpiit_recognition_number": "DIPP32109",
            "verification_status": "verified",
            "trust_score": 94,
            "pilot_success_rate": 95.0,
            "previous_projects": 11,
            "government_pilots": 3,
        },
    ]
    db.table("startups").upsert(startups).execute()
    print(f"  [DONE] Inserted {len(startups)} unique canonical startups")

    # (E) 10 Diverse Government Problems
    problems = [
        {
            "id": PROBLEM_IDS["p1_water"],
            "department_id": DEPT_IDS["water"],
            "officer_id": officers[0]["id"],
            "title": "AI-Based Urban Water Leakage Detection & Pressure Optimization",
            "sector": "Water & Wastewater",
            "location": "Nagpur, Maharashtra",
            "description": "Nagpur municipal distribution network loses 32% non-revenue water. Need high-precision acoustic sensors and edge telemetry to pinpoint subterranean pipeline cracks within 10 meters and automate pressure valve adjustments.",
            "required_capabilities": ["Leak Detection", "Pressure Telemetry", "Acoustic Sensing", "GIS Mapping"],
            "required_technologies": ["IoT", "Acoustic Sensors", "Edge AI", "SCADA"],
            "budget_min": 800000,
            "budget_max": 1500000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Reduce non-revenue water loss by minimum 20% across 50 km feeder main pipelines.",
            "kpis": ["Non-revenue water loss reduction >= 20%", "Leak detection precision <= 10m", "Alert latency <= 60 mins"],
            "eligibility_requirements": "DPIIT recognized startup with proven acoustic or pressure telemetry IP.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p2_agri"],
            "department_id": DEPT_IDS["agri"],
            "officer_id": officers[3]["id"],
            "title": "AI-Based Drone & Satellite Multi-Spectral Crop Disease Detection",
            "sector": "Agriculture",
            "location": "Nashik & Pune, Maharashtra",
            "description": "Fungal pest infestations cause extensive yield loss in onion and soybean belts. Deploy multispectral drone imaging and automated diagnostic alerts to deliver field-level advisory directly to farmers via WhatsApp in Marathi.",
            "required_capabilities": ["Crop Monitoring", "Disease Detection", "Soil Moisture Telemetry", "Yield Prediction"],
            "required_technologies": ["Computer Vision", "Drones", "Satellite Analytics", "Multispectral Imaging"],
            "budget_min": 1500000,
            "budget_max": 3000000,
            "timeline_days": 120,
            "pilot_duration_days": 90,
            "expected_outcome": "Early detection of blight and rust outbreaks 10 days before visible foliar symptoms.",
            "kpis": ["Fungal detection accuracy >= 88%", "Advisory latency <= 12 hours", "Farmer adoption rate >= 70%"],
            "eligibility_requirements": "Experience with DGCA compliant drone flights and vernacular advisory delivery.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p3_health"],
            "department_id": DEPT_IDS["health"],
            "officer_id": officers[4]["id"],
            "title": "Remote Patient Monitoring & Early Diagnostic AI for Primary Health Centers",
            "sector": "Healthcare",
            "location": "Chamarajanagar & Mysuru, Karnataka",
            "description": "Rural primary health centers lack resident cardiologists and oncologists. Require portable diagnostic kits with edge telemetry and automated ECG/vitals triage to connect ASHA workers to district hospital specialists.",
            "required_capabilities": ["Patient Monitoring", "Diagnostic AI", "Remote Tele-triage", "Vital Telemetry"],
            "required_technologies": ["AI/ML", "IoT Sensors", "Computer Vision", "Edge Diagnostics"],
            "budget_min": 2000000,
            "budget_max": 4000000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Screen 5,000+ rural residents and triage acute cardiac/respiratory abnormalities in under 15 minutes.",
            "kpis": ["Diagnostic sensitivity >= 94%", "Tele-consult turnaround <= 15 mins", "ASHA kit uptime >= 98%"],
            "eligibility_requirements": "ISO 13485 or CDSCO certified medical diagnostic hardware.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p4_energy"],
            "department_id": DEPT_IDS["energy"],
            "officer_id": officers[5]["id"],
            "title": "Smart Energy Consumption Optimization & Solar Grid Micro-Balancing",
            "sector": "Clean Energy",
            "location": "Jodhpur & Bikaner, Rajasthan",
            "description": "High penetration of distributed rooftop solar creates phase imbalance and reverse power flow on rural distribution feeders. Need real-time smart inverter telemetry and AI dispatch models to balance micro-grids.",
            "required_capabilities": ["Energy Optimization", "Smart Grid Monitoring", "Peak Load Shifting", "Solar Telemetry"],
            "required_technologies": ["IoT", "AI", "Energy Analytics", "SCADA", "Smart Inverter Firmware"],
            "budget_min": 1800000,
            "budget_max": 3500000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Demonstrate minimum 15% reduction in grid transmission losses and zero voltage flicker trips.",
            "kpis": ["Feeder loss reduction >= 15%", "Voltage stabilization within 230V +/- 4%", "Peak load shift >= 20%"],
            "eligibility_requirements": "Prior experience with state DISCOM SCADA or substations.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p5_edu"],
            "department_id": DEPT_IDS["education"],
            "officer_id": officers[6]["id"],
            "title": "Adaptive Vernacular Learning & Foundational Numeracy for Government Schools",
            "sector": "Education & Skilling",
            "location": "Warangal & Karimnagar, Telangana",
            "description": "Government primary schools require an adaptive multilingual software for Grades 3-5 students to improve foundational literacy and numeracy (FLN) in Telugu and English medium classrooms.",
            "required_capabilities": ["Adaptive Learning", "Multilingual Vernacular Tutoring", "Student Analytics"],
            "required_technologies": ["NLP", "Generative AI", "Adaptive Learning Engine", "Speech Recognition"],
            "budget_min": 1000000,
            "budget_max": 2000000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Demonstrate minimum 25% improvement in reading fluency and math scores across 1,200 participating students.",
            "kpis": ["Student Fluency Improvement >= 25%", "Weekly Active Usage >= 80%", "Teacher Adoption Score >= 85%"],
            "eligibility_requirements": "SCERT or NCERT aligned curriculum compliance.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p6_mobility"],
            "department_id": DEPT_IDS["mobility"],
            "officer_id": officers[2]["id"],
            "title": "Computer Vision Road Incident Detection & Traffic Monitoring",
            "sector": "Smart Infrastructure & Mobility",
            "location": "NH-44 & NH-48 Corridors, Maharashtra",
            "description": "National Highways Authority of India requires an automated video analytics solution across existing highway surveillance cameras to detect collisions, stationary vehicles, lane infractions, and animal crossings within 30 seconds.",
            "required_capabilities": ["Accident Detection", "Traffic Flow Optimization", "Highway Safety Analytics", "Video Telemetry"],
            "required_technologies": ["Computer Vision", "Edge AI", "Traffic Analytics", "LiDAR"],
            "budget_min": 2500000,
            "budget_max": 5000000,
            "timeline_days": 240,
            "pilot_duration_days": 90,
            "expected_outcome": "Automated incident detection within 30 seconds with 95% precision across a 50 km designated pilot corridor.",
            "kpis": ["Incident Detection Accuracy >= 95%", "Alert Latency <= 30s", "False Positive Rate < 5%"],
            "eligibility_requirements": "Startup must demonstrate real-time RTSP video stream processing capability at 30 fps.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p7_grievance"],
            "department_id": DEPT_IDS["bmc"],
            "officer_id": officers[7]["id"],
            "title": "AI Citizen Grievance Triaging & Municipal Workflow Automation",
            "sector": "Governance & Smart Cities",
            "location": "Mumbai, Maharashtra",
            "description": "BMC receives over 8,000 complaints daily across phone, portal, and social media. Need NLP and automated workflow routing to direct tickets to the exact ward officer and prevent SLA breaches.",
            "required_capabilities": ["Citizen Grievance Auto-Triaging", "Municipal Work Order Automation", "Service SLA Tracking"],
            "required_technologies": ["AI", "NLP", "Workflow Automation", "GIS Integration"],
            "budget_min": 1500000,
            "budget_max": 3500000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Reduce misrouted complaints by 80% and decrease average citizen grievance resolution time by 35%.",
            "kpis": ["Triaging Accuracy >= 92%", "Misroute Rate < 5%", "SLA Escalation Reduction >= 35%"],
            "eligibility_requirements": "Support for bilingual Marathi-English NLP with municipal terminology dictionary.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p8_waste"],
            "department_id": DEPT_IDS["pune"],
            "officer_id": officers[1]["id"],
            "title": "Waste Collection Route Optimization & Dynamic Bin Fill Telemetry",
            "sector": "Waste Management",
            "location": "Pune, Maharashtra",
            "description": "Pune Smart City requires IoT fill-level sensors on municipal bins combined with dynamic route planning software for garbage collection trucks to minimize diesel consumption and prevent bin overflow.",
            "required_capabilities": ["Bin Level Telemetry", "Dynamic Route Optimization", "Carbon Emission Analytics"],
            "required_technologies": ["IoT Ultrasonic Sensors", "GIS Optimization", "Cloud Dashboard"],
            "budget_min": 1000000,
            "budget_max": 2500000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Reduce fuel consumption by 18% and eliminate uncollected garbage overflow incidents.",
            "kpis": ["Route Mileage Reduction >= 18%", "Bin Overflow Incidents = 0", "Driver Route Compliance >= 90%"],
            "eligibility_requirements": "Sub-GHz LoRaWAN or NB-IoT sensor hardware with minimum 3-year battery life.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p9_pothole"],
            "department_id": DEPT_IDS["mobility"],
            "officer_id": officers[2]["id"],
            "title": "Automated Pothole Detection & Road Surface Quality Mapping",
            "sector": "Smart Infrastructure & Mobility",
            "location": "Pune-Solapur Highway (NH-65)",
            "description": "Deploy dashcam-mounted edge AI boxes on state transport buses to continuously map road roughness (IRI) and identify pavement defects before monsoons.",
            "required_capabilities": ["Road Surface Analysis", "Defect Geotagging", "Preventive Maintenance Prioritization"],
            "required_technologies": ["Computer Vision", "Edge AI", "GIS", "Accelerometer Telemetry"],
            "budget_min": 1200000,
            "budget_max": 2800000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Full survey of 300 km highway pavement within 30 days with defect localization.",
            "kpis": ["Pothole detection precision >= 90%", "GIS coordinate accuracy <= 3m"],
            "eligibility_requirements": "Proven vehicle-mounted edge camera edge inference.",
            "status": "draft",
        },
        {
            "id": PROBLEM_IDS["p10_sewage"],
            "department_id": DEPT_IDS["water"],
            "officer_id": officers[0]["id"],
            "title": "Decentralized Sewage Treatment Remote Telemetry & Quality Compliance",
            "sector": "Water & Wastewater",
            "location": "Nagpur Rural & Suburbs",
            "description": "Continuous BOD, COD, and TSS telemetry across 15 decentralized packaged sewage treatment plants to verify NGT discharge norms automatically.",
            "required_capabilities": ["Effluent Quality Telemetry", "Real-Time Sensor Calibration", "Pollution Control Alerts"],
            "required_technologies": ["Optical Sensors", "IoT", "Cloud SCADA", "Automated Samplers"],
            "budget_min": 900000,
            "budget_max": 1800000,
            "timeline_days": 150,
            "pilot_duration_days": 90,
            "expected_outcome": "100% automated regulatory reporting without manual grab-sampling tampering.",
            "kpis": ["Sensor telemetry uptime >= 99%", "Compliance alert delay <= 5 mins"],
            "eligibility_requirements": "Optical spectrometer sensor IP compliant with CPCB guidelines.",
            "status": "published",
        },
    ]
    db.table("problems").upsert(problems).execute()
    print(f"  [DONE] Inserted {len(problems)} problems")

    # (F) Exactly 12 Applications (3 Submitted, 2 Shortlisted, 5 Selected, 2 Rejected)
    applications = [
        # 3 SUBMITTED
        {
            "id": APP_IDS["sub_1"],
            "problem_id": PROBLEM_IDS["p7_grievance"],
            "startup_id": STARTUP_IDS["civicpulse"],
            "solution": "CivicPulse AI-Triaging: Automated multilingual citizen grievance categorization, duplicate detection, and automated routing to exact ward officers.",
            "proposed_approach": "Fine-tune Marathi-English transformer on 100,000 historic BMC complaints and integrate with SAP CRM.",
            "implementation_plan": "Phase 1: Ingest complaint datasets. Phase 2: Deploy webhook routing engine. Phase 3: Ward engineer training.",
            "cost_proposed": 1800000,
            "team_details": {"lead": "Pooja Deshmukh", "ml_lead": "Aniket S", "engineers": 4},
            "previous_work": "Deployed AI triaging for Pune Municipal Corporation processing 12,000 grievances/month.",
            "expected_outcome": "Reduce misrouted complaints to under 4% and cut grievance assignment delay from 48 hours to 30 seconds.",
            "status": "submitted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat(),
        },
        {
            "id": APP_IDS["sub_2"],
            "problem_id": PROBLEM_IDS["p5_edu"],
            "startup_id": STARTUP_IDS["edubridge"],
            "solution": "EduBridge Vernacular FLN: Voice-enabled AI tutor on low-cost tablets with bilingual Telugu-English speech evaluation.",
            "proposed_approach": "Pre-load 250 offline learning units on school tablets with weekly sync to district education server.",
            "implementation_plan": "School deployment in 20 pilot schools across Warangal with bi-weekly learning score assessments.",
            "cost_proposed": 1200000,
            "team_details": {"lead": "Neha Tiwari", "curriculum_expert": "S. V. Rao", "engineers": 3},
            "previous_work": "Implemented adaptive reading software in 50 tribal residential schools in Telangana.",
            "expected_outcome": "Increase foundational literacy scores by minimum 28% over 90 days.",
            "status": "submitted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(),
        },
        {
            "id": APP_IDS["sub_3"],
            "problem_id": PROBLEM_IDS["p10_sewage"],
            "startup_id": STARTUP_IDS["aqua"],
            "solution": "AquaSense Effluent Telemetry: Self-cleaning optical probe monitoring BOD/COD/TSS with automated anti-fouling wiper mechanism.",
            "proposed_approach": "Install 15 optical effluent telemetry loggers at STP discharge outfalls streaming directly to MPCB portal.",
            "implementation_plan": "Deploy sensor hardware, calibrate against laboratory titration samples, configure automated alert triggers.",
            "cost_proposed": 1400000,
            "team_details": {"lead": "Dr. Anika Patel", "chem_engineer": "Dr. Ramesh M", "engineers": 3},
            "previous_work": "Deployed river water monitoring stations on Godavari river for Nashik Smart City.",
            "expected_outcome": "Real-time compliance monitoring with zero data tampering.",
            "status": "submitted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat(),
        },

        # 2 SHORTLISTED
        {
            "id": APP_IDS["short_1"],
            "problem_id": PROBLEM_IDS["p9_pothole"],
            "startup_id": STARTUP_IDS["safe"],
            "solution": "SafeRoute Pavement Vision: Low-cost edge camera units computing pavement International Roughness Index (IRI) on municipal buses.",
            "proposed_approach": "Mount AI dashcam boxes on 15 MSRTC buses plying NH-65 to generate a high-density GIS pavement heat-map.",
            "implementation_plan": "Hardware mounting, highway mapping run, dashboard deployment for NHAI project directors.",
            "cost_proposed": 1600000,
            "team_details": {"lead": "Vikram Malhotra", "cv_lead": "Harshvardhan K", "engineers": 3},
            "previous_work": "Mapped 1,200 km of Delhi-NCR arterial roads for PWD.",
            "expected_outcome": "Complete GIS pavement roughness heat-map updated weekly with centimeter-accurate pothole geotags.",
            "status": "shortlisted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=14)).isoformat(),
        },
        {
            "id": APP_IDS["short_2"],
            "problem_id": PROBLEM_IDS["p8_waste"],
            "startup_id": STARTUP_IDS["civicpulse"],
            "solution": "CivicPulse Dynamic Waste Routing: LoRaWAN ultrasonic bin level sensors combined with genetic route optimization for garbage tippers.",
            "proposed_approach": "Equip 80 commercial garbage bins in Kothrud with ultrasonic sensors and provide turn-by-turn routing tablet to drivers.",
            "implementation_plan": "Sensor installation, driver app rollout, dispatch dashboard integration with Pune Command Centre.",
            "cost_proposed": 1500000,
            "team_details": {"lead": "Pooja Deshmukh", "iot_lead": "Amit Joshi", "engineers": 3},
            "previous_work": "Smart waste routing deployed in Thane municipal corporation.",
            "expected_outcome": "Zero bin overflow incidents and minimum 15% reduction in diesel consumption.",
            "status": "shortlisted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=12)).isoformat(),
        },

        # 5 SELECTED (Connected to 5 Pilots)
        {
            "id": APP_IDS["sel_1"],
            "problem_id": PROBLEM_IDS["p1_water"],
            "startup_id": STARTUP_IDS["aqua"],
            "solution": "AquaSense Acoustic Leak Detection Mesh: High-precision hydro-acoustic listening sticks and continuous pressure sensors isolating pipe fractures.",
            "proposed_approach": "Deploy 40 acoustic telemetry loggers across 12 km critical feeder mains in Nagpur North with cloud analytics.",
            "implementation_plan": "Month 1: Acoustic logger deployment. Month 2: Baseline leak noise profiling. Month 3: Leak repair pinpointing and validation.",
            "cost_proposed": 1000000,
            "team_details": {"lead": "Dr. Anika Patel", "sensor_engineer": "Tanmay Deshmukh", "engineers": 3},
            "previous_work": "Detected 14 hidden leaks saving 1.2 MLD water for Pimpri Chinchwad Municipal Corporation.",
            "expected_outcome": "Pinpoint 100% of subterranean leaks > 200 liters/hour within 10 meters.",
            "status": "selected",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=45)).isoformat(),
        },
        {
            "id": APP_IDS["sel_2"],
            "problem_id": PROBLEM_IDS["p3_health"],
            "startup_id": STARTUP_IDS["medi"],
            "solution": "MediTrack Tele-Triage Kit: Portable point-of-care 12-lead ECG, SpO2, and BP monitor with on-device risk assessment for ASHA workers.",
            "proposed_approach": "Equip 30 Primary Health Centres in Chamarajanagar with automated triage tablets connected to district hospital cardiologists.",
            "implementation_plan": "Equip PHCs, train medical officers, run 90-day clinical triage validation.",
            "cost_proposed": 3500000,
            "team_details": {"lead": "Dr. Kavya Nair", "medical_officer": "Dr. Vinod K", "engineers": 5},
            "previous_work": "Screened 18,000 rural patients in Raichur district identifying 420 acute cardiac cases.",
            "expected_outcome": "Screen 6,000 rural residents and cut critical referral times by half.",
            "status": "selected",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=60)).isoformat(),
        },
        {
            "id": APP_IDS["sel_3"],
            "problem_id": PROBLEM_IDS["p2_agri"],
            "startup_id": STARTUP_IDS["krishi"],
            "solution": "KrishiVision Drone-Satellite Analytics: Multi-spectral drone imaging fused with Sentinel-2 satellite data for field-level pest & moisture mapping.",
            "proposed_approach": "Weekly drone flights over 2,500 hectares of onion and soybean farms in Nashik with automated WhatsApp advisories in Marathi.",
            "implementation_plan": "Establish ground calibration stations, schedule bi-weekly flights, push localized advisories.",
            "cost_proposed": 2800000,
            "team_details": {"lead": "Rohit Patil", "agronomist": "Dr. S. Kulkarni", "engineers": 4},
            "previous_work": "Completed crop monitoring pilot for 1,500 farmers in Baramati with 92% farmer satisfaction.",
            "expected_outcome": "Reduce crop damage from pest attacks by 30% and optimize fertilizer usage.",
            "status": "selected",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=90)).isoformat(),
        },
        {
            "id": APP_IDS["sel_4"],
            "problem_id": PROBLEM_IDS["p4_energy"],
            "startup_id": STARTUP_IDS["cleangrid"],
            "solution": "CleanGrid Micro-Balancing System: Edge IoT controllers on solar inverters with automated phase balancing and peak-shaving dispatch algorithms.",
            "proposed_approach": "Install edge controllers across 20 distribution transformers in Bikaner solar hub with sub-second voltage logging.",
            "implementation_plan": "Install telemetry units, run feeder phase balancing, record loss reduction metrics.",
            "cost_proposed": 1800000,
            "team_details": {"lead": "Aditya Verma", "electrical_engineer": "N. K. Sharma", "engineers": 3},
            "previous_work": "Substation balancing pilot for Rajasthan Urja Vikas Nigam.",
            "expected_outcome": "Cut feeder technical transmission losses by minimum 15% and stabilize voltage swings.",
            "status": "selected",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=55)).isoformat(),
        },
        {
            "id": APP_IDS["sel_5"],
            "problem_id": PROBLEM_IDS["p6_mobility"],
            "startup_id": STARTUP_IDS["safe"],
            "solution": "SafeRoute Highway Incident Vision: Real-time CCTV edge video pipeline auto-detecting collisions, stranded vehicles, and wrong-way driving within 30 seconds.",
            "proposed_approach": "Ingest 40 CCTV feeds across a 50 km stretch of NH-44 into localized edge GPU inference servers with automated alert dispatch to patrol vans.",
            "implementation_plan": "Deploy GPU edge servers, connect optical video streams, calibrate detection algorithms.",
            "cost_proposed": 2500000,
            "team_details": {"lead": "Vikram Malhotra", "cv_lead": "Harshvardhan K", "engineers": 4},
            "previous_work": "Deployed expressway incident detection on Eastern Peripheral Expressway for NHAI.",
            "expected_outcome": "Under-30-second collision detection with 95% precision across pilot corridor.",
            "status": "selected",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=70)).isoformat(),
        },

        # 2 REJECTED
        {
            "id": APP_IDS["rej_1"],
            "problem_id": PROBLEM_IDS["p1_water"],
            "startup_id": STARTUP_IDS["cleangrid"],
            "solution": "CleanGrid Solar Pumping Audit: Energy audit proposal for municipal water lifting stations without acoustic leak sensing.",
            "proposed_approach": "Energy logging on high-capacity turbine pumps without subterranean leak detection equipment.",
            "implementation_plan": "Audit pumps over 60 days.",
            "cost_proposed": 2200000,
            "team_details": {"lead": "Aditya Verma", "engineers": 2},
            "previous_work": "Industrial pump efficiency testing.",
            "expected_outcome": "5% energy efficiency saving.",
            "status": "rejected",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=35)).isoformat(),
        },
        {
            "id": APP_IDS["rej_2"],
            "problem_id": PROBLEM_IDS["p2_agri"],
            "startup_id": STARTUP_IDS["safe"],
            "solution": "SafeRoute Farm Vehicle Tracking: GPS tracking collars and tractor fleet telematics without crop health imaging.",
            "proposed_approach": "Vehicle tracking unit installation on farm machinery without multispectral crop sensing.",
            "implementation_plan": "GPS fleet tracking.",
            "cost_proposed": 3000000,
            "team_details": {"lead": "Vikram Malhotra", "engineers": 2},
            "previous_work": "Commercial truck fleet tracking.",
            "expected_outcome": "Machine hours tracking.",
            "status": "rejected",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=70)).isoformat(),
        },
    ]
    db.table("applications").upsert(applications).execute()
    print(f"  [DONE] Inserted {len(applications)} applications (Exact: 3 Submitted, 2 Shortlisted, 5 Selected, 2 Rejected)")

    # (G) Evaluations for the 5 Selected Applications
    evaluations = [
        {
            "id": "f0000001-1111-4111-8111-000000000001",
            "application_id": APP_IDS["sel_1"],
            "officer_id": officers[0]["id"],
            "technical_fit": 9, "feasibility": 9, "cost_effectiveness": 9, "team_capability": 9, "expected_impact": 9, "scalability": 9,
            "decision": "select",
            "notes": "Exceptional acoustic telemetry solution. Validated IP and municipal track record.",
            "evaluated_at": (datetime.now(timezone.utc) - timedelta(days=44)).isoformat(),
        },
        {
            "id": "f0000002-1111-4111-8111-000000000002",
            "application_id": APP_IDS["sel_2"],
            "officer_id": officers[4]["id"],
            "technical_fit": 9, "feasibility": 8, "cost_effectiveness": 8, "team_capability": 9, "expected_impact": 9, "scalability": 8,
            "decision": "select",
            "notes": "Critical rural healthcare triage solution. Certified diagnostic hardware.",
            "evaluated_at": (datetime.now(timezone.utc) - timedelta(days=58)).isoformat(),
        },
        {
            "id": "f0000003-1111-4111-8111-000000000003",
            "application_id": APP_IDS["sel_3"],
            "officer_id": officers[3]["id"],
            "technical_fit": 10, "feasibility": 9, "cost_effectiveness": 9, "team_capability": 9, "expected_impact": 10, "scalability": 9,
            "decision": "select",
            "notes": "Fully integrated drone-satellite analytics with vernacular delivery in Marathi.",
            "evaluated_at": (datetime.now(timezone.utc) - timedelta(days=88)).isoformat(),
        },
        {
            "id": "f0000004-1111-4111-8111-000000000004",
            "application_id": APP_IDS["sel_4"],
            "officer_id": officers[5]["id"],
            "technical_fit": 9, "feasibility": 9, "cost_effectiveness": 8, "team_capability": 9, "expected_impact": 9, "scalability": 8,
            "decision": "select",
            "notes": "High innovation potential for distributed solar micro-grid stabilization.",
            "evaluated_at": (datetime.now(timezone.utc) - timedelta(days=54)).isoformat(),
        },
        {
            "id": "f0000005-1111-4111-8111-000000000005",
            "application_id": APP_IDS["sel_5"],
            "officer_id": officers[2]["id"],
            "technical_fit": 9, "feasibility": 8, "cost_effectiveness": 8, "team_capability": 9, "expected_impact": 9, "scalability": 9,
            "decision": "select",
            "notes": "Strong highway computer vision capability. Selected for 50 km pilot corridor.",
            "evaluated_at": (datetime.now(timezone.utc) - timedelta(days=68)).isoformat(),
        },
    ]
    db.table("evaluations").upsert(evaluations).execute()
    print(f"  [DONE] Inserted {len(evaluations)} evaluations")

    # (H) Exactly 5 Realistic Pilots
    pilots = [
        # Pilot 1: Active (AquaSense & Water Resources Dept, Nagpur)
        {
            "id": PILOT_IDS["pilot_1_active"],
            "problem_id": PROBLEM_IDS["p1_water"],
            "application_id": APP_IDS["sel_1"],
            "startup_id": STARTUP_IDS["aqua"],
            "department_id": DEPT_IDS["water"],
            "pilot_number": "PILOT-WRD-2025-001",
            "duration_days": 90,
            "budget_allocated": 1000000,
            "budget_released": 800000,
            "budget_utilized": 740000,
            "target_outcome": "Reduce non-revenue water loss by minimum 20% and identify pipeline leakages within 10 meters precision.",
            "success_criteria": {"water_loss_reduction": 20, "detection_accuracy": 90, "alert_latency_hours": 12},
            "status": "active",
            "progress_percent": 82.0,
            "overall_score": 92.0,
            "start_date": (datetime.now(timezone.utc) - timedelta(days=45)).date().isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=45)).date().isoformat(),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=45)).isoformat(),
        },
        # Pilot 2: Active / At Risk (MediTrack AI & Health Dept, Karnataka)
        {
            "id": PILOT_IDS["pilot_2_at_risk"],
            "problem_id": PROBLEM_IDS["p3_health"],
            "application_id": APP_IDS["sel_2"],
            "startup_id": STARTUP_IDS["medi"],
            "department_id": DEPT_IDS["health"],
            "pilot_number": "PILOT-HFW-2025-002",
            "duration_days": 90,
            "budget_allocated": 3500000,
            "budget_released": 1500000,
            "budget_utilized": 1420000,
            "target_outcome": "Screen 5,000+ rural tribal patients and establish automated triage with district hospital.",
            "success_criteria": {"patient_screenings": 5000, "diagnostic_precision": 90, "referral_escalation_time_minutes": 30},
            "status": "active",
            "progress_percent": 40.0,
            "overall_score": 74.0,
            "start_date": (datetime.now(timezone.utc) - timedelta(days=50)).date().isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=40)).date().isoformat(),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=50)).isoformat(),
        },
        # Pilot 3: Completed Successful (KrishiVision & Agriculture Dept, Pune)
        {
            "id": PILOT_IDS["pilot_3_completed"],
            "problem_id": PROBLEM_IDS["p2_agri"],
            "application_id": APP_IDS["sel_3"],
            "startup_id": STARTUP_IDS["krishi"],
            "department_id": DEPT_IDS["agri"],
            "pilot_number": "PILOT-AGR-2025-003",
            "duration_days": 120,
            "budget_allocated": 2800000,
            "budget_released": 2800000,
            "budget_utilized": 2650000,
            "target_outcome": "Cover 2,500 hectares of farm land with precision pest and crop health advisories.",
            "success_criteria": {"farm_coverage_ha": 2500, "pest_detection_accuracy": 85, "farmer_advisory_delivery_pct": 90},
            "status": "completed",
            "progress_percent": 100.0,
            "overall_score": 96.0,
            "start_date": (datetime.now(timezone.utc) - timedelta(days=130)).date().isoformat(),
            "end_date": (datetime.now(timezone.utc) - timedelta(days=10)).date().isoformat(),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=130)).isoformat(),
        },
        # Pilot 4: Active (CleanGrid Dynamics & MNRE)
        {
            "id": PILOT_IDS["pilot_4_energy"],
            "problem_id": PROBLEM_IDS["p4_energy"],
            "application_id": APP_IDS["sel_4"],
            "startup_id": STARTUP_IDS["cleangrid"],
            "department_id": DEPT_IDS["energy"],
            "pilot_number": "PILOT-MNRE-2025-004",
            "duration_days": 90,
            "budget_allocated": 1800000,
            "budget_released": 1200000,
            "budget_utilized": 1120000,
            "target_outcome": "Demonstrate micro-grid phase balancing and 15% reduction in technical losses on 20 solar feeders.",
            "success_criteria": {"feeder_loss_reduction": 15, "voltage_stabilization": 98, "peak_load_shift": 20},
            "status": "active",
            "progress_percent": 65.0,
            "overall_score": 88.0,
            "start_date": (datetime.now(timezone.utc) - timedelta(days=35)).date().isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=55)).date().isoformat(),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=35)).isoformat(),
        },
        # Pilot 5: Paused / Delayed (SafeRoute Mobility & NHAI)
        {
            "id": PILOT_IDS["pilot_5_mobility"],
            "problem_id": PROBLEM_IDS["p6_mobility"],
            "application_id": APP_IDS["sel_5"],
            "startup_id": STARTUP_IDS["safe"],
            "department_id": DEPT_IDS["mobility"],
            "pilot_number": "PILOT-NHAI-2025-005",
            "duration_days": 90,
            "budget_allocated": 2500000,
            "budget_released": 1000000,
            "budget_utilized": 850000,
            "target_outcome": "Automated incident detection within 30 seconds across 50 km NH-44 corridor.",
            "success_criteria": {"incident_detection_accuracy": 95, "alert_latency_seconds": 30, "false_positive_rate": 5},
            "status": "paused",
            "progress_percent": 35.0,
            "overall_score": 72.0,
            "start_date": (datetime.now(timezone.utc) - timedelta(days=40)).date().isoformat(),
            "end_date": (datetime.now(timezone.utc) + timedelta(days=50)).date().isoformat(),
            "created_at": (datetime.now(timezone.utc) - timedelta(days=40)).isoformat(),
        },
    ]
    db.table("pilots").upsert(pilots).execute()
    print(f"  [DONE] Inserted {len(pilots)} pilots (3 Active, 1 Completed, 1 Paused/Delayed)")

    # (I) Milestones (18 Milestones across 5 pilots)
    milestones = [
        # Pilot 1 (Water Leakage)
        {"id": "0d000001-1111-4111-8111-000000000001", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Acoustic Sensor Hardware Procurement & Lab Testing", "description": "Procure and calibrate 40 hydro-acoustic sensor units.", "due_date": (datetime.now(timezone.utc) - timedelta(days=35)).date().isoformat(), "status": "inspector_verified", "sequence_order": 1, "verified_at": (datetime.now(timezone.utc) - timedelta(days=34)).isoformat()},
        {"id": "0d000002-1111-4111-8111-000000000002", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Pipeline GIS Mapping & Telemetry Node Installation", "description": "Complete GIS survey of Nagpur North and clamp 40 sensor nodes.", "due_date": (datetime.now(timezone.utc) - timedelta(days=25)).date().isoformat(), "status": "inspector_verified", "sequence_order": 2, "verified_at": (datetime.now(timezone.utc) - timedelta(days=24)).isoformat()},
        {"id": "0d000003-1111-4111-8111-000000000003", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Telemetry Cloud Ingestion & Pressure Calibration", "description": "Establish 4G/NB-IoT data telemetry pipeline to municipal SCADA.", "due_date": (datetime.now(timezone.utc) - timedelta(days=15)).date().isoformat(), "status": "inspector_verified", "sequence_order": 3, "verified_at": (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()},
        {"id": "0d000004-1111-4111-8111-000000000004", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Edge AI Leak Detection Algorithm Deployment", "description": "Deploy frequency-domain wavelet filter isolating burst sounds.", "due_date": (datetime.now(timezone.utc) - timedelta(days=5)).date().isoformat(), "status": "inspector_verified", "sequence_order": 4, "verified_at": (datetime.now(timezone.utc) - timedelta(days=4)).isoformat()},
        {"id": "0d000005-1111-4111-8111-000000000005", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "30-Day Live Telemetry Run & Ground-Truth Verification", "description": "Monitor live network and trigger municipal repair work orders.", "due_date": (datetime.now(timezone.utc) - timedelta(days=1)).date().isoformat(), "status": "inspector_verified", "sequence_order": 5, "verified_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()},
        {"id": "0d000006-1111-4111-8111-000000000006", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Final Pilot Evaluation & Scale-Up Procurement Dossier", "description": "Consolidate 90-day water loss audit for procurement review.", "due_date": (datetime.now(timezone.utc) + timedelta(days=20)).date().isoformat(), "status": "startup_claimed", "sequence_order": 6, "startup_claimed_at": now},

        # Pilot 2 (Health Triage)
        {"id": "0d000007-1111-4111-8111-000000000007", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "title": "Diagnostic Kit Assembly & Safety Certification", "description": "Assemble 30 medical tele-triage kits.", "due_date": (datetime.now(timezone.utc) - timedelta(days=30)).date().isoformat(), "status": "inspector_verified", "sequence_order": 1, "verified_at": (datetime.now(timezone.utc) - timedelta(days=28)).isoformat()},
        {"id": "0d000008-1111-4111-8111-000000000008", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "title": "ASHA Worker Training in 15 PHCs", "description": "Conduct on-site hands-on clinical workflow training.", "due_date": (datetime.now(timezone.utc) - timedelta(days=10)).date().isoformat(), "status": "inspector_verified", "sequence_order": 2, "verified_at": (datetime.now(timezone.utc) - timedelta(days=8)).isoformat()},
        {"id": "0d000009-1111-4111-8111-000000000009", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "title": "Remaining 15 PHC Kit Rollout", "description": "Delayed: Optical pulse sensor component shipment delayed.", "due_date": (datetime.now(timezone.utc) - timedelta(days=2)).date().isoformat(), "status": "pending", "sequence_order": 3},

        # Pilot 3 (Crop Disease)
        {"id": "0d000010-1111-4111-8111-000000000010", "pilot_id": PILOT_IDS["pilot_3_completed"], "title": "Drone Fleet Deployment & GIS Basemap Creation", "description": "Completed full 2,500 hectare orthomosaic mapping.", "due_date": (datetime.now(timezone.utc) - timedelta(days=100)).date().isoformat(), "status": "inspector_verified", "sequence_order": 1, "verified_at": (datetime.now(timezone.utc) - timedelta(days=98)).isoformat()},
        {"id": "0d000011-1111-4111-8111-000000000011", "pilot_id": PILOT_IDS["pilot_3_completed"], "title": "Pest Outbreak Alert Engine Integration", "description": "Integrated automated alert push via SMS/WhatsApp.", "due_date": (datetime.now(timezone.utc) - timedelta(days=60)).date().isoformat(), "status": "inspector_verified", "sequence_order": 2, "verified_at": (datetime.now(timezone.utc) - timedelta(days=58)).isoformat()},
        {"id": "0d000012-1111-4111-8111-000000000012", "pilot_id": PILOT_IDS["pilot_3_completed"], "title": "Final Yield Audit & Farmer Satisfaction Sign-off", "description": "All targets exceeded. Agriculture commissioner verified report.", "due_date": (datetime.now(timezone.utc) - timedelta(days=15)).date().isoformat(), "status": "inspector_verified", "sequence_order": 3, "verified_at": (datetime.now(timezone.utc) - timedelta(days=12)).isoformat()},

        # Pilot 4 (Energy Optimization)
        {"id": "0d000013-1111-4111-8111-000000000013", "pilot_id": PILOT_IDS["pilot_4_energy"], "title": "Inverter Controller Fabrication & Feeder Installation", "description": "Install 20 edge micro-controllers on distribution transformers.", "due_date": (datetime.now(timezone.utc) - timedelta(days=20)).date().isoformat(), "status": "inspector_verified", "sequence_order": 1, "verified_at": (datetime.now(timezone.utc) - timedelta(days=18)).isoformat()},
        {"id": "0d000014-1111-4111-8111-000000000014", "pilot_id": PILOT_IDS["pilot_4_energy"], "title": "Telemetry Ingestion into State Load Dispatch Centre", "description": "Telemetry validation with DISCOM central dashboard.", "due_date": (datetime.now(timezone.utc) - timedelta(days=5)).date().isoformat(), "status": "inspector_verified", "sequence_order": 2, "verified_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat()},
        {"id": "0d000015-1111-4111-8111-000000000015", "pilot_id": PILOT_IDS["pilot_4_energy"], "title": "Phase Balancing & Peak Shaving Field Trial", "description": "Execute automated power dispatch during peak afternoon solar surge.", "due_date": (datetime.now(timezone.utc) + timedelta(days=25)).date().isoformat(), "status": "pending", "sequence_order": 3},

        # Pilot 5 (Mobility Highway)
        {"id": "0d000016-1111-4111-8111-000000000016", "pilot_id": PILOT_IDS["pilot_5_mobility"], "title": "Toll Plaza GPU Edge Box Setup", "description": "Install 4 edge computing rack units at toll plaza control rooms.", "due_date": (datetime.now(timezone.utc) - timedelta(days=25)).date().isoformat(), "status": "inspector_verified", "sequence_order": 1, "verified_at": (datetime.now(timezone.utc) - timedelta(days=23)).isoformat()},
        {"id": "0d000017-1111-4111-8111-000000000017", "pilot_id": PILOT_IDS["pilot_5_mobility"], "title": "Highway CCTV Optical Fiber Stream Interfacing", "description": "Optical fiber connectivity on 20 cameras delayed due to highway resurfacing.", "due_date": (datetime.now(timezone.utc) - timedelta(days=10)).date().isoformat(), "status": "pending", "sequence_order": 2},
        {"id": "0d000018-1111-4111-8111-000000000018", "pilot_id": PILOT_IDS["pilot_5_mobility"], "title": "Automated Crash Detection Model Calibration", "description": "Model validation with highway patrol response team.", "due_date": (datetime.now(timezone.utc) + timedelta(days=30)).date().isoformat(), "status": "pending", "sequence_order": 3},
    ]
    db.table("milestones").upsert(milestones).execute()
    print(f"  [DONE] Inserted {len(milestones)} milestones")

    # (J) KPIs (12 KPIs across 5 pilots)
    kpis = [
        {"id": "0e000001-1111-4111-8111-000000000001", "pilot_id": PILOT_IDS["pilot_1_active"], "metric_name": "Non-Revenue Water Loss Reduction", "baseline_value": 32.0, "target_value": 20.0, "current_value": 18.5, "unit": "percent", "measurement_method": "District Metered Area Flow Meters", "status": "achieved"},
        {"id": "0e000002-1111-4111-8111-000000000002", "pilot_id": PILOT_IDS["pilot_1_active"], "metric_name": "Acoustic Leak Detection Accuracy", "baseline_value": 0.0, "target_value": 90.0, "current_value": 94.2, "unit": "percent", "measurement_method": "Excavation ground-truth validation", "status": "achieved"},
        {"id": "0e000003-1111-4111-8111-000000000003", "pilot_id": PILOT_IDS["pilot_1_active"], "metric_name": "Mean Time to Leak Alert", "baseline_value": 72.0, "target_value": 12.0, "current_value": 4.5, "unit": "hours", "measurement_method": "Acoustic sensor cloud alert timestamps", "status": "achieved"},

        {"id": "0e000004-1111-4111-8111-000000000004", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "metric_name": "Primary Health Centre Patient Screenings", "baseline_value": 0.0, "target_value": 5000.0, "current_value": 2150.0, "unit": "patients", "measurement_method": "District Health Portal Logs", "status": "at_risk"},
        {"id": "0e000005-1111-4111-8111-000000000005", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "metric_name": "Cardiac Risk Diagnostic Accuracy", "baseline_value": 65.0, "target_value": 90.0, "current_value": 89.4, "unit": "percent", "measurement_method": "Cardiologist second-opinion review", "status": "on_track"},

        {"id": "0e000006-1111-4111-8111-000000000006", "pilot_id": PILOT_IDS["pilot_3_completed"], "metric_name": "Farm Coverage with Multi-Spectral Drones", "baseline_value": 0.0, "target_value": 2500.0, "current_value": 2680.0, "unit": "hectares", "measurement_method": "GPS flight-log telemetry", "status": "achieved"},
        {"id": "0e000007-1111-4111-8111-000000000007", "pilot_id": PILOT_IDS["pilot_3_completed"], "metric_name": "Pest Infection Rate Reduction", "baseline_value": 24.0, "target_value": 10.0, "current_value": 7.8, "unit": "percent", "measurement_method": "Randomized field quadrant sampling", "status": "achieved"},

        {"id": "0e000008-1111-4111-8111-000000000008", "pilot_id": PILOT_IDS["pilot_4_energy"], "metric_name": "Feeder Technical Transmission Loss Reduction", "baseline_value": 16.5, "target_value": 12.0, "current_value": 11.2, "unit": "percent", "measurement_method": "Substation energy meter reconciliation", "status": "achieved"},
        {"id": "0e000009-1111-4111-8111-000000000009", "pilot_id": PILOT_IDS["pilot_4_energy"], "metric_name": "Peak Afternoon Solar Curtailment Prevention", "baseline_value": 0.0, "target_value": 20.0, "current_value": 18.5, "unit": "percent", "measurement_method": "Smart inverter phase balancing logs", "status": "on_track"},

        {"id": "0e000010-1111-4111-8111-000000000010", "pilot_id": PILOT_IDS["pilot_5_mobility"], "metric_name": "Highway Collision Alert Latency", "baseline_value": 25.0, "target_value": 1.0, "current_value": 1.8, "unit": "minutes", "measurement_method": "CCTV incident alert timestamp", "status": "at_risk"},
        {"id": "0e000011-1111-4111-8111-000000000011", "pilot_id": PILOT_IDS["pilot_5_mobility"], "metric_name": "Incident Detection Precision", "baseline_value": 50.0, "target_value": 95.0, "current_value": 91.0, "unit": "percent", "measurement_method": "Highway patrol log verification", "status": "on_track"},
        {"id": "0e000012-1111-4111-8111-000000000012", "pilot_id": PILOT_IDS["pilot_1_active"], "metric_name": "SCADA Valve Automation Response Time", "baseline_value": 180.0, "target_value": 15.0, "current_value": 8.0, "unit": "minutes", "measurement_method": "Automated pressure actuator response", "status": "achieved"},
    ]
    db.table("kpis").upsert(kpis).execute()
    print(f"  [DONE] Inserted {len(kpis)} KPIs")

    # (K) Budget Transactions
    budget_tx = [
        {"id": "0f000001-1111-4111-8111-000000000001", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "allocated", "amount": 1000000, "notes": "Sanctioned pilot budget under Innovation Scheme", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=45)).isoformat()},
        {"id": "0f000002-1111-4111-8111-000000000002", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "released", "amount": 400000, "notes": "Tranche 1 release upon hardware procurement verification", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=34)).isoformat()},
        {"id": "0f000003-1111-4111-8111-000000000003", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "utilized", "amount": 380000, "notes": "Acoustic sensor units and hardware components purchased", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()},
        {"id": "0f000004-1111-4111-8111-000000000004", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "released", "amount": 400000, "notes": "Tranche 2 release upon telemetry cloud integration", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()},
        {"id": "0f000005-1111-4111-8111-000000000005", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "utilized", "amount": 360000, "notes": "Cloud server compute, edge model deployment, and field installation", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()},

        {"id": "0f000006-1111-4111-8111-000000000006", "pilot_id": PILOT_IDS["pilot_3_completed"], "transaction_type": "allocated", "amount": 2800000, "notes": "Full sanction for Nashik drone agricultural pilot", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=130)).isoformat()},
        {"id": "0f000007-1111-4111-8111-000000000007", "pilot_id": PILOT_IDS["pilot_3_completed"], "transaction_type": "released", "amount": 2800000, "notes": "Complete budget released across 3 milestones", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=50)).isoformat()},
        {"id": "0f000008-1111-4111-8111-000000000008", "pilot_id": PILOT_IDS["pilot_3_completed"], "transaction_type": "utilized", "amount": 2650000, "notes": "Drone fleet operations, satellite imagery licenses, farmer advisory push", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=20)).isoformat()},

        {"id": "0f000009-1111-4111-8111-000000000009", "pilot_id": PILOT_IDS["pilot_4_energy"], "transaction_type": "allocated", "amount": 1800000, "notes": "MNRE Innovation Pilot Sanction", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=35)).isoformat()},
        {"id": "0f000010-1111-4111-8111-000000000010", "pilot_id": PILOT_IDS["pilot_4_energy"], "transaction_type": "released", "amount": 1200000, "notes": "Tranche 1 & 2 released upon inverter controller installation", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=18)).isoformat()},
        {"id": "0f000011-1111-4111-8111-000000000011", "pilot_id": PILOT_IDS["pilot_4_energy"], "transaction_type": "utilized", "amount": 1120000, "notes": "Inverter controller hardware and firmware licenses", "recorded_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()},
    ]
    db.table("budget_transactions").upsert(budget_tx).execute()
    print(f"  [DONE] Inserted {len(budget_tx)} budget transactions")

    # (L) Field Inspections
    inspections = [
        {
            "id": "aa000001-1111-4111-8111-000000000001",
            "pilot_id": PILOT_IDS["pilot_1_active"],
            "milestone_id": "0d000004-1111-4111-8111-000000000004",
            "inspector_id": user_ids["arjun.mehta@nhai.gov.in"],
            "scheduled_date": (datetime.now(timezone.utc) - timedelta(days=6)).date().isoformat(),
            "inspection_date": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat(),
            "location": "Nagpur North Feeder Network, Sadar Sector",
            "notes": "Field inspection verified 40 acoustic sensor nodes installed securely on water mains. Test leak simulation detected within 8 meters in 4.5 minutes. GFR compliance confirmed.",
            "status": "submitted",
            "verified_completion_percent": 82.0,
            "submitted_at": (datetime.now(timezone.utc) - timedelta(days=4)).isoformat(),
        },
        {
            "id": "aa000002-1111-4111-8111-000000000002",
            "pilot_id": PILOT_IDS["pilot_3_completed"],
            "milestone_id": "0d000012-1111-4111-8111-000000000012",
            "inspector_id": user_ids["anita.desai@agri.maharashtra.gov.in"],
            "scheduled_date": (datetime.now(timezone.utc) - timedelta(days=16)).date().isoformat(),
            "inspection_date": (datetime.now(timezone.utc) - timedelta(days=15)).isoformat(),
            "location": "Niphad & Dindori talukas, Nashik district",
            "notes": "Physical audit confirmed 2,680 hectares covered. Verified farmer WhatsApp delivery logs and reduction in crop damage. Recommended for expedited procurement review.",
            "status": "submitted",
            "verified_completion_percent": 100.0,
            "submitted_at": (datetime.now(timezone.utc) - timedelta(days=14)).isoformat(),
        },
    ]
    db.table("field_inspections").upsert(inspections).execute()
    print(f"  [DONE] Inserted {len(inspections)} field inspections")

    # (M) Procurement Cases (Procurement Readiness)
    procurement_cases = [
        {
            "id": "0c000001-1111-4111-8111-000000000001",
            "pilot_id": PILOT_IDS["pilot_1_active"],
            "readiness_score": 92.0,
            "readiness_level": "high",
            "checklist": {
                "pilot_completed": True,
                "kpi_results_available": True,
                "outcome_report": True,
                "technical_documentation": True,
                "cost_information": True,
                "compliance_documents": True,
                "government_evaluation": True,
                "field_verification": True,
                "issue_resolution": True,
            },
            "status": "ready",
            "ai_analysis": "Pilot PILOT-WRD-2025-001 achieved 82% verified completion with 18.5% water loss reduction. Field inspection confirms sensor telemetry accuracy. Ready for Rule 149 GFR single-source transfer to public procurement review.",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat(),
        },
        {
            "id": "0c000002-1111-4111-8111-000000000002",
            "pilot_id": PILOT_IDS["pilot_3_completed"],
            "readiness_score": 98.0,
            "readiness_level": "high",
            "checklist": {
                "pilot_completed": True,
                "kpi_results_available": True,
                "outcome_report": True,
                "technical_documentation": True,
                "cost_information": True,
                "compliance_documents": True,
                "government_evaluation": True,
                "field_verification": True,
                "issue_resolution": True,
            },
            "status": "approved",
            "ai_analysis": "Pilot PILOT-AGR-2025-003 successfully completed with 100% milestone achievement. Transferred for departmental public procurement under Reference PROC-CASE-2026-8812.",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=12)).isoformat(),
        },
        {
            "id": "0c000003-1111-4111-8111-000000000003",
            "pilot_id": PILOT_IDS["pilot_4_energy"],
            "readiness_score": 85.0,
            "readiness_level": "high",
            "checklist": {
                "pilot_completed": False,
                "kpi_results_available": True,
                "outcome_report": True,
                "technical_documentation": True,
                "cost_information": True,
                "compliance_documents": True,
                "government_evaluation": True,
                "field_verification": True,
                "issue_resolution": True,
            },
            "status": "ready",
            "ai_analysis": "Pilot demonstrates 65% progress with verified reduction in feeder loss. Pre-procurement documentation prepared.",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
        },
    ]
    db.table("procurement_cases").upsert(procurement_cases).execute()
    print(f"  [DONE] Inserted {len(procurement_cases)} procurement cases")

    # (N) Validated Solutions (For National Scaled Solutions Repository)
    solutions = [
        {
            "id": "0b000001-1111-4111-8111-000000000001",
            "pilot_id": PILOT_IDS["pilot_1_active"],
            "startup_id": STARTUP_IDS["aqua"],
            "department_id": DEPT_IDS["water"],
            "solution_name": "AquaSense Acoustic Mesh - Subterranean Leak Detection",
            "sector": "Water & Wastewater",
            "technologies": ["IoT", "Acoustic Sensors", "Edge AI", "SCADA", "GIS Mapping"],
            "problem_description": "Subterranean acoustic pipe listening sticks and continuous pressure telemetry isolating pipe fractures within 10 meters.",
            "kpi_achievement_percent": 96.5,
            "deployment_location": "Nagpur North Urban Feeder (50 km)",
            "validation_status": "government_verified",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat(),
        },
        {
            "id": "0b000002-1111-4111-8111-000000000002",
            "pilot_id": PILOT_IDS["pilot_3_completed"],
            "startup_id": STARTUP_IDS["krishi"],
            "department_id": DEPT_IDS["agri"],
            "solution_name": "KrishiVision AgriScan - Drone Multi-Spectral Pest Detection",
            "sector": "Agriculture",
            "technologies": ["Computer Vision", "Drones", "Satellite Analytics", "Multispectral Imaging"],
            "problem_description": "Field-level pest detection and soil moisture mapping delivering vernacular advisory directly to 10,000+ farmers via WhatsApp.",
            "kpi_achievement_percent": 98.2,
            "deployment_location": "Nashik District (2,680 Hectares)",
            "validation_status": "scaled",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=12)).isoformat(),
        },
        {
            "id": "0b000003-1111-4111-8111-000000000003",
            "pilot_id": PILOT_IDS["pilot_4_energy"],
            "startup_id": STARTUP_IDS["cleangrid"],
            "department_id": DEPT_IDS["energy"],
            "solution_name": "CleanGrid MicroBalancer - Solar Feeder Grid Telemetry",
            "sector": "Clean Energy",
            "technologies": ["IoT", "AI", "Energy Analytics", "SCADA", "Smart Inverters"],
            "problem_description": "Edge IoT controllers on solar inverters with automated phase balancing and peak-shaving dispatch algorithms.",
            "kpi_achievement_percent": 92.0,
            "deployment_location": "Bikaner Solar Distribution Hub, Rajasthan",
            "validation_status": "government_verified",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat(),
        },
    ]
    db.table("validated_solutions").upsert(solutions).execute()
    print(f"  [DONE] Inserted {len(solutions)} validated solutions")

    # (O) Adoption Requests (Inter-Departmental Scaling)
    adoption_requests = [
        {
            "id": "0e000001-2222-4222-8222-000000000001",
            "validated_solution_id": "0b000001-1111-4111-8111-000000000001",
            "requesting_department_id": DEPT_IDS["pune"],
            "requesting_officer_id": officers[1]["id"],
            "status": "pending",
            "context_notes": "Pune Smart City seeks to replicate the AquaSense acoustic leak detection pilot across 35 km of Kothrud water distribution network under GFR Rule 149 cross-departmental provisions.",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
        }
    ]
    db.table("adoption_requests").upsert(adoption_requests).execute()
    print(f"  [DONE] Inserted {len(adoption_requests)} adoption requests")

    print("\n" + "=" * 70)
    print("SUCCESS: Full Pragati Canonical Demo Dataset Seeded Successfully!")
    print(f"  - Unique Startups: 7 (AquaSense, SafeRoute, MediTrack, KrishiVision, CleanGrid, EduBridge, CivicPulse)")
    print(f"  - Government Departments: 8 | Officers: 8")
    print(f"  - Government Challenges: 10")
    print(f"  - Applications: 12 (3 Submitted, 2 Shortlisted, 5 Selected, 2 Rejected)")
    print(f"  - Pilots: 5 (3 Active, 1 Completed, 1 Paused/Delayed)")
    print(f"  - Procurement Cases: 3 | Validated Solutions: 3 | Adoption Requests: 1")
    print("=" * 70)

if __name__ == "__main__":
    print("=" * 70)
    print("PRAGATI CANONICAL DATABASE SEEDING PROCESS")
    print("=" * 70)
    user_ids = sync_auth_users()
    clean_database()
    seed_all(user_ids)
