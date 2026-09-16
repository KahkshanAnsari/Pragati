import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  User,
  Sparkles,
  MessageSquare,
  AlertCircle,
  FileCheck,
  MapPin,
  Mail,
  Send,
  Edit3,
  Check,
  Plus,
  Rocket
} from 'lucide-react';
import { GovernmentProject, ProjectMilestone, ProjectUpdate } from '../../types';
import { getProjectById, updateProject, updateMilestoneStatus, addProjectUpdate } from '../../lib/projectService';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SkeletonProjectDetail } from '../../components/ui/Skeleton';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';

export function GovernmentProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [project, setProject] = useState<GovernmentProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'kpis' | 'updates' | 'lineage'>('overview');

  // Form states
  const [newUpdateText, setNewUpdateText] = useState('');
  const [updateType, setUpdateType] = useState<'progress' | 'issue' | 'field_visit' | 'general'>('field_visit');
  const [submittingUpdate, setSubmittingUpdate] = useState(false);

  // Edit progress/budget modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProgress, setEditProgress] = useState(0);
  const [editBudgetUtilized, setEditBudgetUtilized] = useState(0);
  const [editDeploymentCurrent, setEditDeploymentCurrent] = useState(0);
  const [editOfficerNotes, setEditOfficerNotes] = useState('');

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const data = await getProjectById(id);
      setProject(data);
      if (data) {
        setEditProgress(data.progress_percent);
        setEditBudgetUtilized(data.budget_utilized);
        setEditDeploymentCurrent(data.deployment_current);
        setEditOfficerNotes(data.officer_notes || '');
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleMilestoneAction = async (milestoneId: string, newStatus: 'completed' | 'in_progress') => {
    if (!project) return;
    try {
      const note = newStatus === 'completed'
        ? `Verified and signed off by ${(profile as any)?.name || 'Nodal Officer'} on ${new Date().toLocaleDateString('en-IN')}`
        : 'Work in progress; inspected by field team';
      const updatedMs = await updateMilestoneStatus(project.id, milestoneId, newStatus, note);

      setProject((prev) => {
        if (!prev) return prev;
        const milestones = prev.milestones?.map((m) => (m.id === milestoneId ? { ...m, ...updatedMs } : m)) || [];
        const completed = milestones.filter((m) => m.status === 'completed').length;
        const total = milestones.length;
        const progress_percent = total > 0 ? Math.round((completed / total) * 100) : prev.progress_percent;
        const status = progress_percent >= 100 ? 'completed' : prev.status;
        return { ...prev, milestones, progress_percent, status };
      });
      toast.success(`Milestone marked as ${newStatus}!`);
    } catch (err) {
      toast.error('Failed to update milestone status');
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newUpdateText.trim()) return;
    setSubmittingUpdate(true);
    try {
      const up = await addProjectUpdate(project.id, {
        authorRole: 'government_officer',
        authorName: (profile as any)?.name || 'Joint Commissioner',
        updateText: newUpdateText.trim(),
        updateType: updateType
      });
      setProject((prev) => {
        if (!prev) return prev;
        const updates = prev.updates ? [up, ...prev.updates] : [up];
        return { ...prev, updates };
      });
      setNewUpdateText('');
      toast.success('Official field observation logged successfully!');
    } catch (err) {
      toast.error('Failed to post observation');
    } finally {
      setSubmittingUpdate(false);
    }
  };

  const handleSaveProjectMetrics = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      const status = editProgress >= 100 ? 'completed' : project.status;
      const updated = await updateProject(project.id, {
        progress_percent: editProgress,
        budget_utilized: editBudgetUtilized,
        deployment_current: editDeploymentCurrent,
        officer_notes: editOfficerNotes,
        status: status as any
      });
      setProject((prev) => prev ? { ...prev, ...updated } : prev);
      setShowEditModal(false);
      toast.success('Project metrics updated successfully!');
    } catch (err) {
      toast.error('Failed to update project metrics');
    }
  };

  const handleRecommendScaleUp = async () => {
    if (!project) return;
    try {
      const updated = await updateProject(project.id, {
        scale_up_status: 'scaled',
        officer_notes: `${project.officer_notes || ''} [RECOMMENDED FOR STATEWIDE SCALE-UP BY NODAL OFFICER]`.trim()
      });
      setProject((prev) => prev ? { ...prev, ...updated } : prev);
      toast.success('Project recommended for statewide scale-up!');
    } catch (err) {
      toast.error('Failed to recommend scale-up');
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
          onClick={() => navigate('/government/projects')}
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
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate('/government/projects')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-navy-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Government Projects</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Update Metrics & Notes</span>
          </button>

          {project.scale_up_status !== 'scaled' && (
            <button
              onClick={handleRecommendScaleUp}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Authorize Scale-Up</span>
            </button>
          )}

          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
            {project.project_number}
          </span>
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
              <span className="text-xs text-slate-700 font-bold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Startup: {project.startup?.name}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.project_name}
            </h1>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Quick Details Box */}
          <div className="flex flex-row lg:flex-col gap-3 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[220px]">
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Governing Officer</div>
              <div className="text-xs font-bold text-slate-900">{project.officer?.name || 'Nodal Officer'}</div>
              <div className="text-[10px] text-slate-500">{project.officer?.designation}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Work Order & GeM Dossier</div>
              <div className="text-xs font-mono font-bold text-slate-800">{project.work_order_number || 'WO-GOV-2026'}</div>
            </div>
            {project.government_evaluation && (
              <div className="pt-2 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Official Rating</div>
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
              <span>Budget Utilized</span>
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
              <span>Deployment Coverage</span>
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
            activeTab === 'overview' ? 'bg-navy-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Project Overview
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'milestones' ? 'bg-navy-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Manage Milestones ({completedMilestones}/{totalMilestones})</span>
        </button>
        <button
          onClick={() => setActiveTab('kpis')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'kpis' ? 'bg-navy-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>KPI Compliance ({project.kpi_achievement_percent}%)</span>
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'updates' ? 'bg-navy-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Field Inspections & Observations ({project.updates?.length || 0})</span>
        </button>
        <button
          onClick={() => setActiveTab('lineage')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shrink-0 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'lineage' ? 'bg-navy-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Pilot & Procurement Provenance</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Target className="w-4 h-4 text-blue-600" />
                Deployment Coverage & Mandate
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-4">
                <div className="text-xs font-bold text-slate-800 mb-1">Target Scope</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {project.deployment_scope}
                </p>
                <div className="mt-3 flex items-center gap-4 text-xs font-medium text-slate-700">
                  <div>
                    <span className="text-slate-400">Currently Operational:</span>{' '}
                    <span className="font-bold text-emerald-700">{project.deployment_current} {project.deployment_unit || 'Units'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Target:</span>{' '}
                    <span className="font-bold text-slate-900">{project.deployment_target} {project.deployment_unit || 'Units'}</span>
                  </div>
                </div>
              </div>

              {project.officer_notes && (
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    Government Inspection & Sign-Off Record
                  </div>
                  <p className="text-xs text-blue-900/90 leading-relaxed">
                    "{project.officer_notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Quick Milestones Checklist */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Deliverables & Verification Status
                </h3>
                <button
                  onClick={() => setActiveTab('milestones')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Manage All →
                </button>
              </div>

              <div className="space-y-3">
                {project.milestones?.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${
                        m.status === 'completed' ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}>
                        {m.status === 'completed' ? '✓' : m.sequence_order}
                      </div>
                      <span className="font-bold text-slate-800 truncate">{m.title}</span>
                    </div>
                    <div>
                      {m.status === 'completed' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Verified</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Startup Info & Provenance */}
          <div className="space-y-6">
            {/* Startup Info Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Awarded Startup Innovator
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {project.startup?.name?.charAt(0) || 'S'}
                </div>
                <div className="truncate">
                  <div className="text-sm font-bold text-slate-900">
                    {project.startup?.name || 'Startup Innovator'}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Founder: {project.startup?.founder_name || 'Innovator'}
                  </div>
                  <div className="text-xs text-emerald-700 font-semibold mt-1">
                    DPIIT Recognition: {project.startup?.dpiit_recognition_number || 'Verified'}
                  </div>
                  <div className="text-xs text-slate-600 mt-1 font-mono">
                    {project.startup?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Pilot Traceability Card */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-xl border border-blue-200/80 p-5 shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Qualifying Pilot Lineage
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-slate-500">Pilot Number</span>
                  <span className="font-bold font-mono text-slate-900">{project.pilot?.pilot_number || 'PILOT-VERIFIED'}</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-slate-500">Pilot Rating</span>
                  <span className="font-bold text-amber-600">★ {project.government_evaluation || '4.8'} / 5.0</span>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-white border border-slate-200/80">
                  <span className="text-slate-500">Scale-Up Status</span>
                  <span className="font-bold text-emerald-700">
                    {project.scale_up_status?.toUpperCase() || 'RECOMMENDED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage Milestones */}
      {activeTab === 'milestones' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Project Milestones & Verification Controls</h3>
              <p className="text-xs text-slate-500">Review deliverables and sign off on completion tranches.</p>
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
                  <div className="flex flex-wrap items-start justify-between gap-3">
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
                              <span className="text-emerald-700 font-semibold">Verified: {formatDate(m.completed_date)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Officer Action Buttons */}
                    <div className="flex items-center gap-2">
                      {!isMsCompleted && (
                        <button
                          onClick={() => handleMilestoneAction(m.id, 'completed')}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          <Check className="w-3 h-3" />
                          Sign Off & Mark Completed
                        </button>
                      )}
                      {!isMsCompleted && !isInProgress && (
                        <button
                          onClick={() => handleMilestoneAction(m.id, 'in_progress')}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {isMsCompleted && (
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ Officially Verified
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
              <h3 className="text-sm font-bold text-slate-900">Performance Indicators & SLAs</h3>
              <p className="text-xs text-slate-500">Mandatory metrics monitored under the procurement contract.</p>
            </div>
            <div className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Performance: {project.kpi_achievement_percent}%
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

      {/* Tab 4: Field Observations */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          {/* Post Officer Observation Form */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-blue-600" />
              Record Official Field Observation / Inspection Note
            </h3>
            <form onSubmit={handleAddUpdate} className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs font-medium text-slate-600">Category:</label>
                <select
                  value={updateType}
                  onChange={(e: any) => setUpdateType(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1"
                >
                  <option value="field_visit">Field Inspection Visit</option>
                  <option value="progress">Progress Verification</option>
                  <option value="issue">Issue / Delay Log</option>
                  <option value="general">General Note</option>
                </select>
              </div>

              <textarea
                value={newUpdateText}
                onChange={(e) => setNewUpdateText(e.target.value)}
                placeholder="Record inspection details, telemetry verification, site visits, or instructions to the startup..."
                rows={3}
                className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingUpdate || !newUpdateText.trim()}
                  className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submittingUpdate ? 'Logging...' : 'Log Official Observation'}
                </button>
              </div>
            </form>
          </div>

          {/* Observations List */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Audit Log & Field Observations</h3>
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

      {/* Tab 5: Provenance */}
      {activeTab === 'lineage' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Procurement Lineage & Pilot Provenance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Traceable chain from original government challenge through pilot to awarded project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-2">Pilot Performance Certification</div>
              <div className="space-y-1.5 text-slate-600">
                <div><span className="font-semibold">Pilot ID:</span> {project.pilot?.pilot_number || 'PILOT-VERIFIED'}</div>
                <div><span className="font-semibold">KPI Score:</span> 94% Achieved</div>
                <div><span className="font-semibold">Government Rating:</span> ★ 4.8 / 5.0 (Passed)</div>
                <div><span className="font-semibold">Outcome:</span> Successful Pilot Clearance</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="font-bold text-slate-800 mb-2">Procurement Authorization</div>
              <div className="space-y-1.5 text-slate-600">
                <div><span className="font-semibold">Authority:</span> GFR 2017 Rule 149 / Innovation Exemption</div>
                <div><span className="font-semibold">Dossier ID:</span> {project.procurement_case_id || '0c000001-1111-4111-8111-000000000001'}</div>
                <div><span className="font-semibold">Work Order Ref:</span> {project.work_order_number}</div>
                <div><span className="font-semibold">Status:</span> Formally Approved for Enterprise Deployment</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metrics Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Update Project Execution Metrics</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProjectMetrics} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Overall Progress Percentage ({editProgress}%)
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Budget Utilized (₹)
                </label>
                <input
                  type="number"
                  value={editBudgetUtilized}
                  onChange={(e) => setEditBudgetUtilized(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Deployment Coverage (Current: {editDeploymentCurrent} of {project.deployment_target})
                </label>
                <input
                  type="number"
                  value={editDeploymentCurrent}
                  onChange={(e) => setEditDeploymentCurrent(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Official Officer Inspection Notes
                </label>
                <textarea
                  value={editOfficerNotes}
                  onChange={(e) => setEditOfficerNotes(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
