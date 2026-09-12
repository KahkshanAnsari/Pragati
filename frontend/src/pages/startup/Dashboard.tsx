import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { KPICard } from '../../components/ui/KPICard';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import {
  Compass,
  FileText,
  Rocket,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Briefcase,
  Layers,
  Award,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';

export function StartupDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [startupProfile, setStartupProfile] = useState<any>(profile);
  const [recommendedProblems, setRecommendedProblems] = useState<any[]>([]);
  const [allOpenProblemsCount, setAllOpenProblemsCount] = useState<number>(0);
  const [applications, setApplications] = useState<any[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stRes, probRes, appRes, pilotRes] = await Promise.allSettled([
        api.get('/api/startups').catch(() => ({ data: [] })),
        api.get('/api/problems?status=published').catch(() => ({ data: [] })),
        api.get('/api/applications?startup_id=mine').catch(() => ({ data: [] })),
        api.get('/api/pilots?startup_id=mine').catch(() => ({ data: [] })),
      ]);

      // Resolve startup profile
      let currentSt = profile;
      if (stRes.status === 'fulfilled') {
        const list = Array.isArray(stRes.value.data) ? stRes.value.data : (stRes.value.data?.data || []);
        if (user) {
          const match = list.find((s: any) => s.user_id === user.id || s.email === user.email);
          if (match) currentSt = match;
        }
        if (!currentSt && list.length > 0) currentSt = list[0];
        setStartupProfile(currentSt);
      }

      // Problems
      if (probRes.status === 'fulfilled') {
        const rawProbs = Array.isArray(probRes.value.data) ? probRes.value.data : (probRes.value.data?.data || []);
        setAllOpenProblemsCount(rawProbs.length);
        
        // Prioritize matching sector if available
        const stSector = (currentSt as any)?.sector;
        if (stSector && typeof stSector === 'string') {
          const sorted = [...rawProbs].sort((a, b) => {
            const aMatch = a.sector?.toLowerCase().includes(stSector.toLowerCase()) ? 1 : 0;
            const bMatch = b.sector?.toLowerCase().includes(stSector.toLowerCase()) ? 1 : 0;
            return bMatch - aMatch;
          });
          setRecommendedProblems(sorted.slice(0, 4));
        } else {
          setRecommendedProblems(rawProbs.slice(0, 4));
        }

      }

      // Applications
      if (appRes.status === 'fulfilled') {
        const rawApps = Array.isArray(appRes.value.data) ? appRes.value.data : (appRes.value.data?.data || []);
        setApplications(rawApps);
      }

      // Pilots
      if (pilotRes.status === 'fulfilled') {
        const rawPilots = Array.isArray(pilotRes.value.data) ? pilotRes.value.data : (pilotRes.value.data?.data || []);
        setPilots(rawPilots);
      }
    } catch (err) {
      console.error('Failed to load startup dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const activePilots = pilots.filter((p) => p.status === 'active');
  const completedPilots = pilots.filter((p) => p.status === 'completed');

  const appCounts = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === 'submitted').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    selected: applications.filter((a) => a.status === 'selected').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const startupName = startupProfile?.name || 'Startup Founder';

  if (loading) {
    return (
      <div className="p-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Startup Command Center
            </span>
            <Badge variant="success" className="text-xs">
              DPIIT Verified
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900">
            Welcome back, {startupName}
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Sector: <strong className="text-navy-900">{startupProfile?.sector || 'Multi-Sector Innovation'}</strong> • Trust Score: <strong className="text-emerald-600">{startupProfile?.trust_score || 94}/100</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Button
            onClick={() => navigate('/startup/problems')}
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-2.5 px-4 flex items-center gap-1.5 shadow-sm"
          >
            <Compass className="w-4 h-4 text-blue-400" /> Discover Problems
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/startup/applications')}
            className="text-xs font-semibold py-2.5 px-4"
          >
            My Applications
          </Button>
        </div>
      </div>

      {/* Dynamic 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Recommended Challenges</span>
            <Compass className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{allOpenProblemsCount}</p>
          <p className="text-[11px] text-gray-400 mt-1">Open government challenges</p>
        </Card>

        <Card className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Applications</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{appCounts.total}</p>
          <p className="text-[11px] text-gray-400 mt-1">
            {appCounts.submitted} submitted • {appCounts.shortlisted} shortlisted
          </p>
        </Card>

        <Card className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Active Pilots</span>
            <Rocket className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{activePilots.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Live field deployments</p>
        </Card>

        <Card className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase">Completed Pilots</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{completedPilots.length}</p>
          <p className="text-[11px] text-gray-400 mt-1">Validated for procurement</p>
        </Card>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Recommended Challenges & Active Pilot Progress */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Pilots Progress */}
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-navy-900">Active Pilot Deployments</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/startup/pilots')}>
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            {activePilots.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-xs text-gray-500">
                No active pilots underway. Submit proposals to open challenges to launch a government pilot.
              </div>
            ) : (
              <div className="space-y-4">
                {activePilots.map((p) => {
                  const progress = Math.round(p.progress_percent || 0);
                  const title = p.problem?.title || p.target_outcome || `Pilot ${p.pilot_number}`;
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {p.pilot_number}
                            </span>
                            <Badge variant="success">Active Deployment</Badge>
                          </div>
                          <h3
                            onClick={() => navigate(`/startup/pilots/${p.id}/workspace`)}
                            className="text-base font-bold text-navy-900 hover:text-blue-600 cursor-pointer transition-colors"
                          >
                            {title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {p.department?.name || 'Department'} • {p.duration_days || 90} Days Pilot
                          </p>
                        </div>
                        <span className="text-base font-bold text-navy-900">{progress}%</span>
                      </div>

                      <ProgressBar value={progress} color="navy" />

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 text-xs">
                        <span className="text-gray-500">
                          Utilized: <strong>{formatCurrency(p.budget_utilized || 0)}</strong> of {formatCurrency(p.budget_allocated)}
                        </span>
                        <Button
                          size="sm"
                          className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold py-1 px-3"
                          onClick={() => navigate(`/startup/pilots/${p.id}/workspace`)}
                        >
                          Open Workspace
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recommended Challenges */}
          <Card className="p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-navy-900">Recommended Government Challenges</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/startup/problems')}>
                Explore All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {prob.sector}
                      </span>
                      <span className="text-[11px] font-bold text-navy-900">
                        {prob.budget_min && prob.budget_max
                          ? `${formatCurrency(prob.budget_min)} – ${formatCurrency(prob.budget_max)}`
                          : 'Budget on assessment'}
                      </span>
                    </div>

                    <h3
                      onClick={() => navigate(`/startup/problems/${prob.id}`)}
                      className="font-bold text-navy-900 text-sm hover:text-blue-600 cursor-pointer line-clamp-2"
                    >
                      {prob.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">{prob.department?.name || 'Department'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => navigate(`/startup/problems/${prob.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      onClick={() => navigate(`/startup/problems/${prob.id}/apply`)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Application Pipeline, Upcoming Actions, Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Application Pipeline Card */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-600" /> Application Pipeline
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Total Submitted</span>
                <span className="font-bold text-navy-900">{appCounts.total}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-blue-50 rounded-lg text-blue-900">
                <span>Under Evaluation</span>
                <span className="font-bold">{appCounts.submitted}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-amber-50 rounded-lg text-amber-900">
                <span>Shortlisted</span>
                <span className="font-bold">{appCounts.shortlisted}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 bg-emerald-50 rounded-lg text-emerald-900">
                <span>Selected for Pilot</span>
                <span className="font-bold">{appCounts.selected}</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Actions */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Upcoming Pilot Actions
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1">
                <p className="font-bold text-amber-900">Milestone 6 Sign-off</p>
                <p className="text-amber-800">Final pilot documentation and procurement case ready for review.</p>
                <button
                  onClick={() => navigate('/startup/pilots')}
                  className="text-amber-900 font-semibold underline text-[11px] block mt-1"
                >
                  Go to Pilot Workspace
                </button>
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-1">
                <p className="font-bold text-blue-900">Live KPI Updates</p>
                <p className="text-blue-800">Ensure weekly telemetry values are recorded for automated GFR compliance.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StartupDashboard;
