import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Pilot, Milestone, FieldInspection as InspectionType } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';

export const FieldInspection: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [inspections, setInspections] = useState<InspectionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [location, setLocation] = useState('');
  const [completionPercent, setCompletionPercent] = useState(0);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, mRes, iRes] = await Promise.all([
          api.get(`/api/pilots/${id}`),
          api.get(`/api/pilots/${id}/milestones`),
          api.get(`/api/inspections?pilot_id=${id}`)
        ]);
        setPilot(pRes.data.data);
        setMilestones(mRes.data.data || []);
        setInspections(iRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load inspection data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return toast.error('Select a milestone');
    
    setSubmitting(true);
    try {
      await api.post(`/api/inspections/${id}/submit`, {
        milestone_id: selectedMilestone,
        inspection_date: inspectionDate,
        location,
        verified_completion_percent: completionPercent,
        notes,
        status: 'submitted'
      });
      toast.success('Inspection report submitted!');
      navigate(`/government/pilots/${id}/workspace`);
    } catch (err) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
      </div>
      
      <PageHeader title="Field Inspection" subtitle={`Submit report for ${pilot?.startup?.name || 'Pilot'}`} />

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select
              label="Select Milestone to Inspect"
              value={selectedMilestone}
              onChange={(value) => setSelectedMilestone(value)}
              options={[
                { label: 'Select Milestone', value: '' },
                ...milestones
                  .filter(m => m.status === 'startup_claimed' || m.status === 'pending')
                  .map(m => ({ label: `M${m.sequence_order}: ${m.title}`, value: m.id }))
              ]}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Inspection Date"
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                required
              />
              <Input
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where was it inspected?"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Verified Completion %</label>
                <span className="font-bold text-navy-900">{completionPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={completionPercent}
                onChange={(e) => setCompletionPercent(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
              />
            </div>

            <Textarea
              label="Inspection Notes & Findings"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px]"
              required
            />

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo Evidence</label>
              <input type="file" multiple className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-navy-50 file:text-navy-700 hover:file:bg-navy-100" />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Inspection Report'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {inspections.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-navy-900 mb-4">Previous Reports</h3>
          <div className="space-y-4">
            {inspections.map(i => (
              <Card key={i.id} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div className="font-medium">M{i.milestone?.sequence_order} Inspection</div>
                    <div className="text-sm text-gray-500">{i.inspection_date}</div>
                  </div>
                  <div className="text-sm mt-2 text-gray-700">{i.notes}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
