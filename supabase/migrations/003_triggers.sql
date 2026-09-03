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
