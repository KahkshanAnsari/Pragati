import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge, BadgeVariant } from '../../components/ui/Badge';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { FileText, AlertCircle, Search } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface Problem {
  id: string;
  title: string;
  department_id: string;
  sector: string;
  status: string;
  budget_min: number | null;
  budget_max: number | null;
  created_at: string;
  // enriched
  department_name: string;
  applications_count: number;
  active_pilot: boolean;
}

function statusBadge(status: string): BadgeVariant {
  if (status === 'published' || status === 'matched') return 'active';
  if (status === 'pilot_active') return 'info';
  if (status === 'pilot_completed') return 'completed';
  if (status === 'draft') return 'draft';
  return 'secondary';
}

export default function AdminProblemsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [problemsRes, deptsRes, appsRes, pilotsRes] = await Promise.all([
          supabase.from('problems').select('*').order('created_at', { ascending: false }),
          supabase.from('government_departments').select('id, name'),
          supabase.from('applications').select('problem_id, status'),
          supabase.from('pilots').select('problem_id, status'),
        ]);

        if (problemsRes.error) throw problemsRes.error;

        const deptMap: Record<string, string> = {};
        (deptsRes.data || []).forEach(d => { deptMap[d.id] = d.name; });

        const appCount: Record<string, number> = {};
        (appsRes.data || []).forEach(a => { appCount[a.problem_id] = (appCount[a.problem_id] || 0) + 1; });

        const activePilotSet = new Set<string>();
        (pilotsRes.data || []).forEach(p => {
          if (p.status === 'active' || p.status === 'completed') activePilotSet.add(p.problem_id);
        });

        setProblems((problemsRes.data || []).map(p => ({
          ...p,
          department_name: deptMap[p.department_id] || '—',
          applications_count: appCount[p.id] || 0,
          active_pilot: activePilotSet.has(p.id),
        })));
      } catch (e: any) {
        setError(e.message || 'Failed to load problems');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sectors = Array.from(new Set(problems.map(p => p.sector).filter(Boolean)));

  const filtered = problems.filter(p => {
    const matchSector = sectorFilter === 'all' || p.sector === sectorFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.department_name.toLowerCase().includes(q) ||
      (p.sector || '').toLowerCase().includes(q);
    return matchSector && matchSearch;
  });

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-600" />
            Problems
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Government challenges posted on the platform</p>
        </div>
        <span className="text-sm text-gray-500">{filtered.length} problems</span>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Sectors</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </Card>

      {error && (
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        </Card>
      )}

      {!error && (
        <Card className="overflow-hidden p-0">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No problems found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Problem</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Department</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Applications</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Pilot</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Posted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900 max-w-xs truncate">{p.title}</div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-gray-600 max-w-[160px] truncate">{p.department_name}</td>
                      <td className="px-5 py-3.5 text-gray-600 text-xs">{p.sector || '—'}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={statusBadge(p.status)}>
                          {p.status?.replace('_', ' ') || '—'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell text-gray-700 font-medium">{p.applications_count}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        {p.active_pilot
                          ? <Badge variant="active">Active</Badge>
                          : <span className="text-gray-400 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                        {p.created_at ? formatDate(p.created_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
