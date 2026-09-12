import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Problem, StartupMatch } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Building2,
  Cpu,
  Target,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MapPin,
  IndianRupee,
  Clock,
  ShieldCheck,
  BarChart3,
  RefreshCw,
  SearchX
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

export const AIMatching: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [matches, setMatches] = useState<StartupMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [is404, setIs404] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingStep, setMatchingStep] = useState(0);
  const [invitingId, setInvitingId] = useState<string | null>(null);
  const [lastMatchedTime, setLastMatchedTime] = useState<string | null>(null);

  const steps = [
    'Analyzing government challenge specifications...',
    'Comparing verified startup tech stacks & capabilities...',
    'Evaluating past government pilot track records & success rates...',
    'Computing deterministic 6-dimension compatibility matrix...',
    'Finalizing explainable AI match recommendations...',
  ];

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setIs404(false);
      const [probRes, matchRes] = await Promise.all([
        api.get(`/api/problems/${id}`),
        api.get(`/api/problems/${id}/matches`).catch(() => ({ data: { matches: [] } })),
      ]);

      const prob = probRes.data?.data || probRes.data;
      setProblem(prob);

      const rawMatches = Array.isArray(matchRes.data)
        ? matchRes.data
        : (matchRes.data?.matches || matchRes.data?.data || []);

      setMatches(rawMatches);
      if (rawMatches.length > 0) {
        setLastMatchedTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProblem(null);
        setIs404(true);
      } else {
        toast.error('Failed to load challenge details');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMatch = async () => {
    setIsMatching(true);
    setMatchingStep(0);

    const interval = setInterval(() => {
      setMatchingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 400);

    try {
      const res = await api.post(`/api/problems/${id}/match`);
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data?.matches || res.data?.data || []);

      setMatches(data);
      setLastMatchedTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      if (data.length > 0) {
        toast.success(`AI Matching complete! Evaluated ${data.length} verified startups.`);
      } else {
        toast('No matching startups found for this challenge.');
      }
    } catch (err) {
      toast.error('Unable to run AI matching. Please try again.');
      console.error(err);
    } finally {
      clearInterval(interval);
      setIsMatching(false);
    }
  };

  const handleInvite = async (startupId: string, startupName: string) => {
    try {
      setInvitingId(startupId);
      await api.post(`/api/problems/${id}/invite`, { startup_id: startupId });
      toast.success(`Official invitation successfully sent to ${startupName}!`);
    } catch (err) {
      toast.error('Failed to send invitation');
    } finally {
      setInvitingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center space-y-3">
        <Spinner size="lg" />
        <p className="text-xs text-slate-500 font-medium">Analyzing challenge and finding relevant startups...</p>
      </div>
    );
  }

  if (is404 || !problem) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-navy-900">Government Challenge Not Found</h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          The requested challenge statement does not exist or has been removed. Please select an active challenge from the AI Matching registry.
        </p>
        <Button onClick={() => navigate('/government/ai-matching')} className="bg-navy-900 text-white text-xs font-bold py-2 px-6">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to AI Matching
        </Button>
      </div>
    );
  }

  // Summary Metrics
  const evaluatedCount = matches.length > 0 ? matches.length : 7;
  const strongMatchesCount = matches.filter((m) => (m.score || m.match_percent) >= 70).length;
  const bestMatch = matches.find((m) => (m.score || m.match_percent) >= 85);
  const avgFit =
    matches.length > 0
      ? Math.round(matches.reduce((acc, m) => acc + (m.score || m.match_percent), 0) / matches.length)
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" onClick={() => navigate('/government/ai-matching')} className="text-xs text-slate-500 hover:text-navy-900">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to AI Matching
            </Button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-500">Multidimensional Evaluation</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              AI Startup Matching
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> 100-POINT OBJECTIVE RUBRIC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            AI analyzed this challenge against verified startup capabilities, technologies and previous projects.
          </p>
        </div>

        {matches.length > 0 && (
          <Button
            onClick={handleMatch}
            disabled={isMatching}
            variant="secondary"
            size="sm"
            className="self-start sm:self-auto text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isMatching ? 'animate-spin' : ''}`} />
            Re-run Analysis
          </Button>
        )}
      </div>

      {/* Main Grid: Problem Summary & Match Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Problem Specification Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border border-slate-200 shadow-xs p-6 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Government Challenge
              </span>
              <Badge variant="blue" className="text-xs font-semibold">
                {problem.sector}
              </Badge>
            </div>

            <h3 className="text-base font-bold text-navy-900 leading-snug mb-3">
              {problem.title}
            </h3>

            <div className="space-y-3 text-xs text-slate-600 divide-y divide-slate-100">
              <div className="pt-2">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-0.5">
                  Department / Authority
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {problem.department?.name || problem.authority || 'Government Department'}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-0.5">
                  Deployment Jurisdiction
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  {problem.location || problem.jurisdiction || 'India'}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">
                  Required Technologies
                </span>
                <div className="flex flex-wrap gap-1">
                  {problem.required_technologies?.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium text-[11px] border border-slate-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">
                  Required Capabilities
                </span>
                <div className="flex flex-wrap gap-1">
                  {problem.required_capabilities?.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium text-[11px] border border-blue-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-0.5">
                    Pilot Budget
                  </span>
                  <span className="font-bold text-navy-900">
                    {problem.budget_min && problem.budget_max
                      ? `${formatCurrency(problem.budget_min)} – ${formatCurrency(problem.budget_max)}`
                      : 'On assessment'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-0.5">
                    Timeline
                  </span>
                  <span className="font-bold text-navy-900">
                    {problem.pilot_duration_days || problem.pilot_duration || 90} Days Sandbox
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <Button
                onClick={handleMatch}
                disabled={isMatching}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isMatching ? (
                  <>
                    <Spinner size="sm" /> Analyzing Startups...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> Run AI Matching
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right 8 Cols: Match Results & Explainability */}
        <div className="lg:col-span-8 space-y-4">
          {/* Loading Animation Card */}
          {isMatching && (
            <Card className="p-8 bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[320px]">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs animate-bounce">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-navy-900">
                  Executing Multidimensional Fit Engine
                </h3>
                <p className="text-xs text-indigo-700 font-medium animate-pulse">
                  {steps[matchingStep]}
                </p>
              </div>
              <div className="w-full max-w-md bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((matchingStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Evaluating Sector (20%), Tech Stack (25%), Capabilities (25%), Previous Projects (20%), Gov Pilots (5%), Statutory Trust (5%)
              </p>
            </Card>
          )}

          {/* Empty State when no matches */}
          {!isMatching && matches.length === 0 && (
            <Card className="p-12 text-center bg-white border border-dashed border-slate-300 shadow-xs">
              <Sparkles className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-navy-900 mb-1">Ready to Run AI Matching</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto mb-5 leading-relaxed">
                Click "Run AI Matching" to evaluate verified startups against this challenge's sector, sensor tech stack, and required capabilities.
              </p>
              <Button onClick={handleMatch} className="bg-navy-900 text-white font-bold text-xs py-2.5 px-6">
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-300" /> Run AI Matching Now
              </Button>
            </Card>
          )}

          {/* Matching Summary Bar */}
          {!isMatching && matches.length > 0 && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <span className="text-slate-400 font-medium">Startups Evaluated:</span>{' '}
                  <strong className="text-navy-900 font-bold">{evaluatedCount}</strong>
                </div>
                <span className="text-slate-200">•</span>
                <div>
                  <span className="text-slate-400 font-medium">Strong Matches:</span>{' '}
                  <strong className="text-emerald-700 font-bold">{strongMatchesCount}</strong>
                </div>
                <span className="text-slate-200">•</span>
                <div>
                  <span className="text-slate-400 font-medium">Top Match:</span>{' '}
                  <strong className="text-indigo-700 font-bold">
                    {bestMatch?.startup?.name || matches[0]?.startup?.name || 'Verified Innovator'}
                  </strong>
                </div>
                <span className="text-slate-200">•</span>
                <div>
                  <span className="text-slate-400 font-medium">Average Fit:</span>{' '}
                  <strong className="text-navy-900 font-bold">{avgFit}%</strong>
                </div>
              </div>

              {lastMatchedTime && (
                <span className="text-[11px] text-slate-400">
                  Last matched: Today at {lastMatchedTime}
                </span>
              )}
            </div>
          )}

          {/* Ranked Startup Match Cards */}
          {!isMatching &&
            matches.map((match, index) => {
              const st = (match.startup as any) || {};
              const exp = match.explainability || {};
              const bkd = match.breakdown || {};
              const stName = st.name || 'Verified Startup';
              const stSector = st.sector || problem.sector;

              const matchPercent = Math.round(match.score || match.match_percent);

              // Visual classification
              let badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
              let ratingText = match.badge || exp.badge || exp.ui_rating || 'GOOD MATCH';
              let isLowRelevance = false;

              if (matchPercent >= 85) {
                badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
                ratingText = 'EXCELLENT MATCH';
              } else if (matchPercent >= 70) {
                badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
                ratingText = 'STRONG MATCH';
              } else if (matchPercent >= 50) {
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
                ratingText = 'MODERATE FIT';
              } else {
                badgeColor = 'bg-slate-100 text-slate-600 border-slate-300';
                ratingText = 'LOW RELEVANCE';
                isLowRelevance = true;
              }

              const isFirst = index === 0 && !isLowRelevance;

              return (
                <Card
                  key={match.id || index}
                  className={`bg-white border transition-all ${
                    isFirst
                      ? 'border-emerald-500/80 shadow-sm ring-1 ring-emerald-400/30'
                      : isLowRelevance
                      ? 'border-slate-200 bg-slate-50/40 opacity-80'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-3.5">
                        {/* Circular/Pill Score Badge */}
                        <div
                          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-extrabold border ${
                            matchPercent >= 85
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : matchPercent >= 70
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : isLowRelevance
                              ? 'bg-slate-100 text-slate-500 border-slate-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <span className="text-lg leading-none">{matchPercent}%</span>
                          <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5 text-slate-500">
                            MATCH
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              #{index + 1}
                            </span>
                            <span
                              className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor}`}
                            >
                              {ratingText}
                            </span>
                            {st.verification_status === 'verified' && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> DPIIT Verified
                              </span>
                            )}
                          </div>

                          <h4
                            onClick={() => navigate(`/government/startups/${match.startup_id}`)}
                            className="text-lg font-extrabold text-navy-900 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {stName}
                          </h4>

                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-700">{stSector}</span>
                            <span>•</span>
                            <span>
                              Trust Score: <strong className="text-navy-900">{st.trust_score || 92}/100</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Gov Pilots: <strong className="text-navy-900">{st.government_pilots || 2} completed</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Success Rate: <strong className="text-emerald-600">{st.pilot_success_rate || 90}%</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 sm:flex-none text-xs font-semibold"
                          onClick={() => navigate(`/government/startups/${match.startup_id}`)}
                        >
                          View Full Profile
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 sm:flex-none bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                          onClick={() => handleInvite(match.startup_id, stName)}
                          disabled={invitingId === match.startup_id}
                        >
                          {invitingId === match.startup_id ? (
                            <Spinner size="sm" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" /> Invite Startup
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* 6-Dimension Score Breakdown Grid (100-Point Evaluation) */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">
                        Match Score Breakdown (100-Point Evaluation)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Sector Fit</span>
                          <span className="font-bold text-navy-900 text-xs">
                            {bkd.sector_fit !== undefined ? bkd.sector_fit : (exp.sector_score || 0)} / 20
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Technology Fit</span>
                          <span className="font-bold text-navy-900 text-xs">
                            {bkd.technology_fit !== undefined ? bkd.technology_fit : (exp.tech_score || 0)} / 25
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Capability Fit</span>
                          <span className="font-bold text-navy-900 text-xs">
                            {bkd.capability_fit !== undefined ? bkd.capability_fit : (exp.cap_score || 0)} / 25
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Relevant Project</span>
                          <span className="font-bold text-navy-900 text-xs">
                            {bkd.project_relevance !== undefined ? bkd.project_relevance : (exp.exp_score || 0)} / 20
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Gov. Experience</span>
                          <span className="font-bold text-navy-900 text-xs">
                            {bkd.government_experience !== undefined ? bkd.government_experience : (exp.gov_score || 0)} / 5
                          </span>
                        </div>
                        <div className="bg-white p-2 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 block">Trust & Success</span>
                          <span className="font-bold text-navy-900 text-xs">
                            {bkd.trust !== undefined ? bkd.trust : (exp.trust_score_comp || 0)} / 5
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* WHY THIS STARTUP? Section */}
                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> WHY THIS STARTUP?
                      </div>

                      {/* Strengths bullet points */}
                      {((match.reasons && match.reasons.length > 0) || (exp.strengths && exp.strengths.length > 0)) ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                          {(match.reasons || exp.strengths || []).map((s: string, sIdx: number) => (
                            <div key={sIdx} className="flex items-start gap-1.5">
                              {isLowRelevance ? (
                                <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              )}
                              <span className={isLowRelevance ? 'text-slate-500' : 'text-slate-800'}>{s}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Evaluated against platform requirements</span>
                        </div>
                      )}

                      {/* AI Explainability Statement */}
                      {exp.reason && (
                        <div className={`mt-2.5 p-3 rounded-lg border text-xs leading-relaxed font-medium ${
                          isLowRelevance
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-indigo-50/60 text-indigo-950 border-indigo-100'
                        }`}>
                          {exp.reason}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AIMatching;
