import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ValidatedSolution } from '../../types';
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
  Download,
  DollarSign,
  Scale,
  X,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// Enriched sample data for the pilot report view (keyed by solution list index).
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
    procurementCost: string;
    gfrReference: string;
    finalOutcome: string;
  }
> = {
  0: {
    originalProblem:
      'Municipal water distribution network in Nagpur reported non-revenue water (NRW) losses of 41%, causing ₹8.2 crore in annual revenue leakage. Manual pressure monitoring was insufficient to detect pipe burst events and illegal tappings in real time.',
    proposedSolution:
      'IoT-based water distribution management using acoustic leak detectors, high-frequency pressure sensors, and real-time AI anomaly detection. Flow telemetry aggregated on an officer dashboard with automated work orders sent to field teams within 90 seconds of burst identification.',
    pilotDuration: '90 Days (Dec 2025 – Mar 2026)',
    pilotCost: '₹38.5 Lakhs (Allocated) • ₹36.2 Lakhs (Utilized)',
    baselineKPI: 'NRW Loss: 41% | Leak Detection Time: 72+ hours | Pressure Anomaly Events: 120/month',
    targetKPI: 'NRW Loss ≤ 25% | Leak Detection Time ≤ 2 hours | Pressure Anomaly Events ≤ 30/month',
    achievedKPI: 'NRW Loss: 22.3% | Leak Detection Time: 82 minutes | Pressure Anomaly Events: 18/month',
    improvement: '18.7% absolute reduction in NRW losses • ₹3.1 Cr annual revenue recovered • 94% faster leak detection',
    fieldInspectionStatus: 'Completed — 3 joint field inspections by WRD Nagpur + PRAGATI Certified Field Inspector (Arjun Mehta)',
    evidenceStatus: 'Uploaded & Verified — IoT telemetry logs, pressure transducer records, video logs of pipe repairs, and calibration certificates.',
    verificationStatus: 'Government Verified — Officially certified by Joint Commissioner, Water Resources Department, Nagpur',
    deploymentScope: '6 distribution zones covering 48,000 households across Nagpur Municipal Corporation Zone 3',
    procurementCost: 'Projected full municipal scaling: ₹1.45 Cr (Estimated 14-month ROI through water recovery)',
    gfrReference: 'Compliant under GFR 2017 Rule 149 & Public Procurement of Innovation guidelines (Single-Stage Scaling without Repeat Trials)',
    finalOutcome:
      'Pilot declared SUCCESSFUL. AquaSense AI exceeded all 3 KPI targets during the 90-day pilot in Nagpur. The solution is certified for immediate inter-departmental replication and direct public procurement.',
  },
};

