// ─── Users & Auth ───────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  role: 'government_officer' | 'startup' | 'admin';
  created_at: string;
}

export interface GovernmentDepartment {
  id: string;
  name: string;
  sector: string;
  location: string;
  head_name: string;
  created_at: string;
}

export interface GovernmentOfficer {
  id: string;
  user_id: string;
  department_id: string;
  department?: GovernmentDepartment;
  name: string;
  designation: string;
  official_email: string;
  gov_id: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
}

// ─── Startups ────────────────────────────────────────────────────────────────
export interface Startup {
  id: string;
  user_id: string;
  name: string;
  founder_name: string;
  email: string;
  phone: string;
  sector: string;
  technologies: string[];
  capabilities: string[];
  team_size: number;
  experience_years: number;
  gst_number: string;
  incorporation_number: string;
  dpiit_recognition_number: string;
  verification_status: 'draft' | 'pending' | 'verified';
  trust_score: number;
  pilot_success_rate: number;
  previous_projects: number;
  government_pilots: number;
  location?: string;
  created_at: string;
}

export interface StartupDocument {
  id: string;
  startup_id: string;
  doc_type: string;
  file_url: string;
  verified: boolean;
  uploaded_at: string;
}

// ─── Problems ────────────────────────────────────────────────────────────────
export interface ProblemAIStructured {
  sector: string;
  technology: string;
  required_capability: string;
  expected_outcome: string;
  suggested_kpi: string;
  suggested_pilot_duration_days: number;
  refined_description: string;
}

export interface Problem {
  id: string;
  department_id: string;
  department?: GovernmentDepartment;
  officer_id: string;
  officer?: GovernmentOfficer;
  title: string;
  description: string;
  ai_structured: ProblemAIStructured | null;
  sector: string;
  location: string;
  required_capabilities: string[];
  required_technologies: string[];
  budget_min: number;
  budget_max: number;
  timeline_days: number;
  pilot_duration_days: number;
  expected_outcome: string;
  kpis: string[];
  eligibility_requirements: string;
  authority?: string;
  jurisdiction?: string;
  pilot_duration?: number;
  status: 'draft' | 'published' | 'matched' | 'pilot_active' | 'completed';
  created_at: string;
  updated_at: string;
}

// ─── Matching ────────────────────────────────────────────────────────────────
export interface MatchExplainability {
  sector_match?: boolean;
  technology_match?: boolean;
  capability_match?: boolean;
  previous_relevant_project?: boolean;
  government_pilot_experience?: boolean;
  location_match?: boolean | 'partial';
  reason?: string;
  sector_score?: number;
  sector_max?: number;
  tech_score?: number;
  tech_max?: number;
  cap_score?: number;
  cap_max?: number;
  exp_score?: number;
  exp_max?: number;
  gov_score?: number;
  gov_max?: number;
  trust_score_comp?: number;
  trust_max?: number;
  strengths?: string[];
  ui_rating?: string;
  badge?: string;
  is_relevant?: boolean;
  best_matching_project?: string;
}



export interface StartupMatch {
  id?: string;
  problem_id: string;
  startup_id: string;
  startup?: Startup;
  match_percent: number;
  score?: number;
  badge?: string;
  breakdown?: {
    sector_fit?: number;
    technology_fit?: number;
    capability_fit?: number;
    project_relevance?: number;
    government_experience?: number;
    trust?: number;
  };
  reasons?: string[];
  match_rating: 'BEST' | 'GOOD' | 'FAIR';
  explainability: MatchExplainability;
  created_at?: string;
}

// ─── Applications ────────────────────────────────────────────────────────────
export interface Application {
  id: string;
  problem_id: string;
  problem?: Problem;
  startup_id: string;
  startup?: Startup;
  solution: string;
  proposed_approach: string;
  implementation_plan: string;
  cost_proposed: number;
  team_details: Record<string, unknown>;
  previous_work: string;
  expected_outcome: string;
  status: 'submitted' | 'shortlisted' | 'selected' | 'rejected';
  created_at: string;
}

export interface Evaluation {
  id: string;
  application_id: string;
  application?: Application;
  officer_id: string;
  technical_fit: number;
  feasibility: number;
  cost_effectiveness: number;
  team_capability: number;
  expected_impact: number;
  scalability: number;
  total_score: number;
  decision: 'shortlist' | 'reject' | 'select';
  notes: string;
  evaluated_at: string;
}

// ─── Pilots ──────────────────────────────────────────────────────────────────
export interface SuccessCriteria {
  water_loss_reduction?: number;
  detection_accuracy?: number;
  detection_time_hours?: number;
  [key: string]: number | undefined;
}

export interface Pilot {
  id: string;
  problem_id: string;
  problem?: Problem;
  application_id: string;
  startup_id: string;
  startup?: Startup;
  department_id: string;
  department?: GovernmentDepartment;
  pilot_number: string;
  duration_days: number;
  budget_allocated: number;
  budget_released: number;
  budget_utilized: number;
  target_outcome: string;
  success_criteria: SuccessCriteria;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'terminated';
  progress_percent: number;
  overall_score: number | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
}

export interface Milestone {
  id: string;
  pilot_id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'startup_claimed' | 'inspector_verified' | 'rejected';
  startup_evidence_url: string | null;
  startup_claimed_at: string | null;
  verified_at: string | null;
  sequence_order: number;
}

