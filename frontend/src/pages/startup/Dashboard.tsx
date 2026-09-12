import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '../../components/ui/PageHeader';
import { KPICard } from '../../components/ui/KPICard';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { DashboardAnalyticsSkeleton } from '../../components/ui/Skeleton';
import {
  Compass, FileText, Rocket, CheckCircle2, Clock,
  ArrowRight, Award, MapPin, Briefcase, IndianRupee,
  Sparkles, TrendingUp, BarChart3,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { formatCurrency, formatDate } from '../../lib/utils';

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

      if (probRes.status === 'fulfilled') {
        const rawProbs = Array.isArray(probRes.value.data) ? probRes.value.data : (probRes.value.data?.data || []);
        setAllOpenProblemsCount(rawProbs.length);

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

      if (appRes.status === 'fulfilled') {
        const rawApps = Array.isArray(appRes.value.data) ? appRes.value.data : (appRes.value.data?.data || []);
        setApplications(rawApps);
      }

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

  const startupName = startupProfile?.name || 'AquaSense Technologies';
  const successRate = startupProfile?.pilot_success_rate ?? 92;
  const trustScore = startupProfile?.trust_score ?? 94;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardAnalyticsSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Innovator Command Center
            </span>
            <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-cyan-600" /> DPIIT Recognized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Welcome back, {startupName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Sector: <strong className="text-slate-800">{startupProfile?.sector || 'Water & DeepTech'}</strong> • DPIIT: <strong className="text-slate-800">{startupProfile?.dpiit_recognition_number || 'DIPP12345'}</strong> • Trust Score: <strong className="text-blue-600">{trustScore}/100</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Button
            onClick={() => navigate('/startup/problems')}
            className="bg-navy-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-4 flex items-center gap-1.5 shadow-card hover:shadow-glow-blue"
          >
            <Compass className="w-4 h-4 text-cyan-400" /> Discover Challenges
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/startup/applications')}
            className="text-xs font-semibold py-2.5 px-4"
          >
            My Applications ({appCounts.total})
          </Button>
        </div>
      </div>

      {/* 6 Startup Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          label="Application Trend"
          value={appCounts.total}
          change="+3 this month"
          trend="up"
          icon={<FileText className="w-4 h-4" />}
          accentColor="blue"
          onClick={() => navigate('/startup/applications')}
        />
        <KPICard
          label="Success Rate"
          value={`${successRate}%`}
          change="Top 5% DPIIT"
          trend="up"
          icon={<Award className="w-4 h-4" />}
          accentColor="cyan"
        />
        <KPICard
          label="Match Score Avg"
          value={`${trustScore}%`}
          icon={<Sparkles className="w-4 h-4" />}
          accentColor="blue"
        />
        <KPICard
          label="Active Pilots"
          value={activePilots.length}
          icon={<Rocket className="w-4 h-4" />}
          accentColor="cyan"
          onClick={() => navigate('/startup/pilots')}
        />
        <KPICard
          label="Funding Potential"
          value="₹32L"
          icon={<IndianRupee className="w-4 h-4" />}
          accentColor="navy"
          description="Available sandbox grants"
        />
        <KPICard
          label="Open Challenges"
          value={allOpenProblemsCount}
          icon={<Compass className="w-4 h-4" />}
          accentColor="blue"
          onClick={() => navigate('/startup/problems')}
        />
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Active Pilot Telemetry & Recommended Challenges */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Pilots Live Progress */}
          <Card className="p-6 border border-slate-200 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-navy-900">Active Pilot Deployments</h2>
              </div>
              <Button variant="ghost" size="xs" onClick={() => navigate('/startup/pilots')} className="text-xs text-blue-600 font-semibold">
                View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            {activePilots.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
                No active pilot sandbox currently executing. Submit proposals to open challenges to launch a government pilot.
              </div>
            ) : (
              <div className="space-y-4">
                {activePilots.map((p) => {
                  const progress = Math.round(p.progress_percent || 0);
                  const title = p.problem?.title || p.target_outcome || `Pilot ${p.pilot_number}`;
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                              {p.pilot_number || 'PILOT-WRD-001'}
                            </span>
                            <Badge variant="cyan" dot>
                              Active Field Sandbox
                            </Badge>
                          </div>
                          <h4 className="font-bold text-sm text-navy-900">{title}</h4>
                        </div>
                        <Button
                          size="xs"
                          className="bg-navy-900 hover:bg-slate-800 text-white"
                          onClick={() => navigate(`/startup/pilots/${p.id}/workspace`)}
                        >
                          Telemetry <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold text-slate-600">Milestone Execution</span>
                          <span className="font-bold text-navy-900">{progress}%</span>
                        </div>
                        <ProgressBar value={progress} color="blue" size="md" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recommended Challenges for Startup */}
          <Card className="p-6 border border-slate-200 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-cyan-600" />
                <h2 className="text-base font-bold text-navy-900">Recommended Challenges for You</h2>
              </div>
              <Button variant="ghost" size="xs" onClick={() => navigate('/startup/problems')} className="text-xs text-blue-600 font-semibold">
                Explore All <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:shadow-card hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {prob.sector}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" /> {prob.location || 'India'}
                      </span>
                    </div>
                    <h4
                      onClick={() => navigate(`/startup/problems/${prob.id}`)}
                      className="font-bold text-xs text-navy-900 hover:text-blue-600 cursor-pointer line-clamp-2"
                    >
                      {prob.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {prob.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-navy-900">
                      {prob.budget_min && prob.budget_max ? formatCurrency(prob.budget_max) : 'Grant TBD'}
                    </span>
                    <Button
                      size="xs"
                      onClick={() => navigate(`/startup/problems/${prob.id}/apply`)}
                      className="bg-navy-900 hover:bg-slate-800 text-white text-[11px]"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 4 Cols: Application Status Pipeline & Quick Profile Health */}
        <div className="lg:col-span-4 space-y-4">
          <Card padding="p-5" className="border border-slate-200 shadow-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Application Status Pipeline</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Submitted & Under Review', count: appCounts.submitted, color: 'bg-blue-600 text-white' },
                { label: 'Shortlisted for Technical Fit', count: appCounts.shortlisted, color: 'bg-cyan-600 text-white' },
                { label: 'Selected for Pilot Sandbox', count: appCounts.selected, color: 'bg-navy-900 text-white' },
                { label: 'Archived / Not Selected', count: appCounts.rejected, color: 'bg-slate-200 text-slate-700' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${item.color}`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="p-5" className="border border-slate-200 shadow-card">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Statutory Verification</h3>
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 text-xs space-y-1.5">
              <p className="font-bold text-navy-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> DPIIT Recognition Active
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Eligible for direct government innovation procurement under Rule 149 & 170 of General Financial Rules (GFR 2017).
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default StartupDashboard;
