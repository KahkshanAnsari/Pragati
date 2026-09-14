import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Pilot } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { toast } from 'react-hot-toast';
import {
  getRatingForPilot,
  savePilotRating,
  PilotRating,
} from '../../lib/ratingService';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  Calendar,
  Star,
  Award,
  FileText,
  AlertCircle,
  Briefcase,
  Layers,
  Sparkles,
  UserCheck,
  Clock,
  Target,
  Edit3,
} from 'lucide-react';

const TIER_LABELS: Record<number, { label: string; desc: string; color: string }> = {
  1: { label: 'Unsatisfactory', desc: 'Failed to meet essential operational benchmarks', color: 'text-red-700 bg-red-50 border-red-200' },
  2: { label: 'Marginal', desc: 'Partial achievement; required significant departmental intervention', color: 'text-amber-800 bg-amber-50 border-amber-200' },
  3: { label: 'Satisfactory', desc: 'Met standard contractual milestone benchmarks reliably', color: 'text-blue-800 bg-blue-50 border-blue-200' },
  4: { label: 'Very Good', desc: 'Exceeded multiple performance targets with robust field delivery', color: 'text-indigo-800 bg-indigo-50 border-indigo-200' },
  5: { label: 'Exceptional', desc: 'Exceeded all targets; recommended for single-stage public procurement', color: 'text-emerald-800 bg-emerald-50 border-emerald-200' },
};

