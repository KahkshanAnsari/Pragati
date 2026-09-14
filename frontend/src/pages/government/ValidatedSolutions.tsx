import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ValidatedSolution } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Building2,
  Sparkles,
  Layers,
  FileText,
  TrendingUp,
  Calendar,
  BarChart2,
  ClipboardCheck,
  Send,
  AlertCircle,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// Enriched demo data for the pilot report modal (keyed by solution list index).
// Does NOT modify any backend/database/seed data.
// ──────────────────────────────────────────────────────────────────────────────
const PILOT_REPORT_ENRICHMENT: Record<
  number,
  {
    originalProblem: string;
    proposedSolution: string;
    pilotDuration: string;
    pilotCost: string;
    baselineKPI: string;
    targetKPI: string;
    achievedKPI: string;
    improvement: string;
    fieldInspectionStatus: string;
    evidenceStatus: string;
    verificationStatus: string;
    deploymentScope: string;
    finalOutcome: string;
  }
> = {
  0: {
    originalProblem:
      'Municipal water distribution network in Nagpur reported non-revenue water (NRW) losses of 41%, causing ₹8.2 crore in annual revenue leakage. Manual pressure monitoring was insufficient to detect pipe burst events and illegal tappings in real time.',
    proposedSolution:
      'IoT-based water distribution management using pressure sensors, acoustic leak detectors, and real-time AI anomaly detection. Flow telemetry aggregated on a cloud dashboard with auto-alert to field repair teams within 90 seconds of detection.',
    pilotDuration: '90 Days (Dec 2025 – Mar 2026)',
    pilotCost: '₹38.5 Lakhs (Allocated) • ₹36.2 Lakhs (Utilized)',
    baselineKPI: 'NRW Loss: 41% | Leak Detection Time: 72+ hours | Pressure Events: 120/month',
    targetKPI: 'NRW Loss ≤ 25% | Detection Time ≤ 2 hours | Pressure Events ≤ 30/month',
    achievedKPI: 'NRW Loss: 22.3% | Detection Time: 82 minutes | Pressure Events: 18/month',
    improvement: '18.7% reduction in NRW losses • ₹3.1 Cr annual revenue recovered • 94% faster leak detection',
    fieldInspectionStatus: 'Completed — 3 joint field inspections by WRD Nagpur + PRAGATI Inspector',
    evidenceStatus: 'Uploaded — IoT telemetry logs, video evidence of pipe repair events, and sensor calibration certificates verified.',
    verificationStatus: 'Government Verified — Confirmed by Joint Commissioner, Water Resources Dept., Nagpur',
    deploymentScope: '6 distribution zones covering 48,000 households across Nagpur Municipal Zone 3',
    finalOutcome:
      'Pilot declared SUCCESSFUL. AquaSense AI exceeded all 3 KPI targets during the 90-day pilot in Nagpur. The solution is eligible for full-scale procurement and replication in other urban bodies under GFR 2017 provisions.',
  },
};

function getPilotEnrichment(idx: number) {
  return (
    PILOT_REPORT_ENRICHMENT[idx] ?? {
      originalProblem: 'Government department identified a critical service delivery gap affecting citizens and civic operations. A structured pilot was initiated to evaluate a technology-based solution.',
      proposedSolution: 'A technology-enabled solution was deployed in a controlled zone for evidence-based evaluation, with KPI tracking and third-party inspection.',
      pilotDuration: '90 Days',
      pilotCost: 'As per approved pilot budget',
      baselineKPI: 'Baseline KPIs measured at pilot commencement',
      targetKPI: 'Improvement targets defined in pilot agreement',
      achievedKPI: 'KPI targets met or exceeded during pilot period',
      improvement: 'Measured improvement over baseline — details in pilot report',
      fieldInspectionStatus: 'Field inspections completed by designated inspector team',
      evidenceStatus: 'Evidence uploaded and verified by inspection team',
      verificationStatus: 'Verified by competent government authority',
      deploymentScope: 'Pilot jurisdiction as specified in the pilot agreement',
      finalOutcome: 'Pilot completed with satisfactory outcome. Solution eligible for adoption under applicable procurement framework.',
    }
  );
}

