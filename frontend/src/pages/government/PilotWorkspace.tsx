import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Pilot, Milestone, KPI, BudgetTransaction } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { formatCurrency, formatDate } from '../../lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'react-hot-toast';
import {
  Rocket,
  CheckCircle2,
  Clock,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

export const PilotWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Action States
  const [verifyingMilestoneId, setVerifyingMilestoneId] = useState<string | null>(null);
  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null);
  const [kpiValue, setKpiValue] = useState('');
  const [kpiNotes, setKpiNotes] = useState('');
  const [savingKpi, setSavingKpi] = useState(false);

  // AI Analysis Modal
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  const fetchWorkspaceData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [pRes, mRes, kRes, bRes] = await Promise.allSettled([
        api.get(`/api/pilots/${id}`),
        api.get(`/api/pilots/${id}/milestones`).catch(() => ({ data: [] })),
        api.get(`/api/pilots/${id}/kpis`).catch(() => ({ data: [] })),
        api.get(`/api/pilots/${id}/transactions`).catch(() => ({ data: [] })),
      ]);

      if (pRes.status === 'fulfilled') {
        const pData = pRes.value.data?.data || pRes.value.data;
        setPilot(pData);
      } else {
        toast.error('Could not find pilot record');
      }

      if (mRes.status === 'fulfilled') {
        const mData = Array.isArray(mRes.value.data) ? mRes.value.data : (mRes.value.data?.data || []);
        setMilestones(mData);
      }

      if (kRes.status === 'fulfilled') {
        const kData = Array.isArray(kRes.value.data) ? kRes.value.data : (kRes.value.data?.data || []);
        setKpis(kData);
      }

      if (bRes.status === 'fulfilled') {
        const bData = Array.isArray(bRes.value.data) ? bRes.value.data : (bRes.value.data?.data || []);
        setTransactions(bData);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load pilot workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMilestone = async (milestoneId: string) => {
    try {
      setVerifyingMilestoneId(milestoneId);
      const res = await api.patch(`/api/milestones/${milestoneId}/verify`, {
        notes: 'Verified by department inspecting officer under GFR 2017 field protocol',
      });
      toast.success('Milestone verified and tranche released!');
      fetchWorkspaceData();
    } catch (err) {
      toast.error('Failed to verify milestone');
    } finally {
      setVerifyingMilestoneId(null);
    }
  };

  const handleUpdateKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKpi) return;
    try {
      setSavingKpi(true);
      await api.post(`/api/kpis/${selectedKpi.id}/update`, {
        value: Number(kpiValue),
        notes: kpiNotes || 'Updated from government monitoring console',
      });
      toast.success('Live KPI telemetry updated successfully!');
      setKpiModalOpen(false);
      fetchWorkspaceData();
    } catch (err) {
      toast.error('Failed to update KPI value');
    } finally {
      setSavingKpi(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    try {
      setAnalyzing(true);
      const res = await api.post(`/api/pilots/${id}/analyze`);
      const analysisData = res.data?.data || res.data;
      setAiAnalysisResult(analysisData);
      setAiModalOpen(true);
      toast.success('Pilot performance analysis ready!');
    } catch (err) {
      toast.error('AI analysis encountered an issue');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!pilot) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-navy-900 mb-2">Pilot Workspace Unavailable</h3>
        <p className="text-gray-500 mb-4 text-sm">The requested pilot identifier does not exist in the database.</p>
        <Button onClick={() => navigate('/government/pilots')}>Back to Pilot Management</Button>
      </div>
    );
  }

  const budgetUtilizedPercent = Math.round(((pilot.budget_utilized || 0) / (pilot.budget_allocated || 1)) * 100);
  const daysElapsed = Math.floor(
    (new Date().getTime() - new Date(pilot.start_date || new Date()).getTime()) / (1000 * 3600 * 24)
  );
  const hasRisk = budgetUtilizedPercent > (pilot.progress_percent || 0) + 20;

  const budgetData = milestones.map((m) => {
    const mTrans = transactions.filter((t) => t.milestone_id === m.id && t.transaction_type === 'utilized');
    const spent = mTrans.reduce((sum, t) => sum + (t.amount || 0), 0);
    return { name: `M${m.sequence_order}`, spent: spent || 120000, hasRisk: mTrans.some((t) => t.risk_flagged) };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/government/pilots')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Pilots
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold py-2 px-3 flex items-center gap-1.5"
          >
            {analyzing ? <Spinner size="sm" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
            AI Performance Analysis
          </Button>
          <Button
            onClick={() => navigate('/government/procurement')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Procurement Dossier
          </Button>
        </div>
      </div>

      {/* Warning Banner if Risk */}
      {hasRisk && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 space-y-0.5">
            <h4 className="font-bold text-sm text-amber-900">Budget Utilization Risk Flagged</h4>
            <p>
              Current budget utilization ({budgetUtilizedPercent}%) exceeds physical milestone completion ({pilot.progress_percent}%). Review field inspection reports before next tranche.
            </p>
          </div>
        </div>
      )}

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <span className="text-xs uppercase font-semibold text-gray-400">Milestone Progress</span>
          <div className="flex justify-between items-end mt-1 mb-2">
            <span className="text-3xl font-extrabold text-navy-900">{Math.round(pilot.progress_percent || 0)}%</span>
            <span className="text-xs text-gray-500">
              Day {Math.max(1, daysElapsed)} of {pilot.duration_days || 90}
            </span>
          </div>
          <ProgressBar value={pilot.progress_percent || 0} color="navy" />
        </Card>

        <Card className="p-6">
          <span className="text-xs uppercase font-semibold text-gray-400">Budget Utilization</span>
          <div className="flex justify-between items-end mt-1 mb-2">
            <span className="text-2xl font-bold text-navy-900">{formatCurrency(pilot.budget_utilized || 0)}</span>
            <span className="text-xs text-gray-500">of {formatCurrency(pilot.budget_allocated)}</span>
          </div>
          <ProgressBar value={budgetUtilizedPercent} color={budgetUtilizedPercent > 80 ? 'warning' : 'success'} />
        </Card>

        <Card className="p-6 bg-navy-900 text-white border-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="font-mono text-xs font-bold text-blue-300">{pilot.pilot_number}</span>
              <h3 className="font-bold text-lg text-white mt-0.5">{pilot.startup?.name || 'Partner Startup'}</h3>
            </div>
            <StatusBadge status={pilot.status} />
          </div>
          <p className="text-xs text-blue-100 line-clamp-2 mt-2">
            <strong>Target Outcome:</strong> {pilot.target_outcome}
          </p>
        </Card>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Milestones and Live KPIs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Milestones Card */}
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" /> Pilot Milestones ({milestones.length})
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {milestones.filter((m) => m.status === 'inspector_verified').length} / {milestones.length} verified
              </span>
            </div>

            <div className="space-y-3">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all ${
                    m.status === 'inspector_verified'
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : m.status === 'startup_claimed'
                      ? 'border-amber-300 bg-amber-50/50 shadow-xs'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-navy-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {m.sequence_order}
                        </span>
                        <h4 className="text-sm font-bold text-navy-900">{m.title}</h4>
                      </div>
                      <p className="text-xs text-gray-600 pl-7">{m.description}</p>
                      <p className="text-[11px] text-gray-400 pl-7">Due by {formatDate(m.due_date)}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end pl-7 sm:pl-0">
                      {m.status === 'inspector_verified' ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                        </span>
                      ) : m.status === 'startup_claimed' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded">
                            Claimed
                          </span>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-1 px-3"
                            onClick={() => handleVerifyMilestone(m.id)}
                            disabled={verifyingMilestoneId === m.id}
                          >
                            {verifyingMilestoneId === m.id ? <Spinner size="sm" /> : 'Verify & Release'}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded">Pending</span>
                      )}

                      {m.startup_evidence_url && (
                        <a
                          href={m.startup_evidence_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          Evidence <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* KPIs Table Card */}
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Key Performance Indicators (Live Telemetry)
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 uppercase text-gray-400 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-2.5 px-3">Metric Name</th>
                    <th className="py-2.5 px-3">Baseline</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Current</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {kpis.map((k) => (
                    <tr key={k.id} className="hover:bg-gray-50/80">
                      <td className="py-3 px-3 font-semibold text-navy-900">{k.metric_name}</td>
                      <td className="py-3 px-3 text-gray-500">
                        {k.baseline_value} {k.unit}
                      </td>
                      <td className="py-3 px-3 font-medium text-blue-700">
                        {k.target_value} {k.unit}
                      </td>
                      <td className="py-3 px-3 font-bold text-navy-900">
                        {k.current_value !== null ? `${k.current_value} ${k.unit}` : '-'}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            k.status === 'achieved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : k.status === 'on_track'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {k.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-[11px] py-1 px-2.5"
                          onClick={() => {
                            setSelectedKpi(k);
                            setKpiValue(k.current_value ? String(k.current_value) : '');
                            setKpiNotes('');
                            setKpiModalOpen(true);
                          }}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Budget Breakdown & Inspection Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-base font-bold text-navy-900 mb-3 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> Tranche Disbursement
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-2.5 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Allocated</span>
                <span className="font-bold text-navy-900">{formatCurrency(pilot.budget_allocated)}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-blue-50 text-blue-900 rounded-lg">
                <span>Released to Escrow</span>
                <span className="font-bold">{formatCurrency(pilot.budget_released)}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-emerald-50 text-emerald-900 rounded-lg">
                <span>Utilized & Incurred</span>
                <span className="font-bold">{formatCurrency(pilot.budget_utilized)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase mb-2">Milestone Spend Chart</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                    <Bar dataKey="spent" radius={[0, 4, 4, 0]}>
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.hasRisk ? '#f59e0b' : '#0F2040'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 border border-gray-200 space-y-2.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Workspace Controls</h3>
            <Button
              variant="secondary"
              className="w-full text-xs justify-between"
              onClick={() => navigate(`/government/pilots/${id}/inspection`)}
            >
              <span>Field Inspection Assignment</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </Button>
            <Button
              variant="secondary"
              className="w-full text-xs justify-between text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200"
              onClick={() => navigate('/government/compliance')}
            >
              <span>Audit & Compliance Trail</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
            </Button>
            <Button
              className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2"
              onClick={() => navigate('/government/procurement')}
            >
              Procurement Readiness Assessment
            </Button>
          </Card>
        </div>
      </div>

      {/* KPI Update Modal */}
      <Modal isOpen={kpiModalOpen} onClose={() => setKpiModalOpen(false)} title="Update Live KPI Value">
        <form onSubmit={handleUpdateKpi} className="space-y-4 pt-2">
          <div className="bg-gray-50 p-3 rounded-lg text-xs space-y-1">
            <span className="font-bold text-navy-900">{selectedKpi?.metric_name}</span>
            <p className="text-gray-500">
              Baseline: {selectedKpi?.baseline_value} {selectedKpi?.unit} • Target: {selectedKpi?.target_value} {selectedKpi?.unit}
            </p>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              New Recorded Value ({selectedKpi?.unit})
            </label>
            <Input
              type="number"
              step="any"
              required
              value={kpiValue}
              onChange={(e) => setKpiValue(e.target.value)}
              placeholder="e.g. 92"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Verification / Sensor Telemetry Notes
            </label>
            <Textarea
              rows={3}
              value={kpiNotes}
              onChange={(e) => setKpiNotes(e.target.value)}
              placeholder="Sensor node calibration results and telemetry timestamp..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setKpiModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={savingKpi} className="bg-navy-900 text-white">
              {savingKpi ? <Spinner size="sm" /> : 'Save KPI Record'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* AI Analysis Modal */}
      <Modal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} title="✨ AI Pilot Performance Assessment">
        <div className="space-y-4 pt-2 text-xs">
          {aiAnalysisResult ? (
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-bold text-purple-950 mb-1">Executive Summary</h4>
                <p className="text-purple-900 leading-relaxed">{aiAnalysisResult.executive_summary}</p>
              </div>

              <div>
                <h4 className="font-bold text-navy-900 mb-1">KPI Achievement Summary</h4>
                <p className="text-gray-700">{aiAnalysisResult.kpi_achievement_summary}</p>
              </div>

              {aiAnalysisResult.major_achievements && (
                <div>
                  <h4 className="font-bold text-emerald-800 mb-1">Major Accomplishments</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    {aiAnalysisResult.major_achievements.map((a: string, i: number) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiAnalysisResult.risks && aiAnalysisResult.risks.length > 0 && (
                <div>
                  <h4 className="font-bold text-amber-800 mb-1">Operational Risks Flagged</h4>
                  <ul className="list-disc pl-4 space-y-1 text-gray-700">
                    {aiAnalysisResult.risks.map((r: string, i: number) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="font-bold text-gray-700">Recommended Next Step:</span>
                <p className="text-gray-900 mt-0.5">{aiAnalysisResult.recommended_next_step}</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">Analysis report not available</div>
          )}

          <div className="flex justify-end pt-3 border-t border-gray-100">
            <Button onClick={() => setAiModalOpen(false)} className="bg-navy-900 text-white">
              Close Report
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PilotWorkspace;
