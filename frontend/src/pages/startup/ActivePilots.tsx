import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonList } from '../../components/ui/Skeleton';
import { Pilot } from '../../types';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { SmartPilotProgress, getPilotProgressInfo } from '../../components/ui/SmartPilotProgress';
import { getRatingForPilot } from '../../lib/ratingService';
import { Clock, Briefcase, Activity, Target, CheckCircle, ArrowRight, Star, ShieldCheck } from 'lucide-react';

export const ActivePilots: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/pilots?startup_id=mine');
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setPilots(data);
    } catch (error) {
      toast.error('Failed to load active pilots');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <SkeletonList count={3} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Pilots"
        subtitle="Manage, monitor, and submit milestones & KPI evidence for your funded government pilots."
      />

      {pilots.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Pilots</h3>
          <p className="text-gray-500 mb-6 text-sm">
            Once your problem application is selected and approved by the department, your pilot workspace will appear here.
          </p>
          <Button onClick={() => navigate('/startup/applications')}>View My Applications</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pilots.map((pilot) => {
            const progressInfo = getPilotProgressInfo(pilot);
            const pilotTitle = (pilot as any).problem?.title || `Pilot ${pilot.pilot_number || pilot.id.substring(0, 8)}`;
            const deptName = (pilot as any).department?.name || 'Government Department';

            return (
              <Card
                key={pilot.id}
                className="p-6 border border-gray-200 border-l-4 border-l-blue-600 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            {pilot.pilot_number || `PILOT-${pilot.id.substring(0, 8).toUpperCase()}`}
                          </span>
                          <Badge variant={pilot.status === 'completed' ? 'success' : 'active'}>
                            {pilot.status === 'completed' ? 'Successfully Completed' : 'Active Deployment'}
                          </Badge>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${progressInfo.badgeClass}`}
                          >
                            <progressInfo.icon className="w-3 h-3" />
                            {progressInfo.label}
                          </span>
                          {pilot.status === 'completed' && (() => {
                            const r = getRatingForPilot(pilot.id);
                            return (
                              <>
                                {r && (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300">
                                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                    Evaluated (★ {r.overall_rating}/5)
                                  </span>
                                )}
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  Validated Solution
                                </span>
                              </>
                            );
                          })()}
                        </div>
                        <h3
                          onClick={() => navigate(`/startup/pilots/${pilot.id}/workspace`)}
                          className="text-xl font-bold text-navy-900 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {pilotTitle}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2 mt-1 text-sm">
                          <Briefcase className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{deptName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-gray-100 bg-gray-50/50 -mx-6 px-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Budget Used</p>
                        <p className="font-bold text-navy-900 text-sm">{formatCurrency(pilot.budget_utilized || 0)}</p>
                        <p className="text-xs text-gray-400">of {formatCurrency(pilot.budget_allocated)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Timeline</p>
                        <p className="font-bold text-navy-900 text-sm flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> {pilot.duration_days || 90} days
                        </p>
                        {pilot.start_date && (
                          <p className="text-xs text-gray-400">Started {formatDate(pilot.start_date)}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Schedule Health</p>
                        <p className={`font-bold text-sm flex items-center gap-1 ${progressInfo.dotColor}`}>
                          <progressInfo.icon className="w-3.5 h-3.5" />
                          {progressInfo.label}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Exp: {progressInfo.expected}% (Δ {progressInfo.delta > 0 ? `+${progressInfo.delta}` : progressInfo.delta}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Governance</p>
                        <p className="font-bold text-sm flex items-center gap-1 text-emerald-600">
                          <Target className="w-3.5 h-3.5" />
                          On Track
                        </p>
                        <p className="text-[11px] text-gray-400">Milestone Tranches</p>
                      </div>
                    </div>

                    <div>
                      <SmartPilotProgress pilot={pilot} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 lg:w-52 shrink-0 justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Button
                      className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-1"
                      onClick={() => navigate(`/startup/pilots/${pilot.id}/workspace`)}
                    >
                      {pilot.status === 'completed' ? 'Pilot Outcome & Workspace' : 'Open Workspace'} <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                    {pilot.status === 'completed' ? (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 space-y-1">
                        <div className="font-bold flex items-center gap-1 text-emerald-800">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          Procurement Approved
                        </div>
                        <p className="text-[11px] text-gray-700">Deployment: 25 monitoring locations</p>
                        <p className="text-[11px] text-blue-700 font-semibold">Scale-Up: Recommended</p>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          className="w-full text-xs"
                          onClick={() => navigate(`/startup/pilots/${pilot.id}/workspace`)}
                        >
                          Update KPIs
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full text-xs"
                          onClick={() => navigate(`/startup/pilots/${pilot.id}/workspace`)}
                        >
                          Submit Milestone
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivePilots;
