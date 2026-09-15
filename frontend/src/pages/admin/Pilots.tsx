import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge, BadgeVariant } from '../../components/ui/Badge';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { Rocket, AlertCircle, Search } from 'lucide-react';
import { formatDate, formatCurrency } from '../../lib/utils';

interface PilotRecord {
  id: string;
  problem_id: string;
  startup_id: string;
  department_id: string;
  status: string;
  phase: string | null;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  // enriched
  problem_title: string;
  startup_name: string;
  department_name: string;
}

function pilotStatusBadge(status: string): BadgeVariant {
  if (status === 'active') return 'active';
  if (status === 'completed') return 'completed';
  if (status === 'paused') return 'warning';
  if (status === 'terminated') return 'rejected';
  return 'draft';
}

export default function AdminPilotsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pilots, setPilots] = useState<PilotRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [pilotsRes, problemsRes, startupsRes, deptsRes] = await Promise.all([
          supabase.from('pilots').select('*').order('created_at', { ascending: false }),
          supabase.from('problems').select('id, title'),
          supabase.from('startups').select('id, name'),
          supabase.from('government_departments').select('id, name'),
        ]);

        if (pilotsRes.error) throw pilotsRes.error;

        const problemMap: Record<string, string> = {};
        (problemsRes.data || []).forEach(p => { problemMap[p.id] = p.title; });

        const startupMap: Record<string, string> = {};
        (startupsRes.data || []).forEach(s => { startupMap[s.id] = s.name; });

        const deptMap: Record<string, string> = {};
        (deptsRes.data || []).forEach(d => { deptMap[d.id] = d.name; });

        setPilots((pilotsRes.data || []).map(p => ({
          ...p,
          problem_title: problemMap[p.problem_id] || '—',
          startup_name: startupMap[p.startup_id] || '—',
          department_name: deptMap[p.department_id] || '—',
        })));
      } catch (e: any) {
        setError(e.message || 'Failed to load pilots');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statuses = ['active', 'completed', 'paused', 'terminated'];
  const counts: Record<string, number> = { all: pilots.length };
  statuses.forEach(s => { counts[s] = pilots.filter(p => p.status === s).length; });

  const filtered = pilots.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.problem_title.toLowerCase().includes(q) ||
      p.startup_name.toLowerCase().includes(q) ||
      p.department_name.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-blue-600" />
            Pilots
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">All pilot programmes across the platform</p>
        </div>
        <span className="text-sm text-gray-500">{filtered.length} pilots</span>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(['all', ...statuses] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`p-3 rounded-xl border text-left transition-colors ${
              statusFilter === s
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`text-xl font-bold ${
              s === 'active' ? 'text-blue-600' :
              s === 'completed' ? 'text-emerald-600' :
              s === 'paused' ? 'text-amber-600' :
              s === 'terminated' ? 'text-red-600' :
              'text-gray-900'
            }`}>{counts[s] ?? 0}</div>
            <div className="text-xs text-gray-500 mt-0.5 capitalize">{s}</div>
          </button>
        ))}
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by problem, startup, or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
              <Rocket className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No pilots found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Problem</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Startup</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Department</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Budget</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Phase</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Start Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(pilot => (
                    <tr key={pilot.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900 max-w-[200px] truncate">{pilot.problem_title}</div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-700 max-w-[140px] truncate">{pilot.startup_name}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-gray-600 text-xs max-w-[140px] truncate">{pilot.department_name}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={pilotStatusBadge(pilot.status)}>{pilot.status || '—'}</Badge>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-700">
                        {pilot.budget ? formatCurrency(pilot.budget) : '—'}
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-600 capitalize">{pilot.phase || '—'}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                        {pilot.start_date ? formatDate(pilot.start_date) : '—'}
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
