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
