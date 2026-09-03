import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, PieChart, Pie, Cell } from 'recharts';

export const Analytics: React.FC = () => {

  const startupsBySector = [
    { name: 'Water', count: 120 },
    { name: 'Smart City', count: 90 },
    { name: 'Health', count: 65 },
    { name: 'Agriculture', count: 55 },
    { name: 'Transport', count: 35 },
    { name: 'Energy', count: 21 },
  ];

  const scaledSolutions = [
    { month: 'Jan', count: 2 },
    { month: 'Feb', count: 5 },
    { month: 'Mar', count: 7 },
    { month: 'Apr', count: 12 },
    { month: 'May', count: 18 },
    { month: 'Jun', count: 24 },
  ];

  const budgetData = [
    { dept: 'Urban Dev', allocated: 500, utilized: 350 },
    { dept: 'Health', allocated: 400, utilized: 280 },
    { dept: 'Transport', allocated: 300, utilized: 150 },
    { dept: 'Agriculture', allocated: 250, utilized: 200 },
    { dept: 'Water', allocated: 450, utilized: 410 },
  ];

  const notificationsData = [
    { name: 'Milestone Alerts', value: 400 },
    { name: 'Inspections', value: 300 },
    { name: 'Verifications', value: 300 },
    { name: 'Violations', value: 100 },
  ];
  const COLORS = ['#0F2040', '#3B82F6', '#10B981', '#EF4444'];

  return (
    <div className="space-y-6">
      <PageHeader title="Detailed Analytics" description="Deep dive into platform metrics and performance." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Startups by Sector</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={startupsBySector} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Solutions Scaled Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scaledSolutions}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#10B981" fillOpacity={1} fill="url(#colorCount)" name="Total Scaled Solutions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold text-navy-900 mb-4">Budget Utilization by Department (in ₹ Lakhs)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="dept" />
                <YAxis />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="utilized" stackId="a" fill="#10B981" name="Utilized Budget" />
                <Bar dataKey="allocated" stackId="a" fill="#E5E7EB" name="Remaining Budget" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold text-navy-900 mb-4">Notifications Sent by Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={notificationsData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                  {notificationsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