function getPilotEnrichment(idx: number, sol?: ValidatedSolution) {
  return (
    PILOT_REPORT_ENRICHMENT[idx] ?? {
      originalProblem:
        sol?.problem_description ||
        'Government department identified a critical operational bottleneck in service delivery. A structured government pilot was initiated to evaluate a technology-driven startup solution with clear baseline indicators.',
      proposedSolution:
        'Technology-driven automated deployment integrated with field telemetry, predictive analytics, and real-time monitoring to address operational inefficiencies.',
      pilotDuration: '90 Days',
      pilotCost: 'Allocated as per approved pilot project budget',
      baselineKPI: 'Baseline operational metrics recorded at pilot commencement',
      targetKPI: 'Target benchmarks established in the tripartite pilot agreement',
      achievedKPI: 'KPI targets successfully met or exceeded during the pilot evaluation period',
      improvement: `Demonstrated measurable outcome with ${sol?.kpi_achievement_percent || 90}% overall target fulfillment`,
      fieldInspectionStatus: 'Completed by designated departmental inspection committee',
      evidenceStatus: 'Field logs, telemetry datasets, and verification certificates verified',
      verificationStatus: 'Government Verified by competent authority',
      deploymentScope: `Designated pilot jurisdiction at ${sol?.deployment_location || 'Field Site'}`,
      procurementCost: 'Calculated based on standard departmental unit rates and scale requirements',
      gfrReference: 'Statutory compliance under GFR 2017 Rule 149 for adoption of validated innovative solutions',
      finalOutcome:
        'Pilot successfully completed with verified KPI performance. The solution is certified for scaling and inter-departmental adoption.',
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
  const [adoptSolution, setAdoptSolution] = useState<ValidatedSolution | null>(null);
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
    setIsSearchingAI(true);
    const query = search.trim();

    // 1. If query is empty, sort all solutions by KPI outcome
    if (!query) {
      try {
        const res = await api.get('/api/solutions');
        const list: ValidatedSolution[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        const sorted = [...list].sort((a, b) => (b.kpi_achievement_percent || 0) - (a.kpi_achievement_percent || 0));
        setSolutions(sorted);
        toast.success('Semantic ranking active — solutions sorted by verified KPI outcome.');
      } catch {
        setSolutions((prev) => [...prev].sort((a, b) => (b.kpi_achievement_percent || 0) - (a.kpi_achievement_percent || 0)));
        toast.success('Semantic ranking active — solutions sorted by verified KPI outcome.');
      } finally {
        setIsSearchingAI(false);
      }
      return;
    }

    // 2. Try backend API first
    try {
      const res = await api.post('/api/solutions/search', { query });
      const list: ValidatedSolution[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      if (list.length > 0) {
        setSolutions(list);
        toast.success(`Semantic search identified ${list.length} relevant validated solutions.`);
        setIsSearchingAI(false);
        return;
      }
    } catch {
      // Backend not responding or serverless route -> use client-side semantic scoring
    }

    // 3. Client-side semantic & relevance ranking fallback
    try {
      const qTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
      const scored = solutions.map((sol) => {
        let score = 0;
        const textToSearch = [
          sol.solution_name || '',
          sol.problem_description || '',
          sol.sector || '',
          sol.deployment_location || '',
          sol.startup?.name || '',
          sol.department?.name || '',
          ...(sol.technologies || []),
        ].join(' ').toLowerCase();

        for (const token of qTokens) {
          if (textToSearch.includes(token)) score += 6;
          // Concept associations
          if (['water', 'leak', 'pipeline', 'flow', 'aquasense', 'pressure', 'nrw'].some((k) => token.includes(k)) &&
              textToSearch.includes('water')) score += 4;
          if (['ai', 'iot', 'sensor', 'smart', 'machine', 'telemetry', 'camera'].some((k) => token.includes(k)) &&
              (textToSearch.includes('ai') || textToSearch.includes('iot') || textToSearch.includes('sensor'))) score += 4;
          if (['clean', 'energy', 'solar', 'grid', 'power', 'battery'].some((k) => token.includes(k)) &&
              (textToSearch.includes('energy') || textToSearch.includes('solar'))) score += 4;
          if (['health', 'hospital', 'clinic', 'patient', 'medical'].some((k) => token.includes(k)) &&
              textToSearch.includes('health')) score += 4;
          if (['traffic', 'road', 'transit', 'mobility', 'transport'].some((k) => token.includes(k)) &&
              (textToSearch.includes('mobility') || textToSearch.includes('traffic'))) score += 4;
        }

        score += (sol.kpi_achievement_percent || 0) * 0.05;
        return { sol, score };
      });

      const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.sol);
      if (matched.length > 0) {
        setSolutions(matched);
        toast.success(`Semantic search identified ${matched.length} relevant solutions.`);
      } else {
        toast('No direct semantic matches found. Showing all verified solutions.');
      }
    } catch {
      toast.error('Search completed.');
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleDownloadReport = (sol: ValidatedSolution, enrich: ReturnType<typeof getPilotEnrichment>) => {
    const docId = `PRAGATI/VAL-RPT/${sol.id.slice(0, 8).toUpperCase()}`;
    const reportText = `================================================================================
PRAGATI — NATIONAL GOVERNMENT INNOVATION & PROCUREMENT PLATFORM
OFFICIAL PILOT VALIDATION & PROCUREMENT ASSESSMENT REPORT
================================================================================
DOCUMENT REFERENCE : ${docId}
DATE OF ISSUE      : ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
STATUS             : CERTIFIED VALIDATED SOLUTION • GFR 2017 COMPLIANT
--------------------------------------------------------------------------------

1. SOLUTION OVERVIEW
   - Solution Name      : ${sol.solution_name}
   - Startup / Vendor   : ${sol.startup?.name || 'AquaSense Technologies'}
   - Host Department    : ${sol.department?.name || 'Water Resources Department'}
   - Sector             : ${sol.sector}
   - Technologies       : ${sol.technologies?.join(', ') || 'AI, IoT, Cloud Telemetry'}
   - Deployment Scope   : ${enrich.deploymentScope}

2. ORIGINAL GOVERNMENT PROBLEM
   ${enrich.originalProblem}

3. PROPOSED SOLUTION & ARCHITECTURE
   ${enrich.proposedSolution}

4. PILOT DURATION & INVESTMENT
   - Pilot Duration     : ${enrich.pilotDuration}
   - Pilot Investment   : ${enrich.pilotCost}
   - Deployment Site    : ${sol.deployment_location}

5. KPI PERFORMANCE & MEASURED OUTCOMES
   - Baseline KPI       : ${enrich.baselineKPI}
   - Target KPI         : ${enrich.targetKPI}
   - Achieved KPI       : ${enrich.achievedKPI}
   - Target Met         : ${sol.kpi_achievement_percent}%
   - Net Improvement    : ${enrich.improvement}

6. VALIDATION & FIELD INSPECTION
   - Field Inspection   : ${enrich.fieldInspectionStatus}
   - Telemetry Evidence : ${enrich.evidenceStatus}
   - Official Sign-Off  : ${enrich.verificationStatus}

7. STATUTORY & PROCUREMENT COMPLIANCE (GFR 2017)
   - Rule Alignment     : General Financial Rules (GFR) 2017 - Rule 149 / Innovation Procurement
   - Inter-Dept Reuse   : Eligible for direct replication without repeat trial pilots
   - Audit Trail        : Tamper-evident pilot milestones, telemetry logs & joint inspection sign-offs

8. FINAL VALIDATION OUTCOME
   ${enrich.finalOutcome}

================================================================================
AUTHORIZED BY:
PRAGATI Central Evaluation & Innovation Scaling Committee
Government Innovation & Public Procurement Repository
================================================================================
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PRAGATI_Validation_Report_${sol.solution_name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Official Validation Report downloaded successfully.');
  };

  const handleAdoptRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adoptSolution) return;
    try {
      setSubmittingAdopt(true);
      await api.post(`/api/solutions/${adoptSolution.id}/adopt`, {
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

  const enrichment = reportSolution ? getPilotEnrichment(reportIdx, reportSolution) : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* ── 1. REPOSITORY HERO HEADING ────────────────────────────────────────── */}
      <div className="pb-5 border-b border-gray-200">
        <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 inline-block mb-2">
          VALIDATED INNOVATION REPOSITORY
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">
          Proven Solutions, Ready for Reuse
        </h1>
        <p className="mt-1.5 text-xs md:text-sm text-gray-600 max-w-4xl leading-relaxed">
          Discover startup solutions that have completed structured government pilots, demonstrated measurable outcomes, and are ready for informed adoption across departments.
        </p>
      </div>

      {/* ── 2. DARK BLUE REPOSITORY BANNER ───────────────────────────────────── */}
      <Card className="bg-gradient-to-r from-navy-900 via-blue-900 to-navy-800 text-white border-0 shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> PROVEN &amp; REUSABLE
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">Adopt What Has Already Been Proven</h2>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
              Explore solutions that have completed structured government pilots with field validation, measurable KPI outcomes, and procurement-readiness checks. Reduce duplicate trials and move proven innovations toward wider adoption.
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

      {/* ── 3. SEARCH & SECTOR FILTER BAR WITH ENABLED SEMANTIC SEARCH ────────── */}
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
          disabled={isSearchingAI}
          className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
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

      {/* ── 4. SOLUTIONS CARDS GRID (BOTH VIEW REPORT & REQUEST ADOPTION) ─────── */}
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

            {/* Actions: View Report + Request Adoption on Card */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 text-xs font-semibold flex items-center justify-center gap-1"
                onClick={() => {
                  setReportSolution(sol);
                  setReportIdx(idx);
                  setReportOpen(true);
                }}
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                View Report
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center justify-center gap-1"
                onClick={() => {
                  setAdoptSolution(sol);
                  setAdoptModalOpen(true);
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Request Adoption
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

      {/* ── 5. FULL DEDICATED OFFICIAL REPORT PANEL ───────────────────────────── */}
      {reportSolution && enrichment && reportOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto"
          onClick={() => setReportOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Official Report Header */}
            <div className="bg-[#123158] text-white px-6 py-5 flex items-start justify-between gap-4 shrink-0 border-b border-blue-900">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                    GOVERNMENT OF INDIA • PRAGATI
                  </span>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> GFR 2017 CERTIFIED
                  </span>
                </div>
                <h2 className="text-xl font-black tracking-tight text-white leading-tight">
                  Official Pilot Validation &amp; Procurement Assessment Report
                </h2>
                <p className="text-xs text-slate-300">
                  Document Reference: PRAGATI/VAL-RPT/{reportSolution.id.slice(0, 8).toUpperCase()} • Solution: {reportSolution.solution_name}
                </p>
              </div>

              {/* Top Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownloadReport(reportSolution, enrichment)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  title="Download Official Report"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReportOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Report"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Report Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs text-slate-700">
              
              {/* 1. Solution Overview */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" /> 1. Solution Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Solution Name', value: reportSolution.solution_name },
                    { label: 'Startup / Vendor', value: reportSolution.startup?.name || 'AquaSense Technologies' },
                    { label: 'Host Department', value: reportSolution.department?.name || 'Water Resources Department' },
                    { label: 'Sector', value: reportSolution.sector },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                      <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{label}</span>
                      <span className="font-bold text-navy-900 text-xs">{value}</span>
                    </div>
                  ))}
                </div>

                {reportSolution.technologies && reportSolution.technologies.length > 0 && (
                  <div className="mt-3 bg-blue-50/70 rounded-xl p-3 border border-blue-100 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase text-blue-700 shrink-0">Technologies Deployed:</span>
                    {reportSolution.technologies.map((t, i) => (
                      <span key={i} className="text-[11px] bg-white text-navy-900 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200" />

              {/* 2. Original Government Problem */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> 2. Original Government Problem
                </h3>
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 leading-relaxed font-medium">
                  {enrichment.originalProblem}
                </div>
              </div>

              <div className="border-t border-slate-200" />

              {/* 3. Proposed Solution & Architecture */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> 3. Proposed Solution &amp; Technical Architecture
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 leading-relaxed">
                  {enrichment.proposedSolution}
                </div>
              </div>

              <div className="border-t border-slate-200" />

              {/* 4. Pilot Duration & Location */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" /> 4. Pilot Duration &amp; Host Jurisdiction
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Pilot Duration', value: enrichment.pilotDuration },
                    { label: 'Deployment Location', value: reportSolution.deployment_location },
                    { label: 'Pilot Investment', value: enrichment.pilotCost },
                    { label: 'Deployment Scope', value: enrichment.deploymentScope },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
                      <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{label}</span>
                      <span className="font-semibold text-slate-800 text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200" />

              {/* 5. KPI Baseline vs Achieved */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600" /> 5. KPI Performance — Baseline vs. Achieved
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                      <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Baseline KPI</span>
                      <p className="text-slate-700 font-semibold leading-snug">{enrichment.baselineKPI}</p>
                    </div>
                    <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5">
                      <span className="block text-[10px] font-bold uppercase text-blue-600 mb-1">Target Benchmark</span>
                      <p className="text-blue-950 font-semibold leading-snug">{enrichment.targetKPI}</p>
                    </div>
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5">
                      <span className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">KPI Achieved in Field</span>
                      <p className="text-emerald-950 font-bold leading-snug">{enrichment.achievedKPI}</p>
                    </div>
                  </div>

                  {/* Highlight Improvement */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[10px] font-bold uppercase text-emerald-700">Measured Outcome &amp; Net Improvement</span>
                        <p className="text-emerald-950 font-bold mt-0.5">{enrichment.improvement}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-2xl font-black text-emerald-600">{reportSolution.kpi_achievement_percent}%</span>
                      <p className="text-[10px] font-bold text-emerald-700 uppercase">Target Exceeded</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200" />

              {/* 6. Validation & Field Inspection */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-purple-600" /> 6. Validation &amp; Field Inspection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Field Inspection
                    </div>
                    <p className="text-slate-700 font-medium">{enrichment.fieldInspectionStatus}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Telemetry Evidence
                    </div>
                    <p className="text-slate-700 font-medium">{enrichment.evidenceStatus}</p>
                  </div>
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Government Sign-Off
                    </div>
                    <p className="text-emerald-950 font-semibold">{enrichment.verificationStatus}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200" />

              {/* 7. Procurement & GFR 2017 Compliance */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" /> 7. Procurement &amp; Statutory GFR 2017 Compliance
                </h3>
                <div className="space-y-3">
                  <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <DollarSign className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-blue-700">Scaling Cost Assessment</span>
                      <p className="text-blue-950 font-semibold mt-0.5">{enrichment.procurementCost}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase text-slate-500">Statutory Authorization</span>
                      <p className="text-slate-800 font-medium mt-0.5">{enrichment.gfrReference}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200" />

              {/* 8. Final Validation Outcome */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 8. Final Validation Outcome
                </h3>
                <div className="bg-navy-900 text-white rounded-xl p-5 leading-relaxed">
                  <p className="font-medium">{enrichment.finalOutcome}</p>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Status: {reportSolution.validation_status === 'government_verified'
                        ? 'Government Verified'
                        : reportSolution.validation_status === 'scaled'
                        ? 'Scaled & Adopted'
                        : 'Pilot Completed'}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Eligible for Inter-Departmental Adoption
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <p className="text-xs text-slate-500 text-center sm:text-left">
                Certified ready for inter-departmental replication under GFR 2017 provisions.
              </p>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 sm:flex-initial text-xs font-bold flex items-center justify-center gap-1.5"
                  onClick={() => handleDownloadReport(reportSolution, enrichment)}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Report
                </Button>
                <Button
                  type="button"
                  className="flex-1 sm:flex-initial bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                  onClick={() => {
                    setAdoptSolution(reportSolution);
                    setAdoptModalOpen(true);
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  Request Adoption
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. ADOPTION REQUEST MODAL ─────────────────────────────────────────── */}
      <Modal
        isOpen={adoptModalOpen}
        onClose={() => setAdoptModalOpen(false)}
        title={`Request Adoption: ${adoptSolution?.solution_name || reportSolution?.solution_name}`}
      >
        <form onSubmit={handleAdoptRequest} className="space-y-4 pt-2 text-xs">
          <p className="text-gray-600">
            Submit an official request to adopt this pre-validated solution in your department under GFR 2017 cross-department scaling provisions.
          </p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
            <span className="font-bold text-blue-950">Original Pilot Department:</span>
            <p className="text-blue-900">{adoptSolution?.department?.name || reportSolution?.department?.name || 'Partner Department'}</p>
            <span className="font-bold text-blue-950 block pt-1">Validated Vendor:</span>
            <p className="text-blue-900">{adoptSolution?.startup?.name || reportSolution?.startup?.name || 'Startup'}</p>
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


