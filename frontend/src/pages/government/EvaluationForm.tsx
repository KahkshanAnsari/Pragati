import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Application, Evaluation } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Textarea } from '../../components/ui/Textarea';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export const EvaluationForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [scores, setScores] = useState({
    technical_fit: 0,
    feasibility: 0,
    cost_effectiveness: 0,
    team_capability: 0,
    expected_impact: 0,
    scalability: 0
  });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const res = await api.get(`/api/applications/${id}`);
        setApp(res.data?.data || res.data);
      } catch (err) {
        toast.error('Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApp();
  }, [id]);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  const handleSubmit = async (decision: 'shortlist' | 'reject' | 'select') => {
    setSubmitting(true);
    try {
      await api.patch(`/api/applications/${id}/status`, {
        status: decision === 'select' ? 'selected' : decision === 'shortlist' ? 'shortlisted' : 'rejected',
        evaluation: {
          ...scores,
          total_score: totalScore,
          decision,
          notes
        }
      });
      toast.success(`Application marked as ${decision}`);
      navigate('/government/applications');
    } catch (err) {
      toast.error('Failed to submit evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSlider = (key: keyof typeof scores, label: string) => (
    <div className="mb-6">
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-navy-900">{scores[key]}/10</span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        value={scores[key]}
        onChange={(e) => setScores(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-900"
      />
    </div>
  );

  if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;
  if (!app) return <div>Application not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
      </div>
      <PageHeader title="Evaluate Application" subtitle={`Reviewing solution from ${app.startup?.name}`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Summary */}
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">Application Details</h3></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Proposed Solution</h4>
              <p className="text-gray-800 whitespace-pre-wrap">{app.solution}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Implementation Plan</h4>
              <p className="text-gray-800 whitespace-pre-wrap">{app.implementation_plan}</p>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
              <span className="font-medium text-gray-700">Proposed Cost</span>
              <span className="text-xl font-bold text-navy-900">{formatCurrency(app.cost_proposed)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Right: Form */}
        <Card>
          <CardHeader className="bg-navy-50 border-b border-navy-100 pb-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-navy-900">Scoring Form</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Total Score:</span>
                <span className={`text-2xl font-bold ${totalScore >= 45 ? 'text-green-600' : totalScore >= 30 ? 'text-amber-500' : 'text-red-500'}`}>
                  {totalScore}/60
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {renderSlider('technical_fit', 'Technical Fit')}
            {renderSlider('feasibility', 'Feasibility')}
            {renderSlider('cost_effectiveness', 'Cost Effectiveness')}
            {renderSlider('team_capability', 'Team Capability')}
            {renderSlider('expected_impact', 'Expected Impact')}
            {renderSlider('scalability', 'Scalability')}
            
            <div className="mt-6">
              <Textarea 
                label="Evaluation Notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your comments here..."
                className="min-h-[100px]"
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button 
                onClick={() => handleSubmit('select')} 
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                Select for Pilot
              </Button>
              <Button 
                onClick={() => handleSubmit('shortlist')} 
                disabled={submitting}
                className="bg-amber-500 hover:bg-amber-600 text-white flex-1"
              >
                Shortlist
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleSubmit('reject')} 
                disabled={submitting}
                className="border-red-500 text-red-600 hover:bg-red-50 flex-1"
              >
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
