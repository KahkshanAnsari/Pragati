import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { Rocket, Award, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export function StartupRegister() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    sector: '',
    dpiit: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register and auto-confirm via backend endpoint
      try {
        await api.post('/api/auth/register-startup', {
          name: formData.name,
          email: formData.email.trim(),
          password: formData.password,
          sector: formData.sector || 'Technology',
          dpiit: formData.dpiit,
        });
      } catch (backendErr: any) {
        // Fallback: direct Supabase signUp + auto-confirm
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email.trim(),
          password: formData.password,
          options: {
            data: { role: 'startup', name: formData.name, sector: formData.sector },
          },
        });
        if (signUpError && !signUpError.message.toLowerCase().includes('already exists')) {
          throw signUpError;
        }
        // Ensure auto-confirmed on backend
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
            navigate('/startup/dashboard');
            return;
          }
        }
        throw loginError;
      }

      if (loginData?.session) {
        setSession(loginData.session);
        toast.success('Registration successful! Welcome to Pragati.');
        navigate('/startup/dashboard');
      } else {
        navigate('/startup/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Screen: Startup Ecosystem Graphic & Highlights */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="startup-reg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#startup-reg-grid)" />
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
              <p className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Startup Innovator Portal</p>
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
              <Rocket className="w-4 h-4" /> Startup Sandboxing Ecosystem
            </span>
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Direct Access to Government Procurement Sandboxes
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Join hundreds of high-growth Indian startups solving national infrastructure, water, healthcare, and urban governance challenges with funded pilots.
            </p>
          </motion.div>

          <div className="space-y-3 pt-2">
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">GFR 2017 Exemption Dossier</p>
                  <p className="text-[11px] text-slate-400">Direct procurement validation post-pilot</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400">Exemption</span>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Autonomous AI Matching</p>
                  <p className="text-[11px] text-slate-400">Direct invitations based on technical fit</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400">Enabled</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-4">
          <span>Smart India Hackathon 2026</span>
          <span className="text-cyan-400 font-semibold">Startup India & DPIIT Aligned</span>
        </div>
      </div>

      {/* Right Screen: Multi-step Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 mb-2 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                P
              </div>
              <span className="font-extrabold text-navy-900">PRAGATI Startup</span>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black text-navy-900 tracking-tight">Startup Registration</h1>
              <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">Step {step} of 3</span>
            </div>
            <p className="text-xs text-slate-500">
              Register your venture to apply for open challenges and funded pilot deployments.
            </p>
          </div>

          <ProgressBar value={(step / 3) * 100} color="navy" className="mb-4" />

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-3.5">
              <Input
                label="Startup / Company Name"
                required
                placeholder="e.g. AquaSense AI Technologies"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Work Email"
                type="email"
                required
                placeholder="e.g. founder@startup.com"
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
              <Button type="submit" className="w-full !mt-5 shadow-glow-blue">
                Continue to Step 2 <ArrowRight className="w-4 h-4 ml-1.5 inline" />
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-3.5">
              <Input
                label="Primary Sector / Domain"
                required
                placeholder="e.g. Water Tech, Smart Mobility, AI, Clean Energy"
                value={formData.sector}
                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1 shadow-glow-blue">
                  Next Step <ArrowRight className="w-4 h-4 ml-1.5 inline" />
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                label="DPIIT Recognition Number"
                placeholder="e.g. DIPP12345 (Optional)"
                value={formData.dpiit}
                onChange={(e) => setFormData({ ...formData, dpiit: e.target.value })}
              />
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">DPIIT Recognition Benefits:</p>
                <p>Eligible for direct fast-track procurement under Rule 170 of General Financial Rules 2017.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 shadow-glow-blue"
                  isLoading={loading}
                >
                  Complete Registration <CheckCircle2 className="w-4 h-4 ml-1.5 inline" />
                </Button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Already registered?{' '}
              <Link to="/auth/startup/login" className="text-blue-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
