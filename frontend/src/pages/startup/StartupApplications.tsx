import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Modal } from '../../components/ui/Modal';
import { Application } from '../../types';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { formatDate, formatCurrency } from '../../lib/utils';
import { FileText, ArrowRight, IndianRupee, Clock, CheckCircle2, Rocket, Eye, Briefcase } from 'lucide-react';

export const StartupApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'submitted' | 'shortlisted' | 'selected' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/applications?startup_id=mine');
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter(app => {
    if (activeTab === 'all') return true;
    const s = (app.status || '').toLowerCase().trim();
    return s === activeTab;
  });

  const counts = {
    all: applications.length,
    submitted: applications.filter(a => (a.status || '').toLowerCase().trim() === 'submitted').length,
    shortlisted: applications.filter(a => (a.status || '').toLowerCase().trim() === 'shortlisted').length,
    selected: applications.filter(a => (a.status || '').toLowerCase().trim() === 'selected').length,
    rejected: applications.filter(a => (a.status || '').toLowerCase().trim() === 'rejected').length,
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase().trim();
    switch (s) {
      case 'submitted': return <Badge variant="secondary">Submitted</Badge>;
      case 'shortlisted': return <Badge variant="warning">Shortlisted</Badge>;
      case 'selected': return <Badge variant="success">Selected ✓</Badge>;
      case 'rejected': return <Badge variant="danger">Not Selected</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track the status of your submitted problem applications and pilot proposals."
      />

      {/* Tab bar with counts */}
      <div className="flex space-x-1 border-b border-gray-200 mb-4 overflow-x-auto pb-2">
        {(['all', 'submitted', 'shortlisted', 'selected', 'rejected'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 font-semibold'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                {counts[tab]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-500 mb-6 text-sm">
            {activeTab !== 'all'
              ? `No applications currently in the '${activeTab}' stage.`
              : "You haven't submitted applications for any open challenges yet."}
          </p>
          <Button onClick={() => navigate('/startup/problems')}>Discover Open Problems</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map(app => {
            const probId = app.problem_id || (app as any).problem?.id;
            const probTitle = (app as any).problem?.title || app.solution?.substring(0, 60) || 'Proposal';

            return (
              <Card key={app.id} className={`p-5 transition-all hover:shadow-md border border-gray-200 ${app.status === 'rejected' ? 'opacity-80' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3
                        onClick={() => probId && navigate(`/startup/problems/${probId}`)}
                        className="text-lg font-bold text-navy-900 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        {probTitle}
                      </h3>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> Submitted {formatDate(app.created_at)}
                      </span>
                      {app.cost_proposed && (
                        <span className="flex items-center gap-1 font-semibold text-navy-900">
                          <IndianRupee className="w-3.5 h-3.5 text-gray-400" /> {formatCurrency(app.cost_proposed)} proposed
                        </span>
                      )}
                    </div>

                    {app.solution && (
                      <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100 line-clamp-2">
                        <strong className="text-navy-900">Proposal Summary:</strong> {app.solution}
                      </p>
                    )}

                    {app.status === 'shortlisted' && (
                      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs flex items-center gap-2">
                        <span><strong>🎉 Shortlisted:</strong> Your application is under technical evaluation by the department.</span>
                      </div>
                    )}

                    {app.status === 'selected' && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <strong>Congratulations!</strong> You have been selected for this pilot project.
                        </span>
                        <Button size="sm" onClick={() => navigate('/startup/pilots')} className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 shrink-0 text-xs">
                          <Rocket className="w-3.5 h-3.5 mr-1" /> View Pilot
                        </Button>
                      </div>
                    )}

                    {app.status === 'rejected' && (
                      <div className="mt-2 p-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs">
                        Application evaluated. Another startup was selected for this specific problem statement.
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                    {probId && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 md:w-36 text-xs"
                        onClick={() => navigate(`/startup/problems/${probId}`)}
                      >
                        Problem Details
                      </Button>
                    )}
                    {app.status === 'selected' && (
                      <Button
                        size="sm"
                        className="flex-1 md:w-36 bg-navy-900 text-white text-xs"
                        onClick={() => navigate('/startup/pilots')}
                      >
                        Active Pilot
                      </Button>
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

export default StartupApplications;
