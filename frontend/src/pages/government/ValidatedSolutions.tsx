import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ValidatedSolution } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { Spinner } from '../../components/ui/Spinner';
import { formatDate } from '../../lib/utils';
import { toast } from 'react-hot-toast';
import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Building2,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  Send,
} from 'lucide-react';

export const ValidatedSolutions: React.FC = () => {
  const [solutions, setSolutions] = useState<ValidatedSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  // Adoption modal
  const [selectedSolution, setSelectedSolution] = useState<ValidatedSolution | null>(null);
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);
  const [adoptNotes, setAdoptNotes] = useState('');
  const [submittingAdopt, setSubmittingAdopt] = useState(false);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/solutions');
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setSolutions(list);
    } catch (err) {
      toast.error('Failed to load solutions repository');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAISearch = async () => {
    if (!search.trim()) return;
    setIsSearchingAI(true);
    try {
      const res = await api.post('/api/solutions/search', { query: search });
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      if (list.length > 0) {
        setSolutions(list);
        toast.success(`AI identified ${list.length} relevant validated solutions!`);
      } else {
        toast('No direct semantic matches found. Showing standard results.');
      }
    } catch (err) {
      toast.error('AI search encountered an issue');
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleAdoptRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolution) return;
    try {
      setSubmittingAdopt(true);
      await api.post(`/api/solutions/${selectedSolution.id}/adopt`, {
        context_notes: adoptNotes || 'Interested in replicating pilot deployment in our jurisdiction under GFR 2017.',
      });
      toast.success('Cross-department adoption request submitted!');
      setAdoptModalOpen(false);
      setAdoptNotes('');
    } catch (err) {
      toast.error('Failed to submit adoption request');
    } finally {
      setSubmittingAdopt(false);
    }
  };

  const filteredSolutions = solutions.filter((s) => {
    if (sector && !s.sector?.toLowerCase().includes(sector.toLowerCase())) return false;
    if (
      search &&
      !isSearchingAI &&
      !s.solution_name?.toLowerCase().includes(search.toLowerCase()) &&
      !s.problem_description?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-16 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="National Validated Solutions Repository"
        subtitle="Pilot Once → Verify → Reuse → Scale. Replicate proven startup innovations across state & central departments without repeat trials."
      />

      {/* Advisory Banner */}
      <Card className="bg-gradient-to-r from-navy-900 via-blue-900 to-navy-800 text-white border-0 shadow-md p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Statutory Inter-Departmental Reusability
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">Don't reinvent the wheel.</h2>
            <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
              Explore solutions that have successfully completed structured government pilots with third-party field inspection, telemetry KPIs, and statutory compliance under GFR 2017. Fast-track adoption in your department.
            </p>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-xl text-center backdrop-blur-xs shrink-0 border border-white/10">
            <div className="text-3xl font-extrabold text-white">{solutions.length}</div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-blue-200 mt-0.5">
              Verified Solutions
            </div>
          </div>
        </div>
      </Card>

      {/* Search & Sector Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by problem, technology, startup, or deployment location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
          />
        </div>
        <Select
          value={sector}
          onChange={(value) => setSector(value)}
          options={[
            { label: 'All Sectors', value: '' },
            { label: 'Water & Wastewater', value: 'Water' },
            { label: 'Smart Infrastructure & Mobility', value: 'Mobility' },
            { label: 'Healthcare', value: 'Healthcare' },
            { label: 'Agriculture', value: 'Agriculture' },
            { label: 'Clean Energy', value: 'Energy' },
            { label: 'Governance & Smart Cities', value: 'Governance' },
          ]}
        />
        <Button
          onClick={handleAISearch}
          disabled={isSearchingAI || !search.trim()}
          className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 flex items-center justify-center gap-1.5 shrink-0"
        >
          {isSearchingAI ? (
            <Spinner size="sm" />
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Semantic Search
            </>
          )}
        </Button>
      </div>

      {/* Solutions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSolutions.map((sol) => (
          <Card
            key={sol.id}
            className="p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <Badge variant="blue" className="text-xs">
                  {sol.sector}
                </Badge>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Procurement Verified
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-navy-900 leading-snug">{sol.solution_name}</h3>
                <p className="text-xs font-semibold text-blue-700 mt-0.5">{sol.startup?.name || 'Partner Startup'}</p>
              </div>

              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{sol.problem_description}</p>

              {/* Technologies */}
              {sol.technologies && sol.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {sol.technologies.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* KPI Score Box */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">KPI Target Achieved</span>
                  <span className="text-xs text-gray-500">Exceeded baseline</span>
                </div>
                <span className="text-xl font-extrabold text-emerald-600">{sol.kpi_achievement_percent}%</span>
              </div>

              <div className="space-y-1 text-xs text-gray-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>Deployment: {sol.deployment_location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{sol.department?.name || 'Department'}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => {
                  setSelectedSolution(sol);
                  setAdoptModalOpen(true);
                }}
              >
                Request Adoption
              </Button>
            </div>
          </Card>
        ))}

        {filteredSolutions.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-navy-900 mb-1">No Validated Solutions Found</h3>
            <p className="text-xs text-gray-500">Try changing your search keywords or sector filter.</p>
          </div>
        )}
      </div>

      {/* Adoption Request Modal */}
      <Modal
        isOpen={adoptModalOpen}
        onClose={() => setAdoptModalOpen(false)}
        title={`Request Adoption: ${selectedSolution?.solution_name}`}
      >
        <form onSubmit={handleAdoptRequest} className="space-y-4 pt-2 text-xs">
          <p className="text-gray-600">
            Submit an official request to adopt this pre-validated solution in your department under GFR 2017 cross-department scaling provisions.
          </p>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-1">
            <span className="font-bold text-blue-950">Original Pilot Department:</span>
            <p className="text-blue-900">{selectedSolution?.department?.name || 'Partner Department'}</p>
            <span className="font-bold text-blue-950 block pt-1">Validated Vendor:</span>
            <p className="text-blue-900">{selectedSolution?.startup?.name || 'Startup'}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Context Notes & Jurisdictional Requirement
            </label>
            <Textarea
              rows={4}
              required
              value={adoptNotes}
              onChange={(e) => setAdoptNotes(e.target.value)}
              placeholder="Detail your department's jurisdiction, expected scale, and implementation timeline..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => setAdoptModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submittingAdopt}
              className="bg-navy-900 text-white flex items-center gap-1.5"
            >
              {submittingAdopt ? <Spinner size="sm" /> : <Send className="w-3.5 h-3.5" />} Submit Adoption Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ValidatedSolutions;
