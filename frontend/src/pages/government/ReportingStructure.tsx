import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import {
  ShieldCheck,
  Users,
  UserCheck,
  ClipboardList,
  CheckCircle2,
  FileText,
  Upload,
  Eye,
  Send,
  AlertCircle,
  Building2,
} from 'lucide-react';

const HIERARCHY = [
  {
    roleKey: 'nodal',
    title: 'Nodal Officer',
    subtitle: 'Joint Commissioner / Department Head',
    level: 1,
    colorBg: 'bg-navy-900',
    colorBorder: 'border-navy-900',
    colorText: 'text-white',
    colorBadgeBg: 'bg-blue-800/60',
    colorBadgeText: 'text-blue-200',
    icon: ShieldCheck,
    description: 'Department-level oversight and final procurement authority',
    responsibilities: [
      'Create and release government challenge statements',
      'Assign supervisors and oversee field officer teams',
      'Review department-level pilot progress reports',
      'Review and validate pilot outcome reports',
      'Take final department-level decision for adoption and procurement',
    ],
  },
  {
    roleKey: 'supervisor',
    title: 'Supervisor',
    subtitle: 'Deputy / Section Officer',
    level: 2,
    colorBg: 'bg-blue-700',
    colorBorder: 'border-blue-700',
    colorText: 'text-white',
    colorBadgeBg: 'bg-blue-600/60',
    colorBadgeText: 'text-blue-100',
    icon: Users,
    description: 'Monitoring and quality review of field officer submissions',
    responsibilities: [
      'View assigned field officers and their active pilots',
      'Monitor progress of pilots under their jurisdiction',
      'Review field observation reports submitted by field officers',
      'Verify field reports against evidence and inspection data',
      'Send field reports back for correction if evidence is insufficient',
      'Approve field reports for higher-level (Nodal Officer) review',
    ],
  },
  {
    roleKey: 'field',
    title: 'Field / Reporting Officer',
    subtitle: 'Field Inspector / Reporting Officer',
    level: 3,
    colorBg: 'bg-slate-700',
    colorBorder: 'border-slate-700',
    colorText: 'text-white',
    colorBadgeBg: 'bg-slate-600/60',
    colorBadgeText: 'text-slate-200',
    icon: UserCheck,
    description: 'On-ground inspection, KPI measurement and evidence submission',
    responsibilities: [
      'View assigned challenges and active pilot deployments',
      'Conduct field inspections at pilot deployment sites',
      'Enter KPI observations and measurements',
      'Upload evidence (photographs, documents, sensor data)',
      'Submit field observation reports to assigned supervisor',
    ],
  },
];

const ROLE_ACTIONS: Record<string, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }[]> = {
  nodal: [
    { icon: FileText, label: 'Post Government Problem', color: 'text-emerald-400' },
    { icon: Users, label: 'Assign Officers', color: 'text-blue-300' },
    { icon: Eye, label: 'Review Pilot Reports', color: 'text-purple-300' },
    { icon: CheckCircle2, label: 'Approve Adoption', color: 'text-amber-300' },
  ],
  supervisor: [
    { icon: Eye, label: 'Monitor Field Officers', color: 'text-blue-300' },
    { icon: ClipboardList, label: 'Review Field Reports', color: 'text-purple-300' },
    { icon: CheckCircle2, label: 'Approve Report', color: 'text-emerald-300' },
    { icon: AlertCircle, label: 'Send Back for Correction', color: 'text-amber-300' },
  ],
  field: [
    { icon: Eye, label: 'View Assigned Pilots', color: 'text-blue-300' },
    { icon: ClipboardList, label: 'Conduct Field Inspection', color: 'text-purple-300' },
    { icon: Upload, label: 'Upload Evidence', color: 'text-emerald-300' },
    { icon: Send, label: 'Submit Report to Supervisor', color: 'text-amber-300' },
  ],
};

// Demo data for the hierarchy display (prototype / illustration)
const DEMO_HIERARCHY = {
  nodal: { name: 'Rajesh Kumar', designation: 'Joint Commissioner', department: 'Water Resources Dept., Nagpur' },
  supervisor: { name: 'Sneha Patil', designation: 'Deputy Section Officer', department: 'Water Resources Dept., Nagpur' },
  field: { name: 'Arjun Mehta', designation: 'Field Inspector', department: 'Water Resources Dept., Nagpur' },
};

