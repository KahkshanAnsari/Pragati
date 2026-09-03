import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { KPICard } from '../../components/ui/KPICard';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Building2, Rocket, FileText, CheckCircle2, ShieldAlert, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../lib/utils';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Mock data for charts
  const sectorData = [
    { name: 'Water', value: 35 },
    { name: 'Smart City', value: 25 },
    { name: 'Agriculture', value: 20 },
    { name: 'Health', value: 10 },
    { name: 'Transport', value: 10 },
  ];
  const COLORS = ['#0F2040', '#3B82F6', '#10B981', '#F59E0B', '#6B7280'];

  const successData = [
    { month: 'Jan', rate: 65 },
    { month: 'Feb', rate: 70 },
    { month: 'Mar', rate: 72 },
    { month: 'Apr', rate: 85 },
    { month: 'May', rate: 82 },
    { month: 'Jun', rate: 90 },
  ];

  const conversionData = [
    { month: 'Jan', pilots: 10, procurement: 2 },
    { month: 'Feb', pilots: 15, procurement: 3 },
    { month: 'Mar', pilots: 18, procurement: 5 },
    { month: 'Apr', pilots: 22, procurement: 8 },
    { month: 'May', pilots: 25, procurement: 10 },
    { month: 'Jun', pilots: 30, procurement: 15 },
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  if (loading) return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <PageHeader 
          title="Admin Dashboard" 
          description={`Platform overview as of ${formatDate(new Date().toISOString())}`}
        />
        <div className="flex gap-2">
          <Button variant="secondary">Export Report</Button>
          <Button className="bg-navy-900 hover:bg-navy-800 text-white">Platform Settings</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard title="Gov Departments" value="24" icon={<Building2 className="w-5 h-5 text-blue-500" />} trend="up" change="+2 this month" />
        <KPICard title="Registered Startups" value="386" icon={<Rocket className="w-5 h-5 text-indigo-500" />} trend="up" change="+45 this month" />
        <KPICard title="Active Problems" value="42" icon={<FileText className="w-5 h-5 text-amber-500" />} />
        <KPICard title="Active Pilots" value="18" icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} />
        <KPICard title="Successful Pilots" value="11" icon={<Award className="w-5 h-5 text-purple-500" />} />
        <KPICard title="Procurement Ready" value="7" icon={<ShieldAlert className="w-5 h-5 text-red-500" />} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Problems by Sector</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {sectorData.map((entry, index) => (
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
          <h3 className="font-semibold text-navy-900 mb-4">Pilot Success Rate (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={successData}>
                <XAxis dataKey="month" stroke="#8884d8" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="rate" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-navy-900 mb-4">Procurement Conversion Funnel</h3>
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
                <Area type="monotone" dataKey="procurement" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorProcurement)" name="Procurement Approved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card className="p-5">
        <h3 className="font-semibold text-navy-900 mb-4">Recent Platform Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-3 last:pb-0 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {i === 1 ? 'A' : i === 2 ? 'G' : 'S'}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    {i === 1 ? 'Admin verified startup "TechCorp"' : i === 2 ? 'Gov Dept posted new problem' : 'Startup submitted pilot evidence'}
                  </p>
                  <p className="text-xs text-gray-500">{i} hour{i > 1 ? 's' : ''} ago</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
