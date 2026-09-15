import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge, BadgeVariant } from '../../components/ui/Badge';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { Shield, AlertCircle, Search } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface StartupRecord {
  id: string;
  user_id: string;
  name: string;
  founder_name: string;
  email: string;
  sector: string;
  verification_status: string;
  trust_score: number | null;
  pilot_success_rate: number | null;
  dpiit_recognition_number: string | null;
  created_at: string;
  // computed
  applications_count: number;
  active_pilots: number;
  completed_pilots: number;
}

function verificationBadge(status: string): BadgeVariant {
  if (status === 'verified') return 'verified';
  if (status === 'pending') return 'pending';
  if (status === 'rejected') return 'rejected';
  return 'draft';
}

export default function AdminVerificationPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startups, setStartups] = useState<StartupRecord[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [startupsRes, applicationsRes, pilotsRes] = await Promise.all([
          supabase.from('startups').select('*').order('created_at', { ascending: false }),
          supabase.from('applications').select('startup_id, status'),
          supabase.from('pilots').select('startup_id, status'),
        ]);

        if (startupsRes.error) throw startupsRes.error;

        const apps = applicationsRes.data || [];
        const pilots = pilotsRes.data || [];

        const appCount: Record<string, number> = {};
        apps.forEach(a => { appCount[a.startup_id] = (appCount[a.startup_id] || 0) + 1; });

        const activePilots: Record<string, number> = {};
        const completedPilots: Record<string, number> = {};
        pilots.forEach(p => {
          if (p.status === 'active' || p.status === 'paused') {
            activePilots[p.startup_id] = (activePilots[p.startup_id] || 0) + 1;
          }
          if (p.status === 'completed') {
            completedPilots[p.startup_id] = (completedPilots[p.startup_id] || 0) + 1;
          }
        });

        setStartups((startupsRes.data || []).map(s => ({
          ...s,
          applications_count: appCount[s.id] || 0,
          active_pilots: activePilots[s.id] || 0,
          completed_pilots: completedPilots[s.id] || 0,
        })));
      } catch (e: any) {
        setError(e.message || 'Failed to load verification data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = startups.filter(s => {
    const matchStatus = statusFilter === 'all' || s.verification_status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.founder_name || '').toLowerCase().includes(q) ||
      (s.sector || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: startups.length,
    verified: startups.filter(s => s.verification_status === 'verified').length,
    pending: startups.filter(s => s.verification_status === 'pending').length,
    rejected: startups.filter(s => s.verification_status === 'rejected').length,
  };

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-600" />
            Startup Verification
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Verification status of all registered startups</p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['all', 'verified', 'pending', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-4 rounded-xl border text-left transition-colors ${
              statusFilter === status
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`text-2xl font-bold ${
              status === 'verified' ? 'text-emerald-600' :
              status === 'pending' ? 'text-amber-600' :
              status === 'rejected' ? 'text-red-600' :
              'text-gray-900'
            }`}>{counts[status]}</div>
            <div className="text-xs text-gray-500 mt-0.5 capitalize">{status === 'all' ? 'Total' : status}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search startups..."
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
            <p className="font-medium">{error}</p>
          </div>
        </Card>
      )}

      {!error && (
        <Card className="overflow-hidden p-0">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Shield className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No startups found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Startup</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">DPIIT</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Applications</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Pilots</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Trust Score</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.founder_name}</div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{s.sector || '—'}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={verificationBadge(s.verification_status)}>
                          {s.verification_status || 'Unknown'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-gray-600 text-xs">
                        {s.dpiit_recognition_number || '—'}
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-gray-700 font-medium">{s.applications_count}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-blue-600 font-medium">{s.active_pilots}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span className="text-emerald-600 font-medium">{s.completed_pilots}</span>
                        <span className="text-xs text-gray-400 ml-1">A/C</span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        {s.trust_score != null ? (
                          <span className={`font-semibold ${s.trust_score >= 80 ? 'text-emerald-600' : s.trust_score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
                            {s.trust_score}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                        {s.created_at ? formatDate(s.created_at) : '—'}
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
