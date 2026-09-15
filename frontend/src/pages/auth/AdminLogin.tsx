import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import pragatiLogo from '../../assets/pragati-logo.png';
import { ShieldCheck, HelpCircle, Lock, Eye, EyeOff } from 'lucide-react';

const DEMO_EMAIL = 'admin@pragati.gov.in';
const DEMO_PASSWORD = 'AdminDemo@2026';

export function AdminLogin() {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
          // If auto-confirm fails, continue with original error
        }
      }

      if (error) {
        toast.error(error.message);
      } else if (data?.session) {
        let userRole = data.session.user?.user_metadata?.role;

        // Fallback: check users database table if role not found in metadata
        if (!userRole) {
          try {
            const { data: dbUser } = await supabase
              .from('users')
              .select('role')
              .eq('id', data.session.user.id)
              .maybeSingle();
            if (dbUser?.role) {
              userRole = dbUser.role;
              data.session.user.user_metadata = {
                ...data.session.user.user_metadata,
                role: dbUser.role,
              };
            }
          } catch (e) {
            console.error('Error checking user role in database:', e);
          }
        }

        if (userRole !== 'admin') {
          toast.error('Access denied. This portal is for platform administrators only.');
          await supabase.auth.signOut();
          return;
        }

        setSession(data.session);
        toast.success('Welcome to PRAGATI Admin Portal');
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ background: 'linear-gradient(135deg, #0B192C 0%, #0F2747 40%, #1A3A6E 100%)' }}>
      {/* Top bar */}
      <div className="w-full px-6 py-3 flex justify-between items-center border-b border-white/10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={pragatiLogo} alt="PRAGATI" className="h-8 w-8 object-contain shrink-0" />
          <div>
            <span className="text-white font-black text-base tracking-tight">PRAGATI</span>
            <span className="ml-2 text-[10px] font-bold bg-blue-500/20 border border-blue-400/30 text-blue-300 px-1.5 py-0.5 rounded">ADMIN</span>
          </div>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-black text-white mb-1.5">Admin Portal</h1>
            <p className="text-slate-400 text-sm">Secure access for platform administrators</p>
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Demo Banner */}
            <div className="mb-6 p-3.5 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mt-1.5 shrink-0" />
                <div>
                  <p className="font-bold text-blue-200 text-xs">Demo Admin Account</p>
                  <p className="text-[11px] text-blue-400 mt-0.5">Full platform monitoring access</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail(DEMO_EMAIL);
                  setPassword(DEMO_PASSWORD);
                }}
                className="text-[11px] font-bold text-blue-300 hover:text-white underline shrink-0 cursor-pointer transition-colors"
              >
                Use Demo
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pragati.gov.in"
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Sign In to Admin Portal
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security notice */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
              Restricted access · Authorized administrators only · All activity is logged
            </p>
          </div>

          {/* Portal links */}
          <div className="mt-5 flex justify-center gap-4 text-xs text-slate-500">
            <Link to="/auth/government/login" className="hover:text-slate-300 transition-colors">
              Government Portal
            </Link>
            <span>·</span>
            <Link to="/auth/startup/login" className="hover:text-slate-300 transition-colors">
              Startup Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
