-- Users
INSERT INTO users (id, email, role, created_at) VALUES 
('a1111111-1111-1111-1111-111111111111', 'rajesh.kumar@waterresources.gov.in', 'government_officer', NOW()),
('a2222222-2222-2222-2222-222222222222', 'priya.sharma@smartcitypune.gov.in', 'government_officer', NOW()),
('a3333333-3333-3333-3333-333333333333', 'arjun.mehta@waterresources.gov.in', 'government_officer', NOW()),
('b1111111-1111-1111-1111-111111111111', 'anika@aquasense.ai', 'startup', NOW()),
('b2222222-2222-2222-2222-222222222222', 'contact@hydrotech.in', 'startup', NOW()),
('b3333333-3333-3333-3333-333333333333', 'info@watervision.in', 'startup', NOW());

-- Government Departments
INSERT INTO government_departments (id, name, sector, location, head_name) VALUES
('d1111111-1111-1111-1111-111111111111', 'Water Resources Dept', 'Water Management', 'Nagpur', 'Director WRD'),
('d2222222-2222-2222-2222-222222222222', 'Smart City Pune', 'Urban Development', 'Pune', 'CEO Smart City Pune');

-- Government Officers
INSERT INTO government_officers (id, user_id, department_id, name, designation, official_email, verification_status) VALUES
('o1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Rajesh Kumar', 'Joint Commissioner', 'rajesh.kumar@waterresources.gov.in', 'verified'),
('o2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'Priya Sharma', 'Chief Innovation Officer', 'priya.sharma@smartcitypune.gov.in', 'verified'),
('o3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'd1111111-1111-1111-1111-111111111111', 'Arjun Mehta', 'Field Inspector', 'arjun.mehta@waterresources.gov.in', 'verified');

-- Startups
INSERT INTO startups (id, user_id, name, founder_name, email, sector, technologies, capabilities, gst_number, dpiit_recognition_number, verification_status, pilot_success_rate, previous_projects, government_pilots, trust_score) VALUES
('s1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'AquaSense AI', 'Dr. Anika Patel', 'anika@aquasense.ai', 'Water Tech', '{"AI","IoT","Computer Vision"}', '{"Leak Detection","Sensor Networks","Real-time Analytics"}', '27AABCA1234B1ZE', 'DIPP12345', 'verified', 92.0, 3, 2, 92),
('s2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'HydroTech Solutions', 'Vikram Singh', 'contact@hydrotech.in', 'Water Tech', '{"IoT","Data Analytics"}', '{"Smart Meters"}', '27AABCA1234B1ZZ', 'DIPP12346', 'verified', 85.0, 2, 1, 80),
('s3333333-3333-3333-3333-333333333333', 'b3333333-3333-3333-3333-333333333333', 'WaterVision India', 'Neha Gupta', 'info@watervision.in', 'Water Tech', '{"Computer Vision"}', '{"Pipeline Inspection"}', '27AABCA1234B1ZY', 'DIPP12347', 'verified', 75.0, 1, 0, 70);

-- Problem
INSERT INTO problems (id, department_id, officer_id, title, description, ai_structured, sector, budget_min, budget_max, pilot_duration_days, expected_outcome, kpis, status, created_at) VALUES
('p1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', 'AI-Based Water Leakage Detection System', 'Looking for an automated system to detect water leaks in urban pipelines to reduce non-revenue water loss.', '{"sector":"Water Management", "technology":"AI + IoT", "required_capability":"Leak Detection", "expected_outcome":"20% reduction in water loss", "suggested_kpi":"Leak detection accuracy >= 90%", "suggested_pilot_duration":"90 days"}', 'Water Management', 800000, 1200000, 90, 'Reduce water loss by 20%', '{"Water loss reduction","Detection accuracy","Detection time"}', 'matched', NOW());

-- Applications
INSERT INTO applications (id, problem_id, startup_id, status) VALUES
('app11111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'selected');

-- Evaluations
INSERT INTO evaluations (application_id, officer_id, technical_fit, feasibility, cost_effectiveness, team_capability, expected_impact, scalability, decision) VALUES
('app11111-1111-1111-1111-111111111111', 'o1111111-1111-1111-1111-111111111111', 9, 9, 8, 9, 9, 8, 'select');

-- Pilots
INSERT INTO pilots (id, problem_id, application_id, startup_id, department_id, pilot_number, duration_days, budget_allocated, budget_released, budget_utilized, success_criteria, status, progress_percent, start_date) VALUES
('plt11111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'app11111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'PILOT-001', 90, 1000000, 800000, 740000, '{"water_loss_reduction": 20, "detection_accuracy": 90, "detection_time_hours": 12}', 'active', 82.0, '2026-06-01');

-- Milestones
INSERT INTO milestones (id, pilot_id, title, status, sequence_order) VALUES
('m1111111-1111-1111-1111-111111111111', 'plt11111-1111-1111-1111-111111111111', 'Equipment Procurement', 'inspector_verified', 1),
('m2222222-2222-2222-2222-222222222222', 'plt11111-1111-1111-1111-111111111111', 'Site Survey & Installation', 'inspector_verified', 2),
('m3333333-3333-3333-3333-333333333333', 'plt11111-1111-1111-1111-111111111111', 'Initial Testing', 'inspector_verified', 3),
('m4444444-4444-4444-4444-444444444444', 'plt11111-1111-1111-1111-111111111111', 'Field Deployment', 'inspector_verified', 4),
('m5555555-5555-5555-5555-555555555555', 'plt11111-1111-1111-1111-111111111111', 'Data Collection & Analysis', 'inspector_verified', 5),
('m6666666-6666-6666-6666-666666666666', 'plt11111-1111-1111-1111-111111111111', 'Final Evaluation', 'pending', 6);

-- KPIs
INSERT INTO kpis (id, pilot_id, metric_name, baseline_value, target_value, current_value, unit, status) VALUES
('k1111111-1111-1111-1111-111111111111', 'plt11111-1111-1111-1111-111111111111', 'Water Loss Reduction', 30, 20, 18, 'percent', 'achieved'),
('k2222222-2222-2222-2222-222222222222', 'plt11111-1111-1111-1111-111111111111', 'Detection Accuracy', 0, 90, 94, 'percent', 'achieved'),
('k3333333-3333-3333-3333-333333333333', 'plt11111-1111-1111-1111-111111111111', 'Detection Time', 24, 12, 15, 'hours', 'at_risk');

-- Budget Transactions
INSERT INTO budget_transactions (pilot_id, transaction_type, amount, milestone_id) VALUES
('plt11111-1111-1111-1111-111111111111', 'allocated', 1000000, NULL),
('plt11111-1111-1111-1111-111111111111', 'released', 300000, 'm1111111-1111-1111-1111-111111111111'),
('plt11111-1111-1111-1111-111111111111', 'released', 250000, 'm2222222-2222-2222-2222-222222222222'),
('plt11111-1111-1111-1111-111111111111', 'released', 250000, 'm4444444-4444-4444-4444-444444444444');

-- Field Inspections
INSERT INTO field_inspections (id, pilot_id, milestone_id, inspector_id, status, notes, submitted_at) VALUES
('fi111111-1111-1111-1111-111111111111', 'plt11111-1111-1111-1111-111111111111', 'm4444444-4444-4444-4444-444444444444', 'a3333333-3333-3333-3333-333333333333', 'submitted', 'Field deployment completed successfully. Sensors installed at all planned nodes.', NOW());

-- Validated Solutions
INSERT INTO validated_solutions (id, pilot_id, startup_id, department_id, solution_name, validation_status) VALUES
('vs111111-1111-1111-1111-111111111111', 'plt11111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'AquaSense Smart Leakage Detection', 'government_verified');

-- Adoption Requests
INSERT INTO adoption_requests (id, validated_solution_id, requesting_department_id, requesting_officer_id, status) VALUES
('ar111111-1111-1111-1111-111111111111', 'vs111111-1111-1111-1111-111111111111', 'd2222222-2222-2222-2222-222222222222', 'o2222222-2222-2222-2222-222222222222', 'pending');

-- Notifications
INSERT INTO notifications (user_id, type, title, body) VALUES
('a1111111-1111-1111-1111-111111111111', 'milestone_update', 'Milestone 5 Completed', 'Data Collection & Analysis has been verified.'),
('b1111111-1111-1111-1111-111111111111', 'adoption_request', 'New Adoption Request', 'Smart City Pune has requested to adopt your solution.');
