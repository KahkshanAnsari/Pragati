import { api } from './api';
import { GovernmentProject, ProjectMilestone, ProjectUpdate } from '../types';

const STORAGE_KEY = 'pragati_government_projects_v1';

export const CANONICAL_PROJECTS: GovernmentProject[] = [
  {
    id: 'gp000001-1111-4111-8111-000000000001',
    project_number: 'PROJ-AGR-2026-001',
    project_name: 'AI-Based Crop Disease Detection Deployment',
    description:
      'Comprehensive statewide deployment of KrishiVision drone multi-spectral imaging and automated pest surveillance covering 2,500 hectares of farm land across Nashik and Baramati districts. Scaled following 100% successful pilot validation.',
    sector: 'Agriculture',
    pilot_id: '0a000003-1111-4111-8111-000000000003',
    validated_solution_id: '0b000002-1111-4111-8111-000000000002',
    procurement_case_id: '0c000002-1111-4111-8111-000000000002',
    startup_id: 'b0000004-1111-4111-8111-000000000004',
    department_id: 'd0000004-1111-4111-8111-000000000004',
    officer_id: 'e0000004-1111-4111-8111-000000000004',
    startup: {
      id: 'b0000004-1111-4111-8111-000000000004',
      user_id: 'u0000004-1111-4111-8111-000000000004',
      name: 'KrishiVision Technologies',
      founder_name: 'Rohit Patil',
      email: 'rohit@krishivision.in',
      phone: '+91 98220 11234',
      sector: 'Agriculture',
      technologies: ['Computer Vision', 'Drone Telemetry', 'Satellite Analytics'],
      capabilities: ['Pest Detection', 'Multi-Spectral Imaging', 'Crop Yield Analytics'],
      team_size: 14,
      experience_years: 5,
      gst_number: '27AAACK1234F1Z8',
      incorporation_number: 'U72900PN2021PTC198765',
      dpiit_recognition_number: 'DIPP-AGRI-8821',
      verification_status: 'verified',
      trust_score: 95,
      pilot_success_rate: 100,
      previous_projects: 4,
      government_pilots: 2,
      location: 'Pune, Maharashtra',
      created_at: '2024-01-10T00:00:00Z',
    },
    department: {
      id: 'd0000004-1111-4111-8111-000000000004',
      name: 'Department of Agriculture, Maharashtra',
      sector: 'Agriculture',
      location: 'Pune, Maharashtra',
      head_name: 'Dr. Anita Desai',
      created_at: '2024-01-01T00:00:00Z',
    },
    officer: {
      id: 'e0000004-1111-4111-8111-000000000004',
      user_id: 'u0000004-1111-4111-8111-000000000004',
      department_id: 'd0000004-1111-4111-8111-000000000004',
      name: 'Dr. Anita Desai',
      designation: 'Director of Agriculture',
      official_email: 'anita.desai@agri.maharashtra.gov.in',
      gov_id: 'GOV-MH-AGRI-001',
      verification_status: 'verified',
      created_at: '2024-01-01T00:00:00Z',
    },
    budget_allocated: 2600000,
    budget_utilized: 2480000,
    status: 'completed',
    progress_percent: 100.0,
    start_date: '2026-01-15',
    expected_end_date: '2026-07-15',
    actual_end_date: '2026-07-10',
    deployment_scope: 'Statewide Farm Clusters, Nashik & Baramati',
    deployment_target: 2500,
    deployment_current: 2500,
    deployment_unit: 'Hectares',
    kpi_achievement_percent: 96.0,
    government_evaluation: 4.9,
    officer_notes:
      'Full statewide agricultural deployment completed ahead of schedule. Drone telemetry and automated Marathi pest advisories successfully delivered to 1,500+ smallholder farmers with 96% satisfaction rate.',
    procurement_reference: 'DOA/MH/GEM/2026/0411',
    work_order_number: 'WO-DOA-2026-092',
    scale_up_status: 'scaled',
    milestones: [
      {
        id: 'pm000001-1111-4111-8111-000000000001',
        project_id: 'gp000001-1111-4111-8111-000000000001',
        title: 'Contract Execution & GeM Work Order Issuance',
        description:
          'Post-pilot procurement case approved under GFR Rule 149; formal work order issued to KrishiVision Technologies.',
        sequence_order: 1,
        due_date: '2026-01-20',
        status: 'completed',
        completed_date: '2026-01-18',
        government_notes: 'Approved by Director of Agriculture Dr. Anita Desai. Mobilization advance released.',
      },
      {
        id: 'pm000002-1111-4111-8111-000000000002',
        project_id: 'gp000001-1111-4111-8111-000000000001',
        title: 'Ground Calibration Stations & Base Station Setup',
        description: 'Installed 8 differential GPS ground calibration stations across Nashik and Baramati blocks.',
        sequence_order: 2,
        due_date: '2026-02-28',
        status: 'completed',
        completed_date: '2026-02-25',
        government_notes: 'Sub-divisional Agriculture Officer inspected and certified all 8 calibration bases.',
      },
      {
        id: 'pm000003-1111-4111-8111-000000000003',
        project_id: 'gp000001-1111-4111-8111-000000000001',
        title: 'Phase 1 Drone Scanning (1,200 Hectares)',
        description:
          'Continuous multispectral scanning across onion and soybean clusters with automated NDVI and stress index generation.',
        sequence_order: 3,
        due_date: '2026-04-15',
        status: 'completed',
        completed_date: '2026-04-12',
        government_notes: '1,200 hectares mapped. Early fungal blight outbreak caught 8 days before visual onset.',
      },
      {
        id: 'pm000004-1111-4111-8111-000000000004',
        project_id: 'gp000001-1111-4111-8111-000000000001',
        title: 'Full Area Scanning (2,500 Hectares) & WhatsApp Push',
        description:
          'All 2,500 hectares covered with automated vernacular Marathi audio advisories sent to registered farmers.',
        sequence_order: 4,
        due_date: '2026-06-15',
        status: 'completed',
        completed_date: '2026-06-10',
        government_notes: '98.2% advisory delivery rate confirmed through SMS/WhatsApp gateway logs.',
      },
      {
        id: 'pm000005-1111-4111-8111-000000000005',
        project_id: 'gp000001-1111-4111-8111-000000000001',
        title: 'Final Yield Verification & Project Sign-Off',
        description:
          'Comprehensive third-party yield evaluation, audit report sign-off, and final contract completion certificate.',
        sequence_order: 5,
        due_date: '2026-07-15',
        status: 'completed',
        completed_date: '2026-07-10',
        government_notes: 'Project declared 100% complete. Final settlement of Rs. 24.8 Lakhs authorized.',
      },
    ],
    updates: [
      {
        id: 'pu000001-1111-4111-8111-000000000001',
        project_id: 'gp000001-1111-4111-8111-000000000001',
        author_role: 'government_officer',
        author_name: 'Dr. Anita Desai, Director of Agriculture',
        update_text:
          'Final contract closure signed. Total budget spent: Rs. 24,80,000 against allocated Rs. 26,00,000 (saving Rs. 1,20,000 for state exchequer). Farm coverage reached 2,500 hectares with zero crop loss from monitored pest vectors.',
        update_type: 'general',
        created_at: '2026-07-10T14:30:00Z',
      },
      {
        id: 'pu000002-1111-4111-8111-000000000002',
        project_id: 'gp000001-1111-4111-8111-000000000001',
        author_role: 'startup',
        author_name: 'Rohit Patil, KrishiVision Technologies',
        update_text:
          'Deployment Milestone 5 verified by district committee. Handed over seasonal pest maps and drone flight telemetry logs to district agri department.',
        update_type: 'milestone',
        created_at: '2026-07-08T11:00:00Z',
      },
    ],
    kpis: [
      { metric_name: 'Farm Coverage Area', baseline_value: 0, target_value: 2500, current_value: 2500, unit: 'Hectares', status: 'achieved' },
      { metric_name: 'Pest Detection Precision', baseline_value: 65, target_value: 85, current_value: 92.4, unit: '%', status: 'achieved' },
      { metric_name: 'Farmer Advisory Delivery', baseline_value: 0, target_value: 90, current_value: 98.2, unit: '%', status: 'achieved' },
      { metric_name: 'Pest Crop Damage Reduction', baseline_value: 0, target_value: 30, current_value: 34.5, unit: '%', status: 'achieved' },
    ],
    created_at: '2026-01-15T09:00:00Z',
  },
  {
    id: 'gp000002-1111-4111-8111-000000000002',
    project_number: 'PROJ-WRD-2026-002',
    project_name: 'Smart Water Quality Monitoring Deployment (AquaSense)',
    description:
      'Comprehensive city-scale expansion of AquaSense AI hydro-acoustic leak telemetry and water quality IoT sensing across 25 municipal zones in Nagpur North and Central. Awarded post PILOT-001 (4.8/5 rating, 94% KPI) under government procurement guidelines.',
    sector: 'Water & Wastewater',
    pilot_id: '0a000001-1111-4111-8111-000000000001',
    validated_solution_id: '0b000001-1111-4111-8111-000000000001',
    procurement_case_id: '0c000001-1111-4111-8111-000000000001',
    startup_id: 'b0000001-1111-4111-8111-000000000001',
    department_id: 'd0000001-1111-4111-8111-000000000001',
    officer_id: 'e0000001-1111-4111-8111-000000000001',
    startup: {
      id: 'b0000001-1111-4111-8111-000000000001',
      user_id: 'u0000001-1111-4111-8111-000000000001',
      name: 'AquaSense Technologies',
      founder_name: 'Dr. Anika Patel',
      email: 'anika@aquasense.ai',
      phone: '+91 98201 44521',
      sector: 'Water & Wastewater',
      technologies: ['Acoustic Telemetry', 'IoT Pressure Grid', 'Wavelet AI'],
      capabilities: ['Subterranean Leak Pinpointing', 'Water Quality Telemetry', 'SCADA Integration'],
      team_size: 18,
      experience_years: 6,
      gst_number: '27AABCA1234B1ZE',
      incorporation_number: 'U74999MH2020PTC334190',
      dpiit_recognition_number: 'DIPP-WR-2023-091',
      verification_status: 'verified',
      trust_score: 98,
      pilot_success_rate: 96,
      previous_projects: 5,
      government_pilots: 3,
      location: 'Nagpur, Maharashtra',
      created_at: '2024-01-01T00:00:00Z',
    },
    department: {
      id: 'd0000001-1111-4111-8111-000000000001',
      name: 'Municipal Water & Sanitation Department',
      sector: 'Water & Wastewater',
      location: 'Nagpur, Maharashtra',
      head_name: 'Rajesh Kumar',
      created_at: '2024-01-01T00:00:00Z',
    },
    officer: {
      id: 'e0000001-1111-4111-8111-000000000001',
      user_id: 'u0000001-1111-4111-8111-000000000001',
      department_id: 'd0000001-1111-4111-8111-000000000001',
      name: 'Rajesh Kumar',
      designation: 'Joint Commissioner (Water Works)',
      official_email: 'rajesh.kumar@waterresources.gov.in',
      gov_id: 'GOV-MH-WRD-001',
      verification_status: 'verified',
      created_at: '2024-01-01T00:00:00Z',
    },
    budget_allocated: 1000000,
    budget_utilized: 720000,
    status: 'active',
    progress_percent: 70.0,
    start_date: '2026-08-01',
    expected_end_date: '2026-11-30',
    actual_end_date: null,
    deployment_scope: '25 Municipal Monitoring Locations, Nagpur Urban Water Grid',
    deployment_target: 25,
    deployment_current: 18,
    deployment_unit: 'Locations',
    kpi_achievement_percent: 92.5,
    government_evaluation: 4.8,
    officer_notes:
      'AquaSense has successfully deployed and commissioned 18 out of 25 municipal monitoring locations. Acoustic sensors operating with sub-8-meter leak pinpointing. Phase 4 installation across remaining 7 nodes scheduled for completion before 30 Nov 2026.',
    procurement_reference: 'WRD/NGP/GEM/2026/0188',
    work_order_number: 'WO-WRD-2026-044',
    scale_up_status: 'recommended',
    milestones: [
      {
        id: 'pm000006-1111-4111-8111-000000000006',
        project_id: 'gp000002-1111-4111-8111-000000000002',
        title: 'Procurement Agreement & Initial Fund Release',
        description:
          'Government contract executed post-pilot validation; initial mobilization tranche of Rs. 4,00,000 released.',
        sequence_order: 1,
        due_date: '2026-08-10',
        status: 'completed',
        completed_date: '2026-08-08',
        government_notes: 'Executed by Rajesh Kumar, Joint Commissioner. Compliance with GFR Rule 149 confirmed.',
      },
      {
        id: 'pm000007-1111-4111-8111-000000000007',
        project_id: 'gp000002-1111-4111-8111-000000000002',
        title: 'Phase 1 Hardware Rollout (Locations 1 to 8)',
        description:
          'Installed acoustic clamp sensors and pressure transmitters across first 8 high-priority municipal water distribution points.',
        sequence_order: 2,
        due_date: '2026-09-05',
        status: 'completed',
        completed_date: '2026-09-03',
        government_notes: 'Field inspected by WRD engineers. All 8 nodes streaming live telemetry to central command.',
      },
      {
        id: 'pm000008-1111-4111-8111-000000000008',
        project_id: 'gp000002-1111-4111-8111-000000000002',
        title: 'Phase 2 Expansion (Locations 9 to 18)',
        description:
          'Expanded deployment to secondary feeder mains. 18 of 25 locations now operational with automated anomaly detection.',
        sequence_order: 3,
        due_date: '2026-10-10',
        status: 'completed',
        completed_date: '2026-10-05',
        government_notes: 'Milestone 3 verified. 18 operational nodes achieved. Budget utilized: Rs. 7,20,000.',
      },
      {
        id: 'pm000009-1111-4111-8111-000000000009',
        project_id: 'gp000002-1111-4111-8111-000000000002',
        title: 'Phase 3 Final Node Installation (Locations 19 to 25)',
        description:
          'Mounting acoustic loggers at the final 7 distribution branches and testing SCADA multi-ward failover.',
        sequence_order: 4,
        due_date: '2026-11-15',
        status: 'in_progress',
        completed_date: null,
        government_notes: 'Installation commenced at nodes 19-21 in Sitabuldi ward. On track for mid-November completion.',
      },
      {
        id: 'pm000010-1111-4111-8111-000000000010',
        project_id: 'gp000002-1111-4111-8111-000000000002',
        title: 'Integrated Verification & City-Scale Commissioning',
        description:
          'Final 30-day continuous stress run, CPCB water quality compliance certification, and handover to municipal operations.',
        sequence_order: 5,
        due_date: '2026-11-30',
        status: 'pending',
        completed_date: null,
        government_notes: 'Target completion date: 30 Nov 2026.',
      },
    ],
    updates: [
      {
        id: 'pu000003-1111-4111-8111-000000000003',
        project_id: 'gp000002-1111-4111-8111-000000000002',
        author_role: 'government_officer',
        author_name: 'Rajesh Kumar, Joint Commissioner',
        update_text:
          'Milestone 3 verified. 18 of 25 monitoring locations are now fully operational. Pressure telemetry and acoustic sensors are active. Budget utilized stands at Rs. 7,20,000 of Rs. 10,00,000. Project progress is at 70% with expected completion on 30 Nov 2026.',
        update_type: 'progress',
        created_at: '2026-10-06T09:30:00Z',
      },
      {
        id: 'pu000004-1111-4111-8111-000000000004',
        project_id: 'gp000002-1111-4111-8111-000000000002',
        author_role: 'startup',
        author_name: 'Dr. Anika Patel, AquaSense Technologies',
        update_text:
          'Completed acoustic profiling for nodes 15 through 18. Detected minor flange weeping at Dharampeth reservoir feeder and notified maintenance engineers within 12 minutes.',
        update_type: 'field_visit',
        created_at: '2026-10-04T16:15:00Z',
      },
      {
        id: 'pu000005-1111-4111-8111-000000000005',
        project_id: 'gp000002-1111-4111-8111-000000000002',
        author_role: 'government_officer',
        author_name: 'Rajesh Kumar, Joint Commissioner',
        update_text:
          'Conducted random field inspection at Zone 4 monitoring node. Water quality sensors (pH, turbidity, residual chlorine) cross-calibrated with laboratory titrations; variance < 1.2%.',
        update_type: 'field_visit',
        created_at: '2026-09-22T14:00:00Z',
      },
    ],
    kpis: [
      { metric_name: 'Deployment Locations Live', baseline_value: 0, target_value: 25, current_value: 18, unit: 'Locations', status: 'on_track' },
      { metric_name: 'Non-Revenue Water Loss', baseline_value: 32, target_value: 20, current_value: 18.2, unit: '%', status: 'achieved' },
      { metric_name: 'Automated Anomaly Precision', baseline_value: 0, target_value: 90, current_value: 94.6, unit: '%', status: 'achieved' },
      { metric_name: 'Alert Escalation Time', baseline_value: 240, target_value: 30, current_value: 14, unit: 'Minutes', status: 'achieved' },
    ],
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'gp000003-1111-4111-8111-000000000003',
    project_number: 'PROJ-MNRE-2026-003',
    project_name: 'Smart Energy Monitoring Deployment',
    description:
      'Phase 1 adoption of CleanGrid MicroBalancer intelligent solar feeder telemetry and predictive inverter health analytics across 20 state-run renewable power substations. Currently deployed across 6 initial pilot sites.',
    sector: 'Clean Energy',
    pilot_id: '0a000004-1111-4111-8111-000000000004',
    validated_solution_id: '0b000003-1111-4111-8111-000000000003',
    procurement_case_id: '0c000003-1111-4111-8111-000000000003',
    startup_id: 'b0000005-1111-4111-8111-000000000005',
    department_id: 'd0000006-1111-4111-8111-000000000006',
    officer_id: 'e0000006-1111-4111-8111-000000000006',
    startup: {
      id: 'b0000005-1111-4111-8111-000000000005',
      user_id: 'u0000005-1111-4111-8111-000000000005',
      name: 'CleanGrid Dynamics',
      founder_name: 'Aditya Verma',
      email: 'aditya@cleangrid.in',
      phone: '+91 97110 55678',
      sector: 'Clean Energy',
      technologies: ['Solar Telemetry', 'SCADA Inverters', 'Predictive Physics AI'],
      capabilities: ['Inverter Failure Prediction', 'Feeder Harmonics Analysis', 'Grid Telemetry'],
      team_size: 11,
      experience_years: 4,
      gst_number: '07AAACG1234D1Z2',
      incorporation_number: 'U40106DL2021PTC384501',
      dpiit_recognition_number: 'DIPP-SOLAR-3391',
      verification_status: 'verified',
      trust_score: 91,
      pilot_success_rate: 88,
      previous_projects: 3,
      government_pilots: 2,
      location: 'New Delhi, Delhi',
      created_at: '2024-01-01T00:00:00Z',
    },
    department: {
      id: 'd0000006-1111-4111-8111-000000000006',
      name: 'Ministry of New and Renewable Energy (MNRE)',
      sector: 'Clean Energy',
      location: 'New Delhi, Delhi',
      head_name: 'Sanjay Patil',
      created_at: '2024-01-01T00:00:00Z',
    },
    officer: {
      id: 'e0000006-1111-4111-8111-000000000006',
      user_id: 'u0000006-1111-4111-8111-000000000006',
      department_id: 'd0000006-1111-4111-8111-000000000006',
      name: 'Sanjay Patil',
      designation: 'Director (Solar Energy)',
      official_email: 'sanjay.patil@mnre.gov.in',
      gov_id: 'GOV-MNRE-DIR-002',
      verification_status: 'verified',
      created_at: '2024-01-01T00:00:00Z',
    },
    budget_allocated: 1200000,
    budget_utilized: 310000,
    status: 'active',
    progress_percent: 30.0,
    start_date: '2026-09-01',
    expected_end_date: '2027-02-28',
    actual_end_date: null,
    deployment_scope: '20 Renewable Power Substations, Charanka Solar Corridor',
    deployment_target: 20,
    deployment_current: 6,
    deployment_unit: 'Substations',
    kpi_achievement_percent: 84.0,
    government_evaluation: 4.5,
    officer_notes:
      'Phase 1 hardware deployment complete across 6 of 20 planned solar feeder sites. High-frequency 1Hz SCADA telemetry streaming reliably to MNRE national control portal. Budget utilized: Rs. 3,10,000 of Rs. 12,00,000.',
    procurement_reference: 'MNRE/SOLAR/2026/0772',
    work_order_number: 'WO-MNRE-2026-019',
    scale_up_status: 'not_ready',
    milestones: [
      {
        id: 'pm000011-1111-4111-8111-000000000011',
        project_id: 'gp000003-1111-4111-8111-000000000003',
        title: 'Work Order Executed & Hardware Staging',
        description:
          'Procurement case approved by MNRE. Contract signed and initial 20 IoT gateway modules calibrated in lab.',
        sequence_order: 1,
        due_date: '2026-09-10',
        status: 'completed',
        completed_date: '2026-09-08',
        government_notes: 'Signed by Director Sanjay Patil. Tranche 1 funds released.',
      },
      {
        id: 'pm000012-1111-4111-8111-000000000012',
        project_id: 'gp000003-1111-4111-8111-000000000003',
        title: 'Phase 1 Site Deployment (6 Substations)',
        description:
          'Completed sensor installation and SCADA interface integration across first 6 renewable power substations.',
        sequence_order: 2,
        due_date: '2026-10-15',
        status: 'completed',
        completed_date: '2026-10-12',
        government_notes: '6 of 20 substations online. Current progress at 30% with Rs. 3,10,000 utilized.',
      },
      {
        id: 'pm000013-1111-4111-8111-000000000013',
        project_id: 'gp000003-1111-4111-8111-000000000003',
        title: 'Phase 2 Rollout (Substations 7 to 14)',
        description:
          'Deploying telemetry gateways across 8 additional solar power feeders in Rajasthan and Gujarat corridor.',
        sequence_order: 3,
        due_date: '2026-12-15',
        status: 'in_progress',
        completed_date: null,
        government_notes: 'Site surveys underway for sites 7 to 10.',
      },
      {
        id: 'pm000014-1111-4111-8111-000000000014',
        project_id: 'gp000003-1111-4111-8111-000000000003',
        title: 'Phase 3 Final Substation Cluster (Substations 15 to 20)',
        description: 'Final 6 substations integration with unified grid stability analytics.',
        sequence_order: 4,
        due_date: '2027-01-31',
        status: 'pending',
        completed_date: null,
        government_notes: null,
      },
      {
        id: 'pm000015-1111-4111-8111-000000000015',
        project_id: 'gp000003-1111-4111-8111-000000000003',
        title: 'Comprehensive Grid Telemetry Verification & Closure',
        description: 'Final validation of inverter fault prediction accuracy and project sign-off.',
        sequence_order: 5,
        due_date: '2027-02-28',
        status: 'pending',
        completed_date: null,
        government_notes: null,
      },
    ],
    updates: [
      {
        id: 'pu000006-1111-4111-8111-000000000006',
        project_id: 'gp000003-1111-4111-8111-000000000003',
        author_role: 'government_officer',
        author_name: 'Sanjay Patil, Director (MNRE)',
        update_text:
          'Milestone 2 completed. 6 of 20 substations online. SCADA telemetry verified with 99.8% uptime. Total budget utilized: Rs. 3,10,000. Project progress: 30%.',
        update_type: 'progress',
        created_at: '2026-10-12T10:00:00Z',
      },
      {
        id: 'pu000007-1111-4111-8111-000000000007',
        project_id: 'gp000003-1111-4111-8111-000000000003',
        author_role: 'startup',
        author_name: 'Aditya Verma, CleanGrid Dynamics',
        update_text:
          'Commissioned inverters at Site 5 and Site 6. Automated harmonic distortion filter deployed.',
        update_type: 'milestone',
        created_at: '2026-10-10T12:00:00Z',
      },
    ],
    kpis: [
      { metric_name: 'Substations Integrated', baseline_value: 0, target_value: 20, current_value: 6, unit: 'Sites', status: 'on_track' },
      { metric_name: 'Predictive Failure Advance Warning', baseline_value: 0, target_value: 48, current_value: 52, unit: 'Hours', status: 'achieved' },
      { metric_name: 'Unscheduled Downtime Reduction', baseline_value: 0, target_value: 25, current_value: 21.5, unit: '%', status: 'on_track' },
      { metric_name: 'Telemetry Gateway Uptime', baseline_value: 0, target_value: 99, current_value: 99.8, unit: '%', status: 'achieved' },
    ],
    created_at: '2026-09-01T11:00:00Z',
  },
];

