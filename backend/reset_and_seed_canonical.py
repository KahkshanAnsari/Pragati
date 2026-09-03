#!/usr/bin/env python3
"""
Pragati Platform - Canonical Database Reset & Seeding Script
============================================================
Creates EXACTLY:
- 7 Unique Startups (no duplicates)
- 10 Problems across key government sectors
- Exactly 10 Applications (3 Submitted, 2 Shortlisted, 3 Selected, 2 Rejected)
- 3 Pilots (1 Active, 1 At Risk / Delayed, 1 Completed Successful)
- Procurement Case & 2 Validated Solutions
- Supabase Auth users for immediate demo login
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
    print("ERROR: Missing SUPABASE_URL or service key in .env")
    sys.exit(1)

db = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─── 1. Canonical ID Mapping ──────────────────────────────────────────────────

AUTH_CREDENTIALS = [
    # Government Officers
    {"email": "rajesh.kumar@waterresources.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Rajesh Kumar", "designation": "Joint Commissioner (Water Works)", "dept": "water"},
    {"email": "priya.sharma@smartcitypune.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Priya Sharma", "designation": "Chief Technology Officer", "dept": "pune"},
    {"email": "arjun.mehta@nhai.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Arjun Mehta", "designation": "Superintending Engineer (ITS)", "dept": "mobility"},
    {"email": "anita.desai@agri.maharashtra.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Dr. Anita Desai", "designation": "Director of Agriculture", "dept": "agri"},
    {"email": "kavya.health@karnataka.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Dr. Ramesh Hegde", "designation": "Mission Director (NHM)", "dept": "health"},
    {"email": "sanjay.patil@mnre.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Sanjay Patil", "designation": "Director (Solar Energy)", "dept": "energy"},
    {"email": "kavita.reddy@edu.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Kavita Reddy", "designation": "Additional Secretary", "dept": "education"},
    {"email": "suresh.bmc@mcgm.gov.in", "password": "GovDemo@2026", "role": "government_officer", "name": "Suresh More", "designation": "Chief Information Officer", "dept": "bmc"},

    # Startup Founders (The 7 Unique Startups)
    {"email": "anika@aquasense.ai", "password": "StartupDemo@2026", "role": "startup", "name": "Dr. Anika Patel", "company": "AquaSense Technologies"},
    {"email": "vikram@saferoute.in", "password": "StartupDemo@2026", "role": "startup", "name": "Vikram Malhotra", "company": "SafeRoute Mobility"},
    {"email": "kavya@meditrack.ai", "password": "StartupDemo@2026", "role": "startup", "name": "Dr. Kavya Nair", "company": "MediTrack AI"},
    {"email": "rohit@krishivision.in", "password": "StartupDemo@2026", "role": "startup", "name": "Rohit Patil", "company": "KrishiVision Technologies"},
    {"email": "aditya@cleangrid.in", "password": "StartupDemo@2026", "role": "startup", "name": "Aditya Verma", "company": "CleanGrid Dynamics"},
    {"email": "neha@edubridge.in", "password": "StartupDemo@2026", "role": "startup", "name": "Neha Tiwari", "company": "EduBridge Labs"},
    {"email": "pooja@civicpulse.in", "password": "StartupDemo@2026", "role": "startup", "name": "Pooja Deshmukh", "company": "CivicPulse Technologies"},
]

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
    "rej_1":   "a0000009-1111-4111-8111-000000000009",
    "rej_2":   "a0000010-1111-4111-8111-000000000010",
}

PILOT_IDS = {
    "pilot_1_active":    "0a000001-1111-4111-8111-000000000001",
    "pilot_2_at_risk":   "0a000002-1111-4111-8111-000000000002",
    "pilot_3_completed": "0a000003-1111-4111-8111-000000000003",
}

def sync_auth_users():
    print("--- 1. Syncing Supabase Auth Users ---")
    user_map = {}
    existing_auth = {u.email: u.id for u in db.auth.admin.list_users()}

    for cred in AUTH_CREDENTIALS:
        email = cred["email"]
        if email in existing_auth:
            uid = existing_auth[email]
            # Update password to ensure demo credentials work
            try:
                db.auth.admin.update_user_by_id(uid, {"password": cred["password"]})
            except Exception:
                pass
            user_map[email] = uid
            print(f"  [EXISTING] {email} -> {uid}")
        else:
            try:
                u = db.auth.admin.create_user({
                    "email": email,
                    "password": cred["password"],
                    "email_confirm": True,
                    "user_metadata": {"role": cred["role"], "name": cred.get("name")}
                })
                uid = u.user.id
                user_map[email] = uid
                print(f"  [CREATED]  {email} -> {uid}")
            except Exception as e:
                print(f"  [ERROR] creating auth user {email}: {e}")

    return user_map

def clean_database():
    print("\n--- 2. Cleaning Existing Records ---")
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
    for tbl in tables:
        try:
            # Delete all rows safely using not.is.null on id
            db.table(tbl).delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
            print(f"  Cleared {tbl}")
        except Exception as e:
            print(f"  [WARN] Cleared {tbl}: {e}")

def seed_data(user_map):
    print("\n--- 3. Seeding Canonical Data ---")
    now = datetime.now(timezone.utc).isoformat()

    # (A) Public Users
    public_users = []
    for cred in AUTH_CREDENTIALS:
        email = cred["email"]
        uid = user_map.get(email)
        if uid:
            public_users.append({
                "id": uid,
                "email": email,
                "role": cred["role"],
                "created_at": now
            })
    db.table("users").upsert(public_users).execute()
    print(f"  [DONE] Inserted {len(public_users)} public users")

    # (B) Government Departments (8)
    departments = [
        {"id": DEPT_IDS["water"], "name": "Water Resources Department, Nagpur", "sector": "Water & Wastewater", "location": "Nagpur, Maharashtra", "head_name": "Rajesh Kumar"},
        {"id": DEPT_IDS["pune"], "name": "Pune Smart City Development Corp (PSCDCL)", "sector": "Governance & Smart Cities", "location": "Pune, Maharashtra", "head_name": "Priya Sharma"},
        {"id": DEPT_IDS["mobility"], "name": "National Highways Authority of India (NHAI)", "sector": "Smart Infrastructure & Mobility", "location": "New Delhi, Delhi", "head_name": "Arjun Mehta"},
        {"id": DEPT_IDS["agri"], "name": "Department of Agriculture, Maharashtra", "sector": "Agriculture", "location": "Pune, Maharashtra", "head_name": "Dr. Anita Desai"},
        {"id": DEPT_IDS["health"], "name": "Department of Health & Family Welfare, Karnataka", "sector": "Healthcare", "location": "Bengaluru, Karnataka", "head_name": "Dr. Ramesh Hegde"},
        {"id": DEPT_IDS["energy"], "name": "Ministry of New and Renewable Energy (MNRE)", "sector": "Clean Energy", "location": "New Delhi, Delhi", "head_name": "Sanjay Patil"},
        {"id": DEPT_IDS["education"], "name": "Department of School Education, Telangana", "sector": "Education & Skilling", "location": "Hyderabad, Telangana", "head_name": "Kavita Reddy"},
        {"id": DEPT_IDS["bmc"], "name": "Brihanmumbai Municipal Corporation (BMC)", "sector": "Governance & Smart Cities", "location": "Mumbai, Maharashtra", "head_name": "Suresh More"},
    ]
    db.table("government_departments").upsert(departments).execute()
    print(f"  [DONE] Inserted {len(departments)} government departments")

    # (C) Government Officers (8)
    officers = [
        {"id": "e0000001-1111-4111-8111-000000000001", "user_id": user_map["rajesh.kumar@waterresources.gov.in"], "department_id": DEPT_IDS["water"], "name": "Rajesh Kumar", "designation": "Joint Commissioner (Water Works)", "official_email": "rajesh.kumar@waterresources.gov.in", "gov_id": "MH-WRD-001", "verification_status": "verified"},
        {"id": "e0000002-1111-4111-8111-000000000002", "user_id": user_map["priya.sharma@smartcitypune.gov.in"], "department_id": DEPT_IDS["pune"], "name": "Priya Sharma", "designation": "Chief Technology Officer", "official_email": "priya.sharma@smartcitypune.gov.in", "gov_id": "MH-PSCDCL-002", "verification_status": "verified"},
        {"id": "e0000003-1111-4111-8111-000000000003", "user_id": user_map["arjun.mehta@nhai.gov.in"], "department_id": DEPT_IDS["mobility"], "name": "Arjun Mehta", "designation": "Superintending Engineer (ITS)", "official_email": "arjun.mehta@nhai.gov.in", "gov_id": "GOI-NHAI-003", "verification_status": "verified"},
        {"id": "e0000004-1111-4111-8111-000000000004", "user_id": user_map["anita.desai@agri.maharashtra.gov.in"], "department_id": DEPT_IDS["agri"], "name": "Dr. Anita Desai", "designation": "Director of Agriculture", "official_email": "anita.desai@agri.maharashtra.gov.in", "gov_id": "MH-AGR-004", "verification_status": "verified"},
        {"id": "e0000005-1111-4111-8111-000000000005", "user_id": user_map["kavya.health@karnataka.gov.in"], "department_id": DEPT_IDS["health"], "name": "Dr. Ramesh Hegde", "designation": "Mission Director (NHM)", "official_email": "kavya.health@karnataka.gov.in", "gov_id": "KA-HFW-005", "verification_status": "verified"},
        {"id": "e0000006-1111-4111-8111-000000000006", "user_id": user_map["sanjay.patil@mnre.gov.in"], "department_id": DEPT_IDS["energy"], "name": "Sanjay Patil", "designation": "Director (Solar Energy)", "official_email": "sanjay.patil@mnre.gov.in", "gov_id": "GOI-MNRE-006", "verification_status": "verified"},
        {"id": "e0000007-1111-4111-8111-000000000007", "user_id": user_map["kavita.reddy@edu.gov.in"], "department_id": DEPT_IDS["education"], "name": "Kavita Reddy", "designation": "Additional Secretary", "official_email": "kavita.reddy@edu.gov.in", "gov_id": "TS-EDU-007", "verification_status": "verified"},
        {"id": "e0000008-1111-4111-8111-000000000008", "user_id": user_map["suresh.bmc@mcgm.gov.in"], "department_id": DEPT_IDS["bmc"], "name": "Suresh More", "designation": "Chief Information Officer", "official_email": "suresh.bmc@mcgm.gov.in", "gov_id": "MH-BMC-008", "verification_status": "verified"},
    ]
    db.table("government_officers").upsert(officers).execute()
    print(f"  [DONE] Inserted {len(officers)} government officers")

    # (D) Exactly 7 Unique Startups (No duplicates!)
    startups = [
        {
            "id": STARTUP_IDS["aqua"],
            "user_id": user_map["anika@aquasense.ai"],
            "name": "AquaSense Technologies",
            "founder_name": "Dr. Anika Patel",
            "email": "anika@aquasense.ai",
            "phone": "+91-9876543210",
            "sector": "Water & Wastewater",
            "technologies": ["IoT", "Acoustic Sensors", "Edge AI", "SCADA", "Cloud"],
            "capabilities": ["Leak Detection", "Pipeline Pressure Telemetry", "Real-Time Water Quality", "Non-Revenue Water Audit"],
            "team_size": 18,
            "experience_years": 5,
            "gst_number": "27AABCA1234A1Z5",
            "incorporation_number": "U72200MH2019PTC123456",
            "dpiit_recognition_number": "DIPP12345",
            "verification_status": "verified",
            "trust_score": 94,
            "pilot_success_rate": 95.0,
            "previous_projects": 8,
            "government_pilots": 3,
        },
        {
            "id": STARTUP_IDS["safe"],
            "user_id": user_map["vikram@saferoute.in"],
            "name": "SafeRoute Mobility",
            "founder_name": "Vikram Malhotra",
            "email": "vikram@saferoute.in",
            "phone": "+91-9876543211",
            "sector": "Smart Infrastructure & Mobility",
            "technologies": ["Computer Vision", "Edge AI", "IoT Sensors", "Traffic Analytics", "5G Video Mesh"],
            "capabilities": ["Automated Incident Detection", "Traffic Flow Optimization", "Highway Safety Analytics", "Emergency Vehicle Preemption"],
            "team_size": 16,
            "experience_years": 4,
            "gst_number": "07AABCS9876A1Z5",
            "incorporation_number": "U63030DL2021PTC678901",
            "dpiit_recognition_number": "DIPP67890",
            "verification_status": "verified",
            "trust_score": 91,
            "pilot_success_rate": 92.0,
            "previous_projects": 6,
            "government_pilots": 2,
        },
        {
            "id": STARTUP_IDS["medi"],
            "user_id": user_map["kavya@meditrack.ai"],
            "name": "MediTrack AI",
            "founder_name": "Dr. Kavya Nair",
            "email": "kavya@meditrack.ai",
            "phone": "+91-9876543212",
            "sector": "Healthcare",
            "technologies": ["AI Diagnostic Models", "Computer Vision", "FHIR Telemetry", "Edge Medical Kits"],
            "capabilities": ["Rural PHC Clinical Triage", "Patient Vitals Monitoring", "Automated Diagnostic Risk Scoring"],
            "team_size": 22,
            "experience_years": 4,
            "gst_number": "29AABCM1234A1Z5",
            "incorporation_number": "U85100KA2020PTC234567",
            "dpiit_recognition_number": "DIPP23456",
            "verification_status": "verified",
            "trust_score": 89,
            "pilot_success_rate": 88.0,
            "previous_projects": 5,
            "government_pilots": 2,
        },
        {
            "id": STARTUP_IDS["krishi"],
            "user_id": user_map["rohit@krishivision.in"],
            "name": "KrishiVision Technologies",
            "founder_name": "Rohit Patil",
            "email": "rohit@krishivision.in",
            "phone": "+91-9876543213",
            "sector": "Agriculture",
            "technologies": ["Drone Multispectral Imaging", "Satellite Remote Sensing", "Soil IoT Probes", "Micro-climate AI"],
            "capabilities": ["Crop Stress Detection", "Precision Irrigation", "Pest & Disease Forecasting", "Yield Estimation"],
            "team_size": 15,
            "experience_years": 4,
            "gst_number": "27AABCK1234A1Z5",
            "incorporation_number": "U01100MH2020PTC345678",
            "dpiit_recognition_number": "DIPP34567",
            "verification_status": "verified",
            "trust_score": 88,
            "pilot_success_rate": 90.0,
            "previous_projects": 7,
            "government_pilots": 3,
        },
        {
            "id": STARTUP_IDS["cleangrid"],
            "user_id": user_map["aditya@cleangrid.in"],
            "name": "CleanGrid Dynamics",
            "founder_name": "Aditya Verma",
            "email": "aditya@cleangrid.in",
            "phone": "+91-9876543214",
            "sector": "Clean Energy",
            "technologies": ["Digital Twin", "IoT SCADA", "Predictive Analytics", "Battery Telemetry"],
            "capabilities": ["Solar Substation Monitoring", "Fault Prediction", "Inverter Efficiency Optimization", "Microgrid Balancing"],
            "team_size": 14,
            "experience_years": 5,
            "gst_number": "24AABCS1234A1Z5",
            "incorporation_number": "U40100GJ2019PTC456789",
            "dpiit_recognition_number": "DIPP45678",
            "verification_status": "verified",
            "trust_score": 86,
            "pilot_success_rate": 85.0,
            "previous_projects": 6,
            "government_pilots": 2,
        },
        {
            "id": STARTUP_IDS["edubridge"],
            "user_id": user_map["neha@edubridge.in"],
            "name": "EduBridge Labs",
            "founder_name": "Neha Tiwari",
            "email": "neha@edubridge.in",
            "phone": "+91-9876543215",
            "sector": "Education & Skilling",
            "technologies": ["Generative AI", "NLP", "Adaptive Learning Engine", "Offline Mobile Sync"],
            "capabilities": ["Multilingual Vernacular Tutoring", "Foundational Literacy Analytics", "Teacher Assessment Dashboards"],
            "team_size": 20,
            "experience_years": 3,
            "gst_number": "36AABCE1234A1Z5",
            "incorporation_number": "U80301TS2021PTC567890",
            "dpiit_recognition_number": "DIPP56789",
            "verification_status": "verified",
            "trust_score": 90,
            "pilot_success_rate": 89.0,
            "previous_projects": 5,
            "government_pilots": 1,
        },
        {
            "id": STARTUP_IDS["civicpulse"],
            "user_id": user_map["pooja@civicpulse.in"],
            "name": "CivicPulse Technologies",
            "founder_name": "Pooja Deshmukh",
            "email": "pooja@civicpulse.in",
            "phone": "+91-9876543216",
            "sector": "Governance & Smart Cities",
            "technologies": ["NLP", "Automated Workflow Engine", "API Integration Mesh", "Conversational AI", "GIS"],
            "capabilities": ["Citizen Grievance Auto-Triaging", "Municipal Work Order Automation", "Service SLA Tracking", "SLA Breach Forecasting"],
            "team_size": 19,
            "experience_years": 4,
            "gst_number": "27AABCP5432A1Z5",
            "incorporation_number": "U74999MH2020PTC789012",
            "dpiit_recognition_number": "DIPP78901",
            "verification_status": "verified",
            "trust_score": 92,
            "pilot_success_rate": 94.0,
            "previous_projects": 8,
            "government_pilots": 3,
        }
    ]
    db.table("startups").upsert(startups).execute()
    print(f"  [DONE] Inserted {len(startups)} unique canonical startups")

    # (E) Exactly 10 Problems across sectors
    problems = [
        {
            "id": PROBLEM_IDS["p1_water"],
            "department_id": DEPT_IDS["water"],
            "officer_id": officers[0]["id"],
            "title": "AI-Based Urban Water Leakage Detection & Pressure Optimization",
            "sector": "Water & Wastewater",
            "location": "Nagpur, Maharashtra",
            "description": "Nagpur municipal distribution experiences estimated 28% non-revenue water loss from underground pipeline fractures. Seeking an acoustic and IoT pressure monitoring mesh capable of isolating pipeline ruptures within 10 meters.",
            "required_capabilities": ["Leak Detection", "Pressure Telemetry", "Acoustic Sensing", "GIS Mapping"],
            "required_technologies": ["IoT", "Acoustic Sensors", "Edge AI", "SCADA"],
            "budget_min": 800000,
            "budget_max": 1500000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Detect underground pipe bursts within 20 minutes, isolate leaks within 10m radius, and achieve minimum 20% water loss reduction.",
            "kpis": ["Water Loss Reduction >= 20%", "Detection Accuracy >= 90%", "Mean Time to Alert < 12h"],
            "eligibility_requirements": "DPIIT recognized startup with proven IoT deployment experience in water or industrial pipelines.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p2_agri"],
            "department_id": DEPT_IDS["agri"],
            "officer_id": officers[3]["id"],
            "title": "Precision Agriculture Drone & Satellite Crop Monitoring",
            "sector": "Agriculture",
            "location": "Pune & Nashik, Maharashtra",
            "description": "Farmers in Nashik and Pune regions suffer extensive crop losses from unseasonal rains and undetected pest infestations. Department seeks drone and remote sensing analytics for weekly crop health advisories.",
            "required_capabilities": ["Crop Stress Detection", "Precision Irrigation", "Pest Forecasting"],
            "required_technologies": ["Drone Multispectral Imaging", "Satellite Remote Sensing", "Micro-climate AI"],
            "budget_min": 2000000,
            "budget_max": 3500000,
            "timeline_days": 180,
            "pilot_duration_days": 120,
            "expected_outcome": "Provide actionable crop health indices across 2,500 hectares with 85% yield prediction accuracy.",
            "kpis": ["Farm Coverage >= 2000 Hectares", "Pest Detection Accuracy >= 85%", "Farmer Advisory Delivery Rate >= 90%"],
            "eligibility_requirements": "Valid DGCA certified drone pilot roster and satellite analytics processing pipeline.",
            "status": "pilot_active",
        },
        {
            "id": PROBLEM_IDS["p3_health"],
            "department_id": DEPT_IDS["health"],
            "officer_id": officers[4]["id"],
            "title": "AI-Assisted Rural Patient Triage & Vitals Telemetry",
            "sector": "Healthcare",
            "location": "Chamarajanagar, Karnataka",
            "description": "Primary Health Centres (PHCs) in remote hilly tribal blocks face acute shortage of specialist doctors. Need diagnostic triage software on ruggedized tablets to classify critical cardiovascular and respiratory cases.",
            "required_capabilities": ["Clinical Triage", "Patient Vitals Monitoring", "Automated Risk Scoring"],
            "required_technologies": ["AI Diagnostic Models", "FHIR Telemetry", "Edge Medical Kits"],
            "budget_min": 2500000,
            "budget_max": 4500000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Screen 5,000+ rural patients with real-time tele-consultation escalation for high-risk patients.",
            "kpis": ["Patient Screenings >= 5000", "Diagnostic Precision >= 90%", "Referral Escalation Time < 30m"],
            "eligibility_requirements": "ISO 13485 or CDSCO compliant medical software protocols.",
            "status": "pilot_active",
        },
        {
            "id": PROBLEM_IDS["p4_energy"],
            "department_id": DEPT_IDS["energy"],
            "officer_id": officers[5]["id"],
            "title": "Solar Park Telemetry & Predictive Inverter Maintenance",
            "sector": "Clean Energy",
            "location": "Charanka Solar Park, Gujarat",
            "description": "Unscheduled inverter trip-offs and string degradation cause up to 6% annual generation loss in high-temperature solar installations. Need AI digital twin to predict component failures 72 hours in advance.",
            "required_capabilities": ["Solar Substation Monitoring", "Fault Prediction", "Inverter Efficiency Optimization"],
            "required_technologies": ["Digital Twin", "IoT SCADA", "Predictive Analytics"],
            "budget_min": 1500000,
            "budget_max": 3000000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Reduce unscheduled inverter downtime by 40% and improve annual plant performance ratio by 2.5%.",
            "kpis": ["Downtime Reduction >= 40%", "Fault Prediction Accuracy >= 85%", "Telemetry Latency < 5s"],
            "eligibility_requirements": "Prior experience with utility-scale solar telemetry protocols (Modbus, IEC 60870).",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p5_edu"],
            "department_id": DEPT_IDS["education"],
            "officer_id": officers[6]["id"],
            "title": "Adaptive Vernacular Learning & Foundational Numeracy",
            "sector": "Education & Skilling",
            "location": "Warangal & Karimnagar, Telangana",
            "description": "Government primary schools require an adaptive multilingual software for Grades 3-5 students to improve foundational literacy and numeracy (FLN) in Telugu and English medium classrooms.",
            "required_capabilities": ["Multilingual Vernacular Tutoring", "Foundational Literacy Analytics", "Teacher Dashboards"],
            "required_technologies": ["Generative AI", "NLP", "Adaptive Learning Engine"],
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
            "location": "NH-44 & NH-48 Corridors",
            "description": "National Highways Authority of India requires an automated video analytics solution across existing highway surveillance cameras to detect collisions, stationary vehicles, lane infractions, and animal crossings within 30 seconds.",
            "required_capabilities": ["Automated Incident Detection", "Traffic Flow Optimization", "Highway Safety Analytics"],
            "required_technologies": ["Computer Vision", "Edge AI", "Traffic Analytics", "5G Video Mesh"],
            "budget_min": 12000000,
            "budget_max": 30000000,
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
            "required_technologies": ["NLP", "Automated Workflow Engine", "API Integration Mesh"],
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
            "title": "Smart Solid Waste Segregation & Collection Route Optimization",
            "sector": "Waste Management",
            "location": "Pune, Maharashtra",
            "description": "Pune Smart City requires IoT fill-level sensors on municipal bins combined with dynamic route planning software for garbage collection trucks to minimize diesel consumption and prevent bin overflow.",
            "required_capabilities": ["Bin Level Telemetry", "Dynamic Route Optimization", "Carbon Emission Analytics"],
            "required_technologies": ["IoT Ultrasonic Sensors", "GIS Optimization", "Cloud Dashboard"],
            "budget_min": 1000000,
            "budget_max": 2500000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Eliminate open bin overflows and achieve 18% fuel savings across the pilot municipal ward fleet.",
            "kpis": ["Overflow Incidents Reduction >= 90%", "Fleet Fuel Savings >= 18%", "Sensor Telemetry Reliability >= 98%"],
            "eligibility_requirements": "IP67 rated ruggedized hardware sensors suitable for Indian environmental conditions.",
            "status": "published",
        },
        {
            "id": PROBLEM_IDS["p9_pothole"],
            "department_id": DEPT_IDS["mobility"],
            "officer_id": officers[2]["id"],
            "title": "Automated Pothole Detection & Road Surface Quality Mapping",
            "sector": "Smart Infrastructure & Mobility",
            "location": "Delhi NCR",
            "description": "Continuous road surface condition assessment using smartphone cameras mounted on public transit buses, generating an automated GIS heat-map of road distress and potholes.",
            "required_capabilities": ["Edge Pothole Detection", "Road Roughness Index Mapping", "Contractor Quality Audits"],
            "required_technologies": ["Computer Vision", "Mobile Edge AI", "GIS"],
            "budget_min": 1200000,
            "budget_max": 2800000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Complete continuous surface distress scanning across 300 km arterial roads weekly.",
            "kpis": ["Detection Precision >= 88%", "Geo-tagging Precision < 3m", "Survey Frequency Weekly"],
            "eligibility_requirements": "Mobile SDK capable of on-device inference without high battery drain.",
            "status": "draft",
        },
        {
            "id": PROBLEM_IDS["p10_sewage"],
            "department_id": DEPT_IDS["water"],
            "officer_id": officers[0]["id"],
            "title": "Decentralized Sewage Treatment Remote Telemetry & Quality Compliance",
            "sector": "Water & Wastewater",
            "location": "Nagpur & Amravati, Maharashtra",
            "description": "Continuous real-time monitoring of BOD, COD, and TSS parameters from decentralized sewage treatment plants (STPs) with automated alerts for regulatory non-compliance.",
            "required_capabilities": ["Effluent Quality Telemetry", "Regulatory Compliance Logging", "Remote Sensor Calibration"],
            "required_technologies": ["Electrochemical Sensors", "IoT Gateway", "Compliance Ledger"],
            "budget_min": 1500000,
            "budget_max": 3200000,
            "timeline_days": 180,
            "pilot_duration_days": 90,
            "expected_outcome": "Continuous 24x7 water quality reporting across 15 decentralized STPs with tamper-evident audit logs.",
            "kpis": ["Sensor Uptime >= 99%", "Compliance Deviation Alerts < 5m", "Calibration Accuracy >= 95%"],
            "eligibility_requirements": "CPCB/SPCB telemetry protocol conformance.",
            "status": "published",
        },
    ]
    db.table("problems").upsert(problems).execute()
    print(f"  [DONE] Inserted {len(problems)} problems")

    # (F) Exactly 10 Applications (User Requirement)
    # Counts: 3 Submitted, 2 Shortlisted, 3 Selected, 2 Rejected
    applications = [
        # 3 SUBMITTED
        {
            "id": APP_IDS["sub_1"],
            "problem_id": PROBLEM_IDS["p6_mobility"],
            "startup_id": STARTUP_IDS["safe"],
            "solution": "SafeRoute Highway AI: Edge-compute cameras processing 30fps video streams along NH-44 to detect collisions, lane obstruction, and stationary vehicles within 25 seconds.",
            "proposed_approach": "Deploy 12 ruggedized edge nodes with dual-optical sensors at major accident-prone intersections on the NH-44 pilot corridor with solar-battery backup and LTE telemetry.",
            "implementation_plan": "Month 1: Hardware site survey and sensor mount. Month 2: Model calibration on local traffic patterns. Month 3: Live telemetry feed to NHAI control room.",
            "cost_proposed": 18000000,
            "team_details": {"lead": "Vikram Malhotra", "ai_researcher": "Dr. Sunita Rao", "engineers": 4},
            "previous_work": "Deployed automated accident detection on Delhi-Meerut Expressway with 94.2% detection precision.",
            "expected_outcome": "Incident alerts delivered to NHAI control room within 30 seconds with 96% accuracy.",
            "status": "submitted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
        },
        {
            "id": APP_IDS["sub_2"],
            "problem_id": PROBLEM_IDS["p7_grievance"],
            "startup_id": STARTUP_IDS["civicpulse"],
            "solution": "CivicPulse AI Triaging Suite: Bilingual Marathi-English grievance parser that maps complaints into 64 municipal service categories with 94% accuracy.",
            "proposed_approach": "Direct API integration into BMC Citizen Portal and WhatsApp grievance bot with auto-routing to corresponding Ward Executive Engineers.",
            "implementation_plan": "Phase 1: Ingest 50,000 historical BMC tickets to train ward-routing model. Phase 2: Pilot in K-East and G-North wards.",
            "cost_proposed": 2800000,
            "team_details": {"lead": "Pooja Deshmukh", "nlp_specialist": "Rohan Deshmukh", "engineers": 3},
            "previous_work": "Automated grievance routing for Navi Mumbai Municipal Corporation reducing resolution time by 32%.",
            "expected_outcome": "Reduce complaint misrouting to under 4% and cut triage time from 4 hours to instantaneous.",
            "status": "submitted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=3)).isoformat(),
        },
        {
            "id": APP_IDS["sub_3"],
            "problem_id": PROBLEM_IDS["p4_energy"],
            "startup_id": STARTUP_IDS["cleangrid"],
            "solution": "CleanGrid Twin: Physics-informed ML model tracking thermal and electrical stress in utility solar inverters to predict failures 72 hours early.",
            "proposed_approach": "High-frequency SCADA data acquisition at 1 Hz from 20 central inverters at Charanka Solar Park.",
            "implementation_plan": "Month 1: Gateway installation and SCADA handshake. Month 2: Baseline energy modeling. Month 3: Predictive fault trigger validation.",
            "cost_proposed": 2200000,
            "team_details": {"lead": "Aditya Verma", "scada_architect": "Kunal Shah", "engineers": 3},
            "previous_work": "Solar telemetry across 150MW private installations in Rajasthan.",
            "expected_outcome": "Predict unscheduled inverter shutdowns with 88% precision 48 hours in advance.",
            "status": "submitted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat(),
        },

        # 2 SHORTLISTED
        {
            "id": APP_IDS["short_1"],
            "problem_id": PROBLEM_IDS["p5_edu"],
            "startup_id": STARTUP_IDS["edubridge"],
            "solution": "EduBridge Vernacular Adaptive Learning Kit: AI-driven diagnostic quizzes in Telugu with speech-recognition based pronunciation feedback.",
            "proposed_approach": "Deploy low-cost Android tablets with offline speech recognition across 15 government schools in Warangal.",
            "implementation_plan": "Phase 1: Curriculum tagging. Phase 2: Teacher orientation. Phase 3: 8-week student cohort tracking.",
            "cost_proposed": 1600000,
            "team_details": {"lead": "Neha Tiwari", "curriculum_lead": "S. Rao", "engineers": 4},
            "previous_work": "FLN improvement pilot across 40 tribal schools in Khammam district with 28% score improvement.",
            "expected_outcome": "Achieve 30% improvement in basic numeracy and Telugu reading comprehension.",
            "status": "shortlisted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat(),
        },
        {
            "id": APP_IDS["short_2"],
            "problem_id": PROBLEM_IDS["p8_waste"],
            "startup_id": STARTUP_IDS["civicpulse"],
            "solution": "CivicRoute Dynamic Fleet Optimizer: Real-time ultrasonic fill sensors on 200 public garbage bins linked to dynamic driver navigation tablets.",
            "proposed_approach": "Sensor retrofitting onto municipal dumper bins with cellular NB-IoT communication and route rerouting API.",
            "implementation_plan": "Deploy sensors in Kothrud ward, integrate with vehicle GPS trackers, run dynamic routing.",
            "cost_proposed": 1950000,
            "team_details": {"lead": "Pooja Deshmukh", "iot_lead": "Manish Joshi", "engineers": 3},
            "previous_work": "Smart waste routing deployed in Thane municipal corporation.",
            "expected_outcome": "Zero bin overflow incidents and minimum 15% reduction in diesel consumption.",
            "status": "shortlisted",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=12)).isoformat(),
        },

        # 3 SELECTED (Connected to Pilots)
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
            "created_at": (datetime.now(timezone.utc) - timedelta(days=40)).isoformat(),
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

        # 2 REJECTED
        {
            "id": APP_IDS["rej_1"],
            "problem_id": PROBLEM_IDS["p1_water"],
            "startup_id": STARTUP_IDS["cleangrid"],
            "solution": "CleanGrid Solar Pumping Audit: Energy audit proposal for municipal water lifting stations.",
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
            "solution": "SafeRoute Farm Vehicle Tracking: GPS tracking collars and tractor fleet telematics.",
            "proposed_approach": "Vehicle tracking unit installation on farm machinery without multispectral crop sensing.",
            "implementation_plan": "GPS fleet tracking.",
            "cost_proposed": 3000000,
            "team_details": {"lead": "Vikram Malhotra", "engineers": 2},
            "previous_work": "Commercial truck fleet tracking.",
            "expected_outcome": "Machine hours tracking.",
            "status": "rejected",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=70)).isoformat(),
        }
    ]
    db.table("applications").upsert(applications).execute()
    print(f"  [DONE] Inserted {len(applications)} applications (Exact 10 records: 3 Submitted, 2 Shortlisted, 3 Selected, 2 Rejected)")

    # (G) Evaluations for the 3 Selected Applications
    evaluations = [
        {
            "id": "f0000001-1111-4111-8111-000000000001",
            "application_id": APP_IDS["sel_1"],
            "officer_id": officers[0]["id"],
            "technical_fit": 9,
            "feasibility": 9,
            "cost_effectiveness": 9,
            "team_capability": 9,
            "expected_impact": 9,
            "scalability": 9,
            "decision": "select",
            "notes": "Exceptional technical capability with validated acoustic sensors and strong municipal track record. Highly recommended for pilot.",
            "evaluated_at": (datetime.now(timezone.utc) - timedelta(days=38)).isoformat(),
        },
        {
            "id": "f0000002-1111-4111-8111-000000000002",
            "application_id": APP_IDS["sel_2"],
            "officer_id": officers[4]["id"],
            "technical_fit": 9,
            "feasibility": 8,
            "cost_effectiveness": 8,
            "team_capability": 9,
            "expected_impact": 9,
            "scalability": 8,
            "decision": "select",
            "notes": "Critical rural healthcare triage solution. Certified hardware and clinical diagnostic algorithms meet government specifications.",
            "evaluated_at": (datetime.now(timezone.utc) - timedelta(days=58)).isoformat(),
        },
        {
            "id": "f0000003-1111-4111-8111-000000000003",
            "application_id": APP_IDS["sel_3"],
            "officer_id": officers[3]["id"],
            "technical_fit": 10,
            "feasibility": 9,
            "cost_effectiveness": 9,
            "team_capability": 9,
            "expected_impact": 10,
            "scalability": 9,
            "decision": "select",
            "notes": "Fully integrated drone-satellite analytics with vernacular delivery. Selected for comprehensive farm monitoring pilot.",
            "evaluated_at": (datetime.now(timezone.utc) - timedelta(days=88)).isoformat(),
        },
    ]
    db.table("evaluations").upsert(evaluations).execute()
    print(f"  [DONE] Inserted {len(evaluations)} evaluations")

    # (H) Exactly 3 Pilots (User Requirement: 1 Active, 1 At Risk / Delayed, 1 Completed Successful)
    pilots = [
        # Pilot 1: Active (AquaSense & Water Resources Dept)
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
        # Pilot 2: At Risk / Delayed (MediTrack AI & Health Dept)
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
        # Pilot 3: Completed Successful (KrishiVision & Agriculture Dept)
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
    ]
    db.table("pilots").upsert(pilots).execute()
    print(f"  [DONE] Inserted {len(pilots)} pilots (1 Active, 1 At Risk / Delayed, 1 Completed Successful)")

    # (I) Milestones for Pilot 1 (Active, 82% progress, 5 verified, 1 claimed)
    milestones = [
        {"id": "0d000001-1111-4111-8111-000000000001", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Acoustic Sensor Hardware Procurement & Lab Bench Testing", "description": "Procure and calibrate 40 hydro-acoustic pipe sensor units and verify acoustic signature bench response.", "due_date": (datetime.now(timezone.utc) - timedelta(days=35)).date().isoformat(), "status": "inspector_verified", "sequence_order": 1, "startup_claimed_at": (datetime.now(timezone.utc) - timedelta(days=36)).isoformat(), "verified_at": (datetime.now(timezone.utc) - timedelta(days=34)).isoformat()},
        {"id": "0d000002-1111-4111-8111-000000000002", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Pipeline GIS Mapping & Telemetry Node Installation", "description": "Complete GIS survey of Nagpur North distribution network and clamp 40 sensor nodes onto feeder mains.", "due_date": (datetime.now(timezone.utc) - timedelta(days=25)).date().isoformat(), "status": "inspector_verified", "sequence_order": 2, "startup_claimed_at": (datetime.now(timezone.utc) - timedelta(days=26)).isoformat(), "verified_at": (datetime.now(timezone.utc) - timedelta(days=24)).isoformat()},
        {"id": "0d000003-1111-4111-8111-000000000003", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Telemetry Cloud Ingestion & Baseline Pressure Calibration", "description": "Establish 4G/NB-IoT data telemetry pipeline to municipal SCADA dashboard and record baseline pressure curves.", "due_date": (datetime.now(timezone.utc) - timedelta(days=15)).date().isoformat(), "status": "inspector_verified", "sequence_order": 3, "startup_claimed_at": (datetime.now(timezone.utc) - timedelta(days=16)).isoformat(), "verified_at": (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()},
        {"id": "0d000004-1111-4111-8111-000000000004", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Edge AI Leak Detection Algorithm Deployment", "description": "Deploy frequency-domain wavelet filter to isolate subterranean burst sounds from ambient traffic noise.", "due_date": (datetime.now(timezone.utc) - timedelta(days=5)).date().isoformat(), "status": "inspector_verified", "sequence_order": 4, "startup_claimed_at": (datetime.now(timezone.utc) - timedelta(days=6)).isoformat(), "verified_at": (datetime.now(timezone.utc) - timedelta(days=4)).isoformat()},
        {"id": "0d000005-1111-4111-8111-000000000005", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "30-Day Live Telemetry Run & Ground-Truth Verification", "description": "Monitor live network continuously, trigger repair work orders, and verify physical leak locations.", "due_date": (datetime.now(timezone.utc) - timedelta(days=1)).date().isoformat(), "status": "inspector_verified", "sequence_order": 5, "startup_claimed_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(), "verified_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()},
        {"id": "0d000006-1111-4111-8111-000000000006", "pilot_id": PILOT_IDS["pilot_1_active"], "title": "Final Pilot Evaluation & Scale-Up Procurement Case", "description": "Consolidate 90-day water loss audit, third-party field inspection, and GeM procurement case dossier.", "due_date": (datetime.now(timezone.utc) + timedelta(days=20)).date().isoformat(), "status": "startup_claimed", "sequence_order": 6, "startup_claimed_at": now},

        # Pilot 2 Milestones (At Risk)
        {"id": "0d000007-1111-4111-8111-000000000007", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "title": "Diagnostic Kit Hardware Assembly & Safety Certification", "description": "Assemble 30 medical tele-triage kits.", "due_date": (datetime.now(timezone.utc) - timedelta(days=30)).date().isoformat(), "status": "inspector_verified", "sequence_order": 1, "verified_at": (datetime.now(timezone.utc) - timedelta(days=28)).isoformat()},
        {"id": "0d000008-1111-4111-8111-000000000008", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "title": "ASHA Worker Training in 15 PHCs", "description": "Conduct on-site hands-on clinical workflow training.", "due_date": (datetime.now(timezone.utc) - timedelta(days=10)).date().isoformat(), "status": "inspector_verified", "sequence_order": 2, "verified_at": (datetime.now(timezone.utc) - timedelta(days=8)).isoformat()},
        {"id": "0d000009-1111-4111-8111-000000000009", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "title": "Remaining 15 PHC Kit Rollout", "description": "Supply chain component delay on optical pulse sensors.", "due_date": (datetime.now(timezone.utc) - timedelta(days=2)).date().isoformat(), "status": "pending", "sequence_order": 3},

        # Pilot 3 Milestones (Completed Successful)
        {"id": "0d000010-1111-4111-8111-000000000010", "pilot_id": PILOT_IDS["pilot_3_completed"], "title": "Drone Fleet Deployment & GIS Basemap Creation", "description": "Completed full 2,500 hectare orthomosaic mapping.", "due_date": (datetime.now(timezone.utc) - timedelta(days=100)).date().isoformat(), "status": "inspector_verified", "sequence_order": 1, "verified_at": (datetime.now(timezone.utc) - timedelta(days=98)).isoformat()},
        {"id": "0d000011-1111-4111-8111-000000000011", "pilot_id": PILOT_IDS["pilot_3_completed"], "title": "Pest Outbreak Alert Engine Integration", "description": "Integrated automated alert push via SMS/WhatsApp.", "due_date": (datetime.now(timezone.utc) - timedelta(days=60)).date().isoformat(), "status": "inspector_verified", "sequence_order": 2, "verified_at": (datetime.now(timezone.utc) - timedelta(days=58)).isoformat()},
        {"id": "0d000012-1111-4111-8111-000000000012", "pilot_id": PILOT_IDS["pilot_3_completed"], "title": "Final Yield Audit & Farmer Satisfaction Sign-off", "description": "All targets exceeded. Agriculture commissioner verified report.", "due_date": (datetime.now(timezone.utc) - timedelta(days=15)).date().isoformat(), "status": "inspector_verified", "sequence_order": 3, "verified_at": (datetime.now(timezone.utc) - timedelta(days=12)).isoformat()},
    ]
    db.table("milestones").upsert(milestones).execute()
    print(f"  [DONE] Inserted {len(milestones)} milestones")

    # (J) KPIs for Pilots
    kpis = [
        # Pilot 1 KPIs
        {"id": "0e000001-1111-4111-8111-000000000001", "pilot_id": PILOT_IDS["pilot_1_active"], "metric_name": "Non-Revenue Water Loss Reduction", "baseline_value": 28.0, "target_value": 20.0, "current_value": 22.4, "unit": "%", "measurement_method": "Ultrasonic electromagnetic bulk water meter differential audit", "status": "achieved"},
        {"id": "0e000002-1111-4111-8111-000000000002", "pilot_id": PILOT_IDS["pilot_1_active"], "metric_name": "Acoustic Leak Detection Accuracy", "baseline_value": 0.0, "target_value": 90.0, "current_value": 94.5, "unit": "%", "measurement_method": "Physical excavation verification of AI flagged coordinates", "status": "achieved"},
        {"id": "0e000003-1111-4111-8111-000000000003", "pilot_id": PILOT_IDS["pilot_1_active"], "metric_name": "Mean Time to Leak Alert", "baseline_value": 72.0, "target_value": 12.0, "current_value": 14.0, "unit": "hours", "measurement_method": "Automated system timestamp from burst sound to SMS work order", "status": "on_track"},

        # Pilot 2 KPIs (At Risk)
        {"id": "0e000004-1111-4111-8111-000000000004", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "metric_name": "Rural Patients Screened", "baseline_value": 0.0, "target_value": 5000.0, "current_value": 2150.0, "unit": "patients", "measurement_method": "ABHA linked digital health record registrations", "status": "at_risk"},
        {"id": "0e000005-1111-4111-8111-000000000005", "pilot_id": PILOT_IDS["pilot_2_at_risk"], "metric_name": "Diagnostic Risk Scoring Precision", "baseline_value": 0.0, "target_value": 90.0, "current_value": 91.2, "unit": "%", "measurement_method": "Secondary confirmation by District Hospital Cardiologist", "status": "achieved"},

        # Pilot 3 KPIs (Completed Successful)
        {"id": "0e000006-1111-4111-8111-000000000006", "pilot_id": PILOT_IDS["pilot_3_completed"], "metric_name": "Farm Land Scanned", "baseline_value": 0.0, "target_value": 2500.0, "current_value": 2680.0, "unit": "hectares", "measurement_method": "GIS orthomosaic flight telemetry logs", "status": "achieved"},
        {"id": "0e000007-1111-4111-8111-000000000007", "pilot_id": PILOT_IDS["pilot_3_completed"], "metric_name": "Pest Detection Accuracy", "baseline_value": 0.0, "target_value": 85.0, "current_value": 92.0, "unit": "%", "measurement_method": "Field agronomy ground-truth inspection", "status": "achieved"},
    ]
    db.table("kpis").upsert(kpis).execute()
    print(f"  [DONE] Inserted {len(kpis)} KPIs")

    # (K) Budget Transactions for Pilot 1
    budget_tx = [
        {"id": "0f000001-1111-4111-8111-000000000001", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "allocated", "amount": 1000000, "notes": "Initial total budget allocated for Nagpur Water Pilot"},
        {"id": "0f000002-1111-4111-8111-000000000002", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "released", "amount": 500000, "notes": "Tranche 1 released upon hardware milestone verification"},
        {"id": "0f000003-1111-4111-8111-000000000003", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "utilized", "amount": 480000, "notes": "Sensor fabrication and GIS node clamp installation costs"},
        {"id": "0f000004-1111-4111-8111-000000000004", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "released", "amount": 300000, "notes": "Tranche 2 released upon 30-day live telemetry run verification"},
        {"id": "0f000005-1111-4111-8111-000000000005", "pilot_id": PILOT_IDS["pilot_1_active"], "transaction_type": "utilized", "amount": 260000, "notes": "Cloud server infrastructure and field engineering team operations"},
    ]
    db.table("budget_transactions").upsert(budget_tx).execute()
    print(f"  [DONE] Inserted {len(budget_tx)} budget transactions")

    # (L) Field Inspections for Pilot 1
    inspections = [
        {
            "id": "aa000001-1111-4111-8111-000000000001",
            "pilot_id": PILOT_IDS["pilot_1_active"],
            "milestone_id": milestones[1]["id"],
            "inspector_id": user_map["rajesh.kumar@waterresources.gov.in"],
            "scheduled_date": (datetime.now(timezone.utc) - timedelta(days=25)).date().isoformat(),
            "inspection_date": (datetime.now(timezone.utc) - timedelta(days=24)).isoformat(),
            "location": "Mankapur Ring Road, Nagpur",
            "notes": "Verified 40 clamp-on acoustic loggers installed along 12 km trunk line. Cellular signal and battery voltage verified.",
            "status": "submitted",
            "verified_completion_percent": 100.0,
            "submitted_at": (datetime.now(timezone.utc) - timedelta(days=24)).isoformat(),
        },
        {
            "id": "aa000002-1111-4111-8111-000000000002",
            "pilot_id": PILOT_IDS["pilot_1_active"],
            "milestone_id": milestones[4]["id"],
            "inspector_id": user_map["rajesh.kumar@waterresources.gov.in"],
            "scheduled_date": (datetime.now(timezone.utc) - timedelta(days=2)).date().isoformat(),
            "inspection_date": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat(),
            "location": "Sitabuldi Main Feeder, Nagpur",
            "notes": "Physical excavation conducted at coordinates flagged by AquaSense AI. 15mm hairline fracture verified and repaired. Leakage pinpointing accuracy: 6.2 meters.",
            "status": "submitted",
            "verified_completion_percent": 100.0,
            "submitted_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat(),
        },
    ]
    db.table("field_inspections").upsert(inspections).execute()
    print(f"  [DONE] Inserted {len(inspections)} field inspections")

    # (M) Procurement Cases (1 Procurement-ready solution for Pilot 1 and 1 for Pilot 3)
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
            "ai_analysis": "AquaSense Acoustic Mesh has completed 82% of pilot with 100% verified field inspections and exceeded water loss reduction targets. Fully compliant with GFR 2017 Rule 149 for accelerated GeM direct purchase onboarding.",
            "report_url": "https://pragati.gov.in/reports/PILOT-WRD-2025-001-Procurement-Case.pdf",
            "created_at": now,
        },
        {
            "id": "0c000002-1111-4111-8111-000000000002",
            "pilot_id": PILOT_IDS["pilot_3_completed"],
            "readiness_score": 96.0,
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
            "ai_analysis": "Pilot 100% completed with full agronomy verification across 2,680 hectares. Ready for scale-up procurement across Maharashtra state agriculture commissionerate.",
            "report_url": "https://pragati.gov.in/reports/PILOT-AGR-2025-003-Approved-Case.pdf",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat(),
        }
    ]
    db.table("procurement_cases").upsert(procurement_cases).execute()
    print(f"  [DONE] Inserted {len(procurement_cases)} procurement cases")

    # (N) Validated Solutions Repository (2 Validated Solutions)
    validated_solutions = [
        {
            "id": "0b000001-1111-4111-8111-000000000001",
            "pilot_id": PILOT_IDS["pilot_1_active"],
            "startup_id": STARTUP_IDS["aqua"],
            "department_id": DEPT_IDS["water"],
            "solution_name": "AquaSense Smart Acoustic Water Leakage Detection & Pressure Telemetry Mesh",
            "sector": "Water & Wastewater",
            "technologies": ["IoT", "Acoustic Sensors", "Edge AI", "SCADA", "Cloud"],
            "problem_description": "28% non-revenue water loss from subterranean pipeline fractures across municipal distribution network.",
            "kpi_achievement_percent": 94.5,
            "deployment_location": "Nagpur North Zone, Maharashtra",
            "validation_status": "government_verified",
            "created_at": now,
        },
        {
            "id": "0b000002-1111-4111-8111-000000000002",
            "pilot_id": PILOT_IDS["pilot_3_completed"],
            "startup_id": STARTUP_IDS["krishi"],
            "department_id": DEPT_IDS["agri"],
            "solution_name": "KrishiVision Multispectral Drone & Satellite Farm Health Advisory Mesh",
            "sector": "Agriculture",
            "technologies": ["Drone Multispectral Imaging", "Satellite Remote Sensing", "Soil IoT Probes", "Micro-climate AI"],
            "problem_description": "Unpredictable crop pest infestations and excessive chemical pesticide application causing farm yield decline.",
            "kpi_achievement_percent": 96.0,
            "deployment_location": "Nashik & Baramati, Maharashtra",
            "validation_status": "scaled",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat(),
        }
    ]
    db.table("validated_solutions").upsert(validated_solutions).execute()
    print(f"  [DONE] Inserted {len(validated_solutions)} validated solutions")

    # (O) Adoption Request (For Cross-Department Adoption Demo)
    adoption_requests = [
        {
            "id": "ac000001-1111-4111-8111-000000000001",
            "validated_solution_id": validated_solutions[0]["id"],
            "requesting_department_id": DEPT_IDS["pune"],
            "requesting_officer_id": officers[1]["id"],
            "status": "pending",
            "context_notes": "Pune Municipal Corporation seeks to replicate the Nagpur water leakage pilot for Ward 4 (Kothrud) to address 22% NRW loss.",
            "created_at": (datetime.now(timezone.utc) - timedelta(days=2)).isoformat(),
        }
    ]
    db.table("adoption_requests").upsert(adoption_requests).execute()
    print(f"  [DONE] Inserted {len(adoption_requests)} adoption requests")

    print("\n==================================================================")
    print("SUCCESS: Database completely cleared and re-seeded with canonical demo data!")
    print(f"  - Startups: exactly 7 unique (no duplicates)")
    print(f"  - Problems: 10 diverse government challenges")
    print(f"  - Applications: exactly 10 (3 submitted, 2 shortlisted, 3 selected, 2 rejected)")
    print(f"  - Pilots: 3 (1 active, 1 at risk, 1 completed)")
    print(f"  - Validated Solutions: 2 verified scalable solutions")
    print("==================================================================")

if __name__ == "__main__":
    users = sync_auth_users()
    clean_database()
    seed_data(users)
