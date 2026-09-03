import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import {
  AlertCircle,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Plus,
  Compass,
  FileText,
  Users,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export function GovernmentDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const date = new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' }).format(new Date());

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);
  const [procurementCases, setProcurementCases] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [probRes, appRes, pilotRes, solRes] = await Promise.allSettled([
        api.get('/api/problems').catch(() => ({ data: [] })),
        api.get('/api/applications').catch(() => ({ data: [] })),
        api.get('/api/pilots').catch(() => ({ data: [] })),
        api.get('/api/solutions').catch(() => ({ data: [] })),
      ]);

      if (probRes.status === 'fulfilled') {
        const list = Array.isArray(probRes.value.data) ? probRes.value.data : (probRes.value.data?.data || []);
        setProblems(list);
      }

      if (appRes.status === 'fulfilled') {
        const list = Array.isArray(appRes.value.data) ? appRes.value.data : (appRes.value.data?.data || []);
        setApplications(list);
      }

      if (pilotRes.status === 'fulfilled') {
        const list = Array.isArray(pilotRes.value.data) ? pilotRes.value.data : (pilotRes.value.data?.data || []);
        setPilots(list);
      }

      if (solRes.status === 'fulfilled') {
        const list = Array.isArray(solRes.value.data) ? solRes.value.data : (solRes.value.data?.data || []);
        setSolutions(list);
      }
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const openProblems = problems.filter((p) => p.status === 'published');
  const activePilots = pilots.filter((p) => p.status === 'active');
  const readyPilots = pilots.filter((p) => (p.progress_percent || 0) >= 70);

  // Dynamic Pipeline Counts
  const problemPipeline = {
    draft: problems.filter((p) => p.status === 'draft').length,
    open: problems.filter((p) => p.status === 'published').length,
    matched: problems.filter((p) => p.status === 'matched').length,
    pilot_active: problems.filter((p) => p.status === 'pilot_active').length,
    completed: problems.filter((p) => p.status === 'completed').length,
  };

  const applicationPipeline = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    selected: applications.filter((a) => a.status === 'selected').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const officerName = (profile as any)?.name || 'Nodal Officer';
  const deptName = (profile as any)?.department?.name || 'Department of Innovation & Public Procurement';

  if (loading) {
    return (
      <div className="p-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-navy-800 bg-navy-50 px-2.5 py-0.5 rounded border border-navy-200">
              Government Innovation Command Center
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900">
            Welcome back, {officerName}
          </h1>
          <p className="text-xs md:text-sm text-gray-600 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            {deptName}
          </p>
        </div>

        {/* Command Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button
            onClick={() => navigate('/government/problems/new')}
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2.5 px-3 flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Post Problem
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/government/startups')}
            className="text-xs font-semibold py-2.5 px-3"
          >
            Find Startups
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/government/applications')}
            className="text-xs font-semibold py-2.5 px-3"
          >
            Applications ({applicationPipeline.submitted})
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/government/procurement')}
            className="text-xs font-semibold py-2.5 px-3 text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
          >
            Procurement Readiness
          </Button>
        </div>
      </div>

      {/* Dynamic 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Open Problems</span>
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{openProblems.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Open for applications</p>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">To Review</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{applicationPipeline.submitted}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">Awaiting scoring</p>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Active Pilots</span>
            <Rocket className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{activePilots.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Live field deployments</p>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Procurement Ready</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{readyPilots.length}</p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">Ready for review</p>
        </Card>

        <Card className="p-4 bg-white border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Validated Solutions</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{solutions.length}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">Proven in government</p>
        </Card>
      </div>

      {/* Main Command Center Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Active Pilots & Open Challenges */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Pilot Monitoring */}
          <Card className="p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-navy-900">Active Pilot Deployments</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/government/pilots')}>
                View All Pilots <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="space-y-4">
              {pilots.map((p) => {
                const progress = Math.round(p.progress_percent || 0);
                const title = p.problem?.title || `Pilot ${p.pilot_number}`;
                const startupName = p.startup?.name || 'Selected Startup';

                return (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {p.pilot_number}
                          </span>
                          <Badge variant={p.status === 'completed' ? 'success' : 'active'}>
                            {p.status.toUpperCase()}
                          </Badge>
                          {p.progress_percent < 50 && p.status === 'active' && (
                            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                              Supply Chain Attention
                            </span>
                          )}
                        </div>
                        <h3
                          onClick={() => navigate(`/government/pilots/${p.id}/workspace`)}
                          className="text-base font-bold text-navy-900 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Vendor: <strong className="text-navy-900">{startupName}</strong> • Allocated: {formatCurrency(p.budget_allocated)}
                        </p>
                      </div>
                      <span className="text-base font-bold text-navy-900">{progress}%</span>
                    </div>

                    <ProgressBar value={progress} color="navy" />

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 text-xs">
                      <span className="text-gray-500">
                        Budget Utilized: <strong>{formatCurrency(p.budget_utilized || 0)}</strong>
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="text-xs"
                          onClick={() => navigate(`/government/pilots/${p.id}/inspection`)}
                        >
                          Field Inspections
                        </Button>
                        <Button
                          size="sm"
                          className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold"
                          onClick={() => navigate(`/government/pilots/${p.id}/workspace`)}
                        >
                          Open Workspace
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Open Problems with AI Matching Trigger */}
          <Card className="p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-navy-900">Department Problem Statements</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/government/problems')}>
                Problem Registry <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {openProblems.slice(0, 4).map((prob) => (
                <div
                  key={prob.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {prob.sector}
                      </span>
                      <span className="text-[11px] font-bold text-navy-900">
                        {prob.budget_min ? `₹${Math.round(prob.budget_min / 100000)}L - ₹${Math.round(prob.budget_max / 100000)}L` : 'Standard'}
                      </span>
                    </div>

                    <h4
                      onClick={() => navigate(`/government/problems/${prob.id}`)}
                      className="font-bold text-navy-900 text-sm hover:text-blue-600 cursor-pointer line-clamp-2"
                    >
                      {prob.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Pilot Duration: <strong>{prob.pilot_duration_days || 90} Days</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => navigate(`/government/problems/${prob.id}`)}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-navy-900 hover:bg-navy-800 text-white text-xs flex items-center justify-center gap-1"
                      onClick={() => navigate(`/government/problems/${prob.id}/match`)}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Match
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Problem Pipeline & Application Pipeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* Problem Pipeline */}
          <Card className="p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" /> Problem Pipeline
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Draft Specifications</span>
                <span className="font-bold text-navy-900">{problemPipeline.draft}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg text-blue-900 font-medium">
                <span>Published (Open)</span>
                <span className="font-bold">{problemPipeline.open}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg text-emerald-900 font-medium">
                <span>Under Active Pilot</span>
                <span className="font-bold">{problemPipeline.pilot_active}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-lg text-purple-900 font-medium">
                <span>Completed / Procured</span>
                <span className="font-bold">{problemPipeline.completed}</span>
              </div>
            </div>
          </Card>

          {/* Application Pipeline */}
          <Card className="p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Application Pipeline
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <span className="text-gray-600 font-medium">Total Received</span>
                <span className="font-bold text-navy-900">{applicationPipeline.total}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg text-amber-900 font-medium">
                <span>Awaiting Evaluation</span>
                <span className="font-bold">{applicationPipeline.submitted}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg text-blue-900 font-medium">
                <span>Shortlisted for Review</span>
                <span className="font-bold">{applicationPipeline.shortlisted}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg text-emerald-900 font-medium">
                <span>Selected for Pilot</span>
                <span className="font-bold">{applicationPipeline.selected}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100">
              <Button
                className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2"
                onClick={() => navigate('/government/applications')}
              >
                Review Applications
              </Button>
            </div>
          </Card>

          {/* Accelerated Procurement Review Banner */}
          <Card className="p-5 bg-gradient-to-br from-navy-900 to-blue-900 text-white border-0 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Accelerated Procurement Review</h4>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed mb-3">
              {readyPilots.length} pilots have completed inspection verification and qualify for formal procurement review.
            </p>
            <Button
              className="w-full bg-white hover:bg-blue-50 text-navy-900 text-xs font-bold py-2 border-0"
              onClick={() => navigate('/government/procurement')}
            >
              Review Procurement Readiness Cases
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default GovernmentDashboard;
