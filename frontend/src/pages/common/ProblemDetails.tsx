import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Problem, Application } from '../../types';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Target,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Users,
  FileCheck,
} from 'lucide-react';

export const ProblemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuthStore();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [existingApp, setExistingApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchProblemAndApplication();
  }, [id]);

  const fetchProblemAndApplication = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/problems/${id}`);
      const probData = res.data?.data || res.data;
      setProblem(probData);

      // If user is a startup, check if they have already applied
      if (role === 'startup') {
        try {
          const appRes = await api.get('/api/applications?startup_id=mine');
          const apps = Array.isArray(appRes.data) ? appRes.data : (appRes.data?.data || []);
          const match = apps.find((a: any) => a.problem_id === id);
          if (match) {
            setExistingApp(match);
          }
        } catch {
          // non-fatal
        }
      }
    } catch (error) {
      toast.error('Failed to load problem details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Problem Not Found</h2>
        <p className="text-gray-500 mb-6">The requested problem could not be found or has been removed.</p>
        <Button onClick={() => navigate(role === 'government_officer' ? '/government/problems' : '/startup/problems')}>
          Back to Problem Registry
        </Button>
      </div>
    );
  }

  const isPublished = problem.status === 'published';
  const isGov = role === 'government_officer';
  const isStartup = role === 'startup';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(isGov ? '/government/problems' : '/startup/problems')}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to {isGov ? 'Problem Registry' : 'Discover Problems'}
        </Button>

        <div className="flex items-center gap-2">
          {isGov && (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/government/problems/${problem.id}/match`)}
                className="flex items-center gap-1.5 text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                AI Startup Matching
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(`/government/applications`)}
                className="flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                View Applications
              </Button>
            </>
          )}

          {isStartup && (
            existingApp ? (
              <Button
                onClick={() => navigate('/startup/applications')}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Applied ({existingApp.status})
              </Button>
            ) : (
              <Button
                onClick={() => navigate(`/startup/problems/${problem.id}/apply`)}
                disabled={!isPublished}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                Apply for Pilot
              </Button>
            )
          )}
        </div>
      </div>

      {/* Main Hero Card */}
      <Card className="p-6 md:p-8 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-6 border-b border-gray-100">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                {problem.sector}
              </span>
              <Badge variant={isPublished ? 'success' : 'secondary'}>
                {isPublished ? 'Open for Applications' : problem.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {problem.created_at && (
                <span className="text-xs text-gray-400">
                  Posted {formatDate(problem.created_at)}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-navy-900 leading-tight">
              {problem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-1">
              <span className="flex items-center gap-1.5 font-medium text-navy-800">
                <Briefcase className="w-4 h-4 text-blue-600" />
                {problem.department?.name || 'Government Department'}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <MapPin className="w-4 h-4 text-red-500" />
                {problem.location}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-gray-100 bg-gray-50/70 -mx-6 md:-mx-8 px-6 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1 tracking-wider">Pilot Budget</p>
            <p className="text-lg font-bold text-navy-900">
              {problem.budget_min && problem.budget_max
                ? `${formatCurrency(problem.budget_min)} – ${formatCurrency(problem.budget_max)}`
                : 'On Assessment'}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1 tracking-wider">Pilot Duration</p>
            <p className="text-lg font-bold text-navy-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              {problem.pilot_duration_days || 90} Days
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1 tracking-wider">Total Timeline</p>
            <p className="text-lg font-bold text-navy-900">
              {problem.timeline_days || 180} Days
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-gray-400 mb-1 tracking-wider">Status</p>
            <p className="text-lg font-bold text-emerald-600 capitalize">
              {problem.status.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Application Banner for Startups */}
        {isStartup && existingApp && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  You have submitted an application for this challenge.
                </p>
                <p className="text-xs text-emerald-700">
                  Current Status: <strong className="uppercase">{existingApp.status}</strong> — Evaluated by Department
                </p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate('/startup/applications')} className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white">
              View Application Details
            </Button>
          </div>
        )}

        {/* Problem Statement & Description */}
        <div className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-600" /> Problem Background & Statement
            </h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
              {problem.description}
            </p>
          </div>

          {/* Expected Outcome */}
          {problem.expected_outcome && (
            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
              <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" /> Expected Outcome & Success Metric
              </h4>
              <p className="text-sm text-blue-950 font-medium">
                {problem.expected_outcome}
              </p>
            </div>
          )}

          {/* KPIs */}
          {problem.kpis && problem.kpis.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" /> Key Performance Indicators (KPIs)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {problem.kpis.map((kpi, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-800 font-medium">{kpi}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Requirements & Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" /> Required Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {problem.required_technologies && problem.required_technologies.length > 0 ? (
                  problem.required_technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md border border-gray-200">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">Open to suitable technologies</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" /> Required Capabilities
              </h4>
              <div className="flex flex-wrap gap-2">
                {problem.required_capabilities && problem.required_capabilities.length > 0 ? (
                  problem.required_capabilities.map((cap, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-md border border-purple-200">
                      {cap}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">Standard domain capabilities</span>
                )}
              </div>
            </div>
          </div>

          {/* Eligibility Requirements */}
          {problem.eligibility_requirements && (
            <div className="pt-2">
              <h4 className="text-sm font-bold text-navy-900 uppercase tracking-wide mb-2">
                Startup Eligibility & Compliance Requirements
              </h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-200">
                {problem.eligibility_requirements}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            For questions regarding this problem statement, contact the departmental nodal officer.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isStartup && !existingApp && (
              <Button
                onClick={() => navigate(`/startup/problems/${problem.id}/apply`)}
                disabled={!isPublished}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Apply Now
              </Button>
            )}
            {isGov && (
              <Button
                onClick={() => navigate(`/government/problems/${problem.id}/match`)}
                className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white px-6 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" /> Run AI Matching
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProblemDetails;
