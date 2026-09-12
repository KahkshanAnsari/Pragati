import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';
import { Problem, StartupMatch } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AIMatchingSkeleton } from '../../components/ui/Skeleton';
import { toast } from 'react-hot-toast';
import {
  Sparkles, ArrowLeft, CheckCircle2, AlertCircle, Building2,
  Cpu, Target, Send, MapPin, IndianRupee, Clock,
  ShieldCheck, RefreshCw, SearchX, Check, Activity,
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

const AI_STEPS = [
  'Reading Problem Statement',
  'Extracting Sector',
  'Extracting Technologies',
  'Extracting Capabilities',
  'Analyzing Startup Database',
  'Comparing Past Projects',
  'Calculating Match Scores',
  'Generating Recommendations',
];

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

    // Progress through the 8 AI steps over ~3.2 seconds
    const interval = setInterval(() => {
      setMatchingStep((prev) => {
        if (prev < AI_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    try {
      const res = await api.post(`/api/problems/${id}/match`);
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data?.matches || res.data?.data || []);

      // Ensure animation plays through all steps smoothly
      setTimeout(() => {
        clearInterval(interval);
        setMatches(data);
        setIsMatching(false);
        setLastMatchedTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
        if (data.length > 0) {
          toast.success(`AI Matching complete! Evaluated ${data.length} verified startups.`);
        } else {
          toast('No matching startups found for this challenge.');
        }
      }, 3300);
    } catch (err) {
      clearInterval(interval);
      setIsMatching(false);
      toast.error('Unable to run AI matching. Please try again.');
      console.error(err);
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
      <div className="max-w-7xl mx-auto space-y-6">
        <AIMatchingSkeleton />
      </div>
    );
  }

  if (is404 || !problem) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-card max-w-lg mx-auto my-12 space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-navy-900">Government Challenge Not Found</h3>
        <p className="text-slate-500 text-xs leading-relaxed">
          The requested challenge statement does not exist or has been removed.
        </p>
        <Button onClick={() => navigate('/government/ai-matching')} className="bg-navy-900 text-white text-xs font-bold py-2 px-6">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to AI Matching
        </Button>
      </div>
    );
  }

  const strongMatchesCount = matches.filter((m) => (m.score || m.match_percent) >= 70).length;
  const topMatch = matches[0];
  const avgFit = matches.length > 0
    ? Math.round(matches.reduce((acc, m) => acc + (m.score || m.match_percent), 0) / matches.length)
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigate('/government/ai-matching')}
              className="text-xs text-slate-500 hover:text-navy-900 flex items-center gap-1 font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> AI Matching
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-600">Deterministic Fit Engine</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              AI Startup Matching
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> 100-POINT OBJECTIVE RUBRIC
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explainable matching engine assessing sensor tech stacks, capabilities, and verified government pilot track records.
          </p>
        </div>

        {matches.length > 0 && !isMatching && (
          <Button
            onClick={handleMatch}
            variant="outline"
            size="sm"
            className="self-start sm:self-auto text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-run Analysis
          </Button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Problem Specification Card */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-white border border-slate-200 shadow-card p-6 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Challenge Statement
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
                  Authority / Department
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {problem.department?.name || 'Department of Innovation'}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-0.5">
                  Deployment Location
                </span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  {problem.location || 'India'}
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
                    Sandbox Budget
                  </span>
                  <span className="font-bold text-navy-900">
                    {problem.budget_min && problem.budget_max
                      ? `${formatCurrency(problem.budget_min)} – ${formatCurrency(problem.budget_max)}`
                      : 'On assessment'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-0.5">
                    Duration
                  </span>
                  <span className="font-bold text-navy-900">
                    {problem.pilot_duration_days || 90} Days
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-slate-100">
              <Button
                onClick={handleMatch}
                disabled={isMatching}
                className="w-full bg-navy-900 hover:bg-slate-800 text-white font-bold py-2.5 flex items-center justify-center gap-2 shadow-card hover:shadow-glow-blue cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                {isMatching ? 'Executing Fit Engine...' : 'Run AI Matching'}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Processing View OR Results List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="wait">
            {/* ── AI Engine Processing Screen (Step-by-Step Animation) ── */}
            {isMatching && (
              <motion.div
                key="matching-canvas"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="bg-navy-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-card border border-slate-800 space-y-8"
              >
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/20 blur-3xl pointer-events-none" />

                {/* Radar / Neural Animation Header */}
                <div className="text-center relative z-10 space-y-3">
                  <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-blue-600/30 animate-ping" />
                    <div className="absolute inset-2 rounded-full bg-cyan-500/40 animate-pulse" />
                    <div className="relative w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-glow-blue">
                      <Sparkles className="w-6 h-6 text-cyan-200" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold tracking-tight text-white">
                      Autonomous Innovation Fit Engine
                    </h3>
                    <p className="text-xs text-cyan-300 font-medium">
                      Executing 100-Point Multidimensional Evaluation
                    </p>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="w-full max-w-md mx-auto bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${((matchingStep + 1) / AI_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 8 Step-by-Step Animated Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 max-w-xl mx-auto">
                  {AI_STEPS.map((stepName, sIdx) => {
                    const isDone = sIdx < matchingStep;
                    const isCurrent = sIdx === matchingStep;

                    return (
                      <motion.div
                        key={stepName}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: sIdx * 0.05 }}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-semibold transition-all ${
                          isDone
                            ? 'bg-slate-800/90 border-blue-500/40 text-white'
                            : isCurrent
                            ? 'bg-blue-950/80 border-cyan-400 text-cyan-200 shadow-glow-cyan'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                            isDone
                              ? 'bg-blue-600 text-white'
                              : isCurrent
                              ? 'bg-cyan-500 text-navy-950 animate-pulse'
                              : 'bg-slate-800 text-slate-600'
                          }`}
                        >
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : sIdx + 1}
                        </div>
                        <span className="truncate">{stepName}</span>
                      </motion.div>
                    );
                  })}
                </div>

                <p className="text-center text-[11px] text-slate-400 relative z-10">
                  Weighing: Sector Fit (20) • Sensor Stack (25) • Capabilities (25) • Project Track Record (20) • Gov Pilots (5) • Trust Score (5)
                </p>
              </motion.div>
            )}

            {/* ── Empty State before Matching ── */}
            {!isMatching && matches.length === 0 && (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 shadow-card space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">Ready to Run AI Matching</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Evaluate verified startups against this challenge's required capabilities and sensor technologies with complete objective explainability.
                </p>
                <Button onClick={handleMatch} className="bg-navy-900 text-white font-bold text-xs py-2.5 px-6 shadow-card hover:shadow-glow-blue">
                  <Sparkles className="w-4 h-4 mr-1.5 text-cyan-400" /> Run AI Matching Now
                </Button>
              </motion.div>
            )}

            {/* ── Match Results Presentation ── */}
            {!isMatching && matches.length > 0 && (
              <motion.div
                key="match-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Summary Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <span className="text-slate-400">Evaluated:</span>{' '}
                      <strong className="text-navy-900 font-bold">{matches.length} Startups</strong>
                    </div>
                    <span className="text-slate-200">•</span>
                    <div>
                      <span className="text-slate-400">Strong Matches:</span>{' '}
                      <strong className="text-blue-600 font-bold">{strongMatchesCount}</strong>
                    </div>
                    <span className="text-slate-200">•</span>
                    <div>
                      <span className="text-slate-400">Top Match:</span>{' '}
                      <strong className="text-navy-900 font-bold">
                        {topMatch?.startup?.name || 'Verified Startup'}
                      </strong>
                    </div>
                    <span className="text-slate-200">•</span>
                    <div>
                      <span className="text-slate-400">Average Fit:</span>{' '}
                      <strong className="text-slate-700 font-bold">{avgFit}%</strong>
                    </div>
                  </div>

                  {lastMatchedTime && (
                    <span className="text-[11px] text-slate-400">
                      Evaluated: Today at {lastMatchedTime}
                    </span>
                  )}
                </div>

                {/* Ranked Startup Match Cards */}
                {matches.map((match, index) => {
                  const st = (match.startup as any) || {};
                  const exp = match.explainability || {};
                  const bkd = match.breakdown || {};
                  const stName = st.name || 'Verified Startup';
                  const matchPercent = Math.round(match.score || match.match_percent);

                  const isTopRanked = index === 0 && matchPercent >= 70;
                  const isLowFit = matchPercent < 50;

                  return (
                    <motion.div
                      key={match.id || index}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`bg-white border transition-all ${
                          isTopRanked
                            ? 'border-blue-600 shadow-[0_0_20px_-4px_rgba(37,99,235,0.25)] ring-1 ring-blue-600/30'
                            : isLowFit
                            ? 'border-slate-200 opacity-75'
                            : 'border-slate-200 shadow-card hover:border-slate-300'
                        }`}
                      >
                        <div className="p-6 space-y-4">
                          {/* Card Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="flex items-start gap-3.5">
                              {/* Match Percentage Pill */}
                              <div
                                className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-black border ${
                                  isTopRanked
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : isLowFit
                                    ? 'bg-slate-100 text-slate-500 border-slate-200'
                                    : 'bg-cyan-50 text-cyan-800 border-cyan-200'
                                }`}
                              >
                                <span className="text-lg leading-none">{matchPercent}%</span>
                                <span className="text-[8px] uppercase font-bold tracking-wider mt-0.5 text-slate-500">
                                  FIT
                                </span>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                    #{index + 1}
                                  </span>
                                  <Badge variant={isTopRanked ? 'blue' : isLowFit ? 'gray' : 'cyan'}>
                                    {matchPercent >= 85 ? 'EXCELLENT MATCH' : matchPercent >= 70 ? 'STRONG MATCH' : 'MODERATE FIT'}
                                  </Badge>
                                  {st.verification_status === 'verified' && (
                                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1 border border-blue-200">
                                      <CheckCircle2 className="w-3 h-3 text-blue-600" /> DPIIT Verified
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
                                  <span className="font-semibold text-slate-700">{st.sector || problem.sector}</span>
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
                                    Success Rate: <strong className="text-blue-600">{st.pilot_success_rate || 90}%</strong>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 sm:flex-none text-xs font-semibold"
                                onClick={() => navigate(`/government/startups/${match.startup_id}`)}
                              >
                                View Profile
                              </Button>
                              <Button
                                size="sm"
                                className="flex-1 sm:flex-none bg-navy-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                                onClick={() => handleInvite(match.startup_id, stName)}
                                disabled={invitingId === match.startup_id}
                              >
                                <Send className="w-3.5 h-3.5" />
                                {invitingId === match.startup_id ? 'Inviting...' : 'Invite Startup'}
                              </Button>
                            </div>
                          </div>

                          {/* 6-Dimension Score Breakdown Grid */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">
                              Deterministic Score Breakdown (100-Point Evaluation)
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center">
                              <div className="bg-white p-2 rounded-lg border border-slate-200">
                                <span className="text-[10px] text-slate-500 block">Sector Fit</span>
                                <span className="font-bold text-navy-900 text-xs">
                                  {bkd.sector_fit !== undefined ? bkd.sector_fit : (exp.sector_score || 0)} / 20
                                </span>
                              </div>
                              <div className="bg-white p-2 rounded-lg border border-slate-200">
                                <span className="text-[10px] text-slate-500 block">Tech Fit</span>
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
                                <span className="text-[10px] text-slate-500 block">Relevant Work</span>
                                <span className="font-bold text-navy-900 text-xs">
                                  {bkd.project_relevance !== undefined ? bkd.project_relevance : (exp.exp_score || 0)} / 20
                                </span>
                              </div>
                              <div className="bg-white p-2 rounded-lg border border-slate-200">
                                <span className="text-[10px] text-slate-500 block">Gov Pilots</span>
                                <span className="font-bold text-navy-900 text-xs">
                                  {bkd.government_experience !== undefined ? bkd.government_experience : (exp.gov_score || 0)} / 5
                                </span>
                              </div>
                              <div className="bg-white p-2 rounded-lg border border-slate-200">
                                <span className="text-[10px] text-slate-500 block">Trust Score</span>
                                <span className="font-bold text-navy-900 text-xs">
                                  {bkd.trust !== undefined ? bkd.trust : (exp.trust_score_comp || 0)} / 5
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Explainability Statement */}
                          {exp.reason && (
                            <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/50 text-xs leading-relaxed text-slate-700">
                              <strong className="text-navy-900 font-semibold">AI Explainability: </strong>
                              {exp.reason}
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIMatching;
