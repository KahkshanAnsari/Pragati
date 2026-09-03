import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Application } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Card } from '../../components/ui/Card';
import { formatDate, formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Clock,
  IndianRupee,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'shortlisted' | 'selected' | 'rejected'>('all');

  useEffect(() => {
    fetchApps();
  }, []);

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
    all: applications.length,
    submitted: applications.filter((a) => (a.status || '').toLowerCase().trim() === 'submitted').length,
    shortlisted: applications.filter((a) => (a.status || '').toLowerCase().trim() === 'shortlisted').length,
    selected: applications.filter((a) => (a.status || '').toLowerCase().trim() === 'selected').length,
    rejected: applications.filter((a) => (a.status || '').toLowerCase().trim() === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="p-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Review & Evaluation"
        subtitle="Review, score, and select startup pilot proposals for your department's challenges."
      />

      {/* Tabs with Dynamic Counts */}
      <div className="flex border-b border-gray-200 overflow-x-auto space-x-1 pb-1">
        {(['all', 'submitted', 'shortlisted', 'selected', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`py-2.5 px-4 font-semibold text-sm rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              filter === tab
                ? 'border-b-2 border-navy-900 text-navy-900 bg-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <span className="capitalize">{tab}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                filter === tab
                  ? 'bg-navy-100 text-navy-900'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {filteredApps.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-navy-900 mb-1">No Applications Found</h3>
          <p className="text-gray-500 text-sm">
            There are currently no proposals in the '{filter}' category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => (
            <Card
              key={app.id}
              className="p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <StatusBadge status={app.status} />
                    <span className="text-xs text-gray-400 font-medium">
                      Applied {formatDate(app.created_at)}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigate(`/government/applications/${app.id}/evaluate`)}
                    className="text-lg font-bold text-navy-900 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {app.problem?.title || 'Challenge Statement'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <span className="font-semibold text-navy-800 flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      {app.startup?.name}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      {app.startup?.sector || 'Innovation'}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="font-semibold text-navy-900 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                      {app.cost_proposed ? formatCurrency(app.cost_proposed) : 'Cost on review'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    <strong>Solution Summary:</strong> {app.solution}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0">
                  <Button
                    variant={app.status === 'submitted' || app.status === 'shortlisted' ? 'primary' : 'secondary'}
                    size="sm"
                    className="flex-1 md:w-36 text-xs font-semibold py-2"
                    onClick={() => navigate(`/government/applications/${app.id}/evaluate`)}
                  >
                    {app.status === 'submitted' || app.status === 'shortlisted' ? 'Evaluate & Score' : 'View Proposal'}
                  </Button>

                  {app.status === 'selected' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 md:w-36 text-xs text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                      onClick={() => navigate('/government/pilots')}
                    >
                      View in Pilots
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
