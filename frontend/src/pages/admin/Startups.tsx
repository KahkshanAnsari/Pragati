import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { DataTable } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { toast } from 'react-hot-toast';

export const Startups: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<any>(null);
  const [suspendReason, setSuspendReason] = useState('');

  // Mock data
  const startups = [
    { id: '1', name: 'AquaTech Solutions', sector: 'Water', gst: '29ABCDE1234F1Z5', status: 'verified', pilots: 3, successRate: 100, registeredAt: '2023-01-15' },
    { id: '2', name: 'SmartCity AI', sector: 'Smart City', gst: '27XYZDE1234F1Z5', status: 'pending', pilots: 0, successRate: 0, registeredAt: '2023-09-10' },
    { id: '3', name: 'AgriSensors', sector: 'Agriculture', gst: '07ABCDE1234F1Z5', status: 'verified', pilots: 1, successRate: 100, registeredAt: '2023-05-22' },
    { id: '4', name: 'HealthSync', sector: 'Health', gst: '33ABCDE1234F1Z5', status: 'draft', pilots: 0, successRate: 0, registeredAt: '2023-10-01' },
    { id: '5', name: 'EcoTransit', sector: 'Transport', gst: '09ABCDE1234F1Z5', status: 'suspended', pilots: 2, successRate: 50, registeredAt: '2022-11-05' },
  ];

  const filteredStartups = filter === 'All' ? startups : startups.filter(s => s.status.toLowerCase() === filter.toLowerCase());

  const handleVerify = (id: string) => {
    toast.success(`Startup ${id} verified successfully`);
  };

  const handleReject = (id: string) => {
    toast.success(`Startup ${id} rejected`);
  };

  const handleSuspend = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Startup ${selectedStartup?.name} suspended`);
    setSuspendModalOpen(false);
    setSuspendReason('');
  };

  const columns = [
    { header: 'Startup Name', accessor: 'name' as const },
    { header: 'Sector', accessor: 'sector' as const },
    { header: 'GST / DPIIT', accessor: 'gst' as const },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <Badge variant={row.status === 'verified' ? 'success' : row.status === 'pending' ? 'warning' : row.status === 'suspended' ? 'danger' : 'secondary'}>
          {row.status}
        </Badge>
      ) 
    },
    { header: 'Pilots', accessor: 'pilots' as const },
    { header: 'Success Rate', accessor: (row: any) => `${row.successRate}%` },
    { 
      header: 'Actions', 
      accessor: (row: any) => (
        <div className="flex gap-2">
          {row.status === 'pending' && (
            <>
              <Button size="sm" onClick={() => handleVerify(row.id)} className="bg-green-600 hover:bg-green-700 text-white">Verify</Button>
              <Button size="sm" variant="outline" onClick={() => handleReject(row.id)}>Reject</Button>
            </>
          )}
          {row.status === 'verified' && (
            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => { setSelectedStartup(row); setSuspendModalOpen(true); }}>Suspend</Button>
          )}
          <Button size="sm" variant="ghost">View</Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <PageHeader title="Startup Management" description="Verify and manage startup profiles." />
        <Select value={filter} onChange={(value) => setFilter(value)} className="w-48">
          <option value="All">All Statuses</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>

      <Card>
        <DataTable data={filteredStartups} columns={columns} />
      </Card>

      <Modal isOpen={suspendModalOpen} onClose={() => setSuspendModalOpen(false)} title="Suspend Startup">
        <form onSubmit={handleSuspend} className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure you want to suspend <strong>{selectedStartup?.name}</strong>? They will lose access to active pilots and applications.</p>
          <div>
            <label className="block text-sm font-medium mb-1">Reason for suspension</label>
            <Textarea required value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} rows={3} placeholder="Provide details..." />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setSuspendModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">Confirm Suspension</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Startups;
