-- ============================================================
-- PRAGATI PLATFORM - COMPLETE DATABASE SETUP
-- Paste this entire file into Supabase SQL Editor and Run
-- Dashboard: https://supabase.com/dashboard/project/tkmcpckbvagyplolrjsz/sql
-- ============================================================

-- ============================================================
-- FILE: 001_initial_schema.sql
-- ============================================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('government_officer', 'startup', 'admin');
CREATE TYPE verification_status_gov AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE verification_status_startup AS ENUM ('draft', 'pending', 'verified');
CREATE TYPE problem_status AS ENUM ('draft', 'published', 'matched', 'pilot_active', 'completed');
CREATE TYPE match_rating AS ENUM ('BEST', 'GOOD', 'FAIR');
CREATE TYPE application_status AS ENUM ('submitted', 'shortlisted', 'selected', 'rejected');
CREATE TYPE evaluation_decision AS ENUM ('shortlist', 'reject', 'select');
CREATE TYPE pilot_status AS ENUM ('draft', 'active', 'paused', 'completed', 'terminated');
CREATE TYPE milestone_status AS ENUM ('pending', 'startup_claimed', 'inspector_verified', 'rejected');
CREATE TYPE kpi_status AS ENUM ('on_track', 'at_risk', 'achieved', 'missed');
CREATE TYPE budget_transaction_type AS ENUM ('allocated', 'released', 'utilized');
CREATE TYPE field_inspection_status AS ENUM ('scheduled', 'in_progress', 'submitted');
CREATE TYPE issue_category AS ENUM ('fund_misuse', 'false_reporting', 'work_not_completed', 'poor_quality', 'safety_violation', 'document_discrepancy', 'unauthorized_activity', 'other');
CREATE TYPE issue_status AS ENUM ('reported', 'under_investigation', 'resolved');
CREATE TYPE investigation_status AS ENUM ('open', 'in_progress', 'closed');
CREATE TYPE investigation_decision AS ENUM ('warning', 'suspension', 'recovery', 'blacklisting');
CREATE TYPE procurement_readiness_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE procurement_status AS ENUM ('draft', 'ready', 'submitted', 'approved');
CREATE TYPE validation_status AS ENUM ('pilot_completed', 'government_verified', 'scaled');
CREATE TYPE adoption_request_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- Tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE government_departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sector TEXT,
    location TEXT,
    head_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE government_officers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    department_id UUID REFERENCES government_departments(id),
    name TEXT NOT NULL,
    designation TEXT,
    official_email TEXT UNIQUE NOT NULL,
    gov_id TEXT,
    verification_status verification_status_gov DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE startups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    founder_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    sector TEXT,
    technologies TEXT[],
    capabilities TEXT[],
    team_size INT,
    experience_years INT,
    gst_number TEXT,
    incorporation_number TEXT,
    dpiit_recognition_number TEXT,
    verification_status verification_status_startup DEFAULT 'draft',
    trust_score INT DEFAULT 0,
    pilot_success_rate DECIMAL,
    previous_projects INT DEFAULT 0,
    government_pilots INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE startup_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES government_departments(id),
    officer_id UUID REFERENCES government_officers(id),
    title TEXT NOT NULL,
    description TEXT,
    ai_structured JSONB,
    sector TEXT,
    location TEXT,
    required_capabilities TEXT[],
    required_technologies TEXT[],
    budget_min BIGINT,
    budget_max BIGINT,
    timeline_days INT,
    pilot_duration_days INT,
    expected_outcome TEXT,
    kpis TEXT[],
    eligibility_requirements TEXT,
    status problem_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE startup_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    match_percent DECIMAL,
    match_rating match_rating,
    explainability JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id) ON DELETE CASCADE,
    startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
    solution TEXT,
    proposed_approach TEXT,
    implementation_plan TEXT,
    cost_proposed BIGINT,
    team_details JSONB,
    previous_work TEXT,
    expected_outcome TEXT,
    status application_status DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    officer_id UUID REFERENCES government_officers(id),
    technical_fit INT CHECK(technical_fit >= 0 AND technical_fit <= 10),
    feasibility INT CHECK(feasibility >= 0 AND feasibility <= 10),
    cost_effectiveness INT CHECK(cost_effectiveness >= 0 AND cost_effectiveness <= 10),
    team_capability INT CHECK(team_capability >= 0 AND team_capability <= 10),
    expected_impact INT CHECK(expected_impact >= 0 AND expected_impact <= 10),
    scalability INT CHECK(scalability >= 0 AND scalability <= 10),
    total_score DECIMAL GENERATED ALWAYS AS ((technical_fit + feasibility + cost_effectiveness + team_capability + expected_impact + scalability) / 6.0) STORED,
    decision evaluation_decision,
    notes TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pilots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES problems(id),
    application_id UUID REFERENCES applications(id),
    startup_id UUID REFERENCES startups(id),
    department_id UUID REFERENCES government_departments(id),
    pilot_number VARCHAR UNIQUE,
    duration_days INT,
    budget_allocated BIGINT,
    budget_released BIGINT DEFAULT 0,
    budget_utilized BIGINT DEFAULT 0,
    target_outcome TEXT,
    success_criteria JSONB NOT NULL,
    status pilot_status DEFAULT 'draft',
    progress_percent DECIMAL DEFAULT 0,
    overall_score DECIMAL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    title TEXT,
    description TEXT,
    due_date DATE,
    status milestone_status DEFAULT 'pending',
    startup_evidence_url TEXT,
    startup_claimed_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    sequence_order INT
);

