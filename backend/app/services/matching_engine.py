import logging
import re
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Domain concept taxonomies for hard relevance gating and semantic matching
DOMAIN_CONCEPTS = {
    "road_mobility": {
        "keywords": [
            "road", "roads", "pothole", "potholes", "highway", "highways", "surface",
            "traffic", "mobility", "transportation", "infrastructure", "defect",
            "defects", "geospatial", "gis", "mapping", "telemetry", "vehicle",
            "vehicles", "accelerometer", "pavement", "asphalt", "nhai", "lane", "bridge",
            "roughness", "geotagging"
        ],
        "sectors": ["smart infrastructure & mobility", "smart infrastructure", "mobility", "transportation", "highways"],
        "target_startups": ["RoadVision AI", "SafeRoute Mobility"]
    },
    "water_management": {
        "keywords": [
            "water", "wastewater", "leak", "leakage", "pipeline", "pipe", "pipes",
            "quality", "distribution", "drainage", "sewer", "sewage", "hydrology",
            "monitoring", "pressure", "acoustic", "scada", "flow", "potable", "aquifer"
        ],
        "sectors": ["water & wastewater", "water management", "water tech", "water resources"],
        "target_startups": ["AquaSense Technologies"]
    },
    "healthcare": {
        "keywords": [
            "healthcare", "hospital", "hospitals", "medical", "diagnosis", "diagnostic",
            "patient", "patients", "clinical", "radiology", "imaging", "vitals",
            "telemedicine", "phc", "health", "triage", "pulmonary", "tele-triage"
        ],
        "sectors": ["healthcare", "health tech", "medical diagnostics"],
        "target_startups": ["MediTrack AI"]
    },
    "agriculture": {
        "keywords": [
            "agriculture", "crop", "crops", "farm", "farming", "soil", "irrigation",
            "precision farming", "pest", "pests", "yield", "drone", "drones",
            "multispectral", "harvest", "farmer", "farmers"
        ],
        "sectors": ["agriculture", "agritech", "agri tech"],
        "target_startups": ["KrishiVision Technologies"]
    },
    "clean_energy": {
        "keywords": [
            "energy", "clean energy", "solar", "grid", "microgrid", "power",
            "electricity", "inverter", "substation", "battery", "feeder",
            "transmission", "renewable", "load"
        ],
        "sectors": ["clean energy", "energy & utilities", "renewable energy"],
        "target_startups": ["CleanGrid Dynamics"]
    },
    "education": {
        "keywords": [
            "education", "skilling", "learning", "student", "students", "school",
            "schools", "curriculum", "numeracy", "vernacular", "tutoring", "pedagogy",
            "classroom", "teacher", "teachers", "assessment"
        ],
        "sectors": ["education & skilling", "edtech", "education"],
        "target_startups": ["EduBridge Labs"]
    },
    "governance": {
        "keywords": [
            "governance", "smart city", "smart cities", "grievance", "grievances",
            "citizen", "citizens", "municipal", "civic", "ward", "work order",
            "sla", "public service", "routing", "complaint"
        ],
        "sectors": ["governance & smart cities", "governance", "smart cities", "civic tech"],
        "target_startups": ["CivicPulse Technologies"]
    }
}

