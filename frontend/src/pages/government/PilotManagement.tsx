import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PageHeader } from '../../components/ui/PageHeader';
import { Spinner } from '../../components/ui/Spinner';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Pilot } from '../../types';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { SmartPilotProgress, getPilotProgressInfo } from '../../components/ui/SmartPilotProgress';
import { Milestone, KPI, IssueReport, FieldInspection } from '../../types';
import { getRatingForPilot } from '../../lib/ratingService';
import {
  Rocket,
  Briefcase,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  FileSearch,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
  FileCheck,
  AlertCircle,
  FolderOpen,
  Star,
  Award,
} from 'lucide-react';

type PilotSectionTab = 'overview' | 'milestones' | 'kpis' | 'evidence' | 'issues';

export const PilotManagement: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<PilotSectionTab>('overview');
  const [activeStatusTab, setActiveStatusTab] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [selectedPilotId, setSelectedPilotId] = useState<string>('');

  // Monitoring sub-tab data
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [inspections, setInspections] = useState<FieldInspection[]>([]);
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [subDataLoading, setSubDataLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/pilots');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setPilots(data);
      if (data.length > 0 && !selectedPilotId) {
        setSelectedPilotId(data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load pilots');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load detailed monitoring data when switching to sub-tabs
  useEffect(() => {
    if (!selectedPilotId || activeSection === 'overview') return;

    const loadMonitoringData = async () => {
      try {
        setSubDataLoading(true);
        const [mRes, kRes, iRes, issueRes] = await Promise.allSettled([
          api.get(`/api/pilots/${selectedPilotId}/milestones`),
          api.get(`/api/pilots/${selectedPilotId}/kpis`),
          api.get(`/api/pilots/${selectedPilotId}/inspections`),
          api.get(`/api/issues?pilot_id=${selectedPilotId}`),
        ]);

        if (mRes.status === 'fulfilled') {
          setMilestones(Array.isArray(mRes.value.data) ? mRes.value.data : (mRes.value.data?.data || []));
        }
        if (kRes.status === 'fulfilled') {
          setKpis(Array.isArray(kRes.value.data) ? kRes.value.data : (kRes.value.data?.data || []));
        }
        if (iRes.status === 'fulfilled') {
          setInspections(Array.isArray(iRes.value.data) ? iRes.value.data : (iRes.value.data?.data || []));
        }
        if (issueRes.status === 'fulfilled') {
          setIssues(Array.isArray(issueRes.value.data) ? issueRes.value.data : (issueRes.value.data?.data || []));
        }
      } catch (err) {
        console.error('Failed to load monitoring details', err);
      } finally {
        setSubDataLoading(false);
      }
    };

    loadMonitoringData();
  }, [selectedPilotId, activeSection]);

  const filtered = pilots.filter((p) => {
    if (activeStatusTab === 'all') return true;
    return p.status === activeStatusTab;
  });

  const activePilot = pilots.find((p) => p.id === selectedPilotId) || pilots[0];

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonList count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pilot Management & Monitoring"
        subtitle="Manage execution roadmaps, milestone verifications, KPI tracking, and field monitoring."
      />

      {/* Primary Section Tabs: Overview, Milestones, KPI Monitoring, Evidence, Issues */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Pilots', icon: Rocket },
            { id: 'milestones', label: 'Milestones', icon: Layers },
            { id: 'kpis', label: 'KPI Monitoring', icon: Target },
            { id: 'evidence', label: 'Evidence & Field', icon: FileCheck },
            { id: 'issues', label: 'Issues', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as PilotSectionTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg font-bold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Pilot Picker for Detail Tabs */}
        {activeSection !== 'overview' && pilots.length > 1 && (
          <div className="flex items-center gap-2 pb-2 text-xs">
            <span className="text-slate-500 font-medium">Focus Pilot:</span>
            <select
              value={selectedPilotId}
              onChange={(e) => setSelectedPilotId(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {pilots.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.pilot_number || p.id.substring(0, 8)} — {(p as any).problem?.title || 'Pilot'}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── SECTION 1: OVERVIEW & PILOT CARDS ─────────────────── */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Status Filter Tabs */}
          <div className="flex space-x-2">
            {(['all', 'active', 'completed', 'paused'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveStatusTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                  activeStatusTab === tab
                    ? 'bg-navy-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab} ({pilots.filter((p) => (tab === 'all' ? true : p.status === tab)).length})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">No Pilots Found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
                No pilot projects currently in this category. Select startups from the Applications section to launch new pilots.
              </p>
              <div className="mt-4">
                <Button onClick={() => navigate('/government/applications')}>Review Applications</Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filtered.map((pilot) => {
                const progressInfo = getPilotProgressInfo(pilot);
                const pilotTitle = (pilot as any).problem?.title || `Pilot ${pilot.pilot_number || pilot.id.substring(0, 8)}`;
                const startupName = (pilot as any).startup?.name || 'Selected Startup';
                const deptName = (pilot as any).department?.name || 'Department';

                return (
                  <Card
                    key={pilot.id}
                    className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                                {pilot.pilot_number || `PILOT-${pilot.id.substring(0, 8).toUpperCase()}`}
                              </span>
                              <Badge variant={pilot.status === 'completed' ? 'success' : 'active'} className="capitalize">
                                {pilot.status}
                              </Badge>
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${progressInfo.badgeClass}`}
                              >
                                <progressInfo.icon className="w-3 h-3" />
                                {progressInfo.label}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-navy-900">{pilotTitle}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                              <span className="font-semibold text-navy-800 flex items-center gap-1">
                                <Briefcase className="w-4 h-4 text-blue-600" />
                                Startup: {startupName}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span>Dept: {deptName}</span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics Bar with Timeline Comparison */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-gray-100 bg-gray-50/50 -mx-6 px-6">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Budget Utilized</p>
                            <p className="font-bold text-navy-900 text-sm">{formatCurrency(pilot.budget_utilized || 0)}</p>
                            <p className="text-xs text-gray-400">of {formatCurrency(pilot.budget_allocated)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Duration</p>
                            <p className="font-bold text-navy-900 text-sm flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-500" /> {pilot.duration_days || 90} Days
                            </p>
                            {pilot.start_date && (
                              <p className="text-xs text-gray-400">Started {formatDate(pilot.start_date)}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Schedule Health</p>
                            <p className={`font-bold text-sm flex items-center gap-1 ${progressInfo.dotColor}`}>
                              <progressInfo.icon className="w-3.5 h-3.5" />
                              {progressInfo.label}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              Exp: {progressInfo.expected}% (Δ {progressInfo.delta > 0 ? `+${progressInfo.delta}` : progressInfo.delta}%)
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase">Procurement</p>
                            <p className={`font-bold text-sm ${progressInfo.actual >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {progressInfo.actual >= 75 ? 'High Readiness' : 'In Progress'}
                            </p>
                            <p className="text-[11px] text-gray-400">GFR 2017 Sandbox</p>
                          </div>
                        </div>

                        {/* Smart Progress Bar comparing Actual vs Expected */}
                        <div>
                          <SmartPilotProgress pilot={pilot} />
                        </div>
                      </div>

                      {/* Action Column */}
                      <div className="flex flex-col gap-2.5 lg:w-56 shrink-0 justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <Button
                          className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2"
                          onClick={() => navigate(`/government/pilots/${pilot.id}/workspace`)}
                        >
                          Open Pilot Workspace
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full text-xs"
                          onClick={() => {
                            setSelectedPilotId(pilot.id);
                            setActiveSection('milestones');
                          }}
                        >
                          View Milestones
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full text-xs"
                          onClick={() => {
                            setSelectedPilotId(pilot.id);
                            setActiveSection('kpis');
                          }}
                        >
                          KPI Monitoring
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full text-xs text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                          onClick={() => navigate(`/government/procurement/${pilot.id}`)}
                        >
                          Procurement Readiness
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 2: MILESTONES ──────────────────────────────── */}
      {activeSection === 'milestones' && (
        <Card className="p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Milestone Roadmap — {activePilot?.pilot_number || 'Pilot Execution'}
              </h3>
              <p className="text-xs text-slate-500">
                Track sequential delivery stages, startup completion claims, and government inspection verifications.
              </p>
            </div>
            {activePilot && (
              <Button
                size="sm"
                className="bg-navy-900 text-white text-xs"
                onClick={() => navigate(`/government/pilots/${activePilot.id}/workspace`)}
              >
                Inspect in Workspace
              </Button>
            )}
          </div>

          {subDataLoading ? (
            <SkeletonList count={3} />
          ) : milestones.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No milestones currently logged for this pilot. View workspace to configure milestone tranches.
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((m, idx) => {
                const isVerified = m.status === 'inspector_verified';
                const isClaimed = m.status === 'startup_claimed';
                return (
                  <div
                    key={m.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                      isVerified
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : isClaimed
                        ? 'border-blue-200 bg-blue-50/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-500 uppercase">M{m.sequence_order || idx + 1}</span>
                        <h4 className="text-sm font-bold text-navy-900">{m.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : isClaimed
                              ? 'bg-blue-100 text-blue-800 border-blue-300'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {isVerified ? '✓ Inspector Verified' : isClaimed ? 'Startup Claimed — Under Review' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 max-w-xl">{m.description || 'Milestone verification requirements.'}</p>
                      {m.due_date && (
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due: {formatDate(m.due_date)}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {m.startup_evidence_url && (
                        <a
                          href={m.startup_evidence_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Evidence
                        </a>
                      )}
                      {activePilot && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs"
                          onClick={() => navigate(`/government/pilots/${activePilot.id}/workspace`)}
                        >
                          Manage
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* ── SECTION 3: KPI MONITORING ──────────────────────────── */}
      {activeSection === 'kpis' && (
        <Card className="p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Live KPI Metrics & Telemetry — {activePilot?.pilot_number || 'Pilot'}
              </h3>
              <p className="text-xs text-slate-500">
                Measure baseline vs actual sensor telemetry and performance deliverables.
              </p>
            </div>
            {activePilot && (
              <Button
                size="sm"
                className="bg-navy-900 text-white text-xs"
                onClick={() => navigate(`/government/pilots/${activePilot.id}/outcome`)}
              >
                View Full Outcomes
              </Button>
            )}
          </div>

          {subDataLoading ? (
            <SkeletonList count={3} />
          ) : kpis.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No KPIs registered for this pilot yet. Define baseline criteria in the Pilot Workspace.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kpis.map((kpi) => {
                const isOnTrack = kpi.status === 'on_track' || kpi.status === 'achieved';
                return (
                  <div key={kpi.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900 truncate">{kpi.metric_name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isOnTrack
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {kpi.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center py-2 bg-white rounded-lg border border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Baseline</p>
                        <p className="text-xs font-bold text-slate-700">{kpi.baseline_value} {kpi.unit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Target</p>
                        <p className="text-xs font-bold text-blue-700">{kpi.target_value} {kpi.unit}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Current</p>
                        <p className={`text-xs font-bold ${isOnTrack ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {kpi.current_value !== null ? `${kpi.current_value} ${kpi.unit}` : 'Pending'}
                        </p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">
                      <strong>Method:</strong> {kpi.measurement_method || 'Field sensor analysis'}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* ── SECTION 4: EVIDENCE & INSPECTIONS ───────────────────── */}
      {activeSection === 'evidence' && (
        <Card className="p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Field Inspection Records & Verified Evidence
              </h3>
              <p className="text-xs text-slate-500">
                Third-party inspection logs, site verification audit trails, and geo-tagged deliverables.
              </p>
            </div>
            {activePilot && (
              <Button
                size="sm"
                className="bg-navy-900 text-white text-xs"
                onClick={() => navigate(`/government/pilots/${activePilot.id}/inspection`)}
              >
                Schedule Inspection
              </Button>
            )}
          </div>

          {subDataLoading ? (
            <SkeletonList count={2} />
          ) : inspections.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No field inspections recorded yet for this pilot. Click above to schedule a site verification.
            </div>
          ) : (
            <div className="space-y-3">
              {inspections.map((insp) => (
                <div key={insp.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-navy-900">
                      Site Verification — {insp.location || 'Pilot Site'}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                      {insp.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{insp.notes || 'Inspection details and observations.'}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span>Scheduled: {formatDate(insp.scheduled_date)}</span>
                    {insp.inspection_date && <span>Conducted: {formatDate(insp.inspection_date)}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* ── SECTION 5: ISSUES & AUDIT ──────────────────────────── */}
      {activeSection === 'issues' && (
        <Card className="p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-navy-900">
                Risk & Issue Governance
              </h3>
              <p className="text-xs text-slate-500">
                Reported incidents, discrepancy reports, and corrective action workflows.
              </p>
            </div>
            {activePilot && (
              <Button
                size="sm"
                className="bg-navy-900 text-white text-xs"
                onClick={() => navigate(`/government/pilots/${activePilot.id}/issues`)}
              >
                Report New Issue
              </Button>
            )}
          </div>

          {subDataLoading ? (
            <SkeletonList count={2} />
          ) : issues.length === 0 ? (
            <div className="text-center py-12 text-emerald-600 bg-emerald-50/30 rounded-xl border border-dashed border-emerald-200 text-xs">
              <CheckCircle className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
              No active issues or compliance violations reported for this pilot.
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((iss) => (
                <div key={iss.id} className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-rose-900 uppercase tracking-wide">
                      {iss.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 uppercase">
                      {iss.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">{iss.description}</p>
                  <p className="text-[11px] text-slate-400">Reported: {formatDate(iss.report_date)}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default PilotManagement;