CREATE TABLE kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    metric_name TEXT,
    baseline_value DECIMAL,
    target_value DECIMAL,
    current_value DECIMAL,
    unit TEXT,
    measurement_method TEXT,
    status kpi_status
);

CREATE TABLE kpi_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES users(id),
    current_value DECIMAL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

CREATE TABLE budget_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    transaction_type budget_transaction_type,
    amount BIGINT,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    recorded_by UUID REFERENCES users(id),
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    risk_flagged BOOLEAN DEFAULT FALSE,
    risk_reason TEXT
);

CREATE TABLE field_inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    inspector_id UUID REFERENCES users(id),
    scheduled_date DATE,
    inspection_date TIMESTAMPTZ,
    location TEXT,
    notes TEXT,
    status field_inspection_status DEFAULT 'scheduled',
    verified_completion_percent DECIMAL,
    submitted_at TIMESTAMPTZ
);

CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    inspection_id UUID REFERENCES field_inspections(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES users(id),
    file_url TEXT,
    file_type TEXT,
    description TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE issue_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    inspection_id UUID REFERENCES field_inspections(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES users(id),
    category issue_category,
    description TEXT,
    evidence_urls TEXT[],
    location TEXT,
    report_date DATE,
    status issue_status DEFAULT 'reported'
);

CREATE TABLE investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_report_id UUID REFERENCES issue_reports(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    status investigation_status DEFAULT 'open',
    findings TEXT,
    decision investigation_decision,
    decided_by UUID REFERENCES users(id),
    decision_reference TEXT,
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE procurement_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
    readiness_score DECIMAL,
    readiness_level procurement_readiness_level,
    checklist JSONB,
    report_url TEXT,
    ai_analysis TEXT,
    status procurement_status DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE validated_solutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID REFERENCES pilots(id),
    startup_id UUID REFERENCES startups(id),
    department_id UUID REFERENCES government_departments(id),
    solution_name TEXT,
    sector TEXT,
    technologies TEXT[],
    problem_description TEXT,
    kpi_achievement_percent DECIMAL,
    deployment_location TEXT,
    validation_status validation_status,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE adoption_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    validated_solution_id UUID REFERENCES validated_solutions(id) ON DELETE CASCADE,
    requesting_department_id UUID REFERENCES government_departments(id),
    requesting_officer_id UUID REFERENCES government_officers(id),
    status adoption_request_status DEFAULT 'pending',
    context_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT,
    title TEXT,
    body TEXT,
    read BOOLEAN DEFAULT FALSE,
    reference_id UUID,
    reference_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_role TEXT,
    action TEXT,
    entity_type TEXT,
    entity_id UUID,
    previous_value JSONB,
    new_value JSONB,
    evidence_refs TEXT[],
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- FILE: 002_rls_policies.sql
-- ============================================================
-- Helper function to get current user role
CREATE OR REPLACE FUNCTION current_user_role() RETURNS TEXT AS $$
  SELECT role::TEXT FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE procurement_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE validated_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ADMIN POLICIES (All access)
CREATE POLICY admin_all ON users FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON government_departments FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON government_officers FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON startups FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON startup_documents FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON problems FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON startup_matches FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON applications FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON evaluations FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON pilots FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON milestones FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON kpis FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON kpi_updates FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON budget_transactions FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON field_inspections FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON evidence FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON issue_reports FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON investigations FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON procurement_cases FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON validated_solutions FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON adoption_requests FOR ALL USING (current_user_role() = 'admin');
CREATE POLICY admin_all ON notifications FOR ALL USING (current_user_role() = 'admin');

-- GOVERNMENT OFFICER POLICIES
CREATE POLICY gov_officer_self ON government_officers FOR ALL USING (user_id = auth.uid());
CREATE POLICY gov_officer_startups_select ON startups FOR SELECT USING (current_user_role() = 'government_officer');
CREATE POLICY gov_officer_startup_docs_select ON startup_documents FOR SELECT USING (current_user_role() = 'government_officer');
CREATE POLICY gov_officer_problems_all ON problems FOR ALL USING (department_id IN (SELECT department_id FROM government_officers WHERE user_id = auth.uid()));
CREATE POLICY gov_officer_pilots_all ON pilots FOR ALL USING (department_id IN (SELECT department_id FROM government_officers WHERE user_id = auth.uid()));
CREATE POLICY gov_officer_evaluations_insert ON evaluations FOR INSERT WITH CHECK (officer_id IN (SELECT id FROM government_officers WHERE user_id = auth.uid()));
CREATE POLICY gov_officer_field_inspections_insert ON field_inspections FOR INSERT WITH CHECK (inspector_id = auth.uid());
CREATE POLICY gov_officer_issue_reports_insert ON issue_reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY gov_officer_kpi_updates_insert ON kpi_updates FOR INSERT WITH CHECK (recorded_by = auth.uid());
CREATE POLICY gov_officer_evidence_insert ON evidence FOR INSERT WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY gov_officer_audit_logs_select ON audit_logs FOR SELECT USING (current_user_role() = 'government_officer'); -- simplified for demo

-- STARTUP POLICIES
CREATE POLICY startup_problems_select ON problems FOR SELECT USING (status = 'published');
CREATE POLICY startup_applications_select ON applications FOR SELECT USING (startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()));
CREATE POLICY startup_applications_insert ON applications FOR INSERT WITH CHECK (startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()));
CREATE POLICY startup_kpi_updates_select ON kpi_updates FOR SELECT USING (pilot_id IN (SELECT id FROM pilots WHERE startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid())));
CREATE POLICY startup_kpi_updates_insert ON kpi_updates FOR INSERT WITH CHECK (pilot_id IN (SELECT id FROM pilots WHERE startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()) AND status = 'active'));
CREATE POLICY startup_kpi_updates_update ON kpi_updates FOR UPDATE USING (pilot_id IN (SELECT id FROM pilots WHERE startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()) AND status = 'active'));
CREATE POLICY startup_evidence_select ON evidence FOR SELECT USING (pilot_id IN (SELECT id FROM pilots WHERE startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid())));
CREATE POLICY startup_evidence_insert ON evidence FOR INSERT WITH CHECK (pilot_id IN (SELECT id FROM pilots WHERE startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()) AND status = 'active'));
CREATE POLICY startup_evidence_update ON evidence FOR UPDATE USING (pilot_id IN (SELECT id FROM pilots WHERE startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()) AND status = 'active'));
CREATE POLICY startup_pilots_select ON pilots FOR SELECT USING (startup_id IN (SELECT id FROM startups WHERE user_id = auth.uid()));
CREATE POLICY startup_profile_update ON startups FOR UPDATE USING (user_id = auth.uid());

