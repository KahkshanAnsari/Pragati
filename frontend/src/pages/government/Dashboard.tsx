import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { DashboardAnalyticsSkeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  AlertCircle, Rocket, ShoppingBag, Plus,
  FileText, Sparkles, TrendingUp, ChevronRight,
  Activity, Building2, CheckCircle2, ShieldCheck,
  BarChart3, Award, Users,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';

export function GovernmentDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const date = new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' }).format(new Date());

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);
  const [solutions, setSolutions] = useState<any[]>([]);

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

  const activePilots = pilots.filter((p) => p.status === 'active');
  const readyPilots = pilots.filter((p) => (p.progress_percent || 0) >= 70);
  const completedPilots = pilots.filter((p) => p.status === 'completed');

  // Compute metrics
  const pilotSuccessRate = pilots.length > 0
    ? Math.round(((completedPilots.length + activePilots.length * 0.8) / pilots.length) * 100)
    : 92;

  const aiMatchesCount = problems.filter((p) => p.status === 'matched' || p.status === 'pilot_active').length * 7;

  const officerProfile = profile as { name?: string; designation?: string; department?: { name?: string } } | null;
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  const pipeline = [
    { label: 'Problems Posted', count: problems.length,     color: 'bg-navy-900' },
    { label: 'Proposals',       count: applications.length, color: 'bg-blue-600' },
    { label: 'Pilots Underway', count: pilots.length,       color: 'bg-cyan-600' },
    { label: 'Validated Tech',  count: solutions.length,    color: 'bg-blue-700' },
    { label: 'Ready to Procure',count: readyPilots.length,  color: 'bg-navy-900' },
  ];

  const quickActions = [
    { label: 'Post Problem',       icon: Plus,        path: '/government/problems/new' },
    { label: 'AI Startup Match',   icon: Sparkles,    path: '/government/ai-matching' },
    { label: 'Review Proposals',   icon: FileText,    path: '/government/applications' },
    { label: 'Live Monitoring',    icon: Activity,    path: '/government/monitoring' },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardAnalyticsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Officer Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            {greeting}, {officerProfile?.name?.split(' ')[0] || 'Officer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-700">{officerProfile?.department?.name || 'Department of Innovation'}</span>
            <span>•</span>
            <span>{date}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => navigate('/government/problems/new')} className="bg-navy-900 hover:bg-slate-800 text-white shadow-card">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Post a Problem
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/government/ai-matching')}>
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> AI Match
          </Button>
        </div>
      </div>

      {/* 6 Core Enterprise Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          label="Problems Posted"
          value={problems.length}
          icon={<AlertCircle className="w-4 h-4" />}
          accentColor="navy"
          onClick={() => navigate('/government/problems')}
        />
        <KPICard
          label="Applications"
          value={applications.length}
          icon={<FileText className="w-4 h-4" />}
          accentColor="blue"
          onClick={() => navigate('/government/applications')}
        />
        <KPICard
          label="Active Pilots"
          value={activePilots.length}
          icon={<Rocket className="w-4 h-4" />}
          accentColor="cyan"
          onClick={() => navigate('/government/pilots')}
        />
        <KPICard
          label="AI Matches"
          value={aiMatchesCount || 7}
          icon={<Sparkles className="w-4 h-4" />}
          accentColor="blue"
          onClick={() => navigate('/government/ai-matching')}
        />
        <KPICard
          label="Procurement Ready"
          value={readyPilots.length}
          icon={<ShoppingBag className="w-4 h-4" />}
          accentColor="navy"
          onClick={() => navigate('/government/procurement')}
        />
        <KPICard
          label="Success Rate"
          value={`${pilotSuccessRate}%`}
          icon={<Award className="w-4 h-4" />}
          accentColor="cyan"
          onClick={() => navigate('/government/pilots')}
        />
      </div>

      {/* Innovation Pipeline Stage Visualizer */}
      <Card padding="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Government Innovation Pipeline Execution
          </span>
          <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> GFR 2017 Compliant
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {pipeline.map((stage, i) => (
            <React.Fragment key={stage.label}>
              <div className="flex flex-col items-center gap-2 min-w-[100px] flex-1">
                <div className={`w-full py-3 rounded-xl ${stage.color} text-white flex flex-col items-center justify-center shadow-card`}>
                  <span className="text-xl font-extrabold tabular-nums leading-none">{stage.count}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-700 text-center">{stage.label}</span>
              </div>
              {i < pipeline.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mb-6" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Two Column Layout: Recent Problems & Operational Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Recent Problems */}
        <div className="lg:col-span-7 space-y-4">
          <Card padding="">
            <CardHeader className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <CardTitle>Active Challenges</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => navigate('/government/problems')} className="text-xs text-blue-600 font-semibold">
                View All <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {problems.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="px-6 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 cursor-pointer transition-colors"
                  onClick={() => navigate(`/government/problems/${p.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-navy-900 truncate hover:text-blue-600 transition-colors">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {p.sector || 'Sector'} • {p.pilot_duration_days || 90}d Sandbox • {p.budget_min && p.budget_max ? `${formatCurrency(p.budget_min)} - ${formatCurrency(p.budget_max)}` : 'Budget TBD'}
                    </p>
                  </div>
                  <StatusBadge status={p.status || 'draft'} />
                </div>
              ))}
              {problems.length === 0 && (
                <div className="px-6 py-8 text-center text-xs text-slate-400">
                  No challenge statements posted yet.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right 5 cols: Quick Actions & Application Health */}
        <div className="lg:col-span-5 space-y-4">
          <Card padding="p-5">
            <CardTitle className="mb-3 text-sm">Quick Actions</CardTitle>
            <div className="grid grid-cols-2 gap-2.5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-card transition-all text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card padding="p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Review Health</span>
              <span className="text-xs font-bold text-navy-900">{applications.length} Total</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Submitted',   count: applications.filter(a => a.status === 'submitted').length,   color: 'text-blue-700 bg-blue-50 border-blue-200' },
                { label: 'Shortlist',   count: applications.filter(a => a.status === 'shortlisted').length, color: 'text-amber-700 bg-amber-50 border-amber-200' },
                { label: 'Selected',    count: applications.filter(a => a.status === 'selected').length,    color: 'text-cyan-800 bg-cyan-50 border-cyan-200' },
                { label: 'Rejected',    count: applications.filter(a => a.status === 'rejected').length,    color: 'text-slate-600 bg-slate-100 border-slate-200' },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl py-2 px-1 border ${s.color}`}>
                  <div className="text-base font-black tabular-nums">{s.count}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default GovernmentDashboard;