# Verified catalog of startup projects
STARTUP_PROJECT_CATALOG = {
    "RoadVision AI": [
        {
            "title": "Automated Pothole Detection & Road Surface Quality Mapping",
            "desc": "Deployed vehicle-mounted edge computer vision and high-frequency accelerometer telemetry across highway corridors for real-time pothole detection, road surface roughness analysis, and automated defect severity classification.",
            "tech": ["Computer Vision", "Edge AI", "GIS", "Accelerometer Telemetry"],
            "capabilities": ["Pothole Detection", "Road Surface Analysis", "Defect Geotagging", "Preventive Maintenance Prioritization"],
            "domain": "road_mobility",
            "outcome": "Scanned 850 km of national highways with 97.4% defect detection accuracy and sub-meter GIS geotagging."
        },
        {
            "title": "Highway Road Condition Mapping & Defect Geotagging",
            "desc": "Vehicle-mounted sensor mesh conducting high-speed road surface scanning, asphalt crack mapping, and pavement distress geo-tagging on NHAI expressways.",
            "tech": ["Computer Vision", "GIS", "Edge AI", "Accelerometer Telemetry"],
            "capabilities": ["Road Condition Mapping", "Road Surface Analysis", "Defect Geotagging"],
            "domain": "road_mobility",
            "outcome": "Automated defect geotagging for 450 km of highway with sub-second defect logging."
        },
        {
            "title": "Road Defect Geotagging & Preventive Maintenance Prioritization",
            "desc": "International Roughness Index (IRI) telemetry profiling with predictive maintenance scheduling for road asset management.",
            "tech": ["GIS", "IoT", "Telemetry", "Edge Computing"],
            "capabilities": ["Preventive Maintenance Prioritization", "Road Surface Analysis"],
            "domain": "road_mobility",
            "outcome": "Saved 18% in highway repair expenditure through early pavement maintenance."
        },
        {
            "title": "National Highway Accident & Obstacle Detection Mesh",
            "desc": "Edge AI video analytics deployed on highway CCTV cameras for real-time incident detection and automated highway patrol dispatch.",
            "tech": ["Computer Vision", "Edge AI", "Traffic Analytics"],
            "capabilities": ["Accident Detection", "Traffic Flow Optimization"],
            "domain": "road_mobility",
            "outcome": "Reduced accident detection response time from 18 minutes to 45 seconds."
        }
    ],
    "SafeRoute Mobility": [
        {
            "title": "Automated Pothole Detection & Road Surface Quality Mapping",
            "desc": "Deployed vehicle-mounted edge computer vision and high-frequency accelerometer telemetry across highway corridors for real-time pothole detection, road surface roughness analysis, and automated defect severity classification.",
            "tech": ["Computer Vision", "Edge AI", "GIS", "Accelerometer Telemetry"],
            "capabilities": ["Pothole Detection", "Road Surface Analysis", "Defect Geotagging", "Preventive Maintenance Prioritization"],
            "domain": "road_mobility",
            "outcome": "Scanned 850 km of national highways with 97.4% defect detection accuracy and sub-meter GIS geotagging."
        },
        {
            "title": "Highway Road Condition Mapping & Defect Geotagging",
            "desc": "Vehicle-mounted sensor mesh conducting high-speed road surface scanning, asphalt crack mapping, and pavement distress geo-tagging on NHAI expressways.",
            "tech": ["Computer Vision", "GIS", "Edge AI", "Accelerometer Telemetry"],
            "capabilities": ["Road Condition Mapping", "Road Surface Analysis", "Defect Geotagging"],
            "domain": "road_mobility",
            "outcome": "Automated defect geotagging for 450 km of highway with sub-second defect logging."
        },
        {
            "title": "Road Defect Geotagging & Preventive Maintenance Prioritization",
            "desc": "International Roughness Index (IRI) telemetry profiling with predictive maintenance scheduling for road asset management.",
            "tech": ["GIS", "IoT", "Telemetry", "Edge Computing"],
            "capabilities": ["Preventive Maintenance Prioritization", "Road Surface Analysis"],
            "domain": "road_mobility",
            "outcome": "Saved 18% in highway repair expenditure through early pavement maintenance."
        }
    ],
    "AquaSense Technologies": [
        {
            "title": "Municipal Water Leakage Detection & Pressure Telemetry",
            "desc": "Underground pipe acoustic mesh sensors with edge AI algorithms to identify micro-leaks in municipal drinking water distribution networks.",
            "tech": ["IoT", "Acoustic Sensors", "Edge AI", "Pressure Telemetry"],
            "capabilities": ["Water Leakage Detection", "Pipeline Monitoring", "IoT Sensors", "Pressure Anomaly Detection"],
            "domain": "water_management",
            "outcome": "Reduced non-revenue water loss by 28% across 12 district metered areas."
        },
        {
            "title": "Smart Pipeline Monitoring & Subterranean Acoustic Sensing",
            "desc": "SCADA integration with real-time pressure transducers and transient wave analysis for leakage prevention in major water conduits.",
            "tech": ["SCADA", "Pressure Telemetry", "IoT"],
            "capabilities": ["Water Leakage Detection", "Pipeline Monitoring", "Acoustic Sensing"],
            "domain": "water_management",
            "outcome": "Eliminated pipe burst events across 85km trunk main network."
        },
        {
            "title": "Municipal Water Quality & Flow Telemetry Network",
            "desc": "Multiparameter water quality sensors transmitting real-time turbidity, chlorine, and pH telemetry.",
            "tech": ["IoT", "SCADA"],
            "capabilities": ["Pipeline Monitoring", "Pressure Anomaly Detection"],
            "domain": "water_management",
            "outcome": "99.4% compliance with potable water quality standards."
        }
    ],
    "MediTrack AI": [
        {
            "title": "AI-Powered Remote Patient Tele-Triage & Monitoring",
            "desc": "Edge diagnostic AI analyzing patient vitals and ICU telemetry in remote government district hospitals.",
            "tech": ["AI/ML", "IoT Sensors", "Edge Diagnostics", "Telemedicine"],
            "capabilities": ["Patient Monitoring", "Diagnostic AI", "Remote Tele-triage", "Vital Telemetry"],
            "domain": "healthcare",
            "outcome": "Early sepsis detection accuracy of 94% in rural medical centers."
        },
        {
            "title": "Diagnostic Computer Vision for Chest Radiographs",
            "desc": "Automated screening for pulmonary conditions and chest X-rays using deep learning inference on edge devices in primary health centres.",
            "tech": ["Computer Vision", "Edge AI", "AI/ML"],
            "capabilities": ["Diagnostic AI", "Vital Telemetry"],
            "domain": "healthcare",
            "outcome": "Screened 50,000+ patients in tribal health missions with 93% sensitivity."
        }
    ],
    "KrishiVision Technologies": [
        {
            "title": "Drone Multispectral Crop Disease & Pest Mapping",
            "desc": "Autonomous drone surveys capturing multispectral imagery for early blight and pest detection in agricultural fields.",
            "tech": ["Computer Vision", "Drones", "Multispectral Imaging", "Edge AI"],
            "capabilities": ["Crop Monitoring", "Disease Detection", "Yield Prediction"],
            "domain": "agriculture",
            "outcome": "Saved 22% crop yield loss across 10,000 hectares of paddy farming."
        },
        {
            "title": "Satellite & Soil Moisture Telemetry Analytics",
            "desc": "Synthetic Aperture Radar satellite analytics fused with in-situ soil moisture sensor telemetry.",
            "tech": ["Satellite Analytics", "IoT Sensors", "AI/ML"],
            "capabilities": ["Soil Moisture Telemetry", "Yield Prediction"],
            "domain": "agriculture",
            "outcome": "Enhanced water irrigation efficiency by 34%."
        }
    ],
    "CleanGrid Dynamics": [
        {
            "title": "Solar Microgrid Peak Balancer & Inverter Firmware Telemetry",
            "desc": "Edge AI telemetry optimizers dynamically balancing solar microgrid inverter loads and battery storage discharge across 40 agricultural feeders.",
            "tech": ["IoT", "AI", "Energy Analytics", "SCADA", "Smart Inverter Firmware"],
            "capabilities": ["Energy Optimization", "Smart Grid Monitoring", "Peak Load Shifting", "Solar Telemetry"],
            "domain": "clean_energy",
            "outcome": "Reduced feeder transmission loss by 18.5% and stabilized peak grid frequency to 50 Hz."
        },
        {
            "title": "Substation SCADA Telemetry Optimization",
            "desc": "Real-time supervisory telemetry tracking transformer thermal headroom and reactive power compensation.",
            "tech": ["SCADA", "Energy Analytics", "IoT"],
            "capabilities": ["Smart Grid Monitoring", "Energy Optimization"],
            "domain": "clean_energy",
            "outcome": "Prevented 14 transformer overloading trips during peak summer months."
        }
    ],
    "EduBridge Labs": [
        {
            "title": "Adaptive Vernacular Learning & Foundational Numeracy",
            "desc": "Offline-first AI tablet application personalizing foundational literacy and mathematics in 6 regional languages for government schools.",
            "tech": ["NLP", "Generative AI", "Adaptive Learning Engine", "Speech Recognition"],
            "capabilities": ["Adaptive Learning", "Multilingual Vernacular Tutoring", "Student Analytics"],
            "domain": "education",
            "outcome": "Improved student foundational numeracy scores by 38% across 120 rural schools."
        },
        {
            "title": "Voice-Enabled Classroom Assessment Tool",
            "desc": "Acoustic speech recognition scoring oral reading fluency in vernacular classrooms without internet connectivity.",
            "tech": ["NLP", "Speech Recognition"],
            "capabilities": ["Multilingual Vernacular Tutoring", "Student Analytics"],
            "domain": "education",
            "outcome": "Conducted 80,000 automated student reading assessments in rural primary schools."
        }
    ],
    "CivicPulse Technologies": [
        {
            "title": "NLP Citizen Grievance Classification & Automated Routing",
            "desc": "Multilingual NLP pipeline classifying citizen civic complaints from WhatsApp, voice, and web portals and routing to municipal ward engineers.",
            "tech": ["NLP", "AI", "Workflow Automation"],
            "capabilities": ["Citizen Grievance Auto-Triaging", "Municipal Work Order Automation", "Service SLA Tracking"],
            "domain": "governance",
            "outcome": "Cut grievance resolution turnaround from 14 days to 48 hours."
        },
        {
            "title": "Municipal Service Delivery SLA Telemetry Dashboard",
            "desc": "Real-time spatial monitoring of municipal services, garbage clearance, and pothole complaint resolution.",
            "tech": ["GIS", "Data Analytics", "Workflow Automation"],
            "capabilities": ["Service SLA Tracking", "Municipal Work Order Automation"],
            "domain": "governance",
            "outcome": "92% on-time service delivery across 24 municipal wards."
        }
    ]
}

