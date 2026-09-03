import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Problem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';
import { formatCurrency } from '../../lib/utils';
import {
  Sparkles,
  Search,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const AIMatchingLanding: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const sectors = [
    'All',
    'Smart Infrastructure & Mobility',
    'Water & Wastewater',
    'Healthcare',
    'Agriculture',
    'Clean Energy',
    'Education & Skilling',
    'Governance & Smart Cities',
  ];

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/problems');
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setProblems(data);
    } catch (err) {
      toast.error('Failed to load government challenges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter((p) => {
    const matchesSector =
      selectedSector === 'All' ||
      (p.sector && p.sector.toLowerCase().includes(selectedSector.toLowerCase())) ||
      (selectedSector.includes('&') && p.sector && selectedSector.split('&').some(s => p.sector.toLowerCase().includes(s.trim().toLowerCase())));

    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.title.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.location && p.location.toLowerCase().includes(term)) ||
      (p.department?.name && p.department.name.toLowerCase().includes(term)) ||
      (p.required_technologies && p.required_technologies.some(t => t.toLowerCase().includes(term))) ||
      (p.required_capabilities && p.required_capabilities.some(c => c.toLowerCase().includes(term)));

    return matchesSector && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-white/20 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" /> 6-DIMENSION SEMANTIC MATCHING ENGINE
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            AI Startup Matching
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Select a Government Challenge to find the most relevant startups. Our multidimensional
            matching engine analyzes verified capabilities, technologies, and past project track records.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search challenges by title, department, location, or required tech..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px] uppercase mr-1 shrink-0">
            Sector:
          </span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all text-xs cursor-pointer ${
                selectedSector === sec
                  ? 'bg-navy-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Problems List */}
      {loading ? (
        <div className="p-16 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : filteredProblems.length === 0 ? (
        <Card className="p-12 text-center bg-white border border-dashed border-slate-300">
          <CardContent className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900">No Challenges Found</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              No government challenges matched your filter criteria. Try selecting another sector or clearing your search term.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedSector('All');
                setSearch('');
              }}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredProblems.map((problem) => (
            <Card
              key={problem.id}
              className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Sector & Department */}
                <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
                  <Badge variant="blue" className="text-xs font-semibold">
                    {problem.sector}
                  </Badge>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {problem.department?.name || 'Government Authority'}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-navy-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {problem.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      {problem.location || 'India'}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {problem.pilot_duration_days || problem.timeline_days || 90} Days Sandbox
                    </span>
                  </div>
                </div>

                {/* Required Technologies */}
                {problem.required_technologies && problem.required_technologies.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Required Technologies
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {problem.required_technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Capabilities */}
                {problem.required_capabilities && problem.required_capabilities.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Required Capabilities
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {problem.required_capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] font-medium border border-indigo-200"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Budget */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                  <span className="text-slate-400 font-medium">Estimated Pilot Budget:</span>
                  <span className="font-extrabold text-navy-900">
                    {problem.budget_min && problem.budget_max
                      ? `${formatCurrency(problem.budget_min)} – ${formatCurrency(problem.budget_max)}`
                      : 'To be determined'}
                  </span>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/government/problems/${problem.id}`)}
                  className="text-xs text-slate-600 hover:text-navy-900 p-0 hover:bg-transparent"
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate(`/government/problems/${problem.id}/match`)}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Run AI Matching
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIMatchingLanding;
