import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  ShieldCheck,
  Target,
  IndianRupee,
  Layers,
  FileText,
  User,
  Sparkles,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  FileCheck,
  ChevronRight,
  MapPin,
  Mail,
  Send
} from 'lucide-react';
import { GovernmentProject, ProjectMilestone, ProjectUpdate } from '../../types';
import { getProjectById, addProjectUpdate } from '../../lib/projectService';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SkeletonProjectDetail } from '../../components/ui/Skeleton';
import { toast } from 'react-hot-toast';

export function GovernmentProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<GovernmentProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'kpis' | 'updates' | 'lineage'>('overview');
  const [newUpdateText, setNewUpdateText] = useState('');
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const data = await getProjectById(id);
      setProject(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newUpdateText.trim()) return;
    setSubmittingUpdate(true);
    try {
      const up = await addProjectUpdate(project.id, {
        authorRole: 'startup',
        authorName: project.startup?.name || 'Startup Lead',
        updateText: newUpdateText.trim(),
        updateType: 'progress'
      });
      setProject((prev) => {
        if (!prev) return prev;
        const updates = prev.updates ? [up, ...prev.updates] : [up];
        return { ...prev, updates };
      });
      setNewUpdateText('');
      toast.success('Progress update submitted successfully!');
    } catch (err) {
      toast.error('Failed to post update');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  if (loading) {
    return <SkeletonProjectDetail />;
  }

  if (!project) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-slate-200 max-w-xl mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Project Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested government project could not be found.
        </p>
        <button
          onClick={() => navigate('/startup/projects')}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-navy-900 text-white rounded-lg text-xs font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Government Projects
        </button>
      </div>
    );
  }

  const isCompleted = project.status === 'completed';
  const completedMilestones = project.milestones?.filter((m) => m.status === 'completed').length || 0;
  const totalMilestones = project.milestones?.length || 0;
  const budgetPct = Math.min(Math.round((project.budget_utilized / (project.budget_allocated || 1)) * 100), 100);
  const deployPct = Math.min(Math.round((project.deployment_current / (project.deployment_target || 1)) * 100), 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/startup/projects')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Government Projects</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {project.project_number}
          </span>
          {isCompleted ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> In Progress ({project.progress_percent}%)
            </span>
          )}
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                {project.sector}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {project.department?.name}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.department?.location || 'India'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.project_name}
            </h1>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-row lg:flex-col gap-3 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[220px]">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Work Order Ref</div>
              <div className="text-xs font-mono font-bold text-slate-800">{project.work_order_number || 'WO-GOV-2026'}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">GeM Procurement Ref</div>
              <div className="text-xs font-mono font-bold text-blue-700">{project.procurement_reference || 'GEM/2026/0411'}</div>
            </div>
            {project.government_evaluation && (
              <div className="pt-2 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Government Rating</div>
                <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  ★ {project.government_evaluation} / 5.0 (Certified)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 Summary Metric Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          {/* Progress */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Overall Progress</span>
              <span className="font-bold text-blue-700">{project.progress_percent}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={project.progress_percent} size="sm" showLabel />
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              {completedMilestones} of {totalMilestones} Milestones Completed
            </div>
          </div>

          {/* Budget */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Budget Outlay</span>
              <span className="font-bold text-slate-800">{budgetPct}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={budgetPct} size="sm" showLabel />
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              <span className="font-bold text-slate-900">{formatCurrency(project.budget_utilized)}</span> of {formatCurrency(project.budget_allocated)}
            </div>
          </div>

          {/* Deployment Scope */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Deployment Scope</span>
              <span className="font-bold text-emerald-700">{deployPct}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={deployPct} size="sm" showLabel />
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-medium">
              <span className="font-bold text-slate-900">{project.deployment_current}</span> of {project.deployment_target} {project.deployment_unit || 'Units'}
            </div>
          </div>

          {/* KPI Fulfillment */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>KPI Achievement</span>
              <span className="font-bold text-purple-700">{project.kpi_achievement_percent}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar value={Math.min(project.kpi_achievement_percent, 100)} size="sm" showLabel />
            </div>
            <div className="text-[11px] text-purple-700 mt-2 font-semibold flex items-center gap-1">
              <Award className="w-3 h-3" /> Verified Performance
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Project Overview
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'milestones'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Milestones ({completedMilestones}/{totalMilestones})</span>
        </button>
        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'kpis'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>KPI Monitoring ({project.kpi_achievement_percent}%)</span>
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'updates'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Field Updates & Logs ({project.updates?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('lineage')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'lineage'
              ? 'bg-navy-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Pilot & Procurement Lineage</span>
        </button>
      </div>

      {/* Tab 1: Project Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Deployment Scope Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-blue-600" />
                Deployment Scope & Operational Footprint
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4">
                <div className="text-xs font-bold text-slate-800 mb-1">Target Coverage</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {project.deployment_scope}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-700">
                  <div>
                    <span className="text-slate-400">Current Commissioned:</span>{' '}
                    <span className="font-bold text-emerald-700">{project.deployment_current} {project.deployment_unit || 'Units'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Full Target:</span>{' '}
                    <span className="font-bold text-slate-900">{project.deployment_target} {project.deployment_unit || 'Units'}</span>
                  </div>
                </div>
              </div>

              {/* Officer Notes */}
              {project.officer_notes && (
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    Nodal Officer Observation / Sign-Off Note
                  </div>
                  <p className="text-xs text-blue-900/90 leading-relaxed">
                    "{project.officer_notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Recent Updates Snapshot */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  Latest Government & Field Observations
                </h3>
                <button
                  onClick={() => setActiveTab('updates')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  View All ({project.updates?.length || 0}) →
                </button>
              </div>

              <div className="space-y-3">
                {project.updates?.slice(0, 3).map((up) => (
                  <div key={up.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-slate-800">{up.author_name}</span>
                      <span className="text-[11px] text-slate-400">{formatDate(up.created_at)}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {up.update_text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Nodal Officer & Lineage Summary */}
          <div className="space-y-6">
            {/* Government Officer Contact Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Government Nodal Authority
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {project.officer?.name?.charAt(0) || 'O'}
                </div>
                <div className="truncate">
                  <div className="text-sm font-bold text-slate-900">
                    {project.officer?.name || 'Government Nodal Officer'}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {project.officer?.designation || 'Joint Commissioner'}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-1">
                    {project.department?.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-600 mt-2 font-mono">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{project.officer?.official_email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Traceable Pilot Lineage Card */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-blue-200/80 p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Procurement Provenance
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                This project originated from a successful government innovation pilot verified under PRAGATI.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-slate-500">Pilot Number</span>
                  <span className="font-bold font-mono text-slate-900">{project.pilot?.pilot_number || 'PILOT-VERIFIED'}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-slate-500">Pilot Status</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {project.pilot?.status?.toUpperCase() || 'COMPLETED'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-slate-500">Evaluation Rating</span>
                  <span className="font-bold text-amber-600">★ {project.government_evaluation || '4.8'} / 5.0</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-slate-500">Procurement Case</span>
                  <span className="font-bold text-blue-700">Approved (GFR 149)</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => setActiveTab('lineage')}
                  className="w-full py-2 bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-200 transition-colors cursor-pointer text-center"
                >
                  View Complete Lineage Audit Trail →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Milestones & Deliverables</h3>
              <p className="text-xs text-slate-500">Official stages agreed in government work order.</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {completedMilestones} of {totalMilestones} Completed
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {project.milestones?.map((m, idx) => {
              const isMsCompleted = m.status === 'completed';
              const isInProgress = m.status === 'in_progress';
              return (
                <div
                  key={m.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isMsCompleted
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isInProgress
                      ? 'bg-blue-50/40 border-blue-200 ring-1 ring-blue-500/20'
                      : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isMsCompleted
                            ? 'bg-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isMsCompleted ? '✓' : idx + 1}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{m.title}</h4>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Due: {formatDate(m.due_date)}</span>
                          {m.completed_date && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 font-semibold">Completed: {formatDate(m.completed_date)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      {isMsCompleted ? (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Completed
                        </span>
                      ) : isInProgress ? (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          In Progress
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 ml-9 leading-relaxed">
                    {m.description}
                  </p>

                  {m.government_notes && (
                    <div className="mt-3 ml-9 p-2.5 rounded-lg bg-white/80 border border-slate-200/80 text-[11px] text-slate-700">
                      <span className="font-bold text-slate-900">Government Note:</span> {m.government_notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: KPIs */}
      {activeTab === 'kpis' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Performance Indicators (KPIs)</h3>
              <p className="text-xs text-slate-500">Metrics monitored under the government work order.</p>
            </div>
            <div className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Average KPI: {project.kpi_achievement_percent}%
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Metric</th>
                  <th className="pb-3 font-semibold text-center">Baseline</th>
                  <th className="pb-3 font-semibold text-center">Target</th>
                  <th className="pb-3 font-semibold text-center">Current Achieved</th>
                  <th className="pb-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.kpis?.map((k, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 font-bold text-slate-900">{k.metric_name}</td>
                    <td className="py-3.5 text-center text-slate-500">{k.baseline_value} {k.unit}</td>
                    <td className="py-3.5 text-center font-semibold text-slate-700">{k.target_value} {k.unit}</td>
                    <td className="py-3.5 text-center font-bold text-blue-700">{k.current_value} {k.unit}</td>
                    <td className="py-3.5 text-right">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                        k.status === 'achieved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : k.status === 'on_track'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {k.status === 'achieved' ? 'Achieved' : k.status === 'on_track' ? 'On Track' : 'At Risk'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Updates & Observations */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          {/* Post Progress Update Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-600" />
              Post Startup Deployment Update
            </h3>
            <form onSubmit={handleAddUpdate} className="space-y-3">
              <textarea
                value={newUpdateText}
                onChange={(e) => setNewUpdateText(e.target.value)}
                placeholder="Describe progress, sensor deployments, field tests, or operational observations..."
                rows={3}
                className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingUpdate || !newUpdateText.trim()}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submittingUpdate ? 'Submitting...' : 'Post Progress Update'}
                </button>
              </div>
            </form>
          </div>

          {/* Updates Timeline List */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Deployment Log & Field Observations</h3>
            <div className="space-y-3.5">
              {project.updates?.map((up) => (
                <div key={up.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{up.author_name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        up.author_role === 'government_officer'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {up.author_role === 'government_officer' ? 'Government Official' : 'Startup Lead'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{formatDate(up.created_at)}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {up.update_text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Complete Lineage Audit Trail */}
      {activeTab === 'lineage' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              End-to-End Innovation-to-Procurement Lifecycle
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete verified audit trail from problem registry through pilot validation to enterprise procurement.
            </p>
          </div>

          {/* Stepper Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Step 1</div>
              <div className="font-bold text-slate-800 mt-1">Problem Registry</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Challenge defined by department</div>
              <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Published
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Step 2</div>
              <div className="font-bold text-slate-800 mt-1">Evaluation & Selection</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Multi-criteria committee score</div>
              <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Selected for Pilot
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Step 3</div>
              <div className="font-bold text-slate-800 mt-1">Pilot Execution</div>
              <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{project.pilot?.pilot_number || 'PILOT-VERIFIED'}</div>
              <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 100% Validated
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Step 4</div>
              <div className="font-bold text-slate-800 mt-1">Procurement Dossier</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Rule 149 GFR Certification</div>
              <div className="mt-2 text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Approved
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
              <div className="text-[10px] font-bold text-blue-600 uppercase">Step 5</div>
              <div className="font-bold text-blue-900 mt-1">Government Project</div>
              <div className="text-[11px] text-blue-700 mt-0.5">Full deployment scale</div>
              <div className="mt-2 text-[10px] text-blue-800 font-bold flex items-center gap-1">
                {isCompleted ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-blue-600" />}
                {isCompleted ? 'Completed 100%' : 'Active 70%'}
              </div>
            </div>
          </div>

          {/* Traceable Records Box */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
            <div className="text-xs font-bold text-slate-800">Linked Database Records</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Pilot Record ID</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5 truncate">{project.pilot_id}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Validated Solution ID</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5 truncate">{project.validated_solution_id || '0b000001-1111-4111-8111-000000000001'}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Procurement Case ID</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5 truncate">{project.procurement_case_id || '0c000001-1111-4111-8111-000000000001'}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Startup Registration</div>
                <div className="font-mono font-bold text-slate-800 mt-0.5 truncate">{project.startup?.dpiit_recognition_number || 'DPIIT Verified'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
