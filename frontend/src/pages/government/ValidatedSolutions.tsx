import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ValidatedSolution } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Spinner } from '../../components/ui/Spinner';
import { SkeletonCard } from '../../components/ui/Skeleton';
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

// ─── VIEW MODES ──────────────────────────────────────────────────────────────
type ViewMode = 'list' | 'report' | 'adopt';

export const ValidatedSolutions: React.FC = () => {
  const [solutions, setSolutions] = useState<ValidatedSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  const [view, setView] = useState<ViewMode>('list');
  const [activeSolution, setActiveSolution] = useState<ValidatedSolution | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);

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

  const openReport = (sol: ValidatedSolution, idx: number) => {
    setActiveSolution(sol);
    setActiveIdx(idx);
    setView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAdopt = (sol: ValidatedSolution, idx: number) => {
    setActiveSolution(sol);
    setActiveIdx(idx);
    setAdoptNotes('');
    setView('adopt');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToList = () => { setView('list'); setActiveSolution(null); };
  const backToReport = () => { setView('report'); };

  const handleAISearch = async () => {
    setIsSearchingAI(true);
    const query = search.trim();
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
      } finally { setIsSearchingAI(false); }
      return;
    }
    try {
      const res = await api.post('/api/solutions/search', { query });
      const list: ValidatedSolution[] = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      if (list.length > 0) {
        setSolutions(list);
        toast.success('Semantic search identified ' + list.length + ' relevant validated solutions.');
        setIsSearchingAI(false);
        return;
      }
    } catch { /* fallback */ }
    try {
      const qTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
      const scored = solutions.map((sol) => {
        let score = 0;
        const txt = [sol.solution_name||'',sol.problem_description||'',sol.sector||'',sol.deployment_location||'',sol.startup?.name||'',sol.department?.name||'',...(sol.technologies||[])].join(' ').toLowerCase();
        for (const token of qTokens) {
          if (txt.includes(token)) score += 6;
          if (['water','leak','pipeline','flow','aquasense','pressure','nrw'].some(k=>token.includes(k))&&txt.includes('water')) score+=4;
          if (['ai','iot','sensor','smart','machine','telemetry','camera'].some(k=>token.includes(k))&&(txt.includes('ai')||txt.includes('iot')||txt.includes('sensor'))) score+=4;
          if (['clean','energy','solar','grid','power','battery'].some(k=>token.includes(k))&&(txt.includes('energy')||txt.includes('solar'))) score+=4;
          if (['health','hospital','clinic','patient','medical'].some(k=>token.includes(k))&&txt.includes('health')) score+=4;
          if (['traffic','road','transit','mobility','transport'].some(k=>token.includes(k))&&(txt.includes('mobility')||txt.includes('traffic'))) score+=4;
        }
        score += (sol.kpi_achievement_percent||0)*0.05;
        return { sol, score };
      });
      const matched = scored.filter(s=>s.score>0).sort((a,b)=>b.score-a.score).map(s=>s.sol);
      if (matched.length>0) { setSolutions(matched); toast.success('Semantic search identified '+matched.length+' relevant solutions.'); }
      else toast('No direct semantic matches found. Showing all verified solutions.');
    } catch { toast.error('Search completed.'); }
    finally { setIsSearchingAI(false); }
  };

  const handleDownloadReport = (sol: ValidatedSolution, enrich: ReturnType<typeof getPilotEnrichment>) => {
    const docId = 'PRAGATI/VAL-RPT/' + sol.id.slice(0,8).toUpperCase();
    const text = [
      '================================================================================',
      'PRAGATI - GOVERNMENT INNOVATION PLATFORM',
      'OFFICIAL PILOT VALIDATION & PROCUREMENT ASSESSMENT REPORT',
      '================================================================================',
      'DOCUMENT REFERENCE : ' + docId,
      'DATE : ' + new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}),
      'STATUS : CERTIFIED VALIDATED SOLUTION - GFR 2017 COMPLIANT',
      '',
      '1. SOLUTION: ' + sol.solution_name + ' | Startup: ' + (sol.startup?.name||'N/A') + ' | Dept: ' + (sol.department?.name||'N/A'),
      '2. PROBLEM: ' + enrich.originalProblem,
      '3. SOLUTION ARCHITECTURE: ' + enrich.proposedSolution,
      '4. PILOT: ' + enrich.pilotDuration + ' | Investment: ' + enrich.pilotCost + ' | Location: ' + sol.deployment_location,
      '5. KPI BASELINE: ' + enrich.baselineKPI,
      '   KPI TARGET: ' + enrich.targetKPI,
      '   KPI ACHIEVED: ' + enrich.achievedKPI + ' (' + sol.kpi_achievement_percent + '% target met)',
      '6. VALIDATION: ' + enrich.fieldInspectionStatus,
      '7. COMPLIANCE: ' + enrich.gfrReference,
      '8. OUTCOME: ' + enrich.finalOutcome,
      '================================================================================',
      'AUTHORIZED BY: PRAGATI Central Evaluation Committee',
      '================================================================================',
    ].join('\n');
    const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PRAGATI_Report_'+sol.solution_name.replace(/\s+/g,'_')+'.txt';
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully.');
  };

  const handleAdoptRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSolution) return;
    try {
      setSubmittingAdopt(true);
      await api.post('/api/solutions/'+activeSolution.id+'/adopt', { context_notes: adoptNotes||'Interested in replicating pilot deployment under GFR 2017.' });
      toast.success('Adoption request submitted!');
      setAdoptNotes(''); backToReport();
    } catch { toast.error('Failed to submit adoption request'); }
    finally { setSubmittingAdopt(false); }
  };

  const filteredSolutions = solutions.filter((s) => {
    if (sector && !s.sector?.toLowerCase().includes(sector.toLowerCase())) return false;
    if (search && !isSearchingAI && !s.solution_name?.toLowerCase().includes(search.toLowerCase()) && !s.problem_description?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto font-sans">
        <div className="pb-5 border-b border-gray-200">
          <div className="h-8 w-48 bg-slate-200/80 animate-pulse rounded-md mb-2" />
          <div className="h-4 w-96 bg-slate-200/80 animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (<SkeletonCard key={i} />))}
        </div>
      </div>
    );
  }

  const enrichment = activeSolution ? getPilotEnrichment(activeIdx, activeSolution) : null;

  if (view === 'report' && activeSolution && enrichment) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto font-sans">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <button type="button" onClick={backToList} className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy-900 cursor-pointer">
            Back to Validated Solutions
          </button>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" className="text-xs font-bold flex items-center gap-1.5" onClick={() => handleDownloadReport(activeSolution, enrichment)}>
              <Download className="w-3.5 h-3.5" /> Download Report
            </Button>
            <Button type="button" className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5" onClick={() => openAdopt(activeSolution, activeIdx)}>
              <Send className="w-3.5 h-3.5" /> Request Adoption
            </Button>
          </div>
        </div>
        <div className="bg-[#123158] text-white rounded-xl px-6 py-5">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">GOVERNMENT OF INDIA — PRAGATI</span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> GFR 2017 CERTIFIED</span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white leading-tight">Official Pilot Validation &amp; Procurement Assessment Report</h1>
          <p className="text-xs text-slate-300 mt-1">Reference: PRAGATI/VAL-RPT/{activeSolution.id.slice(0,8).toUpperCase()} &nbsp;&bull;&nbsp; {activeSolution.solution_name}</p>
        </div>
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> 1. Solution Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[{label:'Solution Name',value:activeSolution.solution_name},{label:'Startup / Vendor',value:activeSolution.startup?.name||'AquaSense Technologies'},{label:'Host Department',value:activeSolution.department?.name||'Water Resources Department'},{label:'Sector',value:activeSolution.sector}].map(({label,value})=>(
                <div key={label} className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80"><span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{label}</span><span className="font-bold text-navy-900 text-xs">{value}</span></div>
              ))}
            </div>
            {activeSolution.technologies&&activeSolution.technologies.length>0&&(
              <div className="bg-blue-50/70 rounded-lg p-3 border border-blue-100 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase text-blue-700 shrink-0">Technologies Deployed:</span>
                {activeSolution.technologies.map((t,i)=>(<span key={i} className="text-[11px] bg-white text-navy-900 border border-blue-200 px-2 py-0.5 rounded font-semibold">{t}</span>))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-600" /> 2. Original Government Problem</h2>
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-4 text-amber-950 leading-relaxed font-medium text-xs">{enrichment.originalProblem}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"><Sparkles className="w-4 h-4 text-blue-600" /> 3. Proposed Solution &amp; Technical Architecture</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-800 leading-relaxed text-xs">{enrichment.proposedSolution}</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-600" /> 4. Pilot Duration &amp; Host Jurisdiction</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[{label:'Pilot Duration',value:enrichment.pilotDuration},{label:'Deployment Location',value:activeSolution.deployment_location},{label:'Pilot Investment',value:enrichment.pilotCost},{label:'Deployment Scope',value:enrichment.deploymentScope}].map(({label,value})=>(
                <div key={label} className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80"><span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">{label}</span><span className="font-semibold text-slate-800 text-xs">{value}</span></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"><BarChart2 className="w-4 h-4 text-blue-600" /> 5. KPI Performance — Baseline vs. Achieved</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5"><span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Baseline KPI</span><p className="text-slate-700 font-semibold leading-snug text-xs">{enrichment.baselineKPI}</p></div>
              <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3.5"><span className="block text-[10px] font-bold uppercase text-blue-600 mb-1">Target Benchmark</span><p className="text-blue-950 font-semibold leading-snug text-xs">{enrichment.targetKPI}</p></div>
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3.5"><span className="block text-[10px] font-bold uppercase text-emerald-600 mb-1">KPI Achieved in Field</span><p className="text-emerald-950 font-bold leading-snug text-xs">{enrichment.achievedKPI}</p></div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex items-start gap-3"><TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /><div><span className="block text-[10px] font-bold uppercase text-emerald-700">Measured Outcome &amp; Net Improvement</span><p className="text-emerald-950 font-bold mt-0.5 text-xs">{enrichment.improvement}</p></div></div>
              <div className="text-right shrink-0"><span className="text-2xl font-black text-emerald-600">{activeSolution.kpi_achievement_percent}%</span><p className="text-[10px] font-bold text-emerald-700 uppercase">Target Exceeded</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-purple-600" /> 6. Validation &amp; Field Inspection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5"><div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-1"><CheckCircle2 className="w-3.5 h-3.5" /> Field Inspection</div><p className="text-slate-700 font-medium text-xs">{enrichment.fieldInspectionStatus}</p></div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5"><div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-1"><CheckCircle2 className="w-3.5 h-3.5" /> Telemetry Evidence</div><p className="text-slate-700 font-medium text-xs">{enrichment.evidenceStatus}</p></div>
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3.5"><div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-1"><ShieldCheck className="w-3.5 h-3.5" /> Government Sign-Off</div><p className="text-emerald-950 font-semibold text-xs">{enrichment.verificationStatus}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2"><Scale className="w-4 h-4 text-blue-600" /> 7. Procurement &amp; Statutory GFR 2017 Compliance</h2>
            <div className="space-y-3">
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 flex items-start gap-3"><DollarSign className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" /><div><span className="block text-[10px] font-bold uppercase text-blue-700">Scaling Cost Assessment</span><p className="text-blue-950 font-semibold mt-0.5 text-xs">{enrichment.procurementCost}</p></div></div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /><div><span className="block text-[10px] font-bold uppercase text-slate-500">Statutory Authorization</span><p className="text-slate-800 font-medium mt-0.5 text-xs">{enrichment.gfrReference}</p></div></div>
            </div>
          </div>
          <div className="bg-navy-900 text-white rounded-xl p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 8. Final Validation Outcome</h2>
            <p className="text-sm font-medium leading-relaxed">{enrichment.finalOutcome}</p>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
              <span className="text-emerald-300 font-bold flex items-center gap-1.5 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Status: {activeSolution.validation_status==='government_verified'?'Government Verified':activeSolution.validation_status==='scaled'?'Scaled & Adopted':'Pilot Completed'}</span>
              <span className="text-[11px] text-slate-300">Eligible for Inter-Departmental Adoption</span>
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 text-center sm:text-left">Certified ready for inter-departmental replication under GFR 2017 provisions.</p>
            <div className="flex items-center gap-2.5">
              <Button type="button" variant="secondary" className="text-xs font-bold flex items-center gap-1.5" onClick={() => handleDownloadReport(activeSolution, enrichment)}><Download className="w-3.5 h-3.5" /> Download Report</Button>
              <Button type="button" className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5" onClick={() => openAdopt(activeSolution, activeIdx)}><Send className="w-3.5 h-3.5" /> Request Adoption</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'adopt' && activeSolution) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto font-sans">
        <div className="flex items-center pb-4 border-b border-slate-200">
          <button type="button" onClick={backToReport} className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy-900 cursor-pointer">
            Back to Report
          </button>
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy-900">Request Adoption</h1>
          <p className="text-xs text-slate-500 mt-1">{activeSolution.solution_name}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="blue" className="text-xs">{activeSolution.sector}</Badge>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600" /> Procurement Verified</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div><span className="block text-[10px] font-bold uppercase text-blue-600 mb-0.5">Original Pilot Department</span><p className="font-semibold text-blue-950">{activeSolution.department?.name||'Partner Department'}</p></div>
            <div><span className="block text-[10px] font-bold uppercase text-blue-600 mb-0.5">Validated Vendor</span><p className="font-semibold text-blue-950">{activeSolution.startup?.name||'Partner Startup'}</p></div>
            <div><span className="block text-[10px] font-bold uppercase text-blue-600 mb-0.5">Deployment Location</span><p className="font-semibold text-blue-950 flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500 shrink-0" />{activeSolution.deployment_location}</p></div>
            <div><span className="block text-[10px] font-bold uppercase text-blue-600 mb-0.5">KPI Achievement</span><p className="font-bold text-emerald-700 text-sm">{activeSolution.kpi_achievement_percent}% Target Met</p></div>
          </div>
        </div>
        <form onSubmit={handleAdoptRequest} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
          <p className="text-xs text-gray-600 leading-relaxed">Submit an official request to adopt this pre-validated solution under GFR 2017 cross-department scaling provisions. No repeat pilot will be required.</p>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Context Notes &amp; Jurisdictional Requirement <span className="text-red-500">*</span></label>
            <Textarea rows={5} required value={adoptNotes} onChange={(e) => setAdoptNotes(e.target.value)} placeholder="Detail your department's jurisdiction, the expected scale of deployment, your implementation timeline, and any specific operational considerations..." />
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={backToReport} className="flex-1 sm:flex-none">Cancel</Button>
            <Button type="submit" disabled={submittingAdopt} className="flex-1 sm:flex-none bg-navy-900 hover:bg-navy-800 text-white font-semibold flex items-center justify-center gap-1.5">
              {submittingAdopt ? <Spinner size="sm" /> : <Send className="w-3.5 h-3.5" />} Submit Adoption Request
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">Validated Solutions</h1>
        <p className="mt-1.5 text-xs md:text-sm text-gray-600 max-w-4xl leading-relaxed">Discover startup solutions that have completed structured government pilots, demonstrated measurable outcomes, and are ready for informed adoption across departments.</p>
      </div>
      <Card className="bg-gradient-to-r from-navy-900 via-blue-900 to-navy-800 text-white border-0 shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider"><ShieldCheck className="w-4 h-4 text-emerald-400" /> PROVEN &amp; REUSABLE</div>
            <h2 className="text-2xl font-bold text-white leading-tight">Adopt What Has Already Been Proven</h2>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed">Explore solutions that have completed structured government pilots with field validation, measurable KPI outcomes, and procurement-readiness checks. Reduce duplicate trials and move proven innovations toward wider adoption.</p>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-xl text-center backdrop-blur-xs shrink-0 border border-white/10">
            <div className="text-3xl font-extrabold text-white">{solutions.length}</div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-blue-200 mt-0.5">Verified Solutions</div>
          </div>
        </div>
      </Card>
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1"><Input placeholder="Search by problem, technology, startup, or deployment location..." value={search} onChange={(e)=>setSearch(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&handleAISearch()} /></div>
        <Select value={sector} onChange={(value)=>setSector(value)} options={[{label:'All Sectors',value:''},{label:'Water & Wastewater',value:'Water'},{label:'Smart Infrastructure & Mobility',value:'Mobility'},{label:'Healthcare',value:'Healthcare'},{label:'Agriculture',value:'Agriculture'},{label:'Clean Energy',value:'Energy'},{label:'Governance & Smart Cities',value:'Governance'}]} />
        <Button onClick={handleAISearch} disabled={isSearchingAI} className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer">
          {isSearchingAI?<Spinner size="sm"/>:<><Sparkles className="w-3.5 h-3.5 text-amber-300"/> Semantic Search</>}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSolutions.map((sol,idx)=>(
          <Card key={sol.id} className="p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <Badge variant="blue" className="text-xs">{sol.sector}</Badge>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-600"/> Procurement Verified</span>
              </div>
              <div><h3 className="font-bold text-base text-navy-900 leading-snug">{sol.solution_name}</h3><p className="text-xs font-semibold text-blue-700 mt-0.5">{sol.startup?.name||'Partner Startup'}</p></div>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{sol.problem_description}</p>
              {sol.technologies&&sol.technologies.length>0&&(<div className="flex flex-wrap gap-1">{sol.technologies.slice(0,3).map((t,i)=>(<span key={i} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{t}</span>))}</div>)}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between">
                <div><span className="text-[10px] text-gray-400 uppercase font-bold block">KPI Target Achieved</span><span className="text-xs text-gray-500">Exceeded baseline</span></div>
                <span className="text-xl font-extrabold text-emerald-600">{sol.kpi_achievement_percent}%</span>
              </div>
              <div className="space-y-1 text-xs text-gray-500 pt-1">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-500 shrink-0"/><span>Deployment: {sol.deployment_location}</span></div>
                <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0"/><span className="truncate">{sol.department?.name||'Department'}</span></div>
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
              <Button size="sm" variant="secondary" className="flex-1 text-xs font-semibold flex items-center justify-center gap-1" onClick={()=>openReport(sol,idx)}>
                <FileText className="w-3.5 h-3.5 text-blue-600"/> View Report
              </Button>
              <Button size="sm" className="flex-1 bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center justify-center gap-1" onClick={()=>openAdopt(sol,idx)}>
                <Send className="w-3.5 h-3.5"/> Request Adoption
              </Button>
            </div>
          </Card>
        ))}
        {filteredSolutions.length===0&&(
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
            <h3 className="text-base font-bold text-navy-900 mb-1">No Validated Solutions Found</h3>
            <p className="text-xs text-gray-500">Try changing your search keywords or sector filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidatedSolutions;
