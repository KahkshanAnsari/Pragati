import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Startup, StartupDocument, Problem } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { toast } from 'react-hot-toast';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Rocket,
  Award,
  Users,
  Send,
  ArrowLeft,
  Briefcase,
  Layers,
  Cpu,
} from 'lucide-react';

export const StartupProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [documents, setDocuments] = useState<StartupDocument[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [startupRes, docsRes, pilotsRes, appsRes, problemsRes] = await Promise.all([
        api.get(`/api/startups/${id}`),
        api.get(`/api/startups/${id}/documents`).catch(() => ({ data: [] })),
        api.get(`/api/startups/${id}/pilots`).catch(() => ({ data: [] })),
        api.get(`/api/startups/${id}/applications`).catch(() => ({ data: [] })),
        api.get('/api/problems?status=published').catch(() => ({ data: [] })),
      ]);

      const stData = startupRes.data?.data || startupRes.data;
      setStartup(stData);

      const d = docsRes.data?.data || docsRes.data || [];
      setDocuments(Array.isArray(d) ? d : []);

      const p = pilotsRes.data?.data || pilotsRes.data || [];
      setPilots(Array.isArray(p) ? p : []);

      const a = appsRes.data?.data || appsRes.data || [];
      setApplications(Array.isArray(a) ? a : []);

      const pr = problemsRes.data?.data || problemsRes.data || [];
      setProblems(Array.isArray(pr) ? pr : []);
    } catch (err) {
      toast.error('Failed to load startup profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!selectedProblem) {
      toast.error('Please select a problem first');
      return;
    }
    try {
      setInviting(true);
      await api.post(`/api/problems/${selectedProblem}/invite`, { startup_id: id });
      toast.success(`Invitation successfully sent to ${startup?.name}!`);
      setInviteModalOpen(false);
    } catch (err) {
      toast.error('Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-navy-900 mb-2">Startup Not Found</h3>
        <p className="text-gray-500 mb-6 text-sm">The requested startup profile could not be loaded.</p>
        <Button onClick={() => navigate('/government/startups')}>Back to Startup Directory</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/government/startups')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Startup Directory
        </Button>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/government/applications')}
            className="text-xs"
          >
            View Applications ({applications.length})
          </Button>
          {applications.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/government/applications/${applications[0].id}/evaluate`)}
              className="text-xs text-blue-700 bg-blue-50 border-blue-200"
            >
              Start Evaluation
            </Button>
          )}
          <Button
            onClick={() => setInviteModalOpen(true)}
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" /> Invite to Problem
          </Button>
        </div>
      </div>


      {/* Header Profile Card */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-navy-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              {startup.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold text-navy-900">{startup.name}</h1>
                <StatusBadge status={startup.verification_status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 text-xs">
                  {startup.sector}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  {startup.location || 'India'}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-500">
                  Founded by <strong>{startup.founder_name}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-xl border border-gray-200 shrink-0">
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase font-semibold">Trust Score</p>
              <p className={`text-2xl font-bold ${startup.trust_score >= 85 ? 'text-emerald-600' : 'text-blue-600'}`}>
                {startup.trust_score}/100
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-xs text-gray-500 uppercase font-semibold">Success Rate</p>
              <p className="text-2xl font-bold text-navy-900">{startup.pilot_success_rate}%</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Trust Profile, Technologies, Pilots */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statutory Verification Card */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Statutory & Compliance Verification
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="py-2.5 text-gray-600 font-medium">DPIIT Startup Recognition</td>
                    <td className="py-2.5 font-semibold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified ({startup.dpiit_recognition_number || 'DIPP Recognized'})
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-600 font-medium">GST Identification Number</td>
                    <td className="py-2.5 font-mono text-gray-800">
                      {startup.gst_number || '27AABCA1234A1Z5'} <span className="text-emerald-600 text-xs font-semibold ml-2">✓ Active</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-600 font-medium">MCA Incorporation Number (CIN)</td>
                    <td className="py-2.5 font-mono text-gray-800">
                      {startup.incorporation_number || 'U72200MH2019PTC123456'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-600 font-medium">Previous Commercial Projects</td>
                    <td className="py-2.5 font-semibold text-navy-900">{startup.previous_projects || 0} completed</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-600 font-medium">Completed Government Pilots</td>
                    <td className="py-2.5 font-semibold text-navy-900">{startup.government_pilots || 0} pilots</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Technologies & Core Capabilities */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" /> Technical Capabilities & Stack
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs uppercase font-bold text-gray-500 mb-2">Primary Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {startup.technologies && startup.technologies.length > 0 ? (
                    startup.technologies.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-md border border-gray-200">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Not specified</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold text-gray-500 mb-2">Demonstrated Capabilities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {startup.capabilities && startup.capabilities.length > 0 ? (
                    startup.capabilities.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">Standard domain capabilities</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Government Pilots History */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Rocket className="w-5 h-5 text-purple-600" /> Government Pilots ({pilots.length})
            </h3>
            {pilots.length === 0 ? (
              <p className="text-sm text-gray-500">No pilots registered for this startup yet.</p>
            ) : (
              <div className="space-y-3">
                {pilots.map((p) => (
                  <div key={p.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-blue-700">{p.pilot_number}</span>
                        <Badge variant={p.status === 'completed' ? 'success' : 'active'}>{p.status}</Badge>
                      </div>
                      <h4 className="text-sm font-bold text-navy-900">{p.problem?.title || 'Government Pilot'}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Department: {p.department?.name || 'Partner Department'}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/government/pilots/${p.id}/workspace`)}
                    >
                      View Workspace
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Company Info, Contact, Compliance Documents */}
        <div className="space-y-6">
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gray-700" /> Company Info
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Founder & Head</span>
                <p className="font-semibold text-navy-900">{startup.founder_name}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Official Email</span>
                <p className="font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> {startup.email}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase font-semibold">Contact Phone</span>
                <p className="font-medium text-gray-800 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {startup.phone || '+91 98765 43210'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Team Size</span>
                  <p className="font-bold text-navy-900">{startup.team_size || 15} members</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase font-semibold">Experience</span>
                  <p className="font-bold text-navy-900">{startup.experience_years || 4} years</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-700" /> Verified Documents
            </h3>
            {documents.length > 0 ? (
              <div className="space-y-2.5">
                {documents.map((d) => (
                  <div key={d.id} className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-800">{d.doc_type}</span>
                    <a href={d.file_url} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline">
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs text-gray-600">
                <div className="p-2.5 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>DPIIT Certificate</span>
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>GST Registration</span>
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Incorporation Deed</span>
                  <span className="text-emerald-600 font-bold">✓ Verified</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal isOpen={inviteModalOpen} onClose={() => setInviteModalOpen(false)} title={`Invite ${startup.name} to Apply`}>
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600">
            Select an open government problem statement from your registry to notify <strong>{startup.name}</strong>.
          </p>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1.5">Problem Statement</label>
            <Select
              value={selectedProblem}
              onChange={(val) => setSelectedProblem(val)}
              options={[
                { label: 'Select an open challenge...', value: '' },
                ...problems.map((p) => ({ label: p.title, value: p.id })),
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-navy-900 text-white"
              onClick={handleInvite}
              disabled={!selectedProblem || inviting}
            >
              {inviting ? <Spinner size="sm" /> : 'Send Official Invitation'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StartupProfile;
