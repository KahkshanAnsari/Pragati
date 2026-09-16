import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  ShieldCheck,
  Target,
  IndianRupee,
  Layers,
  Search,
  Users,
  Sparkles
} from 'lucide-react';
import { GovernmentProject } from '../../types';
import { getAllProjects } from '../../lib/projectService';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { SkeletonProjectList } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../stores/authStore';

export function GovernmentProjects() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [projects, setProjects] = useState<GovernmentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      const all = await getAllProjects();
      setProjects(all);
      setLoading(false);
    }
    load();
  }, []);

  const officerProfile = profile as any;
  const officerDeptName = officerProfile?.department?.name || 'Water Resources Department, Nagpur';

  const filteredProjects = projects.filter((p) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && p.status === 'active') ||
      (filter === 'completed' && p.status === 'completed');
    const matchesSearch =
      p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.startup?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.department?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalAllocated = projects.reduce((acc, p) => acc + p.budget_allocated, 0);
  const totalUtilized = projects.reduce((acc, p) => acc + p.budget_utilized, 0);
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const activeCount = projects.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-md border border-navy-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Department Innovation Procurement & Project Tracking</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Government Projects
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Monitor and govern scale-up project deployments awarded to certified startups post successful pilot clearance. Oversee milestone disbursements, field observations, and KPI compliance.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
            <div className="text-slate-400 text-[11px]">Governing Jurisdiction</div>
            <div className="font-bold text-white">{officerDeptName}</div>
            <div className="text-emerald-300 text-[11px] font-medium">GFR Rule 149 Authorized</div>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3.5 backdrop-blur-xs border border-white/10">
            <div className="text-xs text-slate-300 font-medium">Total Projects</div>
            <div className="text-2xl font-bold text-white mt-1">{projects.length}</div>
            <div className="text-[11px] text-blue-300 font-medium mt-0.5">Post-Pilot Contracts</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 backdrop-blur-xs border border-white/10">
            <div className="text-xs text-slate-300 font-medium">In Active Deployment</div>
            <div className="text-2xl font-bold text-amber-300 mt-1">{activeCount}</div>
            <div className="text-[11px] text-amber-200/80 font-medium mt-0.5">Live Operations</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 backdrop-blur-xs border border-white/10">
            <div className="text-xs text-slate-300 font-medium">Successfully Completed</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{completedCount}</div>
            <div className="text-[11px] text-emerald-300 font-medium mt-0.5">100% Commissioned</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3.5 backdrop-blur-xs border border-white/10">
            <div className="text-xs text-slate-300 font-medium">Public Outlay Managed</div>
            <div className="text-2xl font-bold text-white mt-1">{formatCurrency(totalAllocated)}</div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">Utilized: {formatCurrency(totalUtilized)}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project name, startup, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-navy-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Deployments ({projects.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              filter === 'active'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              filter === 'completed'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <SkeletonProjectList count={3} />
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Projects Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            No government projects match your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredProjects.map((project) => {
            const isCompleted = project.status === 'completed';
            const completedMilestones = project.milestones?.filter((m) => m.status === 'completed').length || 0;
            const totalMilestones = project.milestones?.length || 0;

            return (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md p-6"
              >
                {/* Header Line */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 font-mono">
                      {project.project_number}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {project.sector}
                    </span>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      Startup: {project.startup?.name}
                    </span>
                    {project.scale_up_status === 'scaled' && (
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        State Scale-Up
                      </span>
                    )}
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Completed (100%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        In Progress ({project.progress_percent}%)
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-extrabold text-slate-900">
                  {project.project_name}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Department Info */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.department?.name}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{project.department?.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Start: {formatDate(project.start_date)}</span>
                    <span className="text-slate-400">→</span>
                    <span>Target: {project.actual_end_date ? formatDate(project.actual_end_date) : formatDate(project.expected_end_date)}</span>
                  </div>

                  {project.work_order_number && (
                    <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/80">
                      Work Order: {project.work_order_number}
                    </div>
                  )}
                </div>

                {/* 4 Metric Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-slate-400" />
                      Budget Utilization
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {formatCurrency(project.budget_utilized)}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      of {formatCurrency(project.budget_allocated)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Target className="w-3 h-3 text-slate-400" />
                      Deployment Coverage
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {project.deployment_current} of {project.deployment_target}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {project.deployment_unit || 'Units'} ({Math.round((project.deployment_current / (project.deployment_target || 1)) * 100)}%)
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Layers className="w-3 h-3 text-slate-400" />
                      Milestones
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {completedMilestones} of {totalMilestones}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                      {totalMilestones > 0 && completedMilestones === totalMilestones ? 'All Milestones Complete' : `${totalMilestones - completedMilestones} Pending`}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-slate-400" />
                      KPI Achievement
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {project.kpi_achievement_percent}%
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {project.government_evaluation ? `Gov Rating: ★ ${project.government_evaluation}/5` : 'Validation Verified'}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                      Deployment Progress
                    </span>
                    <span className="font-extrabold text-blue-700 text-xs">
                      {project.progress_percent}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}
                      style={{ width: `${project.progress_percent}%` }}
                    />
                  </div>
                </div>

                {/* Card Footer: Pilot Traceability & Officer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pilot Lineage:</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {project.pilot?.pilot_number || 'PILOT-VERIFIED'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-emerald-700 font-semibold">
                      Procurement Approved
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/government/projects/${project.id}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <span>Manage Project & Milestones</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
