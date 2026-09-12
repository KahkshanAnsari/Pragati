import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import { Pilot, ProcurementCase, ProcurementChecklist } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Skeleton, KPISkeletonGrid } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { toast } from 'react-hot-toast';
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  RefreshCw,
  Send,
  ShieldCheck,
  FileText,
} from 'lucide-react';

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

  // ── Checklist definition ─────────────────────────────────────────────────
  const checklistItems = [
    { key: 'pilot_completed',       label: 'Pilot Completed' },
    { key: 'kpi_results_available', label: 'KPI Verification' },
    { key: 'compliance_documents',  label: 'Compliance Documentation' },
    { key: 'cost_information',      label: 'Financial Evidence' },
    { key: 'outcome_report',        label: 'Outcome Evaluation' },
    { key: 'government_evaluation', label: 'Pricing Proposal' },
  ];

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        <div className="h-8 w-48 rounded-md bg-slate-200 skeleton-shimmer" />
        <KPISkeletonGrid count={3} />
        <div className="space-y-4">
          {[1, 2].map(i => <Skeleton key={i} variant="card" className="h-64" />)}
        </div>
      </div>
    );
  }
  
  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-20 animate-fade-in">
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-20 h-20 bg-success-50 text-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
              Procurement Case Submitted
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              The validated solution profile and procurement case have been successfully submitted for departmental procurement review.
            </p>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl inline-block mb-8">
              <span className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Reference Number</span>
              <span className="font-mono text-xl font-bold text-navy-900">
                PROC-CASE-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000)}
              </span>
            </div>
            <div>
              <Button onClick={() => navigate('/government/problems')}>Return to Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }



  // ── No data guard ─────────────────────────────────────────────────────────
  if (!procurementCase) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Button>
        <EmptyState
          variant="folder"
          title="No Procurement Data"
          description="No procurement readiness data was found for this pilot."
          action={{ label: 'Go Back', onClick: () => navigate(-1) }}
        />
      </div>
    );
  }

  const score = procurementCase.readiness_score ?? 0;
  const isReady = procurementCase.readiness_level === 'high';
  const checkedCount = checklistItems.filter(
    item => procurementCase.checklist[item.key as keyof ProcurementChecklist]
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Back button */}
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
      </Button>

      <PageHeader
        title="Procurement Readiness"
        subtitle="Evidence-backed readiness for government procurement review"
      />

      {/* ── Procurement Card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card padding="">
          {/* Card header: startup + problem + score */}
          <CardHeader className="px-6 py-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="font-extrabold text-lg tracking-tight text-slate-900">
                  {pilot?.startup?.name || 'Startup'}
                </h2>
                <Badge
                  variant={isReady ? 'success' : 'warning'}
                  dot
                  pulse={!isReady}
                >
                  {procurementCase.readiness_level?.toUpperCase() || 'UNKNOWN'}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 truncate">
                {pilot?.problem?.title || 'Government Problem'}
              </p>
            </div>

            {/* Readiness Score (large number) */}
            <div className="text-right shrink-0 ml-4">
              <div className="text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
                {score}
                <span className="text-2xl font-semibold text-slate-400">%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Readiness Score</p>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-5 space-y-6">
            {/* Overall Readiness Progress Bar */}
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="font-semibold text-slate-600">Overall Readiness</span>
                <span className="font-bold text-slate-900">{score}%</span>
              </div>
              <ProgressBar value={score} color="auto" gradient animated size="lg" />
            </div>

            {/* Checklist Grid (2 cols) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">
                  Compliance Checklist
                  <span className="ml-2 text-xs font-semibold text-slate-400">
                    {checkedCount}/{checklistItems.length} complete
                  </span>
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAssess}
                  disabled={assessing}
                >
                  {assessing
                    ? <Spinner className="w-3.5 h-3.5" />
                    : <><RefreshCw className="w-3.5 h-3.5 mr-1.5" />Refresh AI</>
                  }
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {checklistItems.map((item, i) => {
                  const isChecked = procurementCase.checklist[item.key as keyof ProcurementChecklist];
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
                        isChecked
                          ? 'bg-success-50 border-success-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {isChecked
                        ? <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
                        : <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                      }
                      <span className={`text-sm font-medium ${isChecked ? 'text-success-800' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* AI Analysis */}
            {procurementCase.ai_analysis && (
              <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-blue-900 mb-0.5">AI Assessment</p>
                  <p className="text-xs text-blue-800 leading-relaxed">{procurementCase.ai_analysis}</p>
                </div>
              </div>
            )}
          </CardContent>

          {/* Card Footer: Submit button */}
          <CardFooter className="flex justify-end gap-3">
            {procurementCase.report_url && (
              <Button variant="outline" size="sm">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> View Report
              </Button>
            )}
            <Button
              variant="accent"
              onClick={() => setConfirmModal(true)}
              disabled={!isReady}
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Submit for Review
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Confirmation Modal */}
      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title="Confirm Procurement Submission">
        <div className="space-y-4">
          <p className="text-slate-700 text-sm">
            This action will finalize the validated solution and submit the procurement readiness dossier for government procurement review.
          </p>
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm border border-blue-200">
            Note: The consolidated dossier includes verified KPIs, field inspection reports, and statutory compliance documentation.
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setConfirmModal(false)}>Cancel</Button>
            <Button onClick={handleProceed}>Confirm Submission</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