export interface KPI {
  id: string;
  pilot_id: string;
  metric_name: string;
  baseline_value: number;
  target_value: number;
  current_value: number | null;
  unit: string;
  measurement_method: string;
  status: 'on_track' | 'at_risk' | 'achieved' | 'missed';
}

export interface KPIUpdate {
  id: string;
  kpi_id: string;
  pilot_id: string;
  recorded_by: string;
  current_value: number;
  recorded_at: string;
  notes: string;
}

// ─── Budget ──────────────────────────────────────────────────────────────────
export interface BudgetTransaction {
  id: string;
  pilot_id: string;
  transaction_type: 'allocated' | 'released' | 'utilized';
  amount: number;
  milestone_id: string | null;
  recorded_by: string;
  recorded_at: string;
  notes: string;
  risk_flagged: boolean;
  risk_reason: string | null;
}

// ─── Field Inspections ───────────────────────────────────────────────────────
export interface FieldInspection {
  id: string;
  pilot_id: string;
  milestone_id: string;
  milestone?: Milestone;
  inspector_id: string;
  scheduled_date: string;
  inspection_date: string | null;
  location: string;
  notes: string;
  status: 'scheduled' | 'in_progress' | 'submitted';
  verified_completion_percent: number | null;
  submitted_at: string | null;
}

export interface Evidence {
  id: string;
  pilot_id: string;
  milestone_id: string | null;
  inspection_id: string | null;
  uploaded_by: string;
  file_url: string;
  file_type: string;
  description: string;
  uploaded_at: string;
}

// ─── Issues & Investigations ─────────────────────────────────────────────────
export type IssueCategory =
  | 'fund_misuse'
  | 'false_reporting'
  | 'work_not_completed'
  | 'poor_quality'
  | 'safety_violation'
  | 'document_discrepancy'
  | 'unauthorized_activity'
  | 'other';

export interface IssueReport {
  id: string;
  pilot_id: string;
  inspection_id: string | null;
  reporter_id: string;
  category: IssueCategory;
  description: string;
  evidence_urls: string[];
  location: string;
  report_date: string;
  status: 'reported' | 'under_investigation' | 'resolved';
}

export interface Investigation {
  id: string;
  issue_report_id: string;
  issue?: IssueReport;
  assigned_to: string;
  status: 'open' | 'in_progress' | 'closed';
  findings: string;
  decision: 'warning' | 'suspension' | 'recovery' | 'blacklisting' | null;
  decided_by: string | null;
  decision_reference: string;
  decided_at: string | null;
  created_at: string;
}

// ─── Procurement ─────────────────────────────────────────────────────────────
export interface ProcurementChecklist {
  pilot_completed: boolean;
  kpi_results_available: boolean;
  outcome_report: boolean;
  technical_documentation: boolean;
  cost_information: boolean;
  compliance_documents: boolean;
  government_evaluation: boolean;
  field_verification: boolean;
  issue_resolution: boolean;
}

export interface ProcurementCase {
  id: string;
  pilot_id: string;
  pilot?: Pilot;
  readiness_score: number;
  readiness_level: 'high' | 'medium' | 'low';
  checklist: ProcurementChecklist;
  report_url: string | null;
  ai_analysis: string | null;
  status: 'draft' | 'ready' | 'submitted' | 'approved';
  created_at: string;
  updated_at: string;
}

// ─── Validated Solutions ─────────────────────────────────────────────────────
export interface ValidatedSolution {
  id: string;
  pilot_id: string;
  startup_id: string;
  startup?: Startup;
  department_id: string;
  department?: GovernmentDepartment;
  solution_name: string;
  sector: string;
  technologies: string[];
  problem_description: string;
  kpi_achievement_percent: number;
  deployment_location: string;
  validation_status: 'pilot_completed' | 'government_verified' | 'scaled';
  created_at: string;
}

export interface AdoptionRequest {
  id: string;
  validated_solution_id: string;
  solution?: ValidatedSolution;
  requesting_department_id: string;
  requesting_department?: GovernmentDepartment;
  requesting_officer_id: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  context_notes: string;
  created_at: string;
}

// ─── Notifications & Audit ───────────────────────────────────────────────────
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  reference_id: string | null;
  reference_type: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  evidence_refs: string[];
  ip_address: string | null;
  created_at: string;
}

// ─── API Response Wrappers ───────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

// ─── AI Feature Responses ────────────────────────────────────────────────────
export interface AIStructuredProblem {
  sector: string;
  technology: string;
  required_capability: string;
  expected_outcome: string;
  suggested_kpi: string;
  suggested_pilot_duration_days: number;
  refined_description: string;
}

export interface AIMatchResult {
  startup_id: string;
  startup: Startup;
  match_percent: number;
  match_rating: 'BEST' | 'GOOD' | 'FAIR';
  explainability: MatchExplainability;
}

export interface AIPilotAnalysis {
  executive_summary: string;
  kpi_achievement_summary: string;
  major_achievements: string[];
  risks: string[];
  missing_evidence: string[];
  issues_reported_count: number;
  recommended_next_step: string;
}

export interface AIProcurementReadiness {
  readiness_score: number;
  readiness_level: 'HIGH' | 'MEDIUM' | 'LOW';
  missing_items: string[];
  recommendations: string[];
}

// ─── Pilot Outcome ───────────────────────────────────────────────────────────
export interface PilotOutcomeScore {
  kpi_achievement: number;
  technical_performance: number;
  budget_performance: number;
  timeline: number;
  overall_score: number;
  outcome: 'SUCCESSFUL' | 'NEEDS_REVIEW' | 'UNSUCCESSFUL';
}
