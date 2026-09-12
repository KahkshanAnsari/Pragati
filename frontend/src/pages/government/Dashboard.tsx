import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardFooter } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { KPISkeletonGrid, Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  AlertCircle, Rocket, ShieldCheck, ShoppingBag, Plus,
  FileText, Sparkles, ArrowRight, TrendingUp, ChevronRight,
  Activity, Building2, Users, CheckCircle2,
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

  useEffect(() => { fetchDashboardData(); }, []);

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

  const officerProfile = profile as { name?: string; designation?: string; department?: { name?: string } } | null;
  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  // Pipeline stages
  const pipeline = [
    { label: 'Problems',     count: problems.length,              color: 'bg-navy-900' },
    { label: 'Applications', count: applications.length,          color: 'bg-blue-600' },
    { label: 'Pilots',       count: pilots.length,                color: 'bg-teal-600' },
    { label: 'Validated',    count: solutions.length,             color: 'bg-success-600' },
    { label: 'Procurement',  count: readyPilots.length,           color: 'bg-success-700' },
  ];

  // Quick actions
  const quickActions = [
    { label: 'Post Problem',       icon: Plus,       path: '/government/problems/new', variant: 'primary' as const },
    { label: 'Run AI Matching',    icon: Sparkles,   path: '/government/ai-matching',  variant: 'accent' as const },
    { label: 'Review Applications',icon: FileText,   path: '/government/applications', variant: 'outline' as const },
    { label: 'Pilot Dashboard',    icon: Rocket,     path: '/government/pilots',       variant: 'outline' as const },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {greeting}, {officerProfile?.name?.split(' ')[0] || 'Officer'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" />
              {officerProfile?.department?.name || 'Government Department'} • {date}
            </p>
          </div>
          <Button size="sm" onClick={() => navigate('/government/problems/new')}>
            <Plus className="w-4 h-4 mr-1.5" /> Post Problem
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      {loading ? <KPISkeletonGrid count={4} /> : (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <KPICard label="Active Problems" value={problems.length}
            icon={<AlertCircle className="w-4 h-4" />} accentColor="navy" onClick={() => navigate('/government/problems')} />
          <KPICard label="Applications" value={applications.length}
            icon={<FileText className="w-4 h-4" />} accentColor="blue" onClick={() => navigate('/government/applications')} />
          <KPICard label="Active Pilots" value={activePilots.length}
            icon={<Rocket className="w-4 h-4" />} accentColor="teal" onClick={() => navigate('/government/pilots')} />
          <KPICard label="Procurement Ready" value={readyPilots.length}
            icon={<ShoppingBag className="w-4 h-4" />} accentColor="success" onClick={() => navigate('/government/procurement')} />
        </motion.div>
      )}

      {/* Innovation Pipeline */}
      {!loading && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
          <Card padding="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Government Innovation Pipeline</p>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {pipeline.map((stage, i) => (
                <React.Fragment key={stage.label}>
                  <div className="flex flex-col items-center gap-1.5 min-w-[80px]">
                    <div className={`w-12 h-12 rounded-xl ${stage.color} text-white flex items-center justify-center text-lg font-extrabold shadow-sm`}>
                      {stage.count}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 text-center">{stage.label}</span>
                  </div>
                  {i < pipeline.length - 1 && (
                    <div className="flex items-center mx-1 mb-5">
                      <div className="w-6 h-0.5 bg-slate-200" />
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Problems */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
          <Card padding="">
            <CardHeader>
              <CardTitle>Recent Problems</CardTitle>
              <Button variant="ghost" size="xs" onClick={() => navigate('/government/problems')}>
                View all <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-4 space-y-3">{[1,2,3].map(i => <Skeleton key={i} variant="row" />)}</div>
              ) : problems.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="px-6 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/government/problems/${p.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{p.title}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {p.department?.name || 'Dept'} • {p.sector || 'Sector'}
                    </p>
                  </div>
                  <StatusBadge status={p.status || 'draft'} />
                </div>
              ))}
              {!loading && problems.length === 0 && (
                <p className="px-6 py-8 text-sm text-slate-400 text-center">No problems yet</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}>
          <Card padding="">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="p-4 grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-navy-900/20 hover:bg-slate-50 hover:shadow-card transition-all duration-200 text-left group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-navy-900/8 text-navy-900 flex items-center justify-center shrink-0 group-hover:bg-navy-900/15 transition-colors">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{action.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Recent apps summary */}
            <div className="px-6 pb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Application Overview</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Submitted', count: applications.filter(a => a.status === 'submitted').length, color: 'text-blue-700 bg-blue-50' },
                  { label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length, color: 'text-amber-700 bg-amber-50' },
                  { label: 'Selected', count: applications.filter(a => a.status === 'selected').length, color: 'text-success-700 bg-success-50' },
                  { label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length, color: 'text-slate-600 bg-slate-100' },
                ].map(s => (
                  <div key={s.label} className={`rounded-lg py-2.5 px-2 ${s.color}`}>
                    <div className="text-lg font-extrabold">{s.count}</div>
                    <div className="text-[9px] font-bold uppercase tracking-wide mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
