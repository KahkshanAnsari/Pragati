import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { IssueReport, IssueCategory } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export const IssueReporting: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<IssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [category, setCategory] = useState<IssueCategory>('other');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [reportDate, setReportDate] = useState('');

  const fetchIssues = async () => {
    try {
      const res = await api.get(`/api/issues?pilot_id=${id}`);
      setIssues(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchIssues();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/issues', {
        pilot_id: id,
        category,
        description,
        location,
        report_date: reportDate,
        status: 'reported'
      });
      toast.success('Issue reported successfully');
      setModalOpen(false);
      fetchIssues(); // refresh list
    } catch (err) {
      toast.error('Failed to report issue');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'under_investigation': return 'bg-amber-100 text-amber-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const categories = [
    { label: 'Fund Misuse', value: 'fund_misuse' },
    { label: 'False Reporting', value: 'false_reporting' },
    { label: 'Work Not Completed', value: 'work_not_completed' },
    { label: 'Poor Quality', value: 'poor_quality' },
    { label: 'Safety Violation', value: 'safety_violation' },
    { label: 'Document Discrepancy', value: 'document_discrepancy' },
    { label: 'Unauthorized Activity', value: 'unauthorized_activity' },
    { label: 'Other', value: 'other' }
  ];

  if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
      </div>

      <div className="flex justify-between items-center">
        <PageHeader title="Issue Reporting" subtitle="Track and report anomalies in pilot execution." />
        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setModalOpen(true)}>⚠️ Report New Issue</Button>
      </div>

      <div className="bg-blue-50 text-blue-800 p-4 rounded-md text-sm border border-blue-100">
        <span className="font-bold mr-2">i</span>
        Legal Disclaimer: This platform records and routes issues for review. All enforcement decisions are made by the authorized department outside the system.
      </div>

      <div className="space-y-4">
        {issues.length === 0 ? (
          <Card className="text-center py-12"><p className="text-gray-500">No issues reported for this pilot.</p></Card>
        ) : (
          issues.map(issue => (
            <Card key={issue.id} className="border-l-4 border-l-red-500 overflow-hidden">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg capitalize">{issue.category.replace('_', ' ')}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(issue.report_date)}</div>
                </div>
                <p className="text-gray-700 text-sm mb-4">{issue.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>📍 {issue.location}</span>
                  {issue.status !== 'reported' && (
                    <button className="text-navy-600 font-medium hover:underline">View Investigation</button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Report New Issue">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Issue Category"
            value={category}
            onChange={(value) => setCategory(value as IssueCategory)}
            options={categories}
            required
          />
          <Input
            label="Report Date"
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            required
          />
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <Textarea
            label="Description & Evidence"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="min-h-[100px]"
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => setModalOpen(false)} type="button">Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
