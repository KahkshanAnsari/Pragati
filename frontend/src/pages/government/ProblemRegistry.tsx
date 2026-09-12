import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { Problem } from '../../types';
import { formatCurrency, formatDate } from '../../lib/utils';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { CardSkeletonGrid } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { toast } from 'react-hot-toast';
import { Sparkles, Plus, Search, MapPin, Building2, IndianRupee, Clock } from 'lucide-react';

export const ProblemRegistry: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sector, setSector] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProblems(); }, []);

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

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Problem Registry"
        subtitle="Government challenge marketplace for startup innovation"
        actions={
          <Button onClick={() => navigate('/government/problems/new')}>
            <Plus className="w-4 h-4 mr-1.5" /> Post a Problem
          </Button>
        }
      />

      {/* Filters */}
      <Card padding="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search problems, departments, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Select
            value={filter}
            onChange={(value) => setFilter(value)}
            options={[
              { label: 'All Status', value: 'All' },
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Pilot Active', value: 'pilot_active' },
              { label: 'Completed', value: 'completed' },
            ]}
          />
          <Select
            value={sector}
            onChange={(value) => setSector(value)}
            options={[
              { label: 'All Sectors', value: '' },
              { label: 'Water', value: 'Water' },
              { label: 'Transport', value: 'Transport' },
              { label: 'Healthcare', value: 'Healthcare' },
              { label: 'Agriculture', value: 'Agriculture' },
              { label: 'Energy', value: 'Energy' },
              { label: 'Education', value: 'Education' },
              { label: 'Governance', value: 'Governance' },
            ]}
          />
          {(search || filter !== 'All' || sector) && (
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilter('All'); setSector(''); }}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-slate-500">{filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found</p>
      )}

      {/* Content */}
      {loading ? (
        <CardSkeletonGrid count={6} />
      ) : filteredProblems.length === 0 ? (
        <EmptyState
          variant="search"
          title="No problems found"
          description="Try adjusting your filters or post a new challenge."
          action={{ label: 'Post a Problem', onClick: () => navigate('/government/problems/new') }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProblems.map((problem, i) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Card hover padding="p-5" className="flex flex-col h-full">
                {/* Top: Status + Sector */}
                <div className="flex items-center justify-between mb-2 gap-2">
                  <StatusBadge status={problem.status} />
                  <Badge variant="blue">{problem.sector || 'General'}</Badge>
                </div>

                {/* Title */}
                <h3
                  className="text-sm font-extrabold text-slate-900 tracking-tight mb-1.5 line-clamp-2 hover:text-navy-700 cursor-pointer transition-colors"
                  onClick={() => navigate(`/government/problems/${problem.id}`)}
                >
                  {problem.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">
                  {problem.description || problem.expected_outcome}
                </p>

                {/* Meta */}
                <div className="space-y-1.5 mb-4">
                  {problem.department?.name && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{problem.department.name}</span>
                    </div>
                  )}
                  {problem.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {problem.location}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    {(problem.budget_min || problem.budget_max) && (
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-slate-400" />
                        {problem.budget_min && problem.budget_max
                          ? `${formatCurrency(problem.budget_min)} - ${formatCurrency(problem.budget_max)}`
                          : 'TBD'}
                      </span>
                    )}
                    {problem.pilot_duration_days && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {problem.pilot_duration_days}d
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <Button variant="outline" size="xs" className="flex-1" onClick={() => navigate(`/government/problems/${problem.id}`)}>
                    View
                  </Button>
                  <Button variant="accent" size="xs" className="flex-1" onClick={() => navigate(`/government/problems/${problem.id}/match`)}>
                    <Sparkles className="w-3 h-3 mr-1" /> AI Match
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemRegistry;
