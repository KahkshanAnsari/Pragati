import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { PageHeader } from '../../components/ui/PageHeader';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Pilot, Milestone, KPI } from '../../types';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { CheckCircle2, Clock, Upload, FileText, AlertCircle } from 'lucide-react';

export const PilotWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  
  // Modals state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [kpiModalOpen, setKpiModalOpen] = useState(false);
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null);
  
  // Form state
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [kpiValue, setKpiValue] = useState('');

  useEffect(() => {
    fetchPilot();
  }, [id]);

  const fetchPilot = async () => {
    try {
      setLoading(true);
      const [pilotRes, kpisRes, milestonesRes] = await Promise.allSettled([
        api.get(`/api/pilots/${id}`),
        api.get(`/api/pilots/${id}/kpis`),
        api.get(`/api/pilots/${id}/milestones`),
      ]);

      if (pilotRes.status === 'fulfilled') {
        const pData = pilotRes.value.data?.data || pilotRes.value.data;
        setPilot(pData);
      }

      if (kpisRes.status === 'fulfilled') {
        const kData = Array.isArray(kpisRes.value.data) ? kpisRes.value.data : (kpisRes.value.data?.data || []);
        setKpis(kData);
      }

      if (milestonesRes.status === 'fulfilled') {
        const mData = Array.isArray(milestonesRes.value.data) ? milestonesRes.value.data : (milestonesRes.value.data?.data || []);
        setMilestones(mData);
      }
    } catch (error) {
      toast.error('Unable to load complete pilot workspace. Displaying available data.');
    } finally {
      setLoading(false);
    }
  };


  const handleClaimMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;
    try {
      await api.patch(`/api/milestones/${selectedMilestone.id}/claim`, {
        evidence_url: evidenceUrl,
        notes
      });
      toast.success('Milestone claimed successfully');
      setClaimModalOpen(false);
      fetchPilot(); // refresh
    } catch (error) {
      toast.error('Failed to claim milestone');
    }
  };

  const handleUpdateKpi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKpi) return;
    try {
      await api.post(`/api/kpis/${selectedKpi.id}/update`, {
        value: Number(kpiValue),
        notes
      });
      toast.success('KPI updated successfully');
      setKpiModalOpen(false);
      fetchPilot();
    } catch (error) {
      toast.error('Failed to update KPI');
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;
  if (!pilot) return null;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pilot Workspace" 
        description={`Managing Pilot ID: ${pilot.id.substring(0,8)}`}
        backLink="/startup/pilots"
      />

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-t-4 border-t-blue-500">
          <h4 className="text-sm text-gray-500 font-medium mb-2">Milestone Progress</h4>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-bold text-navy-900">
              {milestones.filter(m => m.status === 'inspector_verified').length || 0} / {milestones.length || 1}
            </span>
          </div>
          <ProgressBar value={40} color="navy" />
        </Card>
        
        <Card className="p-4 border-t-4 border-t-emerald-500">
          <h4 className="text-sm text-gray-500 font-medium mb-2">Budget Utilized</h4>
          <div className="flex justify-between items-end mb-2">
            <span className="text-2xl font-bold text-navy-900">₹{((pilot.budget_utilized || 0)/100000).toFixed(1)}L</span>
            <span className="text-sm text-gray-500">of ₹{(pilot.budget_allocated/100000).toFixed(1)}L</span>
          </div>
          <ProgressBar value={((pilot.budget_utilized || 0) / pilot.budget_allocated) * 100} color="success" />
        </Card>
        
        <Card className="p-4 border-t-4 border-t-amber-500">
          <h4 className="text-sm text-gray-500 font-medium mb-2">Time Remaining</h4>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-amber-500" />
            <span className="text-2xl font-bold text-navy-900">{pilot.duration_days || 90} Days</span>
          </div>
          <ProgressBar value={60} color="warning" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Milestones Section */}
        <Card className="p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Milestones</h3>
          </div>
          
          <div className="space-y-4 flex-1">
            {milestones.map((milestone, idx) => (
              <div key={milestone.id} className={`p-4 rounded-lg border ${milestone.status === 'inspector_verified' ? 'border-green-200 bg-green-50' : milestone.status === 'startup_claimed' ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{idx + 1}. {milestone.title}</h4>
                  {milestone.status === 'inspector_verified' ? (
                    <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</Badge>
                  ) : milestone.status === 'startup_claimed' ? (
                    <Badge variant="warning">Under Review</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                
                {milestone.status === 'pending' && (
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      setSelectedMilestone(milestone);
                      setEvidenceUrl('');
                      setNotes('');
                      setClaimModalOpen(true);
                    }}
                  >
                    Claim Completion
                  </Button>
                )}
                {milestone.status === 'startup_claimed' && (
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Awaiting inspector verification
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* KPIs & Evidence Section */}
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-navy-900">KPI Tracking</h3>
            </div>
            
            <div className="space-y-3">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{kpi.metric_name}</h4>
                    <p className="text-xs text-gray-500">Target: {kpi.target_value} {kpi.unit}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="font-semibold text-navy-900">{kpi.current_value || 0}</span>
                      <span className="text-xs text-gray-500 ml-1">{kpi.unit}</span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={() => {
                        setSelectedKpi(kpi);
                        setKpiValue(kpi.current_value?.toString() || '');
                        setNotes('');
                        setKpiModalOpen(true);
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-navy-900">Evidence & Documents</h3>
              <Button size="sm" variant="secondary" className="flex items-center gap-1"><Upload className="w-4 h-4"/> Upload</Button>
            </div>
            
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Field_Report_V{i}.pdf</p>
                      <p className="text-xs text-gray-500">Uploaded on Oct {10+i}, 2023</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Claim Milestone Modal */}
      <Modal isOpen={claimModalOpen} onClose={() => setClaimModalOpen(false)} title="Claim Milestone Completion">
        <form onSubmit={handleClaimMilestone} className="space-y-4">
          <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 mb-4">
            You are claiming completion for: <strong>{selectedMilestone?.title}</strong>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Evidence URL (Photos, Reports, etc.)</label>
            <Input required value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes for Inspector</label>
            <Textarea required value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setClaimModalOpen(false)}>Cancel</Button>
            <Button type="submit">Submit Claim</Button>
          </div>
        </form>
      </Modal>

      {/* Update KPI Modal */}
      <Modal isOpen={kpiModalOpen} onClose={() => setKpiModalOpen(false)} title="Update KPI Value">
        <form onSubmit={handleUpdateKpi} className="space-y-4">
          <div className="mb-4">
            <h4 className="font-medium">{selectedKpi?.metric_name}</h4>
            <p className="text-sm text-gray-500">Target: {selectedKpi?.target_value} {selectedKpi?.unit}</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Value ({selectedKpi?.unit})</label>
            <Input required type="number" step="any" value={kpiValue} onChange={(e) => setKpiValue(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Update Notes</label>
            <Textarea required value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setKpiModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Update</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PilotWorkspace;
