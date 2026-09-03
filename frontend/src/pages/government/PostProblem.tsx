import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { ArrowLeft, Send } from 'lucide-react';

const DEPARTMENTS = [
  { value: 'd0000001-1111-4111-8111-000000000001', label: 'Water Resources Department, Nagpur' },
  { value: 'd0000002-1111-4111-8111-000000000002', label: 'Pune Smart City Development Corp (PSCDCL)' },
  { value: 'd0000003-1111-4111-8111-000000000003', label: 'National Highways Authority of India (NHAI)' },
  { value: 'd0000004-1111-4111-8111-000000000004', label: 'Department of Agriculture, Maharashtra' },
  { value: 'd0000005-1111-4111-8111-000000000005', label: 'Health & Family Welfare Dept, Karnataka' },
  { value: 'd0000006-1111-4111-8111-000000000006', label: 'Ministry of New & Renewable Energy (MNRE)' },
  { value: 'd0000007-1111-4111-8111-000000000007', label: 'Department of School Education, Telangana' },
  { value: 'd0000008-1111-4111-8111-000000000008', label: 'Brihanmumbai Municipal Corporation (BMC)' },
];

const SECTORS = [
  { value: 'Water & Wastewater', label: 'Water & Wastewater' },
  { value: 'Smart Infrastructure & Mobility', label: 'Smart Infrastructure & Mobility' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Agriculture', label: 'Agriculture' },
  { value: 'Clean Energy', label: 'Clean Energy' },
  { value: 'Education & Skilling', label: 'Education & Skilling' },
  { value: 'Governance & Smart Cities', label: 'Governance & Smart Cities' },
  { value: 'Waste Management', label: 'Waste Management' },
];

export const PostProblem: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department_id: DEPARTMENTS[0].value,
    sector: 'Water & Wastewater',
    location: '',
    required_technologies: '',
    required_capabilities: '',
    budget_min: '',
    budget_max: '',
    timeline_days: '90',
    expected_outcome: '',
    eligibility_requirements: '',
  });

  // Pre-fill department from officer profile if available
  useEffect(() => {
    const officerDeptId = (profile as any)?.department_id || (profile as any)?.department?.id;
    if (officerDeptId) {
      setFormData((prev) => ({ ...prev, department_id: officerDeptId }));
    }
  }, [profile]);

  const handleSubmit = async (status: 'published' | 'draft' = 'published') => {
    if (!formData.title.trim()) {
      toast.error('Problem Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Problem Description is required');
      return;
    }
    if (!formData.sector) {
      toast.error('Sector is required');
      return;
    }

    setSubmitting(true);
    try {
      const budgetMin = formData.budget_min ? Number(formData.budget_min) : 500000;
      const budgetMax = formData.budget_max ? Number(formData.budget_max) : (budgetMin ? budgetMin * 2 : 1500000);
      const timelineDays = formData.timeline_days ? Number(formData.timeline_days) : 90;

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        department_id: formData.department_id || undefined,
        sector: formData.sector,
        location: formData.location.trim() || undefined,
        required_technologies: formData.required_technologies
          ? formData.required_technologies.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        required_capabilities: formData.required_capabilities
          ? formData.required_capabilities.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        budget_min: budgetMin,
        budget_max: budgetMax,
        timeline_days: timelineDays,
        pilot_duration_days: timelineDays,
        expected_outcome: formData.expected_outcome.trim() || undefined,
        eligibility_requirements: formData.eligibility_requirements.trim() || undefined,
        status,
      };

      await api.post('/api/problems', payload);
      toast.success(status === 'published' ? 'Problem posted successfully!' : 'Problem saved as draft!');
      navigate('/government/problems');
    } catch (err: any) {
      console.error('Failed to post problem:', err);
      const msg = err.response?.data?.detail || 'Failed to post problem';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/government/problems')}
          className="gap-2 text-gray-600 hover:text-navy-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Registry
        </Button>
      </div>

      <PageHeader
        title="Post a Problem"
        subtitle="Submit a government challenge statement to invite innovative pilot proposals from verified startups."
      />

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-8 space-y-6">
          {/* Section 1: Problem Overview */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-navy-900 border-b border-gray-100 pb-2">
              Problem Overview
            </h3>

            <Input
              label="Problem Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Automated Water Leakage Detection & Monitoring"
            />

            <Textarea
              label="Problem Description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the operational challenge, current infrastructure bottlenecks, and target problem to solve..."
            />
          </div>

          {/* Section 2: Department & Categorization */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-navy-900 border-b border-gray-100 pb-2">
              Department & Sector Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Government Department"
                value={formData.department_id}
                options={DEPARTMENTS}
                onChange={(val) => setFormData({ ...formData, department_id: val })}
              />

              <Select
                label="Sector"
                value={formData.sector}
                options={SECTORS}
                onChange={(val) => setFormData({ ...formData, sector: val })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location / Jurisdiction"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Nagpur, Maharashtra"
              />

              <Input
                label="Timeline / Pilot Duration (Days)"
                type="number"
                value={formData.timeline_days}
                onChange={(e) => setFormData({ ...formData, timeline_days: e.target.value })}
                placeholder="e.g., 90"
              />
            </div>
          </div>

          {/* Section 3: Technical Requirements */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-navy-900 border-b border-gray-100 pb-2">
              Technical & Operational Requirements
            </h3>

            <Input
              label="Required Technologies (comma-separated)"
              value={formData.required_technologies}
              onChange={(e) => setFormData({ ...formData, required_technologies: e.target.value })}
              placeholder="e.g., IoT, AI/ML, Acoustic Sensors, SCADA"
            />

            <Input
              label="Required Capabilities (comma-separated)"
              value={formData.required_capabilities}
              onChange={(e) => setFormData({ ...formData, required_capabilities: e.target.value })}
              placeholder="e.g., Leak Detection, Water Infrastructure Monitoring, Real-Time Telemetry"
            />
          </div>

          {/* Section 4: Budget & Outcomes */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-navy-900 border-b border-gray-100 pb-2">
              Budget & Expected Outcomes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Budget Min (₹)"
                type="number"
                value={formData.budget_min}
                onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                placeholder="e.g., 1000000"
              />

              <Input
                label="Budget Max (₹)"
                type="number"
                value={formData.budget_max}
                onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                placeholder="e.g., 2000000"
              />
            </div>

            <Input
              label="Expected Outcome"
              value={formData.expected_outcome}
              onChange={(e) => setFormData({ ...formData, expected_outcome: e.target.value })}
              placeholder="e.g., 20% reduction in water distribution losses within 90 days"
            />

            <Textarea
              label="Eligibility Requirements (Optional)"
              rows={2}
              value={formData.eligibility_requirements}
              onChange={(e) => setFormData({ ...formData, eligibility_requirements: e.target.value })}
              placeholder="e.g., DPIIT-recognized startups with proven field deployment experience..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/government/problems')}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleSubmit('draft')}
              disabled={submitting}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={submitting}
              className="bg-navy-900 hover:bg-navy-800 text-white min-w-[140px] gap-2"
            >
              {submitting ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Problem
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostProblem;
