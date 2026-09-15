import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { Building2, AlertCircle, Search } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface Department {
  id: string;
  name: string;
  sector: string;
  location: string;
  head_name: string;
  created_at: string;
  // computed
  problems_count: number;
  active_pilots: number;
  completed_pilots: number;
  procurement_ready: number;
}

export default function AdminDepartmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [deptsRes, problemsRes, pilotsRes, procurementRes] = await Promise.all([
          supabase.from('government_departments').select('*').order('name'),
          supabase.from('problems').select('department_id, status'),
          supabase.from('pilots').select('department_id, status'),
          supabase.from('procurement_cases').select('pilot_id, readiness_level, status'),
        ]);

        if (deptsRes.error) throw deptsRes.error;

        const depts = deptsRes.data || [];
        const problems = problemsRes.data || [];
        const pilots = pilotsRes.data || [];

        // Count problems per department
        const problemCount: Record<string, number> = {};
        problems.forEach(p => {
          problemCount[p.department_id] = (problemCount[p.department_id] || 0) + 1;
        });

        // Count active/completed pilots per department
        const activePilots: Record<string, number> = {};
        const completedPilots: Record<string, number> = {};
        pilots.forEach(p => {
          if (p.status === 'active' || p.status === 'paused') {
            activePilots[p.department_id] = (activePilots[p.department_id] || 0) + 1;
          }
          if (p.status === 'completed') {
            completedPilots[p.department_id] = (completedPilots[p.department_id] || 0) + 1;
          }
        });

        setDepartments(depts.map(d => ({
          ...d,
          problems_count: problemCount[d.id] || 0,
          active_pilots: activePilots[d.id] || 0,
          completed_pilots: completedPilots[d.id] || 0,
          procurement_ready: 0, // only available if joined further
        })));
      } catch (e: any) {
        setError(e.message || 'Failed to load departments');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = departments.filter(d => {
    const q = search.toLowerCase();
    return (
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.sector.toLowerCase().includes(q) ||
      (d.location || '').toLowerCase().includes(q)
    );
  });

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            Government Departments
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Participating departments and their activity</p>
        </div>
        <span className="text-sm text-gray-500">{filtered.length} departments</span>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </Card>

      {error && (
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-medium">Failed to load departments</p>
              <p className="text-sm text-red-500 mt-0.5">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {!error && filtered.length === 0 && (
        <Card className="p-12 text-center text-gray-500">
          <Building2 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No departments found</p>
        </Card>
      )}

      {!error && filtered.length > 0 && (
        <div className="grid gap-4">
          {filtered.map(dept => (
            <Card key={dept.id} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-base truncate">{dept.name}</h3>
                    <Badge variant="info">{dept.sector}</Badge>
                  </div>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                    {dept.location && <span>📍 {dept.location}</span>}
                    {dept.head_name && <span>👤 {dept.head_name}</span>}
                    {dept.created_at && <span>Since {formatDate(dept.created_at)}</span>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 shrink-0">
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-gray-900">{dept.problems_count}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Problems</div>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-blue-600">{dept.active_pilots}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Active Pilots</div>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="text-2xl font-bold text-emerald-600">{dept.completed_pilots}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Completed</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
