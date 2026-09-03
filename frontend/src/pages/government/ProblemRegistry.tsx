import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { Problem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { toast } from 'react-hot-toast';
import { Sparkles, Plus, Search, Filter } from 'lucide-react';

export const ProblemRegistry: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sector, setSector] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/problems');
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setProblems(data);
    } catch (error) {
      toast.error('Failed to load problems.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter((p) => {
    if (filter !== 'All') {
      const f = filter.toLowerCase();
      if (f === 'active' && p.status !== 'pilot_active') return false;
      if (f !== 'active' && p.status !== f) return false;
    }
    if (sector && !p.sector?.toLowerCase().includes(sector.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      const match =
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.department?.name?.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Problem Registry"
          subtitle="Manage, structure, and publish public challenge statements for startup innovation."
        />
        <Button
          onClick={() => navigate('/government/problems/new')}
          className="bg-navy-900 hover:bg-navy-800 text-white flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Post a Problem
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select
          value={filter}
          onChange={(value) => setFilter(value)}
          options={[
            { label: 'All Status', value: 'All' },
            { label: 'Published (Open)', value: 'published' },
            { label: 'Draft', value: 'draft' },
            { label: 'Matched', value: 'matched' },
            { label: 'Pilot Active', value: 'pilot_active' },
            { label: 'Completed', value: 'completed' },
          ]}
        />
        <Select
          value={sector}
          onChange={(value) => setSector(value)}
          options={[
            { label: 'All Sectors', value: '' },
            { label: 'Smart Infrastructure & Mobility', value: 'Mobility' },
            { label: 'Water & Wastewater', value: 'Water' },
            { label: 'Healthcare', value: 'Healthcare' },
            { label: 'Agriculture', value: 'Agriculture' },
            { label: 'Clean Energy', value: 'Energy' },
            { label: 'Education & Skilling', value: 'Education' },
            { label: 'Governance & Smart Cities', value: 'Governance' },
          ]}
        />
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search problems, NHAI, location, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
      </div>

      {filteredProblems.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <p className="text-gray-500 mb-4">No problems found matching your filters.</p>
            <Button variant="secondary" onClick={() => navigate('/government/problems/new')}>
              Post a New Problem
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3
                    onClick={() => navigate(`/government/problems/${problem.id}`)}
                    className="font-bold text-lg text-navy-900 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {problem.title}
                  </h3>
                  <StatusBadge status={problem.status} />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="blue">{problem.department?.name || 'Department'}</Badge>
                  <Badge variant="gray">{problem.sector}</Badge>
                  {problem.location && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      📍 {problem.location}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>
                    <span className="font-medium text-gray-700">Budget:</span>{' '}
                    {problem.budget_min && problem.budget_max
                      ? `${formatCurrency(problem.budget_min)} – ${formatCurrency(problem.budget_max)}`
                      : 'On assessment'}
                  </p>
                  <p className="line-clamp-2">
                    <span className="font-medium text-gray-700">Outcome:</span> {problem.expected_outcome}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Pilot Duration:</span>{' '}
                    {problem.pilot_duration_days || 90} days
                  </p>
                  {problem.created_at && (
                    <p className="text-xs text-gray-400">
                      Created {formatDate(problem.created_at)}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/government/problems/${problem.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    size="sm"
                    className="bg-navy-900 hover:bg-navy-800 text-white flex items-center gap-1"
                    onClick={() => navigate(`/government/problems/${problem.id}/match`)}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    AI Matching
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemRegistry;
