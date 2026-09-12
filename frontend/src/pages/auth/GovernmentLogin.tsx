import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { Building2, ShieldCheck, Sparkles, CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export function GovernmentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      let { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      // Handle unconfirmed email error by auto-confirming and retrying
      if (error && error.message.toLowerCase().includes('confirm')) {
        try {
          await api.post('/api/auth/auto-confirm', { email: cleanEmail });
          const retry = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });
          data = retry.data;
          error = retry.error;
        } catch {
          // Continue with original error if auto-confirm fails
        }
      }

      if (error) {
        toast.error(error.message);
      } else if (data?.session) {
        setSession(data.session);
        toast.success('Signed in successfully.');

        const userRole = data.session.user?.user_metadata?.role;
        if (userRole === 'startup') {
          navigate('/startup/dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/government/dashboard');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('rajesh.kumar@waterresources.gov.in');
    setPassword('GovDemo@2026');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Screen: Government Innovation Ecosystem Graphic & Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Decorative Grid & Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gov-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94A3B8" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gov-grid)" />
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

        {/* Floating GovTech Statistics Cards */}
        <div className="relative z-10 my-auto space-y-6 max-w-md">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Sovereign Innovation Platform
            </span>
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Procurement Readiness Meets Startup Agility
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Post departmental challenges, execute controlled sandboxes, and obtain verified audit dossiers under GFR 2017 guidelines.
            </p>
          </motion.div>

          {/* Floating Glassmorphism Metric Cards */}
          <div className="space-y-3 pt-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">100-Point Objective Matching</p>
                  <p className="text-[11px] text-slate-400">Explainable AI fit score across 6 dimensions</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400">Deterministic</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Immutable Milestone Funding</p>
                  <p className="text-[11px] text-slate-400">Funds released only upon inspector verification</p>
                </div>
              </div>
              <span className="text-xs font-bold text-blue-400">Audit-Ready</span>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Smart India Hackathon 2026 Edition</span>
          <span>Security Level: Departmental TLS 1.3</span>
        </div>
      </div>

      {/* Right Screen: Clean Authentication Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-black text-sm">
                P
              </div>
              <span className="font-extrabold text-base text-navy-900 tracking-tight">PRAGATI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Government Officer Sign In
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Access your departmental challenges, evaluations, and pilot sandboxes.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Official Email Address"
              type="email"
              required
              placeholder="officer@department.gov.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              className="w-full bg-navy-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold shadow-card hover:shadow-glow-blue"
              isLoading={loading}
            >
              Sign In to Government Portal
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Credentials shortcut */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Demo Nodal Officer</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              rajesh.kumar@waterresources.gov.in • Dept. of Water Resources
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>New department officer?</span>
            <Link to="/auth/government/register" className="font-bold text-blue-600 hover:underline">
              Register Credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentLogin;
