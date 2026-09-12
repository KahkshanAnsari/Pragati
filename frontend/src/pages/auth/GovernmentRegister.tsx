import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { Building2, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

export function GovernmentRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department_id: '',
    designation: '',
    gov_id: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register and auto-confirm via backend endpoint
      try {
        await api.post('/api/auth/register-government', {
          name: formData.name,
          email: formData.email.trim(),
          password: formData.password,
          department_id: formData.department_id,
          designation: formData.designation,
          gov_id: formData.gov_id,
        });
      } catch (backendErr: any) {
        // Fallback: direct Supabase signUp + auto-confirm
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: {
              role: 'government_officer',
              name: formData.name,
              designation: formData.designation,
              department_id: formData.department_id,
              gov_id: formData.gov_id,
            },
          },
        });
        if (signUpError && !signUpError.message.toLowerCase().includes('already exists')) {
          throw signUpError;
        }
        try {
          await api.post('/api/auth/auto-confirm', { email: formData.email.trim() });
        } catch {
          // non-fatal
        }
      }

      // 2. Automatically authenticate the user immediately
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (loginError) {
        // If login threw unconfirmed error, trigger auto-confirm and retry once
        if (loginError.message.toLowerCase().includes('confirm')) {
          await api.post('/api/auth/auto-confirm', { email: formData.email.trim() });
          const retry = await supabase.auth.signInWithPassword({
            email: formData.email.trim(),
            password: formData.password,
          });
          if (retry.data?.session) {
            setSession(retry.data.session);
            toast.success('Registration successful! Welcome to Pragati.');
            navigate('/government/dashboard');
            return;
          }
        }
        throw loginError;
      }

      if (loginData?.session) {
        setSession(loginData.session);
        toast.success('Officer registration successful! Welcome to Pragati.');
        navigate('/government/dashboard');
      } else {
        navigate('/government/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Screen: Enterprise GovTech Ecosystem Graphic */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gov-reg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gov-reg-grid)" />
          </svg>
        </div>
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-glow-blue">
              P
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">PRAGATI</span>
              <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Government Portal</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto space-y-6 max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Official Department Onboarding
            </span>
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Join India's Sovereign Innovation Procurement Network
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Empower your department to publish problem statements, evaluate verified deeptech startups, and deploy sandbox pilots with end-to-end milestone audits.
            </p>
          </motion.div>

          <div className="space-y-3 pt-2">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">GFR 2017 Rule 170 / 149 Compliant</p>
                  <p className="text-[11px] text-slate-400">Direct procurement exemption verification</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400">Verified</span>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">30+ Central & State Ministries</p>
                  <p className="text-[11px] text-slate-400">Cross-department solution adoption</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400">Active</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-4">
          <span>Smart India Hackathon 2026</span>
          <span className="text-cyan-400 font-semibold">MoHUA & DPIIT Ecosystem</span>
        </div>
      </div>

      {/* Right Screen: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                P
              </div>
              <span className="font-extrabold text-navy-900">PRAGATI GovTech</span>
            </div>
            <h1 className="text-2xl font-black text-navy-900 tracking-tight">Register Government Officer</h1>
            <p className="text-xs text-slate-500">
              Create your official account to start discovering and procuring innovation.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            <Input
              label="Full Name"
              required
              placeholder="e.g. Dr. Rajesh Kumar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Official Email"
              type="email"
              required
              placeholder="e.g. officer@department.gov.in"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Select
              label="Department"
              options={[
                { value: 'dept_1', label: 'Water Resources Department' },
                { value: 'dept_2', label: 'Ministry of Housing & Urban Affairs' },
                { value: 'dept_3', label: 'Department of Agriculture & Farmers Welfare' },
                { value: 'dept_4', label: 'Smart Cities Mission' },
              ]}
              value={formData.department_id}
              onChange={(val) => setFormData({ ...formData, department_id: val })}
            />
            <Input
              label="Designation"
              required
              placeholder="e.g. Joint Commissioner, Project Director"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
            <Input
              label="Government ID / Reference"
              required
              placeholder="e.g. GOV-MAH-2026-8912"
              value={formData.gov_id}
              onChange={(e) => setFormData({ ...formData, gov_id: e.target.value })}
            />

            <Button type="submit" className="w-full !mt-5 shadow-glow-blue" isLoading={loading}>
              Create Officer Account <ArrowRight className="w-4 h-4 ml-1.5 inline" />
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Already have an official account?{' '}
              <Link to="/auth/government/login" className="text-blue-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
