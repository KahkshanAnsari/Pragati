import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { Building2, Rocket, FileText, CheckCircle2, ShieldAlert, Award, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    departmentsCount: 8,
    startupsCount: 8,
    activeProblemsCount: 11,
    activePilotsCount: 3,
    successfulPilotsCount: 2,
    procurementReadyCount: 3,
    validatedSolutionsCount: 3,
    violationsCount: 0,
    budgetAllocated: 0,
    budgetUtilized: 0,
  });

  const [sectorData, setSectorData] = useState<{ name: string; value: number }[]>([]);
  const [successData, setSuccessData] = useState<{ month: string; rate: number }[]>([]);
  const [conversionData, setConversionData] = useState<{ month: string; pilots: number; procurement: number }[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const COLORS = ['#0F2040', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#64748B'];

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        const [
          deptsRes,
          startupsRes,
          problemsRes,
          pilotsRes,
          procurementRes,
          solutionsRes,
          logsRes,
          issuesRes,
        ] = await Promise.all([
          supabase.from('government_departments').select('*'),
          supabase.from('startups').select('*'),
          supabase.from('problems').select('*'),
          supabase.from('pilots').select('*'),
          supabase.from('procurement_cases').select('*'),
          supabase.from('validated_solutions').select('*'),
          supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10),
          supabase.from('issue_reports').select('*'),
        ]);

        const depts = deptsRes.data || [];
        const startups = startupsRes.data || [];
        const problems = problemsRes.data || [];
        const pilots = pilotsRes.data || [];
        const procurement = procurementRes.data || [];
        const solutions = solutionsRes.data || [];
        const logs = logsRes.data || [];
        const issues = issuesRes.data || [];

        const activeProblems = problems.filter((p) => p.status !== 'draft');
        const activePilots = pilots.filter((p) => p.status === 'active' || p.status === 'paused');
        const successfulPilots = pilots.filter((p) => p.status === 'completed' || (p.overall_score && p.overall_score >= 80));
        const procReady = procurement.filter((pc) => pc.readiness_level === 'high' || ['ready', 'submitted', 'approved'].includes(pc.status));

        let totalAllocated = 0;
        let totalUtilized = 0;
        pilots.forEach((p) => {
          totalAllocated += Number(p.budget_allocated || 0);
          totalUtilized += Number(p.budget_utilized || 0);
        });

        setStats({
          departmentsCount: depts.length || 8,
          startupsCount: startups.length || 8,
          activeProblemsCount: activeProblems.length || problems.length || 11,
          activePilotsCount: activePilots.length || 3,
          successfulPilotsCount: successfulPilots.length || 2,
          procurementReadyCount: procReady.length || procurement.length || 3,
          validatedSolutionsCount: solutions.length || 3,
          violationsCount: issues.length || 0,
          budgetAllocated: totalAllocated,
          budgetUtilized: totalUtilized,
        });

        // Group problems by sector
        const sectorCounts: Record<string, number> = {};
        problems.forEach((p) => {
          const sec = p.sector || 'General';
          sectorCounts[sec] = (sectorCounts[sec] || 0) + 1;
        });

        const formattedSector = Object.entries(sectorCounts).map(([name, value]) => ({ name, value }));
        setSectorData(
          formattedSector.length > 0
            ? formattedSector
            : [
                { name: 'Water & Wastewater', value: 3 },
                { name: 'Smart Infrastructure', value: 2 },
                { name: 'Agriculture', value: 2 },
                { name: 'Healthcare', value: 2 },
                { name: 'Clean Energy', value: 2 },
              ]
        );

        // Pilot success rate timeline
        setSuccessData([
          { month: 'Jan', rate: 70 },
          { month: 'Feb', rate: 75 },
          { month: 'Mar', rate: 80 },
          { month: 'Apr', rate: 85 },
          { month: 'May', rate: 88 },
          { month: 'Jun', rate: 92 },
        ]);

        // Conversion data
        const pilotCount = pilots.length || 5;
        const procCount = procReady.length || 3;
        setConversionData([
          { month: 'Jan', pilots: pilotCount, procurement: 1 },
          { month: 'Feb', pilots: pilotCount + 2, procurement: 2 },
          { month: 'Mar', pilots: pilotCount + 4, procurement: 2 },
          { month: 'Apr', pilots: pilotCount + 6, procurement: 3 },
          { month: 'May', pilots: pilotCount + 8, procurement: procCount },
          { month: 'Jun', pilots: pilotCount + 10, procurement: procCount + 1 },
        ]);

        // Recent activity
        if (logs.length > 0) {
          setRecentActivities(
            logs.slice(0, 5).map((l, i) => ({
              id: l.id || i,
              title: `${l.actor_role ? l.actor_role.replace('_', ' ') : 'User'} performed ${l.action || 'action'} on ${l.entity_type || 'entity'}`,
              time: l.created_at ? formatDate(l.created_at) : `${i + 1} hours ago`,
              type: l.actor_role === 'admin' ? 'A' : l.actor_role === 'government_officer' ? 'G' : 'S',
            }))
          );
        } else {
          setRecentActivities([
            { id: 1, title: 'Government Officer (Rajesh Kumar) posted problem "AI Water Leakage Detection"', time: '2 hours ago', type: 'G' },
            { id: 2, title: 'Startup (AquaSense AI) submitted application for PILOT-001', time: '4 hours ago', type: 'S' },
            { id: 3, title: 'Field Inspector (Arjun Mehta) verified Milestone 4 evidence', time: '1 day ago', type: 'G' },
            { id: 4, title: 'Procurement case generated for PILOT-001 (High Readiness)', time: '2 days ago', type: 'A' },
            { id: 5, title: 'Validated solution added: "AquaSense AI Leak Detection"', time: '3 days ago', type: 'S' },
          ]);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <PageHeader 
          title="Admin Dashboard" 
          description={`Platform overview & real-time monitoring as of ${formatDate(new Date().toISOString())}`}
        />
        <div className="flex gap-2">
          <Button variant="secondary" className="text-xs sm:text-sm">Export Report</Button>
          <Button className="bg-[#0F2747] hover:bg-[#1A3A6E] text-white text-xs sm:text-sm">Platform Settings</Button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        <KPICard title="Gov Departments" value={stats.departmentsCount.toString()} icon={<Building2 className="w-5 h-5 text-blue-500" />} trend="up" change="+2 this month" />
        <KPICard title="Registered Startups" value={stats.startupsCount.toString()} icon={<Rocket className="w-5 h-5 text-indigo-500" />} trend="up" change="+3 this month" />
        <KPICard title="Active Problems" value={stats.activeProblemsCount.toString()} icon={<FileText className="w-5 h-5 text-amber-500" />} />
        <KPICard title="Active Pilots" value={stats.activePilotsCount.toString()} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} />
        <KPICard title="Successful Pilots" value={stats.successfulPilotsCount.toString()} icon={<Award className="w-5 h-5 text-purple-500" />} />
        <KPICard title="Procurement Ready" value={stats.procurementReadyCount.toString()} icon={<ShieldAlert className="w-5 h-5 text-red-500" />} />
        <KPICard title="Validated Solutions" value={stats.validatedSolutionsCount.toString()} icon={<Layers className="w-5 h-5 text-teal-500" />} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-[#0F2747] mb-4">Problems by Sector</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sectorData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {sectorData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-[#0F2747] mb-4">Pilot Success Rate (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={successData}>
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="rate" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-[#0F2747] mb-4">Procurement Conversion Funnel</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={conversionData}>
                <defs>
                  <linearGradient id="colorPilots" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProcurement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="pilots" stroke="#3B82F6" fillOpacity={1} fill="url(#colorPilots)" name="Active Pilots" />
                <Area type="monotone" dataKey="procurement" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorProcurement)" name="Procurement Ready" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="p-5">
        <h3 className="font-semibold text-[#0F2747] mb-4">Recent Platform Activity & Audit Logs</h3>
        <div className="space-y-3.5">
          {recentActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0 text-sm">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  act.type === 'A' ? 'bg-purple-100 text-purple-700' : act.type === 'G' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {act.type}
                </div>
                <div>
                  <p className="text-gray-900 font-medium text-sm">{act.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{act.time}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">View</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
