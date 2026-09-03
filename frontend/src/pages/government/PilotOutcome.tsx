import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Pilot, KPI, PilotOutcomeScore, AIPilotAnalysis } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';

export const PilotOutcome: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIPilotAnalysis | null>(null);

  // Mocked outcome score for now
  const score: PilotOutcomeScore = {
    kpi_achievement: 85,
    technical_performance: 9,
    budget_performance: 8,
    timeline: 9,
    overall_score: 86,
    outcome: 'SUCCESSFUL'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, kRes] = await Promise.all([
          api.get(`/api/pilots/${id}`),
          api.get(`/api/pilots/${id}/kpis`)
        ]);
        setPilot(pRes.data.data);
        setKpis(kRes.data.data || []);
      } catch (err) {
        toast.error('Failed to load outcome data');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.get(`/api/pilots/${id}/analyze`);
      setAnalysis(res.data.data);
      toast.success('AI Analysis Complete');
    } catch (err) {
      toast.error('AI Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
          <PageHeader title="Pilot Outcome Report" subtitle="Final evaluation and readiness assessment." />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h3 className="font-semibold text-lg text-navy-900">KPI Achievements</h3></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kpis.map(kpi => (
                  <div key={kpi.id} className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Baseline</div>
                      <div className="font-medium">{kpi.baseline_value} {kpi.unit}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">Target</div>
                      <div className="font-medium">{kpi.target_value} {kpi.unit}</div>
                    </div>
                    <div className="border-l pl-4 border-gray-200">
                      <div className="text-xs text-gray-500 uppercase">Actual</div>
                      <div className={`font-bold text-lg ${kpi.status === 'achieved' ? 'text-green-600' : 'text-red-500'}`}>
                        {kpi.current_value || 0} {kpi.unit}
                      </div>
                      <div className="text-xs mt-1">
                        {kpi.status === 'achieved' ? '✓ Target Achieved' : '✗ Target Missed'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-navy-900">AI Outcome Analysis</h3>
              {!analysis && (
                <Button onClick={runAnalysis} disabled={analyzing} size="sm">
                  {analyzing ? 'Analyzing...' : '✨ Analyze Pilot with AI'}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {analyzing ? (
                <div className="py-12 flex flex-col items-center">
                  <Spinner className="mb-4" />
                  <p className="text-gray-500">Synthesizing milestones, budget, and KPIs...</p>
                </div>
              ) : analysis ? (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h4 className="font-medium text-navy-900 mb-2">Executive Summary</h4>
                    <p className="text-gray-700 text-sm">{analysis.executive_summary}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2"><span className="text-lg">✓</span> Major Achievements</h4>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                        {analysis.major_achievements.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-700 mb-2 flex items-center gap-2"><span className="text-lg">⚠️</span> Risks Identified</h4>
                      <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                        {analysis.risks.map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h4 className="font-medium text-amber-900 mb-1">Recommended Next Step</h4>
                    <p className="text-amber-800 text-sm">{analysis.recommended_next_step}</p>
                  </div>
                  <div className="text-xs text-gray-400 italic text-center pt-2">
                    Note: AI recommendations only. Government officer makes the final decision.
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Run AI analysis to generate insights.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="text-center border-t-4 border-t-green-500">
            <CardContent className="pt-8 pb-6">
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Overall Score</div>
              <div className="text-6xl font-bold text-navy-900 mb-4">{score.overall_score}<span className="text-2xl text-gray-400">/100</span></div>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-800 font-bold rounded-full text-sm mb-6">
                {score.outcome}
              </div>

              <div className="space-y-3 text-left text-sm border-t border-gray-100 pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">KPI Achievement</span>
                  <span className="font-medium">{score.kpi_achievement}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tech Performance</span>
                  <span className="font-medium">{score.technical_performance}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget Mgmt</span>
                  <span className="font-medium">{score.budget_performance}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline</span>
                  <span className="font-medium">{score.timeline}/10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full py-4 text-lg bg-navy-900 hover:bg-navy-800"
            onClick={() => navigate(`/government/procurement/${id}`)}
          >
            Proceed to Procurement Readiness
          </Button>
        </div>
      </div>
    </div>
  );
};
