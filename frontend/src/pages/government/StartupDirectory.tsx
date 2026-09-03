import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { Startup } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Spinner } from '../../components/ui/Spinner';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { toast } from 'react-hot-toast';

export const StartupDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await api.get('/api/startups');
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        setStartups(data);
      } catch (err) {
        toast.error('Failed to load startups');
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, []);

  const filteredStartups = startups.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (sector && !s.sector?.toLowerCase().includes(sector.toLowerCase())) return false;
    if (status && s.verification_status !== status) return false;
    return true;
  });

  if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <PageHeader title="Startup Directory" subtitle="Browse and discover verified startups." />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          className="flex-grow"
          placeholder="Search startups by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            { label: 'Education & Skilling', value: 'Education' },
            { label: 'Governance & Smart Cities', value: 'Governance' },
          ]}
        />
        <Select 
          value={status}
          onChange={(value) => setStatus(value)}
          options={[
            { label: 'All Statuses', value: '' },
            { label: 'Verified', value: 'verified' },
            { label: 'Pending Review', value: 'pending' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStartups.map(startup => (
          <Card key={startup.id} className="hover:border-navy-200 transition-colors cursor-pointer" onClick={() => navigate(`/government/startups/${startup.id}`)}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-xl text-navy-900 mb-1">{startup.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="blue">{startup.sector}</Badge>
                    <StatusBadge status={startup.verification_status} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Trust Score</div>
                  <div className={`text-xl font-bold ${startup.trust_score >= 80 ? 'text-green-600' : 'text-amber-500'}`}>
                    {startup.trust_score}/100
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Technologies:</div>
                <div className="flex flex-wrap gap-2">
                  {startup.technologies.slice(0, 3).map((tech, i) => (
                    <Badge key={i} variant="gray">{tech}</Badge>
                  ))}
                  {startup.technologies.length > 3 && (
                    <Badge variant="gray">+{startup.technologies.length - 3} more</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 mt-4 text-center">
                <div>
                  <div className="text-lg font-bold text-navy-900">{startup.previous_projects}</div>
                  <div className="text-xs text-gray-500">Prev Projects</div>
                </div>
                <div className="border-l border-r border-gray-100">
                  <div className="text-lg font-bold text-navy-900">{startup.government_pilots}</div>
                  <div className="text-xs text-gray-500">Gov Pilots</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">{startup.pilot_success_rate}%</div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="secondary" className="w-full">View Profile</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredStartups.length === 0 && (
          <div className="col-span-1 lg:col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No startups found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