export const ValidatedSolutions: React.FC = () => {
  const [solutions, setSolutions] = useState<ValidatedSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  // Pilot Report modal state
  const [reportSolution, setReportSolution] = useState<ValidatedSolution | null>(null);
  const [reportIdx, setReportIdx] = useState<number>(0);
  const [reportOpen, setReportOpen] = useState(false);

  // Adoption modal state
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);
  const [adoptNotes, setAdoptNotes] = useState('');
  const [submittingAdopt, setSubmittingAdopt] = useState(false);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/solutions');
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setSolutions(list);
    } catch (err) {
      toast.error('Failed to load solutions repository');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!search.trim()) return;
    setIsSearchingAI(true);
    try {
      const res = await api.post('/api/solutions/search', { query: search });
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      if (list.length > 0) {
        setSolutions(list);
        toast.success(`AI identified ${list.length} relevant validated solutions!`);
      } else {
        toast('No direct semantic matches found. Showing standard results.');
      }
    } catch {
      toast.error('AI search encountered an issue');
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleAdoptRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportSolution) return;
    try {
      setSubmittingAdopt(true);
      await api.post(`/api/solutions/${reportSolution.id}/adopt`, {
        context_notes: adoptNotes || 'Interested in replicating pilot deployment in our jurisdiction under GFR 2017.',
      });
      toast.success('Cross-department adoption request submitted!');
      setAdoptModalOpen(false);
      setAdoptNotes('');
    } catch {
      toast.error('Failed to submit adoption request');
    } finally {
      setSubmittingAdopt(false);
    }
  };

  const filteredSolutions = solutions.filter((s) => {
    if (sector && !s.sector?.toLowerCase().includes(sector.toLowerCase())) return false;
    if (
      search &&
      !isSearchingAI &&
      !s.solution_name?.toLowerCase().includes(search.toLowerCase()) &&
      !s.problem_description?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const enrichment = reportSolution ? getPilotEnrichment(reportIdx) : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="National Validated Solutions Repository"
        subtitle="Pilot Once — Verify — Reuse — Scale. Replicate proven startup innovations across state & central departments without repeat trials."
      />

      {/* Advisory Banner */}
      <Card className="bg-gradient-to-r from-navy-900 via-blue-900 to-navy-800 text-white border-0 shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Statutory Inter-Departmental Reusability
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">Don't reinvent the wheel.</h2>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
              Explore solutions that have successfully completed structured government pilots with third-party field inspection, telemetry KPIs, and statutory compliance under GFR 2017. Fast-track adoption in your department.
            </p>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-xl text-center backdrop-blur-xs shrink-0 border border-white/10">
            <div className="text-3xl font-extrabold text-white">{solutions.length}</div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-blue-200 mt-0.5">
              Verified Solutions
            </div>
          </div>
        </div>
      </Card>

      {/* Search & Sector Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by problem, technology, startup, or deployment location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
          />
        </div>
        <Select
          value={sector}
          onChange={(value) => setSector(value)}
          options={[
            { label: 'All Sectors', value: '' },
            { label: 'Water & Wastewater', value: 'Water' },
            { label: 'Smart Infrastructure & Mobility', value: 'Mobility' },
            { label: 'Healthcare', value: 'Healthcare' },
            { label: 'Agriculture', value: 'Agriculture' },
            { label: 'Clean Energy', value: 'Energy' },
            { label: 'Governance & Smart Cities', value: 'Governance' },
          ]}
        />
        <Button
          onClick={handleAISearch}
          disabled={isSearchingAI || !search.trim()}
          className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 flex items-center justify-center gap-1.5 shrink-0"
        >
          {isSearchingAI ? (
            <Spinner size="sm" />
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Semantic Search
            </>
          )}
        </Button>
      </div>

      {/* Solutions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSolutions.map((sol, idx) => (
          <Card
            key={sol.id}
            className="p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <Badge variant="blue" className="text-xs">
                  {sol.sector}
                </Badge>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Procurement Verified
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-navy-900 leading-snug">{sol.solution_name}</h3>
                <p className="text-xs font-semibold text-blue-700 mt-0.5">{sol.startup?.name || 'Partner Startup'}</p>
              </div>

              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{sol.problem_description}</p>

              {sol.technologies && sol.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {sol.technologies.slice(0, 3).map((t, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">KPI Target Achieved</span>
                  <span className="text-xs text-gray-500">Exceeded baseline</span>
                </div>
                <span className="text-xl font-extrabold text-emerald-600">{sol.kpi_achievement_percent}%</span>
              </div>

              <div className="space-y-1 text-xs text-gray-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Deployment: {sol.deployment_location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{sol.department?.name || 'Department'}</span>
                </div>
              </div>
            </div>

            {/* Primary action: View Pilot Report */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Button
                size="sm"
                className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                onClick={() => {
                  setReportSolution(sol);
                  setReportIdx(idx);
                  setReportOpen(true);
                }}
              >
                <FileText className="w-3.5 h-3.5" />
                View Pilot Report
              </Button>
            </div>
          </Card>
        ))}

        {filteredSolutions.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-navy-900 mb-1">No Validated Solutions Found</h3>
            <p className="text-xs text-gray-500">Try changing your search keywords or sector filter.</p>
          </div>
        )}
      </div>

      {/* ── PILOT SUCCESS REPORT MODAL ──────────────────────────────────────────── */}
      {reportSolution && enrichment && (
        <Modal
          isOpen={reportOpen}
          onClose={() => setReportOpen(false)}
          title="Pilot Success Report"
          size="2xl"
        >
          <div className="space-y-5 text-sm overflow-y-auto max-h-[72vh] pr-1">

            {/* Report header strip */}
            <div className="bg-gradient-to-r from-navy-900 to-blue-900 text-white rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
                    PRAGATI — Official Pilot Evaluation Report
                  </div>
                  <h2 className="text-lg font-extrabold leading-snug">{reportSolution.solution_name}</h2>
                  <p className="text-xs text-blue-200">
                    {reportSolution.startup?.name || 'Partner Startup'} &nbsp;•&nbsp; {reportSolution.sector}
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/40">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Procurement Verified
                </span>
              </div>
            </div>

            {/* 1. Solution Overview */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Solution Overview
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Solution Name', value: reportSolution.solution_name },
                  { label: 'Startup / Vendor', value: reportSolution.startup?.name || 'Partner Startup' },
                  { label: 'Government Department', value: reportSolution.department?.name || 'Government Department' },
                  { label: 'Sector', value: reportSolution.sector },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">{label}</span>
                    <span className="font-semibold text-navy-900">{value}</span>
                  </div>
                ))}
              </div>
              {reportSolution.technologies && reportSolution.technologies.length > 0 && (
                <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <span className="block text-[10px] font-bold uppercase text-blue-500 mb-1.5">Technologies Deployed</span>
                  <div className="flex flex-wrap gap-1.5">
                    {reportSolution.technologies.map((t, i) => (
                      <span key={i} className="text-[11px] bg-white text-navy-900 border border-blue-200 px-2 py-0.5 rounded font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* 2. Original Government Problem */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Original Government Problem
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
                {enrichment.originalProblem}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* 3. Pilot Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-purple-600" /> Pilot Details
              </h3>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: 'Duration', value: enrichment.pilotDuration },
                    { label: 'Deployment Location', value: reportSolution.deployment_location },
                    { label: 'Pilot Cost / Investment', value: enrichment.pilotCost },
                    { label: 'Deployment Scope', value: enrichment.deploymentScope },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span className="block font-bold text-gray-400 text-[10px] uppercase mb-0.5">{label}</span>
                      <span className="font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <span className="block font-bold text-gray-400 text-[10px] uppercase mb-1">Proposed Solution Approach</span>
                  <p className="text-gray-700 leading-relaxed">{enrichment.proposedSolution}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* 4. KPI Performance */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-blue-600" /> Performance — KPI Results
              </h3>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Baseline KPI</span>
                    <p className="text-gray-700 leading-snug font-medium">{enrichment.baselineKPI}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <span className="block text-[10px] font-bold uppercase text-blue-400 mb-1">Target KPI</span>
                    <p className="text-blue-800 leading-snug font-medium">{enrichment.targetKPI}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <span className="block text-[10px] font-bold uppercase text-emerald-500 mb-1">KPI Achieved</span>
                    <p className="text-emerald-800 leading-snug font-bold">{enrichment.achievedKPI}</p>
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <span className="block text-[10px] font-bold uppercase text-emerald-500 mb-0.5">Overall Improvement / Outcome</span>
                    <p className="text-emerald-900 font-semibold">{enrichment.improvement}</p>
                  </div>
                  <div className="ml-auto shrink-0 text-right">
                    <span className="text-3xl font-extrabold text-emerald-600">{reportSolution.kpi_achievement_percent}%</span>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase">KPI Target Met</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* 5. Validation */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <ClipboardCheck className="w-3.5 h-3.5 text-purple-600" /> Validation &amp; Verification
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-gray-400 text-[10px] uppercase mb-0.5">Field Inspection Status</span>
                    <p className="font-medium text-gray-800">{enrichment.fieldInspectionStatus}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-gray-400 text-[10px] uppercase mb-0.5">Evidence Status</span>
                    <p className="font-medium text-gray-800">{enrichment.evidenceStatus}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-emerald-600 text-[10px] uppercase mb-0.5">Verification Status</span>
                    <p className="font-semibold text-emerald-800">{enrichment.verificationStatus}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* 6. Final Outcome */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Final Pilot Outcome
              </h3>
              <div className="bg-navy-900 text-white rounded-xl p-4 text-xs leading-relaxed">
                <p>{enrichment.finalOutcome}</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-emerald-300">
                    Validation Status:{' '}
                    {reportSolution.validation_status === 'government_verified'
                      ? 'Government Verified'
                      : reportSolution.validation_status === 'scaled'
                      ? 'Scaled & Adopted'
                      : 'Pilot Completed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Request Adoption — only available after viewing the full report */}
            <div className="pt-2 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                This solution has completed government-validated piloting and is eligible for cross-department adoption under GFR 2017.
              </p>
              <Button
                className="shrink-0 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs px-5 py-2.5 flex items-center gap-2"
                onClick={() => {
                  setReportOpen(false);
                  setAdoptModalOpen(true);
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Request Adoption
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── ADOPTION REQUEST MODAL ─────────────────────────────────────────────── */}
      <Modal
        isOpen={adoptModalOpen}
        onClose={() => setAdoptModalOpen(false)}
        title={`Request Adoption: ${reportSolution?.solution_name}`}
      >
        <form onSubmit={handleAdoptRequest} className="space-y-4 pt-2 text-xs">
          <p className="text-gray-600">
            Submit an official request to adopt this pre-validated solution in your department under GFR 2017 cross-department scaling provisions.
          </p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
            <span className="font-bold text-blue-950">Original Pilot Department:</span>
            <p className="text-blue-900">{reportSolution?.department?.name || 'Partner Department'}</p>
            <span className="font-bold text-blue-950 block pt-1">Validated Vendor:</span>
            <p className="text-blue-900">{reportSolution?.startup?.name || 'Startup'}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Context Notes &amp; Jurisdictional Requirement
            </label>
            <Textarea
              rows={4}
              required
              value={adoptNotes}
              onChange={(e) => setAdoptNotes(e.target.value)}
              placeholder="Detail your department's jurisdiction, expected scale, and implementation timeline..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setAdoptModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submittingAdopt}
              className="bg-navy-900 text-white flex items-center gap-1.5"
            >
              {submittingAdopt ? <Spinner size="sm" /> : <Send className="w-3.5 h-3.5" />} Submit Adoption Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ValidatedSolutions;


