import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Spinner } from '../../components/ui/Spinner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Badge } from '../../components/ui/Badge';
import { Problem, Application } from '../../types';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../../lib/utils';
import { CheckCircle2, ChevronRight, Upload, AlertCircle, ArrowLeft } from 'lucide-react';

export const ApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApp, setExistingApp] = useState<Application | null>(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    solution_title: '',
    solution_description: '',
    proposed_approach: '',
    implementation_plan: '',
    cost_proposed: '',
    team_size: '5',
    team_details: '',
    previous_work: '',
    reference_projects: '',
    expected_outcome: '',
    documents_url: '',
  });

  useEffect(() => {
    fetchProblemAndApplicationStatus();
  }, [id]);

  const fetchProblemAndApplicationStatus = async () => {
    try {
      setLoading(true);
      const [probRes, appsRes] = await Promise.all([
        api.get(`/api/problems/${id}`),
        api.get('/api/applications?startup_id=mine').catch(() => ({ data: [] }))
      ]);

      setProblem(probRes.data?.data || probRes.data);

      const apps = Array.isArray(appsRes.data) ? appsRes.data : (appsRes.data?.data || []);
      const matched = apps.find((a: any) => a.problem_id === id);
      if (matched) {
        setExistingApp(matched);
      }
    } catch (error) {
      toast.error('Failed to load problem details');
      navigate('/startup/problems');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/api/applications', {
        problem_id: id,
        solution_title: formData.solution_title,
        solution_description: formData.solution_description,
        proposed_approach: formData.proposed_approach,
        implementation_plan: formData.implementation_plan,
        cost_proposed: formData.cost_proposed,
        team_size: formData.team_size,
        team_details: formData.team_details,
        previous_work: formData.previous_work,
        expected_outcome: formData.expected_outcome,
      });
      toast.success('Application submitted successfully!');
      navigate('/startup/applications');
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Failed to submit application';
      toast.error(msg);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/startup/problems')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Discover Problems
        </Button>
      </div>

      <PageHeader
        title="Submit Pilot Application"
        subtitle={`Applying for: ${problem.title}`}
      />

      {existingApp && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                You have already submitted an application for this problem.
              </p>
              <p className="text-xs text-amber-700">
                Current Status: <strong className="capitalize">{existingApp.status}</strong>
              </p>
            </div>
          </div>
          <Button size="sm" onClick={() => navigate('/startup/applications')}>
            View in My Applications
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Problem Summary */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-5 bg-navy-900 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono bg-navy-800 text-blue-300 px-2 py-0.5 rounded">
                {problem.sector}
              </span>
              <Badge variant="success">Open for Applications</Badge>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-white">{problem.title}</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold">Department</p>
                <p className="font-medium text-white">{problem.department?.name ?? 'Government Department'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold">Location</p>
                <p className="font-medium text-white">{problem.location}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold">Budget Range</p>
                <p className="font-medium text-white">
                  {problem.budget_min && problem.budget_max
                    ? `${formatCurrency(problem.budget_min)} – ${formatCurrency(problem.budget_max)}`
                    : 'Budget on assessment'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold">Pilot Duration</p>
                <p className="font-medium text-white">{problem.pilot_duration_days} days</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold">Expected Outcome</p>
                <p className="text-xs text-gray-300 line-clamp-3">{problem.expected_outcome}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-medium text-navy-900 mb-3 text-sm">Application Steps</h4>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`flex items-center gap-3 text-sm cursor-pointer ${
                    step >= s ? 'text-blue-600' : 'text-gray-400'
                  }`}
                  onClick={() => !existingApp && setStep(s)}
                >
                  {step > s ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                        step === s ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300'
                      }`}
                    >
                      {s}
                    </div>
                  )}
                  <span className={step === s ? 'font-semibold text-navy-900' : ''}>
                    {s === 1
                      ? 'Proposed Solution'
                      : s === 2
                      ? 'Implementation & Cost'
                      : s === 3
                      ? 'Track Record & Team'
                      : 'Review & Submit'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Multi-step Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {existingApp ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-navy-900">Application Already Submitted</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your startup has already submitted an application for this problem. The government evaluation committee is reviewing all shortlisted proposals.
                </p>
                <div className="pt-2">
                  <Button onClick={() => navigate('/startup/applications')}>
                    Go to My Applications
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <h3 className="text-lg font-semibold text-navy-900">Section 1: Proposed Solution</h3>
                      <p className="text-xs text-gray-500">Provide a clear title and description of your technology solution.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Solution Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="solution_title"
                        value={formData.solution_title}
                        onChange={handleChange}
                        required
                        placeholder="E.g., AI Edge-Vision Real-Time Road Accident Detection Mesh"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Solution Description <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="solution_description"
                        value={formData.solution_description}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Explain how your solution works, core technologies used, and why it is well-suited for this government challenge..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proposed Technical Approach <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="proposed_approach"
                        value={formData.proposed_approach}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Detailed technical architecture, sensor/data acquisition flow, AI models used, and integration points..."
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <h3 className="text-lg font-semibold text-navy-900">Section 2: Implementation & Cost</h3>
                      <p className="text-xs text-gray-500">Specify pilot rollout schedule and estimated execution budget.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Implementation Plan <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="implementation_plan"
                        value={formData.implementation_plan}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Phase 1: Setup & calibration (Month 1)... Phase 2: Deployment & live testing (Month 2)... Phase 3: Final validation & report (Month 3)..."
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Proposed Cost (₹) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="cost_proposed"
                          type="number"
                          value={formData.cost_proposed}
                          onChange={handleChange}
                          required
                          placeholder="e.g. 15000000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dedicated Team Size <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="team_size"
                          type="number"
                          value={formData.team_size}
                          onChange={handleChange}
                          required
                          placeholder="e.g. 6"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <h3 className="text-lg font-semibold text-navy-900">Section 3: Track Record & Team</h3>
                      <p className="text-xs text-gray-500">Highlight your relevant past deployments and team capability.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Relevant Work & Deployments <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="previous_work"
                        value={formData.previous_work}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Describe 1-3 previous projects, pilots, or clients where similar technology was deployed..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Team Capability & Key Roles
                      </label>
                      <Textarea
                        name="team_details"
                        value={formData.team_details}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Lead Engineer / Project Manager / AI Specialists involved in this pilot..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Outcome & Measurable KPIs <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        name="expected_outcome"
                        value={formData.expected_outcome}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Quantifiable targets (e.g. 90% detection accuracy within 30 seconds, 25% water loss reduction)..."
                      />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="border-b pb-2">
                      <h3 className="text-lg font-semibold text-navy-900">Section 4: Review & Submit</h3>
                      <p className="text-xs text-gray-500">Please review your submission details before submitting to the department.</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-semibold">Problem Title</span>
                        <p className="font-semibold text-navy-900">{problem.title}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 uppercase font-semibold">Proposed Solution</span>
                        <p className="text-sm text-gray-800 font-medium">{formData.solution_title || 'Untitled'}</p>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-1">{formData.solution_description}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                        <div>
                          <span className="text-xs text-gray-500 uppercase font-semibold">Proposed Cost</span>
                          <p className="font-semibold text-navy-900">
                            {formData.cost_proposed ? formatCurrency(Number(formData.cost_proposed)) : 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500 uppercase font-semibold">Dedicated Team</span>
                          <p className="font-semibold text-navy-900">{formData.team_size || '1'} Members</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supporting Documents / Pitch Deck URL (Optional)
                      </label>
                      <Input
                        name="documents_url"
                        value={formData.documents_url}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/..."
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  {step > 1 ? (
                    <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {submitting ? (
                      <Spinner size="sm" />
                    ) : step < 4 ? (
                      <span className="flex items-center">
                        Next Step <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
