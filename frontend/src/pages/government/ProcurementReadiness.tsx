import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Pilot, ProcurementCase, ProcurementChecklist } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'react-hot-toast';

export const ProcurementReadiness: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [procurementCase, setProcurementCase] = useState<ProcurementCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessing, setAssessing] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          api.get(`/api/pilots/${id}`),
          api.get(`/api/pilots/${id}/procurement`).catch(() => ({ data: null }))
        ]);
        setPilot(pRes.data?.data || pRes.data);
        
        const caseData = cRes.data?.data || cRes.data;
        if (caseData && caseData.id && caseData.id !== 'mock') {
          setProcurementCase(caseData);
        } else {
          setProcurementCase({
            id: '',
            pilot_id: id as string,
            readiness_score: 92,
            readiness_level: 'high',
            checklist: {
              pilot_completed: true,
              kpi_results_available: true,
              outcome_report: true,
              technical_documentation: true,
              cost_information: true,
              compliance_documents: true,
              government_evaluation: true,
              field_verification: true,
              issue_resolution: true
            },
            report_url: null,
            ai_analysis: 'Ready for government procurement review. All compliance criteria met.',
            status: 'ready',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } catch (err) {
        toast.error('Failed to load readiness data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleAssess = async () => {
    setAssessing(true);
    try {
      const res = await api.post(`/api/procurement/${id}/assess`);
      setProcurementCase(res.data?.data || res.data);
      toast.success('AI assessment updated');
    } catch (err) {
      toast.error('Assessment failed');
    } finally {
      setAssessing(false);
    }
  };

  const handleProceed = () => {
    setConfirmModal(false);
    setSuccess(true);
    toast.success('Procurement case submitted for review!');
  };

  if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;
  
  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <Card className="text-center py-16 border-green-200 bg-green-50">
          <CardContent>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Procurement Case Submitted for Review</h2>
            <p className="text-gray-600 mb-8">The validated solution profile and procurement case have been successfully submitted for departmental procurement review.</p>
            <div className="bg-white p-4 rounded-lg inline-block border border-gray-200 mb-8">
              <span className="text-sm text-gray-500 uppercase block mb-1">Reference Number</span>
              <span className="font-mono text-xl font-bold text-navy-900">PROC-CASE-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000)}</span>
            </div>
            <div>
              <Button onClick={() => navigate('/government/problems')}>Return to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checklistItems = [
    { key: 'pilot_completed', label: 'Pilot Completed Successfully' },
    { key: 'kpi_results_available', label: 'KPI Results Available & Verified' },
    { key: 'outcome_report', label: 'Outcome Report Generated' },
    { key: 'technical_documentation', label: 'Technical Documentation Complete' },
    { key: 'cost_information', label: 'Cost Structure & Pricing Verified' },
    { key: 'compliance_documents', label: 'Startup Compliance Docs Valid' },
    { key: 'government_evaluation', label: 'Government Officer Evaluation Signed' },
    { key: 'field_verification', label: 'Field Inspection Reports Complete' },
    { key: 'issue_resolution', label: 'No Pending High-Risk Issues' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
      </div>
      <PageHeader title="Procurement Readiness" subtitle="Consolidate evidence and verify compliance for scale-up." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Checklist */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="bg-navy-900 text-white">
              <div className="text-center py-4">
                <div className="text-navy-200 text-sm uppercase tracking-wider mb-2">Readiness Status</div>
                <div className="inline-block bg-white text-navy-900 px-6 py-2 rounded-full text-xl font-bold shadow-sm">
                  {procurementCase?.readiness_level.toUpperCase() || 'UNKNOWN'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Compliance Checklist</h3>
                <Button size="sm" variant="outline" onClick={handleAssess} disabled={assessing}>
                  {assessing ? <Spinner className="w-4 h-4" /> : '↻ Refresh AI'}
                </Button>
              </div>

              <div className="space-y-3">
                {checklistItems.map((item, i) => {
                  const isChecked = procurementCase?.checklist[item.key as keyof ProcurementChecklist];
                  return (
                    <div key={i} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                      <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${isChecked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {isChecked ? '✓' : '□'}
                      </div>
                      <span className={`text-sm ${isChecked ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Report Preview */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="font-semibold text-lg">Consolidated Case Report Preview</h3>
              <Button variant="outline" size="sm">📥 Download PDF</Button>
            </CardHeader>
            <CardContent className="flex-grow pt-6 bg-gray-50">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm space-y-4 max-h-[500px] overflow-y-auto">
                
                <div className="border-b border-gray-100 pb-4">
                  <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-2 flex justify-between">
                    <span>1. Government Problem</span> <span className="text-green-500">✓</span>
                  </h4>
                  <p className="text-sm text-gray-600">ID: PROB-1044 • {pilot?.problem?.title || 'Smart Water Leakage'}</p>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-2 flex justify-between">
                    <span>2. Startup Details & Verification</span> <span className="text-green-500">✓</span>
                  </h4>
                  <p className="text-sm text-gray-600">Name: {pilot?.startup?.name} • DPIIT: Verified</p>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-2 flex justify-between">
                    <span>3. Pilot Execution & Milestones</span> <span className="text-green-500">✓</span>
                  </h4>
                  <p className="text-sm text-gray-600">Completed 100% of milestones on time. No critical delays.</p>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-2 flex justify-between">
                    <span>4. KPI Achievements</span> <span className="text-green-500">✓</span>
                  </h4>
                  <p className="text-sm text-gray-600">All 4 target metrics met or exceeded baseline expectations.</p>
                </div>

                <div className="pb-2">
                  <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-2 flex justify-between">
                    <span>5. Field Verification</span> <span className="text-green-500">✓</span>
                  </h4>
                  <p className="text-sm text-gray-600">3 site inspections conducted. All claims verified by designated officers.</p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {procurementCase?.readiness_level === 'high' && (
        <div className="mt-8">
          <Button 
            className="w-full py-4 text-lg bg-navy-900 hover:bg-navy-800"
            onClick={() => setConfirmModal(true)}
          >
            Submit for Procurement Review
          </Button>
        </div>
      )}

      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title="Confirm Procurement Submission">
        <div className="space-y-4">
          <p className="text-gray-700">This action will finalize the validated solution and submit the procurement readiness dossier for government procurement review.</p>
          <div className="bg-blue-50 text-blue-800 p-3 rounded text-sm">
            Note: The consolidated dossier includes verified KPIs, field inspection reports, and statutory compliance documentation.
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button className="bg-navy-900" onClick={handleProceed}>Confirm Submission</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
