import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Tag, Briefcase, IndianRupee, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Problem, Application } from '../../types';
import { api } from '../../lib/api';
import { formatCurrency } from '../../lib/utils';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';

const SECTORS = [
  'All Sectors',
  'Smart Infrastructure & Mobility',
  'Water & Wastewater',
  'Healthcare',
  'Agriculture',
  'Clean Energy',
  'Education & Skilling',
  'Governance & Smart Cities',
  'Waste Management',
];

export const DiscoverProblems: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [userApplications, setUserApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All Sectors');
  const [locationFilter, setLocationFilter] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProblemsAndApplications();
  }, []);

  const fetchProblemsAndApplications = async () => {
    try {
      setLoading(true);
      // Fetch open/published problems as well as user's existing applications
      const [probRes, appsRes] = await Promise.all([
        api.get('/api/problems'),
        api.get('/api/applications?startup_id=mine').catch(() => ({ data: [] })),
      ]);

      const rawProblems = Array.isArray(probRes.data) ? probRes.data : (probRes.data?.data || []);
      // Filter out pure draft problems from discover view, keep published, matched, pilot_active
      const visibleProblems = rawProblems.filter((p: Problem) => p.status !== 'draft');
      setProblems(visibleProblems);

      const apps = Array.isArray(appsRes.data) ? appsRes.data : (appsRes.data?.data || []);
      setUserApplications(apps);
    } catch (error) {
      toast.error('Failed to fetch problems');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const appliedProblemIds = new Set(userApplications.map((a) => a.problem_id));

  // Multi-dimensional search & filter
  const filteredProblems = problems.filter((p) => {
    // 1. Text Search across Title, Description, Department, Location, Sector, Tech, Capabilities
    const sTerm = searchTerm.trim().toLowerCase();
    let matchesSearch = true;
    if (sTerm) {
      const searchFields = [
        p.title || '',
        p.description || '',
        p.department?.name || '',
        p.location || '',
        p.sector || '',
        p.expected_outcome || '',
        ...(p.required_technologies || []),
        ...(p.required_capabilities || []),
      ].join(' ').toLowerCase();

      matchesSearch = searchFields.includes(sTerm);
    }

    // 2. Sector Filter (case-insensitive fuzzy/contains)
    let matchesSector = true;
    if (sectorFilter && sectorFilter !== 'All Sectors') {
      const selected = sectorFilter.toLowerCase();
      const pSector = (p.sector || '').toLowerCase();
      matchesSector =
        pSector === selected ||
        pSector.includes(selected) ||
        selected.includes(pSector) ||
        (selected.includes('water') && pSector.includes('water')) ||
        (selected.includes('mobility') && (pSector.includes('mobility') || pSector.includes('infrastructure'))) ||
        (selected.includes('health') && pSector.includes('health')) ||
        (selected.includes('agri') && pSector.includes('agri')) ||
        (selected.includes('energy') && pSector.includes('energy')) ||
        (selected.includes('edu') && pSector.includes('edu')) ||
        (selected.includes('governance') && (pSector.includes('governance') || pSector.includes('smart cit')));
    }

    // 3. Location Filter
    const locTerm = locationFilter.trim().toLowerCase();
    let matchesLocation = true;
    if (locTerm) {
      const pLoc = (p.location || '').toLowerCase();
      matchesLocation = pLoc.includes(locTerm);
    }

    return matchesSearch && matchesSector && matchesLocation;
  });

  // Highlight Open/Published problems first
  const publishedProblems = filteredProblems.filter((p) => p.status === 'published');
  const otherProblems = filteredProblems.filter((p) => p.status !== 'published');

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Problems"
        subtitle="Explore open government challenges and apply for funded pilot deployments."
      />

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Text Search */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by keywords, department (NHAI, BMC...), technology (Computer Vision, IoT)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          {/* Sector Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SECTORS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Location Search */}
          <div className="md:col-span-3 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Filter location (Mumbai, NH-44...)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
        </div>

        {/* Active Filters Summary & Reset */}
        {(searchTerm || (sectorFilter && sectorFilter !== 'All Sectors') || locationFilter) && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <span>
              Showing <strong>{filteredProblems.length}</strong> matching problem
              {filteredProblems.length === 1 ? '' : 's'}
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setSectorFilter('All Sectors');
                setLocationFilter('');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </Card>

      {/* Published / Open for Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
            Open for Applications
            <span className="text-xs font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {publishedProblems.length} Available
            </span>
          </h2>
        </div>

        {publishedProblems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">
              No open problems found matching your search filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {publishedProblems.map((p) => (
              <ProblemCard
                key={p.id}
                problem={p}
                hasApplied={appliedProblemIds.has(p.id)}
                onViewDetails={() => navigate(`/startup/problems/${p.id}`)}
                onApply={() => navigate(`/startup/problems/${p.id}/apply`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Active / Ongoing Pilot Problems Section */}
      {otherProblems.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            Active Pilots & Completed Challenges
            <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {otherProblems.length} Underway
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {otherProblems.map((p) => (
              <ProblemCard
                key={p.id}
                problem={p}
                hasApplied={appliedProblemIds.has(p.id)}
                onViewDetails={() => navigate(`/startup/problems/${p.id}`)}
                onApply={() => navigate(`/startup/problems/${p.id}/apply`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ProblemCardProps {
  problem: Problem;
  hasApplied: boolean;
  onViewDetails: () => void;
  onApply: () => void;
}

const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  hasApplied,
  onViewDetails,
  onApply,
}) => {
  const isPublished = problem.status === 'published';

  return (
    <Card
      className={`p-6 transition-all hover:shadow-md border border-gray-200 ${
        isPublished ? 'hover:border-blue-300' : 'bg-gray-50/50'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                  {problem.sector}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {problem.location}
                </span>
              </div>
              <h3
                onClick={onViewDetails}
                className="text-lg font-bold text-navy-900 hover:text-blue-600 cursor-pointer transition-colors"
              >
                {problem.title}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-medium text-gray-800">
                  {problem.department?.name || 'Government Department'}
                </span>
              </p>
            </div>

            <div className="shrink-0">
              {hasApplied ? (
                <Badge variant="warning" className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Application Submitted
                </Badge>
              ) : isPublished ? (
                <Badge variant="success">Open for Applications</Badge>
              ) : (
                <Badge variant="secondary" className="capitalize">
                  {problem.status.replace('_', ' ')}
                </Badge>
              )}
            </div>
          </div>

          <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
            {problem.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pt-1">
            <div className="flex items-center gap-1 font-semibold text-navy-900">
              <IndianRupee className="w-4 h-4 text-gray-500" />
              <span>
                {problem.budget_min && problem.budget_max
                  ? `${formatCurrency(problem.budget_min)} – ${formatCurrency(problem.budget_max)}`
                  : 'Budget on assessment'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3" />
              Pilot: {problem.pilot_duration_days || 90} days
            </div>
            {problem.required_technologies && problem.required_technologies.slice(0, 3).map((tech, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-2 w-full md:w-44 shrink-0 pt-2 md:pt-0">
          <Button
            variant="secondary"
            className="flex-1 md:w-full text-sm"
            onClick={onViewDetails}
          >
            View Details
          </Button>

          {hasApplied ? (
            <Button
              className="flex-1 md:w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              onClick={() => onViewDetails()}
            >
              Check Status
            </Button>
          ) : (
            <Button
              className="flex-1 md:w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
              onClick={onApply}
              disabled={!isPublished}
            >
              Apply Now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DiscoverProblems;
