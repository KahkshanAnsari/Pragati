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