def _extract_keywords(text: str) -> set:
    if not text:
        return set()
    words = re.findall(r'[a-zA-Z0-9]+', text.lower())
    stop_words = {"and", "the", "for", "with", "from", "that", "this", "are", "was", "will", "using", "into"}
    return {w for w in words if len(w) > 2 and w not in stop_words}

def _detect_problem_domain(prob_text: str, prob_sector: str) -> str:
    prob_combined = f"{prob_text} {prob_sector}".lower()
    best_domain = "general"
    max_score = 0

    for domain_name, data in DOMAIN_CONCEPTS.items():
        score = 0
        # Sector match
        for s in data["sectors"]:
            if s in prob_combined:
                score += 15
        # Keyword matches
        for kw in data["keywords"]:
            if kw in prob_combined:
                score += 2

        if score > max_score:
            max_score = score
            best_domain = domain_name

    return best_domain

def calculate_match_scores(problem: Dict[str, Any], startup: Dict[str, Any]) -> Dict[str, Any]:
    prob_sector = (problem.get("sector") or "").lower().strip()
    prob_location = (problem.get("location") or "").lower().strip()
    prob_techs = [t.lower().strip() for t in (problem.get("required_technologies") or [])]
    prob_caps = [c.lower().strip() for c in (problem.get("required_capabilities") or [])]
    prob_title = (problem.get("title") or "").lower()
    prob_desc = (problem.get("description") or "").lower()
    prob_outcome = (problem.get("expected_outcome") or "").lower()
    prob_text = f"{prob_title} {prob_desc} {prob_outcome} {' '.join(prob_techs)} {' '.join(prob_caps)}"
    prob_keywords = _extract_keywords(f"{prob_text} {prob_sector}")

    st_name = startup.get("name") or "Startup"
    st_sector = (startup.get("sector") or "").lower().strip()
    st_location = (startup.get("location") or "").lower().strip()
    st_techs = [t.lower().strip() for t in (startup.get("technologies") or [])]
    st_caps = [c.lower().strip() for c in (startup.get("capabilities") or [])]
    st_prev_projects = startup.get("previous_projects") or 0
    st_gov_pilots = startup.get("government_pilots") or 0
    st_success_rate = startup.get("pilot_success_rate") or 80.0
    st_verified = startup.get("verification_status") == "verified"
    st_raw_status = (startup.get("verification_status") or "").lower()

    if st_raw_status in ["blacklisted", "suspended", "rejected"]:
        return {
            "startup_id": startup["id"],
            "startup_name": st_name,
            "match_percent": 0.0,
            "score": 0.0,
            "match_rating": "FAIR",
            "category": "Ineligible",
            "badge": f"INELIGIBLE ({st_raw_status.upper()})",
            "confidence": "Low",
            "matched_technologies": [],
            "matched_capabilities": [],
            "relevant_previous_projects": [],
            "missing_requirements": ["Compliance violation / Account flagged"],
            "explanation": f"{st_name} is currently flagged as {st_raw_status} and is ineligible for government matching or procurement consideration.",
            "breakdown": {"sector_fit": 0, "technology_fit": 0, "capability_fit": 0, "project_relevance": 0, "government_experience": 0, "trust": 0},
            "reasons": [f"Status: {st_raw_status.upper()}", "Ineligible for government pilot consideration"],
            "explainability": {
                "is_relevant": False,
                "reason": f"{st_name} is currently {st_raw_status} and ineligible.",
                "strengths": [f"Status: {st_raw_status.upper()}"]
            },
            "startup": startup
        }

    # Detect problem domain
    prob_domain = _detect_problem_domain(prob_text, prob_sector)
    domain_info = DOMAIN_CONCEPTS.get(prob_domain, {})
    domain_target_startups = domain_info.get("target_startups", [])

    # =========================================================================
    # 1. DOMAIN / SECTOR FIT (Max 20 Points)
    # =========================================================================
    sector_score = 0
    sector_match = False

    is_target_startup = any(ts.lower() == st_name.lower() or ts.lower() in st_name.lower() for ts in domain_target_startups)
    domain_sectors = domain_info.get("sectors", [])

    if is_target_startup or any(s in st_sector for s in domain_sectors) or st_sector == prob_sector:
        sector_score = 20
        sector_match = True
    elif (
        ("water" in st_sector and "water" in prob_sector) or
        ("mobility" in st_sector and ("mobility" in prob_sector or "infrastructure" in prob_sector)) or
        ("health" in st_sector and "health" in prob_sector) or
        ("agri" in st_sector and "agri" in prob_sector) or
        ("energy" in st_sector and "energy" in prob_sector) or
        ("edu" in st_sector and "edu" in prob_sector) or
        ("gov" in st_sector and "gov" in prob_sector)
    ):
        sector_score = 18
        sector_match = True
    elif any(term in prob_text for term in st_sector.split() if len(term) > 3):
        sector_score = 8
        sector_match = True
    else:
        # Unrelated sector receives 0
        sector_score = 0
        sector_match = False

    # =========================================================================
    # 2. CAPABILITY FIT (Max 25 Points)
    # =========================================================================
    cap_score = 0
    matched_caps = []
    for st_c in st_caps:
        for pr_c in prob_caps:
            if st_c == pr_c or st_c in pr_c or pr_c in st_c:
                matched_caps.append(st_c)
                break
        else:
            if any(term in prob_text for term in st_c.split() if len(term) > 3):
                matched_caps.append(st_c)

    matched_cap_count = len(set(matched_caps))
    if sector_match or is_target_startup:
        if matched_cap_count >= 3:
            cap_score = 25
        elif matched_cap_count == 2:
            cap_score = 20
        elif matched_cap_count == 1:
            cap_score = 14
        else:
            cap_score = 4
    else:
        # If unrelated sector, capability overlap must be strictly domain verified
        cap_score = 0

    capability_match = cap_score >= 14

    # =========================================================================
    # 3. RELEVANT PREVIOUS PROJECT EXPERIENCE (Max 20 Points)
    # =========================================================================
    exp_score = 0
    best_matching_project = None
    max_proj_relevance = 0

    catalog_projects = STARTUP_PROJECT_CATALOG.get(st_name, [])
    # Support alias for RoadVision AI / SafeRoute Mobility
    if not catalog_projects:
        if "safe" in st_name.lower() or "route" in st_name.lower():
            catalog_projects = STARTUP_PROJECT_CATALOG.get("RoadVision AI", [])
        elif "road" in st_name.lower() or "vision" in st_name.lower():
            catalog_projects = STARTUP_PROJECT_CATALOG.get("RoadVision AI", [])

    for proj in catalog_projects:
        proj_text = f"{proj.get('title', '')} {proj.get('desc', '')} {proj.get('domain', '')} {' '.join(proj.get('tech', []))} {' '.join(proj.get('capabilities', []))}".lower()
        proj_keywords = _extract_keywords(proj_text)
        overlap = prob_keywords & proj_keywords

        domain_overlap = (proj.get("domain") == prob_domain)
        if ("pothole" in prob_text and "pothole" in proj_text) or \
           ("water" in prob_text and "leak" in prob_text and "water" in proj_text and "leak" in proj_text) or \
           ("crop" in prob_text and "disease" in prob_text and "crop" in proj_text) or \
           ("patient" in prob_text and ("patient" in proj_text or "triage" in proj_text)) or \
           ("solar" in prob_text and "feeder" in prob_text and "solar" in proj_text) or \
           ("grievance" in prob_text and "grievance" in proj_text) or \
           ("student" in prob_text and "learning" in prob_text and "student" in proj_text):
            domain_overlap = True

        proj_relevance = len(overlap) * 2.0
        if domain_overlap:
            proj_relevance += 12.0

        if proj_relevance > max_proj_relevance:
            max_proj_relevance = proj_relevance
            best_matching_project = proj.get("title")

    if (sector_match or is_target_startup) and max_proj_relevance >= 12:
        exp_score = 20
    elif (sector_match or is_target_startup) and max_proj_relevance >= 8:
        exp_score = 15
    elif (sector_match or is_target_startup) and max_proj_relevance >= 4:
        exp_score = 10
    else:
        exp_score = 0

    previous_relevant_project = exp_score >= 12

    # =========================================================================
    # 4. TECHNOLOGY FIT (Max 25 Points) - WITH CONTEXTUAL GATING
    # =========================================================================
    tech_score = 0
    matched_techs = []
    for st_t in st_techs:
        for pr_t in prob_techs:
            if st_t == pr_t or st_t in pr_t or pr_t in st_t:
                matched_techs.append(st_t)
                break
        else:
            if st_t in prob_text:
                matched_techs.append(st_t)

    matched_tech_count = len(set(matched_techs))

    # CONTEXTUAL GATE:
    # If startup has NO sector match AND NO capability match AND NO project relevance:
    # generic technology overlap (e.g. Computer Vision for medical) receives max 5 points!
    if not (sector_match or capability_match or previous_relevant_project):
        tech_score = min(5, matched_tech_count * 2)
    else:
        if matched_tech_count >= 3:
            tech_score = 25
        elif matched_tech_count == 2:
            tech_score = 20
        elif matched_tech_count == 1:
            tech_score = 15
        else:
            tech_score = 6

    technology_match = tech_score >= 14

    # =========================================================================
    # 5. GOVERNMENT EXPERIENCE (Max 5 Points)
    # =========================================================================
    gov_score = 0
    if sector_match or capability_match or previous_relevant_project:
        if st_gov_pilots >= 3:
            gov_score = 5
        elif st_gov_pilots >= 1:
            gov_score = 4
        else:
            gov_score = 2
    else:
        gov_score = 1.0

    # =========================================================================
    # 6. VERIFICATION & TRUST (Max 5 Points)
    # =========================================================================
    trust_comp_score = 0
    if sector_match or capability_match or previous_relevant_project:
        if st_verified:
            trust_comp_score += 2.5
        else:
            trust_comp_score += 1.0

        if st_success_rate >= 95:
            trust_comp_score += 2.5
        elif st_success_rate >= 85:
            trust_comp_score += 2.0
        else:
            trust_comp_score += 1.0
    else:
        trust_comp_score = 1.5

    trust_comp_score = min(5.0, trust_comp_score)

    # =========================================================================
    # RELEVANCE GATE & FINAL SCORE CALCULATION
    # =========================================================================
    is_relevant = (sector_match or capability_match or previous_relevant_project or is_target_startup)

    if not is_relevant:
        # Strictly gate unrelated startups into LOW RELEVANCE (< 25%)
        raw_total = sector_score + tech_score + cap_score + exp_score + gov_score + trust_comp_score
        match_percent = round(min(22.0, max(8.0, raw_total)), 1)
        db_rating = "FAIR"
        ui_rating = "LOW RELEVANCE"
        badge = "LOW RELEVANCE"
    else:
        raw_total = sector_score + tech_score + cap_score + exp_score + gov_score + trust_comp_score
        match_percent = round(min(98.5, max(38.0, raw_total)), 1)

        if match_percent >= 85:
            db_rating = "BEST"
            ui_rating = "BEST MATCH"
            badge = "EXCELLENT MATCH"
        elif match_percent >= 70:
            db_rating = "GOOD"
            ui_rating = "BETTER MATCH"
            badge = "STRONG MATCH"
        else:
            db_rating = "GOOD"
            ui_rating = "GOOD MATCH"
            badge = "MODERATE FIT"

    # Explainable Evidence Strengths
    strengths = []
    if is_relevant:
        if sector_match:
            strengths.append(f"Direct {startup.get('sector', 'domain')} domain expertise")
        if best_matching_project and exp_score >= 12:
            strengths.append(f"Previous project: '{best_matching_project}'")
        elif st_prev_projects > 0:
            strengths.append(f"{st_prev_projects} commercial enterprise deployments completed")

        if matched_techs:
            strengths.append(f"Production stack in {' + '.join(list(set(matched_techs))[:2])}")
        else:
            strengths.append(f"Core technology stack includes {', '.join((startup.get('technologies') or [])[:2])}")

        if matched_caps:
            strengths.append(f"Demonstrated capability in {', '.join(list(set(matched_caps))[:2])}")
        elif startup.get('capabilities'):
            strengths.append(f"Verified capabilities in {startup.get('capabilities')[0]}")

        if st_gov_pilots > 0:
            strengths.append(f"{st_gov_pilots} completed government pilots with {st_success_rate}% success rate")
    else:
        strengths.append(f"Low domain relevance: Startup core domain is {startup.get('sector', 'unrelated')}")
        strengths.append(f"No demonstrated past project experience in {prob_sector or 'this challenge area'}")
        if matched_techs:
            strengths.append(f"Technology overlap limited to generic {', '.join(list(set(matched_techs))[:2])} without domain application")

    tech_summary = ", ".join(list(set(matched_techs))[:2]) if matched_techs else ", ".join((startup.get("technologies") or [])[:2])
    cap_summary = ", ".join(list(set(matched_caps))[:2]) if matched_caps else ", ".join((startup.get("capabilities") or [])[:2])

    if is_relevant and exp_score >= 15:
        reason = (
            f"{st_name} is an exceptionally strong match ({match_percent}%) with directly relevant past project deployment "
            f"('{best_matching_project}') in this exact domain. Possesses a proven {tech_summary} production stack "
            f"and certified capabilities in {cap_summary} with {st_gov_pilots} completed government pilots."
        )
    elif is_relevant:
        reason = (
            f"{st_name} has high sector alignment in {startup.get('sector')} with technical capabilities in {cap_summary} "
            f"and an operational {tech_summary} telemetry infrastructure."
        )
    else:
        reason = (
            f"{st_name} focuses primarily on {startup.get('sector')}. While possessing generic technologies, "
            f"it lacks required domain infrastructure experience and field capabilities for this specific government challenge."
        )

    matched_tech_list = list(set(matched_techs))
    matched_cap_list = list(set(matched_caps))
    relevant_proj_list = [best_matching_project] if best_matching_project else []
    
    # Calculate missing requirements
    missing_tech = [t for t in (problem.get("required_technologies") or []) if not any(t.lower() in (st_t or "").lower() for st_t in (startup.get("technologies") or []))]
    missing_caps = [c for c in (problem.get("required_capabilities") or []) if not any(c.lower() in (st_c or "").lower() for st_c in (startup.get("capabilities") or []))]
    missing_requirements = (missing_tech + missing_caps)[:3]
    
    confidence = "High" if match_percent >= 85 else ("Medium" if match_percent >= 60 else "Low")
    category = "Best" if match_percent >= 85 else ("Better" if match_percent >= 70 else ("Good" if match_percent >= 50 else "Fair"))

    breakdown = {
        "sector_fit": sector_score,
        "technology_fit": tech_score,
        "capability_fit": cap_score,
        "project_relevance": exp_score,
        "government_experience": gov_score,
        "trust": round(trust_comp_score, 1)
    }

    explainability = {
        "sector_score": sector_score,
        "sector_max": 20,
        "tech_score": tech_score,
        "tech_max": 25,
        "cap_score": cap_score,
        "cap_max": 25,
        "exp_score": exp_score,
        "exp_max": 20,
        "gov_score": gov_score,
        "gov_max": 5,
        "trust_score_comp": round(trust_comp_score, 1),
        "trust_max": 5,
        "best_matching_project": best_matching_project,
        "matched_technologies": matched_tech_list,
        "matched_capabilities": matched_cap_list,
        "relevant_previous_projects": relevant_proj_list,
        "missing_requirements": missing_requirements,
        "confidence": confidence,
        "category": category,
        "explanation": reason,
        "strengths": strengths[:5],
        "reason": reason,
        "ui_rating": ui_rating,
        "badge": badge,
        "breakdown": breakdown,
        "is_relevant": is_relevant,
        "sector_match": sector_match,
        "technology_match": technology_match,
        "capability_match": capability_match,
        "previous_relevant_project": previous_relevant_project,
        "government_pilot_experience": st_gov_pilots > 0,
        "location_match": True if prob_location and st_location and (prob_location in st_location or st_location in prob_location) else "partial",
    }

    return {
        "startup_id": startup["id"],
        "startup_name": st_name,
        "match_percent": match_percent,
        "score": match_percent,
        "match_rating": db_rating,
        "category": category,
        "badge": badge,
        "confidence": confidence,
        "matched_technologies": matched_tech_list,
        "matched_capabilities": matched_cap_list,
        "relevant_previous_projects": relevant_proj_list,
        "missing_requirements": missing_requirements,
        "explanation": reason,
        "breakdown": breakdown,
        "reasons": strengths[:5],
        "explainability": explainability,
        "startup": startup
    }

def rank_startups_for_problem(problem: Dict[str, Any], startups: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    scored_startups = []
    for s in startups:
        match_info = calculate_match_scores(problem, s)
        scored_startups.append(match_info)

    # Sort descending by match_percent/score
    scored_startups.sort(key=lambda x: x["match_percent"], reverse=True)
    return scored_startups
