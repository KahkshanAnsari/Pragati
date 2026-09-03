import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { ProblemAIStructured } from '../../types';
import { useAuthStore } from '../../stores/authStore';

export const PostProblem: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [description, setDescription] = useState('');
  const [isStructuring, setIsStructuring] = useState(false);
  const [aiResult, setAiResult] = useState<ProblemAIStructured | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    required_capabilities: '',
    required_technologies: '',
    budget_min: '',
    budget_max: '',
    timeline_days: '',
    eligibility_requirements: ''
  });

  const handleStructure = async () => {
    if (!description.trim()) {
      toast.error('Please enter a problem description first.');
      return;
    }
    setIsStructuring(true);
    try {
      const res = await api.post('/api/problems/structure', { description });
      setAiResult(res.data.data);
      toast.success('AI structurally refined the problem!');
    } catch (err) {
      toast.error('Failed to structure problem. Try again.');
    } finally {
      setIsStructuring(false);
    }
  };

  const handlePublish = async (status: 'draft' | 'published') => {
    if (!aiResult) return;
    try {
      const payload = {
        ...formData,
        ...aiResult,
        status,
        required_capabilities: formData.required_capabilities.split(',').map(s => s.trim()).filter(Boolean),
        required_technologies: formData.required_technologies.split(',').map(s => s.trim()).filter(Boolean),
        budget_min: Number(formData.budget_min),
        budget_max: Number(formData.budget_max),
        timeline_days: Number(formData.timeline_days)
      };
      
      await api.post('/api/problems', payload);
      toast.success(`Problem ${status === 'published' ? 'published' : 'saved as draft'}!`);
      navigate('/government/problems');
    } catch (err) {
      toast.error('Failed to save problem.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader 
        title="Post a Problem" 
        subtitle="Describe your department's challenge and let AI help structure it for startups."
      />

      <Card>
        <CardContent className="pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description</label>
          <Textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the problem in your own words..."
            className="min-h-[150px] mb-4"
          />
          <Button onClick={handleStructure} disabled={isStructuring || !description.trim()} className="w-full sm:w-auto">
            {isStructuring ? <><Spinner className="mr-2" /> AI is structuring...</> : '✨ Structure with AI'}
          </Button>
        </CardContent>
      </Card>

      {aiResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-amber-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-bl-lg">
              ✨ AI Suggested
            </div>
            <CardContent className="pt-8 space-y-4">
              <h3 className="font-semibold text-lg text-navy-900 border-b pb-2 mb-4">Structured Requirements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Sector" value={aiResult.sector} onChange={(e) => setAiResult({...aiResult, sector: e.target.value})} />
                <Input label="Suggested Pilot Duration (Days)" type="number" value={aiResult.suggested_pilot_duration_days} onChange={(e) => setAiResult({...aiResult, suggested_pilot_duration_days: Number(e.target.value)})} />
                <Input label="Required Technology" value={aiResult.technology} onChange={(e) => setAiResult({...aiResult, technology: e.target.value})} />
                <Input label="Required Capability" value={aiResult.required_capability} onChange={(e) => setAiResult({...aiResult, required_capability: e.target.value})} />
              </div>
              <Textarea label="Suggested KPI" value={aiResult.suggested_kpi} onChange={(e) => setAiResult({...aiResult, suggested_kpi: e.target.value})} />
              <Textarea label="Expected Outcome" value={aiResult.expected_outcome} onChange={(e) => setAiResult({...aiResult, expected_outcome: e.target.value})} />
              <Textarea label="Refined Description" value={aiResult.refined_description} onChange={(e) => setAiResult({...aiResult, refined_description: e.target.value})} className="min-h-[100px]" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-lg text-navy-900 border-b pb-2 mb-4">Final Details</h3>
              <Input label="Problem Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="E.g., Smart Water Leakage Detection System" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Department" value={(profile as any)?.department?.name || 'Department'} disabled />
                <Input label="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="E.g., Mumbai, Maharashtra" />
                <Input label="Budget Min (₹)" type="number" value={formData.budget_min} onChange={e => setFormData({...formData, budget_min: e.target.value})} />
                <Input label="Budget Max (₹)" type="number" value={formData.budget_max} onChange={e => setFormData({...formData, budget_max: e.target.value})} />
                <Input label="Timeline (Days to apply)" type="number" value={formData.timeline_days} onChange={e => setFormData({...formData, timeline_days: e.target.value})} />
              </div>

              <div className="space-y-4">
                <Input label="Required Capabilities (comma separated)" value={formData.required_capabilities} onChange={e => setFormData({...formData, required_capabilities: e.target.value})} placeholder="IoT, Data Analysis, Hardware" />
                <Input label="Required Technologies (comma separated)" value={formData.required_technologies} onChange={e => setFormData({...formData, required_technologies: e.target.value})} placeholder="Sensors, Cloud, React" />
                <Textarea label="Eligibility Requirements" value={formData.eligibility_requirements} onChange={e => setFormData({...formData, eligibility_requirements: e.target.value})} />
              </div>

              <div className="flex gap-4 pt-6">
                <Button onClick={() => handlePublish('published')} className="flex-1">Publish Problem</Button>
                <Button variant="secondary" onClick={() => handlePublish('draft')}>Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
