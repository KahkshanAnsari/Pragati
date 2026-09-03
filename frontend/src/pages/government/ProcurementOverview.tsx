import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { Spinner } from '../../components/ui/Spinner';
import { Pilot } from '../../types';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import {
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Briefcase,
  ArrowRight,
  FileCheck,
} from 'lucide-react';

export const ProcurementOverview: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPilotsAndCases();
  }, []);

  const fetchPilotsAndCases = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/pilots');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setPilots(data);
    } catch (error) {
      toast.error('Failed to load procurement cases');
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

  // Pilots ready for procurement evaluation (progress >= 50%)
  const readyPilots = pilots.filter((p) => (p.progress_percent || 0) >= 50);
  const otherPilots = pilots.filter((p) => (p.progress_percent || 0) < 50);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement Readiness"
        subtitle="Review pilot outcomes and prepare validated solutions for government procurement review."
      />

      {/* Pilots Ready for Assessment */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          High Procurement Readiness Pilots ({readyPilots.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {readyPilots.map((pilot) => {
            const title = (pilot as any).problem?.title || `Pilot ${pilot.pilot_number}`;
            const startupName = (pilot as any).startup?.name || 'Startup';
            const deptName = (pilot as any).department?.name || 'Department';
            const progress = Math.round(pilot.progress_percent || 0);

            return (
              <Card
                key={pilot.id}
                className="p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        {pilot.pilot_number || 'PILOT-READY'}
                      </span>
                      <Badge variant="success">Readiness: HIGH (85%+)</Badge>
                      <span className="text-xs text-gray-500 font-medium">
                        Progress: {progress}%
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-navy-900">{title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1 font-medium text-gray-800">
                        <Briefcase className="w-4 h-4 text-blue-600" /> {startupName}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span>{deptName}</span>
                      <span className="text-gray-300">•</span>
                      <span>Allocated: {formatCurrency(pilot.budget_allocated)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
                    <Button
                      variant="secondary"
                      className="text-xs"
                      onClick={() => navigate(`/government/pilots/${pilot.id}/workspace`)}
                    >
                      View Workspace
                    </Button>
                    <Button
                      className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1"
                      onClick={() => navigate(`/government/procurement/${pilot.id}`)}
                    >
                      <FileCheck className="w-4 h-4 mr-1" />
                      Review Procurement Case <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ongoing Pilots */}
      {otherPilots.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Early Stage Pilots ({otherPilots.length})
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {otherPilots.map((pilot) => {
              const title = (pilot as any).problem?.title || `Pilot ${pilot.pilot_number}`;
              const startupName = (pilot as any).startup?.name || 'Startup';
              const progress = Math.round(pilot.progress_percent || 0);

              return (
                <Card key={pilot.id} className="p-5 bg-gray-50/70 border border-gray-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">{pilot.pilot_number}</span>
                        <Badge variant="secondary">Early Stage ({progress}%)</Badge>
                      </div>
                      <h4 className="font-semibold text-gray-900">{title}</h4>
                      <p className="text-xs text-gray-500 mt-1">Vendor: {startupName}</p>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/government/pilots/${pilot.id}/workspace`)}
                    >
                      Monitor Pilot Progress
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementOverview;