export function ReportingStructure() {
  const { profile } = useAuthStore();
  const officerProfile = profile as { name?: string; designation?: string; department?: { name?: string } } | null;

  // Determine the current user's role level for display (prototype — uses designation keyword matching)
  const designation = (officerProfile?.designation || '').toLowerCase();
  let currentRoleKey = 'nodal';
  if (designation.includes('deputy') || designation.includes('section') || designation.includes('supervisor')) {
    currentRoleKey = 'supervisor';
  } else if (designation.includes('field') || designation.includes('inspector') || designation.includes('reporting')) {
    currentRoleKey = 'field';
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Officer Reporting Structure"
        subtitle="PRAGATI Government Portal — Prototype role hierarchy for pilot monitoring, field reporting, and departmental oversight."
      />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-amber-800">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Prototype Notice:</strong> This is a demo role hierarchy for the PRAGATI pilot monitoring system. It illustrates the conceptual reporting structure using existing sample accounts. It does not represent a real government HR or authorization system.
        </p>
      </div>

      {/* My Role Card */}
      <Card className="p-5 border border-blue-200 bg-blue-50/60 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {officerProfile?.name?.charAt(0) || 'O'}
          </div>
          <div>
            <p className="text-xs font-bold text-navy-900">
              {officerProfile?.name || 'Government Officer'}
            </p>
            <p className="text-[11px] text-gray-500">
              {officerProfile?.designation || 'Joint Commissioner'} &nbsp;•&nbsp; {officerProfile?.department?.name || 'Water Resources Dept., Nagpur'}
            </p>
          </div>
          <span className="ml-auto text-[11px] font-bold bg-navy-900 text-white px-3 py-1 rounded-full">
            {currentRoleKey === 'nodal' ? 'Nodal Officer' : currentRoleKey === 'supervisor' ? 'Supervisor' : 'Field Officer'}
          </span>
        </div>
        <div className="bg-white rounded-lg border border-blue-100 p-3 text-xs text-gray-700">
          <span className="font-semibold text-blue-800 block mb-1">Your Role in this Hierarchy</span>
          {currentRoleKey === 'nodal' && 'You have department-level oversight. You can create challenges, review all pilot progress, and take final procurement decisions.'}
          {currentRoleKey === 'supervisor' && 'You supervise a team of field officers. You review, verify, approve or return their field observation reports.'}
          {currentRoleKey === 'field' && 'You conduct field inspections and submit observation reports to your assigned supervisor.'}
        </div>
      </Card>

      {/* Visual Hierarchy */}
      <div>
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" /> Reporting Structure
        </h2>

        <div className="space-y-0">
          {HIERARCHY.map((role, idx) => {
            const Icon = role.icon;
            const isCurrentUser = role.roleKey === currentRoleKey;
            const actions = ROLE_ACTIONS[role.roleKey];
            const demoOfficer = DEMO_HIERARCHY[role.roleKey as keyof typeof DEMO_HIERARCHY];

            return (
              <div key={role.roleKey}>
                {/* Card */}
                <div
                  className={`relative rounded-2xl border-2 transition-all ${
                    isCurrentUser
                      ? `${role.colorBorder} shadow-md ring-2 ring-offset-2 ring-blue-300`
                      : 'border-gray-200 shadow-sm'
                  }`}
                >
                  {/* Level indicator */}
                  <div className={`${role.colorBg} ${role.colorText} rounded-t-xl px-5 py-3 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm">{role.title}</span>
                          {isCurrentUser && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${role.colorBadgeBg} ${role.colorBadgeText} border border-white/20`}>
                              YOUR ROLE
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] ${role.colorBadgeText} mt-0.5`}>{role.subtitle}</p>
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${role.colorBadgeBg} ${role.colorBadgeText}`}>
                      Level {role.level}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-white rounded-b-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Description */}
                    <div className="md:col-span-1">
                      <p className="text-[11px] text-gray-500 font-semibold uppercase mb-1">Role Description</p>
                      <p className="text-xs text-gray-700 leading-relaxed">{role.description}</p>

                      {/* Demo officer chip */}
                      <div className="mt-3 flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          {demoOfficer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-gray-800">{demoOfficer.name}</p>
                          <p className="text-[10px] text-gray-500">{demoOfficer.designation}</p>
                        </div>
                        <span className="ml-auto text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          Demo
                        </span>
                      </div>
                    </div>

                    {/* Responsibilities */}
                    <div className="md:col-span-1">
                      <p className="text-[11px] text-gray-500 font-semibold uppercase mb-2">Key Responsibilities</p>
                      <ul className="space-y-1.5">
                        {role.responsibilities.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="md:col-span-1">
                      <p className="text-[11px] text-gray-500 font-semibold uppercase mb-2">Portal Actions</p>
                      <div className="space-y-2">
                        {actions.map((a, i) => {
                          const AIcon = a.icon;
                          return (
                            <div key={i} className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-xs text-gray-800 font-medium">
                              <AIcon className={`w-3.5 h-3.5 shrink-0 ${a.color}`} />
                              <span>{a.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector line between levels */}
                {idx < HIERARCHY.length - 1 && (
                  <div className="flex flex-col items-center py-2">
                    <div className="w-px h-5 bg-gray-300" />
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider bg-white border border-gray-200 px-3 py-0.5 rounded-full">
                      reports to
                    </div>
                    <div className="w-px h-5 bg-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Table */}
      <Card className="p-5 border border-gray-200 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-blue-600" /> Role Comparison Summary
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Capability</th>
                <th className="text-center py-2 px-3 font-bold text-navy-900 text-[10px] uppercase">Nodal Officer</th>
                <th className="text-center py-2 px-3 font-bold text-blue-700 text-[10px] uppercase">Supervisor</th>
                <th className="text-center py-2 px-3 font-bold text-slate-700 text-[10px] uppercase">Field Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ['Post Government Problems', true, false, false],
                ['Assign Officers', true, false, false],
                ['View All Pilots', true, true, false],
                ['Conduct Field Inspection', false, false, true],
                ['Upload Evidence', false, false, true],
                ['Submit Field Reports', false, false, true],
                ['Review Field Reports', true, true, false],
                ['Approve Field Reports', true, true, false],
                ['Send Report Back', false, true, false],
                ['Approve Procurement/Adoption', true, false, false],
              ].map(([cap, nodal, sup, field]) => (
                <tr key={String(cap)} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2 pr-4 text-gray-700 font-medium">{cap as string}</td>
                  {[nodal, sup, field].map((val, i) => (
                    <td key={i} className="text-center py-2 px-3">
                      {val ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300 font-bold text-base leading-none">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default ReportingStructure;
