import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { Application } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardFooter } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import {
  FileText, Clock, IndianRupee, Briefcase,
  CheckCircle2, ArrowRight, Building2,
} from 'lucide-react';

type TabType = 'all' | 'submitted' | 'shortlisted' | 'selected' | 'rejected';

const STATUS_VARIANT: Record<string, string> = {
  submitted:   'info',
  shortlisted: 'amber',
  selected:    'success',
  rejected:    'danger',
};

const TABS: TabType[] = ['all', 'submitted', 'shortlisted', 'selected', 'rejected'];

export const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TabType>('all');

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/applications');
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setApplications(data);
    } catch (err) {
      toast.error('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter((a) => {
    if (filter === 'all') return true;
    return (a.status || '').toLowerCase().trim() === filter;
  });

  const counts = {
    all:         applications.length,
    submitted:   applications.filter((a) => (a.status || '').toLowerCase().trim() === 'submitted').length,
    shortlisted: applications.filter((a) => (a.status || '').toLowerCase().trim() === 'shortlisted').length,
    selected:    applications.filter((a) => (a.status || '').toLowerCase().trim() === 'selected').length,
    rejected:    applications.filter((a) => (a.status || '').toLowerCase().trim() === 'rejected').length,
  };

  // Application lifecycle stages for visual indicator
  const STAGES = ['Submitted', 'Shortlisted', 'Selected', 'Pilot'];
  const stageIndex = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'submitted')   return 0;
    if (s === 'shortlisted') return 1;
    if (s === 'selected')    return 2;
    if (s === 'pilot_active' || s === 'pilot') return 3;
    return 0;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Application Review"
        subtitle="Review, evaluate and select startup pilot proposals for your department's challenges."
      />

      {/* Tab bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card p-1 flex overflow-x-auto gap-0.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filter === tab
                ? 'bg-navy-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="capitalize">{tab}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              filter === tab ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <Skeleton key={i} variant="card" className="h-40" />)}
        </div>
      ) : filteredApps.length === 0 ? (
        <EmptyState
          variant="folder"
          title={`No ${filter === 'all' ? '' : filter} applications`}
          description="Applications will appear here once startups apply to your challenges."
        />
      ) : (
        <div className="space-y-3">
          {filteredApps.map((app, i) => {
            const stageIdx = stageIndex(app.status || '');
            const variant = (STATUS_VARIANT[app.status?.toLowerCase() || ''] || 'gray') as any;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <Card padding="" hover>
                  <div className="px-6 py-5">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1 space-y-2.5 min-w-0">
                        {/* Top row: Status + Date */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <Badge variant={variant} dot>
                            {app.status || 'Submitted'}
                          </Badge>
                          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Applied {formatDate(app.created_at)}
                          </span>
                        </div>

                        {/* Problem title */}
                        <h3
                          onClick={() => navigate(`/government/applications/${app.id}/evaluate`)}
                          className="text-base font-extrabold text-slate-900 hover:text-navy-900 cursor-pointer tracking-tight transition-colors"
                        >
                          {app.problem?.title || 'Challenge Statement'}
                        </h3>

                        {/* Startup + cost */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1 font-semibold">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {app.startup?.name}
                          </span>
                          <span className="text-slate-200">|</span>
                          <span className="chip chip-blue">{app.startup?.sector || 'Innovation'}</span>
                          <span className="text-slate-200">|</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <IndianRupee className="w-3 h-3 text-slate-400" />
                            {app.cost_proposed ? formatCurrency(app.cost_proposed) : 'Cost on review'}
                          </span>
                        </div>

                        {/* Solution summary */}
                        {app.solution && (
                          <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                            <strong className="text-slate-700">Solution:</strong> {app.solution}
                          </p>
                        )}

                        {/* Lifecycle pipeline */}
                        <div className="flex items-center gap-0 pt-1">
                          {STAGES.map((stage, si) => {
                            const done = si <= stageIdx;
                            const current = si === stageIdx;
                            return (
                              <React.Fragment key={stage}>
                                <div className="flex flex-col items-center">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 ${
                                    done
                                      ? 'bg-navy-900 border-navy-900 text-white'
                                      : 'bg-white border-slate-200 text-slate-400'
                                  } ${current ? 'ring-2 ring-navy-900/30' : ''}`}>
                                    {done ? <CheckCircle2 className="w-3 h-3" /> : si + 1}
                                  </div>
                                  <span className={`text-[9px] mt-1 font-semibold ${done ? 'text-navy-900' : 'text-slate-400'}`}>
                                    {stage}
                                  </span>
                                </div>
                                {si < STAGES.length - 1 && (
                                  <div className={`flex-1 h-0.5 mx-1 mb-3.5 ${si < stageIdx ? 'bg-navy-900' : 'bg-slate-200'}`} style={{ minWidth: 20 }} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action column */}
                      <div className="flex flex-col gap-2 shrink-0 w-full md:w-40">
                        <Button
                          variant={(app.status === 'submitted' || app.status === 'shortlisted') ? 'primary' : 'outline'}
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => navigate(`/government/applications/${app.id}/evaluate`)}
                        >
                          {(app.status === 'submitted' || app.status === 'shortlisted') ? 'Evaluate' : 'View'}
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                        {app.status === 'selected' && (
                          <Button
                            variant="accent"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() => navigate('/government/pilots')}
                          >
                            View Pilot
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