-- AUDIT LOGS (All authenticated users can INSERT, but NO UPDATE/DELETE)
CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
-- Update and delete are implicitly denied as there are no policies for them.


-- ============================================================
-- FILE: 003_triggers.sql
-- ============================================================
-- Immutability Trigger for pilots.success_criteria
CREATE OR REPLACE FUNCTION check_pilot_success_criteria_immutable()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status != 'draft' AND NEW.success_criteria IS DISTINCT FROM OLD.success_criteria THEN
        RAISE EXCEPTION 'Success criteria are immutable once a pilot is active';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_pilot_success_criteria_immutable
BEFORE UPDATE ON pilots
FOR EACH ROW
EXECUTE FUNCTION check_pilot_success_criteria_immutable();

-- Generic Audit Trigger Function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    v_actor_id UUID;
    v_actor_role TEXT;
BEGIN
    -- Try to get auth.uid() if available, otherwise null
    BEGIN
        v_actor_id := auth.uid();
        SELECT role::TEXT INTO v_actor_role FROM users WHERE id = v_actor_id;
    EXCEPTION WHEN OTHERS THEN
        v_actor_id := NULL;
        v_actor_role := 'system';
    END;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (actor_id, actor_role, action, entity_type, entity_id, previous_value, new_value)
        VALUES (v_actor_id, v_actor_role, 'INSERT', TG_TABLE_NAME, NEW.id, NULL, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (actor_id, actor_role, action, entity_type, entity_id, previous_value, new_value)
        VALUES (v_actor_id, v_actor_role, 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (actor_id, actor_role, action, entity_type, entity_id, previous_value, new_value)
        VALUES (v_actor_id, v_actor_role, 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD), NULL);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply Audit Triggers to required tables
CREATE TRIGGER audit_problems_trigger AFTER INSERT OR UPDATE OR DELETE ON problems FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_pilots_trigger AFTER INSERT OR UPDATE OR DELETE ON pilots FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_applications_trigger AFTER INSERT OR UPDATE OR DELETE ON applications FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_evaluations_trigger AFTER INSERT OR UPDATE OR DELETE ON evaluations FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_milestones_trigger AFTER INSERT OR UPDATE OR DELETE ON milestones FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_kpis_trigger AFTER INSERT OR UPDATE OR DELETE ON kpis FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_issue_reports_trigger AFTER INSERT OR UPDATE OR DELETE ON issue_reports FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_investigations_trigger AFTER INSERT OR UPDATE OR DELETE ON investigations FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_procurement_cases_trigger AFTER INSERT OR UPDATE OR DELETE ON procurement_cases FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_validated_solutions_trigger AFTER INSERT OR UPDATE OR DELETE ON validated_solutions FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();


-- ============================================================
-- FILE: seed.sql (Demo Data)
-- ============================================================
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

