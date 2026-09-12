import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PageHeader } from '../../components/ui/PageHeader';
import { KPICard } from '../../components/ui/KPICard';
import { Skeleton, KPISkeletonGrid } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pilot } from '../../types';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import {
  Rocket, Briefcase, Clock, CheckCircle2, AlertTriangle,
  ExternalLink, ArrowRight, TrendingUp, Activity, ShieldCheck,
  Building2, IndianRupee,
} from 'lucide-react';

type TabType = 'all' | 'active' | 'completed' | 'paused';

const STATUS_HEALTH: Record<string, { label: string; variant: string; icon: React.ElementType }> = {
  active:    { label: 'Active',    variant: 'pilot_active', icon: Activity },
  completed: { label: 'Completed', variant: 'completed',    icon: CheckCircle2 },
  paused:    { label: 'Paused',    variant: 'warning',      icon: AlertTriangle },
};

export const PilotManagement: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const navigate = useNavigate();

  useEffect(() => { fetchPilots(); }, []);

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/pilots');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setPilots(data);
    } catch (error) {
      toast.error('Failed to load pilots');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = pilots.filter((p) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const tabCounts: Record<TabType, number> = {
    all:       pilots.length,
    active:    pilots.filter(p => p.status === 'active').length,
    completed: pilots.filter(p => p.status === 'completed').length,
    paused:    pilots.filter(p => p.status === 'paused').length,
  };

  const avgProgress = pilots.length > 0
    ? Math.round(pilots.reduce((s, p) => s + ((p as any).progress_percent ?? 0), 0) / pilots.length)
    : 0;

  const TABS: TabType[] = ['all', 'active', 'completed', 'paused'];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Pilot Management"
        subtitle="Track execution progress, milestones, KPIs and field verification across all pilots."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/government/monitoring')}>
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            Monitoring Dashboard
          </Button>
        }
      />

      {/* KPI summary */}
      {loading ? (
        <KPISkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Total Pilots"    value={pilots.length}             icon={<Rocket className="w-4 h-4" />}      accentColor="navy" />
          <KPICard label="Active"          value={tabCounts.active}          icon={<Activity className="w-4 h-4" />}    accentColor="teal" />
          <KPICard label="Completed"       value={tabCounts.completed}       icon={<CheckCircle2 className="w-4 h-4" />} accentColor="success" />
          <KPICard label="Avg Progress"    value={`${avgProgress}%`}        icon={<TrendingUp className="w-4 h-4" />}   accentColor="blue" />
        </div>
      )}

      {/* Tab bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-1 flex gap-0.5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all capitalize ${
              activeTab === tab
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>{tabCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} variant="card" className="h-56" />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          variant="pilot"
          title="No pilots in this category"
          description="Select startups from the Applications section to launch new pilots."
          action={{ label: 'Review Applications', onClick: () => navigate('/government/applications') }}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((pilot, i) => {
            const progress = (pilot as any).progress_percent || 0;
            const pilotTitle = (pilot as any).problem?.title || `Pilot ${pilot.pilot_number || pilot.id.substring(0, 8)}`;
            const startupName = (pilot as any).startup?.name || 'Selected Startup';
            const deptName = (pilot as any).department?.name || (pilot as any).problem?.department?.name || 'Department';
            const onTrack = progress >= 60 || pilot.status === 'completed';
            const health = STATUS_HEALTH[pilot.status] || STATUS_HEALTH.active;
            const HealthIcon = health.icon;

            return (
              <motion.div
                key={pilot.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <Card padding="">
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                            {pilot.pilot_number || `PILOT-${pilot.id.substring(0, 8).toUpperCase()}`}
                          </span>
                          <Badge variant={health.variant as any} dot>
                            <HealthIcon className="w-3 h-3 mr-1" />
                            {health.label}
                          </Badge>
                          <Badge variant={onTrack ? 'success' : 'warning'} dot pulse={!onTrack}>
                            {onTrack ? 'On Track' : 'Needs Attention'}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{pilotTitle}</h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{startupName}</span>
                          <span className="text-slate-200">•</span>
                          <span>{deptName}</span>
                        </div>
                      </div>
                      {/* Budget */}
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-0.5">Budget Utilized</p>
                        <p className="font-extrabold text-slate-900 text-base">
                          {formatCurrency((pilot as any).budget_utilized || 0)}
                        </p>
                        <p className="text-[10px] text-slate-400">of {formatCurrency((pilot as any).budget_allocated || 0)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress section */}
                  <div className="px-6 py-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-600">Milestone Progress</span>
                      <span className="font-bold text-slate-900">{Math.round(progress)}%</span>
                    </div>
                    <ProgressBar value={progress} color="auto" gradient animated size="md" />

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      {[
                        { label: 'Duration', value: `${(pilot as any).duration_days || 90}d`, icon: Clock },
                        { label: 'Started', value: (pilot as any).start_date ? formatDate((pilot as any).start_date) : '—', icon: Activity },
                        { label: 'Procurement', value: progress >= 75 ? 'High' : 'In Progress', icon: ShieldCheck },
                        { label: 'Progress', value: `${Math.round(progress)}%`, icon: TrendingUp },
                      ].map(stat => {
                        const StatIcon = stat.icon;
                        return (
                          <div key={stat.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                            <div className="flex items-center gap-1 mb-1">
                              <StatIcon className="w-3 h-3 text-slate-400" />
                              <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400">{stat.label}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer actions */}
                  <CardFooter className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/government/pilots/${pilot.id}/inspection`)}>
                      Field Inspections
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => navigate(`/government/pilots/${pilot.id}/outcome`)}>
                      KPI Outcomes
                    </Button>
                    <Button variant="accent" size="sm" className="text-xs" onClick={() => navigate(`/government/pilots/${pilot.id}/workspace`)}>
                      Open Workspace <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PilotManagement;
