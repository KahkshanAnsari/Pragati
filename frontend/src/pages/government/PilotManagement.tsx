import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PageHeader } from '../../components/ui/PageHeader';
import { Spinner } from '../../components/ui/Spinner';
import { Pilot } from '../../types';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import {
  Rocket,
  Briefcase,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  FileSearch,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const PilotManagement: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPilots();
  }, []);

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
        title="Pilot Management & Monitoring"
        subtitle="Track execution progress, milestones, KPIs, and field verification across all active pilots."
      />

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        {(['all', 'active', 'completed', 'paused'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'text-navy-900 border-b-2 border-navy-900 bg-white font-semibold shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab} ({pilots.filter((p) => (tab === 'all' ? true : p.status === tab)).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No Pilots Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">
            No pilot projects currently in this category. Select startups from the Applications section to launch new pilots.
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate('/government/applications')}>Review Applications</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((pilot) => {
            const progress = pilot.progress_percent || 0;
            const pilotTitle = (pilot as any).problem?.title || `Pilot ${pilot.pilot_number || pilot.id.substring(0, 8)}`;
            const startupName = (pilot as any).startup?.name || 'Selected Startup';
            const deptName = (pilot as any).department?.name || 'Department';

            return (
              <Card
                key={pilot.id}
                className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            {pilot.pilot_number || `PILOT-${pilot.id.substring(0, 8).toUpperCase()}`}
                          </span>
                          <Badge variant={pilot.status === 'completed' ? 'success' : 'active'} className="capitalize">
                            {pilot.status}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-navy-900">{pilotTitle}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="font-semibold text-navy-800 flex items-center gap-1">
                            <Briefcase className="w-4 h-4 text-blue-600" />
                            Startup: {startupName}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span>Dept: {deptName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-y border-gray-100 bg-gray-50/50 -mx-6 px-6">
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Budget Utilized</p>
                        <p className="font-bold text-navy-900 text-sm">{formatCurrency(pilot.budget_utilized || 0)}</p>
                        <p className="text-xs text-gray-400">of {formatCurrency(pilot.budget_allocated)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Duration</p>
                        <p className="font-bold text-navy-900 text-sm flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> {pilot.duration_days || 90} Days
                        </p>
                        {pilot.start_date && (
                          <p className="text-xs text-gray-400">Started {formatDate(pilot.start_date)}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Progress</p>
                        <p className="font-bold text-navy-900 text-sm flex items-center gap-1">
                          {progress >= 75 ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Rocket className="w-3.5 h-3.5 text-blue-500" />
                          )}
                          {Math.round(progress)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase">Procurement</p>
                        <p className={`font-bold text-sm ${progress >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {progress >= 75 ? 'High Readiness' : 'In Progress'}
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

                  {/* Action Column */}
                  <div className="flex flex-col gap-2.5 lg:w-56 shrink-0 justify-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <Button
                      className="w-full bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2"
                      onClick={() => navigate(`/government/pilots/${pilot.id}/workspace`)}
                    >
                      Open Pilot Workspace
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full text-xs"
                      onClick={() => navigate(`/government/pilots/${pilot.id}/inspection`)}
                    >
                      Field Inspections
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full text-xs"
                      onClick={() => navigate(`/government/pilots/${pilot.id}/outcome`)}
                    >
                      Pilot Outcome & KPIs
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full text-xs text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                      onClick={() => navigate(`/government/procurement/${pilot.id}`)}
                    >
                      Procurement Readiness
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

export default PilotManagement;
