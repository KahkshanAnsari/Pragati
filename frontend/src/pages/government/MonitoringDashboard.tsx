import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { KPICard } from '../../components/ui/KPICard';
import { Skeleton, KPISkeletonGrid } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { toast } from 'react-hot-toast';
import {
  Activity, Rocket, CheckCircle2, AlertTriangle, Clock,
  TrendingUp, BarChart3, Target, ArrowRight, Building2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';

export function MonitoringDashboard() {
  const navigate = useNavigate();
  const [pilots, setPilots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/pilots');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setPilots(data);
    } catch (e) {
      toast.error('Failed to load monitoring data.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const activePilots = pilots.filter((p) => ['active', 'in_progress'].includes(p.status));
  const completedPilots = pilots.filter((p) => p.status === 'completed');
  const avgProgress = pilots.length > 0
    ? Math.round(pilots.reduce((s, p) => s + (p.progress_percent ?? 0), 0) / pilots.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Live Monitoring & KPI Health"
        subtitle="Real-time multi-department pilot health, milestone verification, and automated KPI tracking."
        actions={
          <Button variant="outline" size="sm" onClick={() => fetchPilots()}>
            <Activity className="w-3.5 h-3.5 mr-1.5" />
            Refresh Feed
          </Button>
        }
      />

      {loading ? (
        <KPISkeletonGrid count={4} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Total Monitored" value={pilots.length} icon={<Rocket className="w-4 h-4" />} accentColor="navy" />
          <KPICard label="Active Telemetry" value={activePilots.length} icon={<Activity className="w-4 h-4" />} accentColor="teal" />
          <KPICard label="Completed Validations" value={completedPilots.length} icon={<CheckCircle2 className="w-4 h-4" />} accentColor="success" />
          <KPICard label="Average Progress" value={`${avgProgress}%`} icon={<TrendingUp className="w-4 h-4" />} accentColor="blue" />
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="card" className="h-48" />
          ))}
        </div>
      ) : pilots.length === 0 ? (
        <EmptyState
          variant="pilot"
          title="No Pilots Currently Monitored"
          description="Active and verified pilots will report real-time KPI data and milestone progress here."
          action={{
            label: 'Go to Pilot Management',
            onClick: () => navigate('/government/pilots'),
          }}
        />
      ) : (
        <div className="space-y-4">
          {pilots.map((pilot, i) => {
            const prog = pilot.progress_percent ?? 0;
            const onTrack = prog >= 60 || pilot.status === 'completed';
            const problemTitle = pilot.problem?.title || `Pilot ${pilot.pilot_number || pilot.id?.substring(0, 8)}`;
            const startupName = pilot.startup?.name || 'Selected Startup';
            const deptName = pilot.department?.name || pilot.problem?.department?.name || 'Government Department';

            return (
              <motion.div
                key={pilot.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card padding="" hover>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 border-b border-slate-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                          {pilot.pilot_number || `PILOT-${pilot.id?.substring(0, 8).toUpperCase()}`}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base">{problemTitle}</h3>
                        <Badge variant={onTrack ? 'success' : 'warning'} dot pulse={!onTrack}>
                          {onTrack ? 'On Track' : 'Needs Review'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span className="font-medium text-slate-700">{startupName}</span>
                        <span>•</span>
                        <span>{deptName}</span>
                        {pilot.start_date && (
                          <>
                            <span>•</span>
                            <span>Started: {formatDate(pilot.start_date)}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <Badge variant={pilot.status === 'completed' ? 'completed' : 'pilot_active'} dot>
                      {pilot.status}
                    </Badge>
                  </div>

                  <div className="px-6 py-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="font-semibold text-slate-600">Overall Milestone Execution</span>
                      <span className="font-bold text-slate-900">{Math.round(prog)}%</span>
                    </div>
                    <ProgressBar value={prog} color="auto" gradient animated size="md" />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Budget Utilized</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">
                          {formatCurrency(pilot.budget_utilized || 0)}
                        </p>
                        <p className="text-[10px] text-slate-500">of {formatCurrency(pilot.budget_allocated || 0)}</p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Duration</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          {pilot.duration_days || 90} Days
                        </p>
                        <p className="text-[10px] text-slate-500">Government Sandbox</p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Field Inspections</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1 text-teal-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </p>
                        <p className="text-[10px] text-slate-500">On-ground audit</p>
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Procurement Readiness</p>
                        <p className={`text-sm font-bold mt-0.5 ${prog >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {prog >= 70 ? 'High Readiness' : 'In Progress'}
                        </p>
                        <p className="text-[10px] text-slate-500">Automated Audit</p>
                      </div>
                    </div>
                  </div>

                  <CardFooter className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/government/pilots/${pilot.id}/outcome`)}
                    >
                      KPI Outcomes
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/government/pilots/${pilot.id}/workspace`)}
                    >
                      Open Pilot Workspace <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
}

export default MonitoringDashboard;
