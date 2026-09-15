import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { Users as UsersIcon, Search, AlertCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';

type UserRole = 'startup' | 'government_officer' | 'admin';

interface UserRecord {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  organization?: string;
  designation?: string;
  created_at: string;
}

function roleBadgeVariant(role: UserRole) {
  if (role === 'admin') return 'info';
  if (role === 'government_officer') return 'active';
  return 'secondary';
}

function roleLabel(role: UserRole) {
  if (role === 'admin') return 'Admin';
  if (role === 'government_officer') return 'Gov Officer';
  return 'Startup';
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Fetch from users table
        const { data: usersData, error: usersErr } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        if (usersErr) throw usersErr;

        // Fetch gov officers for name/designation enrichment
        const { data: officers } = await supabase
          .from('government_officers')
          .select('user_id, name, designation, official_email');

        // Fetch startups for name enrichment
        const { data: startups } = await supabase
          .from('startups')
          .select('user_id, name, founder_name');

        const officerMap: Record<string, { name: string; designation: string }> = {};
        (officers || []).forEach(o => { officerMap[o.user_id] = { name: o.name, designation: o.designation }; });

        const startupMap: Record<string, { name: string }> = {};
        (startups || []).forEach(s => { startupMap[s.user_id] = { name: s.founder_name || s.name }; });

        const enriched: UserRecord[] = (usersData || []).map(u => {
          if (u.role === 'government_officer' && officerMap[u.id]) {
            return {
              ...u,
              name: officerMap[u.id].name,
              organization: 'Government Department',
              designation: officerMap[u.id].designation,
            };
          }
          if (u.role === 'startup' && startupMap[u.id]) {
            return {
              ...u,
              name: startupMap[u.id].name,
              organization: 'Startup',
            };
          }
          if (u.role === 'admin') {
            return { ...u, name: 'Platform Administrator', organization: 'PRAGATI Admin' };
          }
          return u;
        });

        setUsers(enriched);
      } catch (e: any) {
        setError(e.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.name || '').toLowerCase().includes(q) ||
      (u.role || '').toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <UsersIcon className="w-6 h-6 text-blue-600" />
            Users
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">All registered platform users</p>
        </div>
        <span className="text-sm text-gray-500">{filtered.length} users</span>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="government_officer">Gov Officer</option>
            <option value="startup">Startup</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-medium">Failed to load users</p>
              <p className="text-sm text-red-500 mt-0.5">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Table */}
      {!error && (
        <Card className="overflow-hidden p-0">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <UsersIcon className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No users found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name / Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Organization</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Designation</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-900">{user.name || '—'}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={roleBadgeVariant(user.role)}>{roleLabel(user.role)}</Badge>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-gray-600">{user.organization || '—'}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-600">{user.designation || '—'}</td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-gray-500">
                        {user.created_at ? formatDate(user.created_at) : '—'}
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
