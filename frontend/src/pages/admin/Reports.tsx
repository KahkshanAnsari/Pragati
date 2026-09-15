import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SkeletonPage } from '../../components/ui/Skeleton';
import { FileText, AlertCircle, Download, CheckCircle, Clock, ShieldAlert, BarChart3 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface ReportSummary {
  totalPilots: number;
  completedPilots: number;
  totalProcurementCases: number;
  readyProcurementCases: number;
  totalIssues: number;
  resolvedIssues: number;
  auditLogsCount: number;
}

interface RecentActivityLog {
  id: string;
  action: string;
  actor_role: string;
  entity_type: string;
  created_at: string;
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ReportSummary>({
    totalPilots: 0,
    completedPilots: 0,
    totalProcurementCases: 0,
    readyProcurementCases: 0,
    totalIssues: 0,
    resolvedIssues: 0,
    auditLogsCount: 0,
  });
  const [recentAuditLogs, setRecentAuditLogs] = useState<RecentActivityLog[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [pilotsRes, procurementRes, issuesRes, auditRes] = await Promise.all([
          supabase.from('pilots').select('id, status'),
          supabase.from('procurement_cases').select('id, readiness_level, status'),
          supabase.from('issue_reports').select('id, status'),
          supabase.from('audit_logs').select('id, action, actor_role, entity_type, created_at').order('created_at', { ascending: false }).limit(10),
        ]);

        const pilots = pilotsRes.data || [];
        const procurement = procurementRes.data || [];
        const issues = issuesRes.data || [];
        const audits = auditRes.data || [];

        setSummary({
          totalPilots: pilots.length,
          completedPilots: pilots.filter(p => p.status === 'completed').length,
          totalProcurementCases: procurement.length,
          readyProcurementCases: procurement.filter(p => p.readiness_level === 'HIGH' || p.status === 'ready' || p.status === 'approved').length,
          totalIssues: issues.length,
          resolvedIssues: issues.filter(i => i.status === 'resolved').length,
          auditLogsCount: audits.length,
        });

        setRecentAuditLogs(audits);
      } catch (e: any) {
        setError(e.message || 'Failed to load report metrics');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <SkeletonPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            System Reports & Audit Summary
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform metrics, audit compliance, and system activity</p>
        </div>
      </div>

      {error && (
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        </Card>
      )}

      {!error && (
        <>
          {/* Key Metric Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-blue-50 rounded-lg text-blue-600">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <Badge variant="active">Pilot Completion</Badge>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-gray-900">
                  {summary.completedPilots} / {summary.totalPilots}
                </div>
                <p className="text-sm text-gray-500 mt-1">Pilots successfully completed</p>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <Badge variant="verified">Procurement Ready</Badge>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-gray-900">
                  {summary.readyProcurementCases} / {summary.totalProcurementCases}
                </div>
                <p className="text-sm text-gray-500 mt-1">DPR / Procurement readiness approvals</p>
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-amber-50 rounded-lg text-amber-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <Badge variant="warning">Issue Resolution</Badge>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-gray-900">
                  {summary.resolvedIssues} / {summary.totalIssues}
                </div>
                <p className="text-sm text-gray-500 mt-1">Platform issues resolved</p>
              </div>
            </Card>
          </div>

          {/* Audit Logs Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recent Audit Trail</h3>
                <p className="text-xs text-gray-500">Immutable ledger logs for key platform actions</p>
              </div>
              <span className="text-xs text-gray-500">{recentAuditLogs.length} recent events</span>
            </div>

            {recentAuditLogs.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                No audit log entries recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 font-semibold uppercase">
                      <th className="text-left px-4 py-2.5">Action</th>
                      <th className="text-left px-4 py-2.5">Actor Role</th>
                      <th className="text-left px-4 py-2.5">Entity</th>
                      <th className="text-left px-4 py-2.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentAuditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{log.action || 'System Action'}</td>
                        <td className="px-4 py-3 text-gray-600">
                          <Badge variant="secondary">{log.actor_role || 'system'}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600 capitalize">{log.entity_type || '—'}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {log.created_at ? formatDate(log.created_at) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
