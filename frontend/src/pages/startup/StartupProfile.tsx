import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { PageHeader } from '../../components/ui/PageHeader';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { CheckCircle2, ShieldAlert, Upload, Building2, User, Star, Award, ShieldCheck } from 'lucide-react';
import { getStartupPerformanceSummary, getRatingsForStartup, PilotRating } from '../../lib/ratingService';

export const StartupProfile: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState<'draft' | 'pending' | 'verified'>('verified');
  const [startupRecord, setStartupRecord] = useState<any>(null);
  
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
          setStartupRecord(st);
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
    return <div className="max-w-3xl mx-auto p-8 space-y-4"><SkeletonCard /><SkeletonCard /></div>;
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
          {(() => {
            const performance = getStartupPerformanceSummary(
              startupRecord || {
                id: user?.id || 'startup',
                trust_score: 85,
                government_pilots: 2,
                pilot_success_rate: 92
              }
            );

            return (
              <Card className="p-5 border border-amber-200 bg-gradient-to-br from-amber-50/60 to-white shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-navy-900 text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" /> Government Performance Record
                  </h3>
                  {performance.hasEvaluations && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 py-2 border-y border-amber-100">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(performance.averageRating)
                            ? 'fill-amber-400 text-amber-500'
                            : 'fill-slate-200 text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-black text-navy-900">
                    {performance.averageRating > 0 ? performance.averageRating.toFixed(1) : 'Unrated'}
                    <span className="text-xs text-slate-400 font-normal"> / 5.0</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Evaluations</span>
                    <span className="font-bold text-navy-900">{performance.ratingCount} Official</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pilots Completed</span>
                    <span className="font-bold text-navy-900">{performance.successfulPilots}</span>
                  </div>
                </div>

                {performance.hasEvaluations && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Areas Praised</span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <div className="flex justify-between bg-white px-2 py-1 rounded border border-slate-100">
                        <span className="text-slate-600">Technical:</span>
                        <span className="font-bold text-navy-900">★ {performance.dimensionAverages.technical.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between bg-white px-2 py-1 rounded border border-slate-100">
                        <span className="text-slate-600">Effectiveness:</span>
                        <span className="font-bold text-navy-900">★ {performance.dimensionAverages.effectiveness.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between bg-white px-2 py-1 rounded border border-slate-100">
                        <span className="text-slate-600">Support:</span>
                        <span className="font-bold text-navy-900">★ {performance.dimensionAverages.implementation.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between bg-white px-2 py-1 rounded border border-slate-100">
                        <span className="text-slate-600">Delivery:</span>
                        <span className="font-bold text-navy-900">★ {performance.dimensionAverages.timeliness.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {performance.evaluations.length > 0 && performance.evaluations[0].feedback && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Department Endorsement</span>
                    <blockquote className="bg-white p-2.5 rounded-lg border border-amber-200/80 text-[11px] text-slate-700 italic">
                      "{performance.evaluations[0].feedback.slice(0, 130)}..."
                      <footer className="text-[10px] text-navy-900 font-bold not-italic mt-1">
                        — {performance.evaluations[0].department_name || 'Host Department'}
                      </footer>
                    </blockquote>
                  </div>
                )}
              </Card>
            );
          })()}

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