export const PilotEvaluation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pilot, setPilot] = useState<Pilot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Existing evaluation (if any)
  const [existingRating, setExistingRating] = useState<PilotRating | null>(null);

  // Form states
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [technicalPerf, setTechnicalPerf] = useState<number>(5);
  const [effectiveness, setEffectiveness] = useState<number>(5);
  const [implementation, setImplementation] = useState<number>(5);
  const [timeliness, setTimeliness] = useState<number>(5);
  const [kpiScore, setKpiScore] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [attestationChecked, setAttestationChecked] = useState<boolean>(true);

  useEffect(() => {
    fetchPilotData();
  }, [id]);

  const fetchPilotData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/pilots/${id}`);
      const data: Pilot = res.data?.data || res.data;
      setPilot(data);

      // Check if rating already exists
      const saved = getRatingForPilot(id);
      if (saved) {
        setExistingRating(saved);
        setOverallRating(saved.overall_rating);
        setTechnicalPerf(saved.technical_performance || 5);
        setEffectiveness(saved.solution_effectiveness || 5);
        setImplementation(saved.implementation_support || 5);
        setTimeliness(saved.timeliness || 5);
        setKpiScore(saved.kpi_achievement || 5);
        setFeedback(saved.feedback || '');
      }
    } catch (err) {
      console.error('Failed to load pilot for evaluation', err);
      toast.error('Failed to load pilot details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pilot) return;

    if (!feedback.trim()) {
      toast.error('Please enter Government Officer Feedback before submitting');
      return;
    }

    if (!attestationChecked) {
      toast.error('Please confirm the official officer declaration');
      return;
    }

    try {
      setIsSubmitting(true);
      const saved = await savePilotRating({
        id: existingRating?.id,
        pilot_id: pilot.id,
        startup_id: pilot.startup_id || (pilot.startup?.id as string) || '',
        pilot_number: pilot.pilot_number,
        startup_name: pilot.startup?.name || 'Partner Startup',
        department_name: pilot.department?.name || 'Government Department',
        officer_name: 'Authorized Evaluator',
        officer_designation: 'Joint Commissioner / Departmental Authority',
        problem_title: pilot.problem?.title || 'Government Pilot Solution',
        overall_rating: overallRating,
        technical_performance: technicalPerf,
        solution_effectiveness: effectiveness,
        implementation_support: implementation,
        timeliness: timeliness,
        kpi_achievement: kpiScore,
        feedback: feedback.trim(),
      });

      setExistingRating(saved);
      setIsEditMode(false);
      toast.success('Government Pilot Performance Evaluation recorded successfully!');
    } catch (err) {
      console.error('Failed to submit evaluation', err);
      toast.error('Could not save evaluation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <SkeletonPage />;
  }

  if (!pilot) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200 max-w-xl mx-auto my-8">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-navy-900 mb-2">Pilot Record Not Found</h2>
        <p className="text-sm text-slate-500 mb-4">
          The specified pilot could not be loaded for evaluation.
        </p>
        <Button onClick={() => navigate('/government/pilots')}>Back to Pilot Management</Button>
      </div>
    );
  }

  // Guard: Pilot must be completed
  const isCompleted = pilot.status === 'completed';
  if (!isCompleted) {
    return (
      <div className="space-y-6 max-w-3xl mx-auto font-sans pt-4">
        <div className="bg-white rounded-xl border border-amber-200 p-8 shadow-xs text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Clock className="w-7 h-7 text-amber-600" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-navy-900">
              Pilot Still in Progress
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Official Government Performance Evaluation can only be conducted once a pilot has been
              marked as <strong>Successfully Completed</strong>.
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 max-w-md mx-auto text-left text-xs space-y-1.5 border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Pilot Number:</span>
              <span className="font-mono font-bold text-navy-900">{pilot.pilot_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <Badge variant="active" className="capitalize">{pilot.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Milestone Progress:</span>
              <span className="font-bold text-navy-900">{pilot.progress_percent}%</span>
            </div>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/government/pilots')}
            >
              Back to Pilot Management
            </Button>
            <Button
              className="bg-navy-900 hover:bg-navy-800 text-white"
              onClick={() => navigate(`/government/pilots/${pilot.id}/workspace`)}
            >
              Open Pilot Workspace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: RECORD OF EXISTING EVALUATION (Read-Only Certificate)
  // ──────────────────────────────────────────────────────────────────────────
  if (existingRating && !isEditMode) {
    const tier = TIER_LABELS[existingRating.overall_rating] || TIER_LABELS[5];
    return (
      <div className="space-y-6 max-w-4xl mx-auto font-sans">
        {/* Top bar navigation */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/government/pilots')}
            className="text-xs font-semibold text-slate-600 hover:text-navy-900 cursor-pointer"
          >
            Back to Pilot Management
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs font-semibold flex items-center gap-1.5"
              onClick={() => setIsEditMode(true)}
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              Edit Evaluation
            </Button>
            <Button
              size="sm"
              className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold"
              onClick={() => navigate(`/government/startups/${existingRating.startup_id}`)}
            >
              View Startup Profile
            </Button>
          </div>
        </div>

        {/* Certificate Header Banner */}
        <div className="bg-[#123158] text-white rounded-xl px-6 py-5">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800">
              GOVERNMENT OF INDIA • PRAGATI
            </span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OFFICIAL EVALUATION COMPLETED
            </span>
          </div>
          <h1 className="text-xl font-black tracking-tight text-white leading-tight">
            Government Pilot Performance Evaluation Certificate
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Pilot: {pilot.pilot_number} &nbsp;•&nbsp; Startup: {pilot.startup?.name} &nbsp;•&nbsp; Evaluated on {formatDate(existingRating.evaluated_at)}
          </p>
        </div>

        {/* Overall Score Showcase */}
        <Card className="p-6 border border-slate-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Overall Performance Rating
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-7 h-7 ${
                        star <= existingRating.overall_rating
                          ? 'fill-amber-400 text-amber-500'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-3xl font-black text-navy-900">
                  {existingRating.overall_rating}.0
                  <span className="text-sm font-semibold text-slate-400"> / 5</span>
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${tier.color}`}>
                {tier.label}
              </span>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">{tier.desc}</p>
            </div>
          </div>

          {/* 5-Dimensional Breakdown */}
          <div className="pt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" /> Multi-Dimensional Performance Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Technical Performance', score: existingRating.technical_performance || 5 },
                { label: 'Solution Effectiveness', score: existingRating.solution_effectiveness || 5 },
                { label: 'Implementation & Support', score: existingRating.implementation_support || 5 },
                { label: 'Timeliness & Schedule', score: existingRating.timeliness || 5 },
                { label: 'KPI & Outcome Achievement', score: existingRating.kpi_achievement || 5 },
              ].map(({ label, score }) => (
                <div key={label} className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-700">{label}</span>
                    <span className="font-bold text-navy-900 text-xs">{score} / 5</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Government Officer Written Feedback */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" /> Government Officer Feedback &amp; Procurement Recommendation
            </h3>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
              "{existingRating.feedback}"
            </div>
          </div>

          {/* Department & Officer Sign-Off Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>
                Evaluated by <strong>{existingRating.officer_name || 'Authorized Officer'}</strong> ({existingRating.officer_designation || 'Joint Commissioner'})
              </span>
            </div>
            <span>Department: {existingRating.department_name || pilot.department?.name}</span>
          </div>
        </Card>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW: EVALUATION FORM (First-time submission or Edit mode)
  // ──────────────────────────────────────────────────────────────────────────
  const activeTier = TIER_LABELS[overallRating] || TIER_LABELS[5];

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            if (existingRating) setIsEditMode(false);
            else navigate('/government/pilots');
          }}
          className="text-xs font-semibold text-slate-600 hover:text-navy-900 cursor-pointer"
        >
          Back to {existingRating ? 'Evaluation Summary' : 'Pilot Management'}
        </button>
        {existingRating && (
          <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded font-bold">
            Editing Existing Evaluation
          </span>
        )}
      </div>

      {/* Official Header */}
      <div className="bg-[#123158] text-white rounded-xl px-6 py-5">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 bg-blue-950/80 px-2.5 py-0.5 rounded border border-blue-800">
            GOVERNMENT OF INDIA • PRAGATI
          </span>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> GFR 2017 PILOT ASSESSMENT
          </span>
        </div>
        <h1 className="text-xl font-black tracking-tight text-white leading-tight">
          Official Government Pilot Performance Evaluation
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Structured vendor performance appraisal for completed pilot deployment • {pilot.pilot_number}
        </p>
      </div>

      {/* Completed Pilot Context Summary Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase text-slate-400">Completed Pilot</span>
            <h3 className="text-sm font-bold text-navy-900">{pilot.problem?.title || 'Pilot Project'}</h3>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Completed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/80 text-xs">
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Startup Vendor</span>
            <p className="font-semibold text-navy-900">{pilot.startup?.name || 'Partner Startup'}</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Host Department</span>
            <p className="font-semibold text-slate-800">{pilot.department?.name || 'Department'}</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Duration</span>
            <p className="font-semibold text-slate-800">{pilot.duration_days || 90} Days</p>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase text-slate-400">Budget Utilized</span>
            <p className="font-semibold text-slate-800">{formatCurrency(pilot.budget_utilized || 0)}</p>
          </div>
        </div>
      </div>

      {/* Evaluation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. Overall Rating Section */}
        <Card className="p-6 border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              1. Overall Performance Rating <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Provide an overall statutory appraisal of the startup's delivery quality under government terms.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || overallRating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setOverallRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                    aria-label={`Rate ${star} star`}
                  >
                    <Star
                      className={`w-9 h-9 ${
                        isFilled
                          ? 'fill-amber-400 text-amber-500'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-3 text-2xl font-black text-navy-900">
                {overallRating}.0 <span className="text-xs text-slate-400 font-semibold">/ 5</span>
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold border ${activeTier.color}`}>
                {activeTier.label}
              </span>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs">{activeTier.desc}</p>
            </div>
          </div>
        </Card>

        {/* 2. Structured Dimensions Section */}
        <Card className="p-6 border border-slate-200 space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              2. Detailed Performance Dimensions (1 to 5) <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Score each dimensional criterion based on verified pilot telemetry and departmental monitoring.
            </p>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            {[
              {
                id: 'tech',
                label: 'Technical Performance',
                desc: 'Architecture robustness, sensor/system reliability, data integrity, and tech readiness.',
                value: technicalPerf,
                setter: setTechnicalPerf,
              },
              {
                id: 'eff',
                label: 'Solution Effectiveness',
                desc: 'Demonstrated field outcome, real problem resolution, and operational utility.',
                value: effectiveness,
                setter: setEffectiveness,
              },
              {
                id: 'impl',
                label: 'Implementation & Support',
                desc: 'Field responsiveness, technical support speed, team communication, and maintenance.',
                value: implementation,
                setter: setImplementation,
              },
              {
                id: 'time',
                label: 'Timeliness',
                desc: 'Adherence to contractual milestone schedules and submission deadlines.',
                value: timeliness,
                setter: setTimeliness,
              },
              {
                id: 'kpi',
                label: 'Pilot Outcome / KPI Achievement',
                desc: 'Fulfillment and exceedance of agreed tripartite baseline and target benchmarks.',
                value: kpiScore,
                setter: setKpiScore,
              },
            ].map(({ id, label, desc, value, setter }) => (
              <div key={id} className="pt-3.5 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 max-w-md">
                  <span className="text-xs font-bold text-navy-900">{label}</span>
                  <p className="text-[11px] text-slate-500">{desc}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setter(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        value === num
                          ? 'bg-navy-900 text-white border-navy-900 shadow-xs scale-105'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <span className="text-xs font-bold text-blue-700 ml-1.5 w-8 text-right">
                    {value}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 3. Government Officer Written Feedback */}
        <Card className="p-6 border border-slate-200 space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              3. Government Officer Feedback &amp; Procurement Recommendation <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Provide structured qualitative commentary regarding field observations, vendor strengths, operational constraints, and recommendation for wider departmental adoption.
            </p>
          </div>

          <Textarea
            rows={5}
            required
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Example: AquaSense AI demonstrated exemplary field responsiveness during the 90-day pilot deployment in Nagpur. Acoustic sensors and anomaly alerts operated with 94% verified accuracy. The team trained our zonal municipal engineers effectively. Highly recommended for full-scale municipal adoption under GFR 2017 Rule 149..."
          />
        </Card>

        {/* 4. Declaration & Officer Attestation */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-950">
          <input
            type="checkbox"
            id="attest"
            checked={attestationChecked}
            onChange={(e) => setAttestationChecked(e.target.checked)}
            className="mt-0.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="attest" className="cursor-pointer leading-relaxed">
            <strong>Official Officer Attestation:</strong> I hereby certify that this evaluation reflects authentic pilot verification records, field telemetry datasets, and joint departmental inspection sign-offs under GFR 2017 public procurement standards.
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (existingRating) setIsEditMode(false);
              else navigate('/government/pilots');
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-navy-900 hover:bg-navy-800 text-white font-semibold flex items-center justify-center gap-1.5 px-6"
          >
            {isSubmitting
              ? 'Saving Evaluation...'
              : existingRating
              ? 'Update Performance Evaluation'
              : 'Submit Performance Evaluation'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PilotEvaluation;
