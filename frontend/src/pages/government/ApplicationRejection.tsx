import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Application } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { Badge } from '../../components/ui/Badge';
import { formatDate, formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import { AlertTriangle, Building2, Calendar, IndianRupee, Briefcase, FileText, XCircle } from 'lucide-react';

const REJECTION_REASONS = [
  'Technical requirements not fully met',
  'Required KPI/performance criteria not achieved',
  'Solution not suitable for the current government requirement',
  'Implementation feasibility concerns',
  'Financial/budget suitability concerns',
  'Compliance/documentation issue',
  'Pilot/evaluation performance concerns',
  'Other',
] as const;

type RejectionReason = typeof REJECTION_REASONS[number];

export const ApplicationRejection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState<RejectionReason | ''>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [confirmStep, setConfirmStep] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await api.get(`/api/applications/${id}`);
        const data = res.data?.data || res.data;
        setApp(data);

        // Guard: this page is only for shortlisted applications
        if (data && data.status !== 'shortlisted') {
          toast.error('This application is not in shortlisted status.');
          navigate(-1);
        }
      } catch (err) {
        toast.error('Failed to load application details.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApp();
  }, [id]);

  const handleProceedToConfirm = () => {
    if (!selectedReason) {
      toast.error('Please select a rejection reason before proceeding.');
      return;
    }
    setConfirmStep(true);
  };

  const handleConfirmRejection = async () => {
    if (!selectedReason) {
      toast.error('A rejection reason is required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.patch(`/api/applications/${id}/status`, {
        status: 'rejected',
        rejection_reason: selectedReason,
        rejection_feedback: feedbackText.trim() || null,
      });
      toast.success('Application decision recorded. Startup has been notified.');
      navigate('/government/applications');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to submit rejection decision.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!app) return null;

  const probTitle = app.problem?.title || 'Challenge Statement';
  const startupName = app.startup?.name || 'Startup';
  const deptName = (app.problem as any)?.department?.name || '—';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back navigation */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/government/applications')}
        className="text-sm"
      >
        Back to Applications
      </Button>

      <PageHeader
        title="Application Rejection — Evaluation Decision"
        subtitle="Complete the evaluation form before confirming rejection. This decision will be recorded in the audit trail and communicated to the startup."
      />

      {/* Application Details Panel */}
      <Card className="border border-gray-200">
        <CardHeader>
          <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-navy-700" />
            Application Details
          </h3>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Startup</p>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              {startupName}
              {app.startup?.sector && (
                <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 ml-1">
                  {app.startup.sector}
                </span>
              )}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Problem / Challenge</p>
            <p className="text-sm font-semibold text-gray-900">{probTitle}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Department</p>
            <p className="text-sm text-gray-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {deptName}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Application Date</p>
            <p className="text-sm text-gray-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {formatDate(app.created_at)}
            </p>
          </div>
          {app.cost_proposed && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Proposed Cost</p>
              <p className="text-sm font-semibold text-navy-900 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                {formatCurrency(app.cost_proposed)}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Status</p>
            <Badge variant="warning">Shortlisted</Badge>
          </div>
          {app.solution && (
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Proposed Solution</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 line-clamp-3">
                {app.solution}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rejection / Evaluation Form */}
      <Card className="border border-amber-200 bg-amber-50/30">
        <CardHeader className="border-b border-amber-100">
          <h3 className="font-semibold text-gray-900 text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Rejection Evaluation Form
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Select a rejection reason. This will be communicated to the startup and logged in the audit trail.
          </p>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">

          {/* Rejection Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2.5">
              {REJECTION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                    selectedReason === reason
                      ? 'border-navy-600 bg-navy-50 ring-1 ring-navy-400'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejection_reason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason as RejectionReason)}
                    className="mt-0.5 accent-navy-900 shrink-0"
                  />
                  <span className="text-sm text-gray-800">{reason}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Feedback */}
          <div>
            <Textarea
              label="Additional Evaluation Feedback (Optional)"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Provide any additional context, specific issues observed, or recommendations for the startup..."
              className="min-h-[110px]"
            />
            <p className="text-xs text-gray-400 mt-1">
              This feedback will be visible to the startup when they view their application status.
            </p>
          </div>

          {/* Actions — confirm step */}
          {!confirmStep ? (
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate('/government/applications')}
                className="text-sm"
              >
                Cancel — Return to Applications
              </Button>
              <Button
                onClick={handleProceedToConfirm}
                className="bg-red-700 hover:bg-red-800 text-white text-sm"
              >
                Proceed to Confirm Rejection
              </Button>
            </div>
          ) : (
            <div className="border border-red-300 rounded-xl bg-red-50 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">Confirm Final Rejection Decision</p>
                  <p className="text-sm text-red-700">
                    You are about to reject{' '}
                    <strong>{startupName}</strong>'s application for{' '}
                    <strong>"{probTitle}"</strong>.
                  </p>
                  <div className="mt-3 p-3 bg-white rounded-lg border border-red-200 space-y-1">
                    <p className="text-xs text-gray-600">
                      <strong>Reason:</strong> {selectedReason}
                    </p>
                    {feedbackText && (
                      <p className="text-xs text-gray-600">
                        <strong>Feedback:</strong> {feedbackText}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    This action cannot be undone. The startup will be notified.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmStep(false)}
                  disabled={submitting}
                  className="text-sm"
                >
                  Go Back — Edit Decision
                </Button>
                <Button
                  onClick={handleConfirmRejection}
                  disabled={submitting}
                  isLoading={submitting}
                  className="bg-red-700 hover:bg-red-800 text-white text-sm"
                >
                  Confirm Rejection
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationRejection;
