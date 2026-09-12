import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Spinner } from '../../components/ui/Spinner';
import { Pilot } from '../../types';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { Clock, Briefcase, Activity, Target, CheckCircle, ArrowRight } from 'lucide-react';

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
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
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
            const progress = pilot.progress_percent || 0;
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
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            {pilot.pilot_number || `PILOT-${pilot.id.substring(0, 8).toUpperCase()}`}
                          </span>
                          <Badge variant="success">Active Deployment</Badge>
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
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Progress</p>
                        <p className="font-bold text-navy-900 text-sm flex items-center gap-1">
                          {progress >= 75 ? (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <Activity className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          {Math.round(progress)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">KPI Status</p>
                        <p className={`font-bold text-sm flex items-center gap-1 ${progress >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                          <Target className="w-3.5 h-3.5" />
                          {progress >= 70 ? 'On Track' : 'In Progress'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                        <span>Milestone Execution Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <ProgressBar value={progress} color="navy" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 lg:w-48 shrink-0 justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Button
                      className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-1"
                      onClick={() => navigate(`/startup/pilots/${pilot.id}/workspace`)}
                    >
                      Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
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
