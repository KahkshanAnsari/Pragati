import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { Spinner } from '../../components/ui/Spinner';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { CheckCircle2, ShieldAlert, Upload, Building2, User } from 'lucide-react';

export const StartupProfile: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState<'draft' | 'pending' | 'verified'>('verified');
  
  const [formData, setFormData] = useState({
    name: '',
    founder: '',
    email: user?.email || '',
    phone: '',
    sector: '',
    techTags: '',
    experience: '',
    dpiit_number: '',
    gst_number: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setFetching(true);
        const res = await api.get('/api/startups/me');
        const st = res.data?.data || res.data;
        if (st) {
          setFormData({
            name: st.name || '',
            founder: st.founder_name || '',
            email: st.email || user?.email || '',
            phone: st.phone || '',
            sector: st.sector || '',
            techTags: Array.isArray(st.technologies) ? st.technologies.join(', ') : (st.technologies || ''),
            experience: `${st.experience_years || 5} years enterprise experience in ${st.sector || 'innovation'}.`,
            dpiit_number: st.dpiit_recognition_number || '',
            gst_number: st.gst_number || ''
          });
          setStatus(st.verification_status || 'verified');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch('/api/startups/me', {
        name: formData.name,
        founder_name: formData.founder,
        email: formData.email,
        phone: formData.phone,
        sector: formData.sector,
        technologies: formData.techTags.split(',').map(s => s.trim()).filter(Boolean),
        dpiit_recognition_number: formData.dpiit_number,
        gst_number: formData.gst_number
      });
      toast.success('Profile updated in database successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex h-96 items-center justify-center"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="Startup Profile" 
          description="Manage your company details and verification status."
        />
        {status === 'verified' && (
          <Badge variant="success" className="px-3 py-1 text-sm flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Verified Startup
          </Badge>
        )}
      </div>

      {status === 'draft' && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex justify-between items-center">
          <div>
            <h4 className="font-medium">Complete your profile</h4>
            <p className="text-sm mt-1">Fill in all required details to submit for government verification.</p>
          </div>
          <Button>Submit for Verification</Button>
        </div>
      )}

      {status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <div>
            <h4 className="font-medium">Verification in progress</h4>
            <p className="text-sm mt-1">We are reviewing your documents. You will be notified within 2-3 business days.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold border-b pb-3 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input name="name" value={formData.name} onChange={handleChange} className="pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Founder Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input name="founder" value={formData.founder} onChange={handleChange} className="pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input name="email" value={formData.email} onChange={handleChange} disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold border-b pb-3 mb-4">Capabilities & Experience</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Sector</label>
                  <Select name="sector" value={formData.sector} onChange={(value: string) => setFormData({ ...formData, sector: value })}>
                    <option value="Water">Water</option>
                    <option value="Smart City">Smart City</option>
                    <option value="Health">Health</option>
                    <option value="Agriculture">Agriculture</option>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Technology Tags (comma separated)</label>
                  <Input name="techTags" value={formData.techTags} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience Summary</label>
                <Textarea name="experience" value={formData.experience} onChange={handleChange} rows={4} />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="p-5 bg-navy-900 text-white">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-400" /> Trust Profile
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-navy-700 pb-2">
                <span className="text-gray-300">DPIIT Recognition</span>
                {status === 'verified' ? <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Verified</span> : <span className="text-amber-400">Pending</span>}
              </div>
              <div className="flex justify-between items-center border-b border-navy-700 pb-2">
                <span className="text-gray-300">GST Details</span>
                {status === 'verified' ? <span className="text-green-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Verified</span> : <span className="text-amber-400">Pending</span>}
              </div>
              <div className="flex justify-between items-center border-b border-navy-700 pb-2">
                <span className="text-gray-300">Government Pilots</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex justify-between items-center border-b border-navy-700 pb-2">
                <span className="text-gray-300">Pilot Success Rate</span>
                <span className="font-bold text-green-400">100%</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Verification Documents</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">DPIIT Certificate</label>
                <div className="flex items-center gap-2">
                  <Input value={formData.dpiit_number} disabled className="bg-gray-50" />
                  <Button variant="secondary" size="sm" className="shrink-0"><Upload className="w-4 h-4" /></Button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">GST Certificate</label>
                <div className="flex items-center gap-2">
                  <Input value={formData.gst_number} disabled className="bg-gray-50" />
                  <Button variant="secondary" size="sm" className="shrink-0"><Upload className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StartupProfile;