export function getCachedProjects(): GovernmentProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CANONICAL_PROJECTS));
      return CANONICAL_PROJECTS;
    }
    const parsed: GovernmentProject[] = JSON.parse(raw);
    const list = Array.isArray(parsed) ? [...parsed] : [];
    // Ensure all 3 canonical projects exist
    for (const def of CANONICAL_PROJECTS) {
      if (!list.some((p) => p.id === def.id)) {
        list.push(def);
      }
    }
    return list;
  } catch (err) {
    console.error('Error reading projects cache:', err);
    return CANONICAL_PROJECTS;
  }
}

export function saveCachedProjects(projects: GovernmentProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Error saving projects cache:', err);
  }
}

export async function getAllProjects(): Promise<GovernmentProject[]> {
  try {
    const resp = await api.get('/api/projects');
    const apiData = resp?.data?.data || resp?.data;
    if (Array.isArray(apiData) && apiData.length > 0) {
      // Merge with any local user modifications
      const cached = getCachedProjects();
      const cachedMap = new Map(cached.map((p) => [p.id, p]));
      const merged = apiData.map((ap: GovernmentProject) => {
        const cp = cachedMap.get(ap.id);
        if (cp && cp.updated_at && (!ap.updated_at || new Date(cp.updated_at) > new Date(ap.updated_at))) {
          return { ...ap, ...cp };
        }
        return ap;
      });
      saveCachedProjects(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Could not fetch from /api/projects, using local store:', err);
  }
  return getCachedProjects();
}

export async function getProjectById(id: string): Promise<GovernmentProject | null> {
  try {
    const resp = await api.get(`/api/projects/${id}`);
    const data = resp?.data?.data || resp?.data;
    if (data && data.id) {
      return data;
    }
  } catch (err) {
    console.warn(`Could not fetch /api/projects/${id}, using local store:`, err);
  }
  const all = getCachedProjects();
  return all.find((p) => p.id === id) || null;
}

export async function getProjectsForStartup(startupId?: string): Promise<GovernmentProject[]> {
  const all = await getAllProjects();
  if (!startupId) return all;
  return all.filter((p) => p.startup_id === startupId);
}

export async function getProjectsForDepartment(departmentId?: string): Promise<GovernmentProject[]> {
  const all = await getAllProjects();
  if (!departmentId) return all;
  return all.filter((p) => p.department_id === departmentId);
}

export async function updateProject(id: string, partial: Partial<GovernmentProject>): Promise<GovernmentProject> {
  const nowIso = new Date().toISOString();
  try {
    await api.patch(`/api/projects/${id}`, { ...partial, updated_at: nowIso });
  } catch (err) {
    console.warn('API update failed, saving locally:', err);
  }
  const all = getCachedProjects();
  const index = all.findIndex((p) => p.id === id);
  if (index !== -1) {
    all[index] = { ...all[index], ...partial, updated_at: nowIso };
    saveCachedProjects(all);
    return all[index];
  }
  throw new Error('Project not found');
}

export async function updateMilestoneStatus(
  projectId: string,
  milestoneId: string,
  status: 'pending' | 'in_progress' | 'completed' | 'delayed',
  governmentNotes?: string
): Promise<ProjectMilestone> {
  const nowIso = new Date().toISOString().split('T')[0];
  const payload: Record<string, any> = { status };
  if (status === 'completed') payload.completed_date = nowIso;
  if (governmentNotes) payload.government_notes = governmentNotes;

  try {
    await api.patch(`/api/projects/${projectId}/milestones/${milestoneId}`, payload);
  } catch (err) {
    console.warn('API milestone update failed, updating locally:', err);
  }

  const all = getCachedProjects();
  const proj = all.find((p) => p.id === projectId);
  if (!proj) throw new Error('Project not found');

  const ms = proj.milestones?.find((m) => m.id === milestoneId);
  if (!ms) throw new Error('Milestone not found');

  ms.status = status;
  if (status === 'completed') ms.completed_date = nowIso;
  if (governmentNotes) ms.government_notes = governmentNotes;

  // Recompute progress percent
  const total = proj.milestones?.length || 0;
  const completed = proj.milestones?.filter((m) => m.status === 'completed').length || 0;
  if (total > 0) {
    proj.progress_percent = Math.round((completed / total) * 100);
    if (proj.progress_percent >= 100) proj.status = 'completed';
  }
  proj.updated_at = new Date().toISOString();

  saveCachedProjects(all);
  return ms;
}

export async function addProjectUpdate(
  projectId: string,
  update: {
    authorRole: 'government_officer' | 'startup' | 'admin';
    authorName: string;
    updateText: string;
    updateType: 'progress' | 'issue' | 'milestone' | 'budget' | 'field_visit' | 'kpi_update' | 'general';
  }
): Promise<ProjectUpdate> {
  const newUpdate: ProjectUpdate = {
    id: `pu-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    project_id: projectId,
    author_role: update.authorRole,
    author_name: update.authorName,
    update_text: update.updateText,
    update_type: update.updateType,
    created_at: new Date().toISOString(),
  };

  try {
    await api.post(`/api/projects/${projectId}/updates`, newUpdate);
  } catch (err) {
    console.warn('API add update failed, saving locally:', err);
  }

  const all = getCachedProjects();
  const proj = all.find((p) => p.id === projectId);
  if (proj) {
    if (!proj.updates) proj.updates = [];
    proj.updates.unshift(newUpdate);
    proj.updated_at = new Date().toISOString();
    saveCachedProjects(all);
  }

  return newUpdate;
}
