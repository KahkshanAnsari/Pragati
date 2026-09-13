import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import pragatiLogo from '../../assets/pragati-logo.png';

const DEMO_EMAIL = 'anika@aquasense.ai';
const DEMO_PASSWORD = 'StartupDemo@2026';

export function StartupLogin() {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
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
          // If auto-confirm fails, continue with original error
        }
      }

      if (error) {
        toast.error(error.message);
      } else if (data?.session) {
        setSession(data.session);
        toast.success('Signed in successfully.');

        const userRole = data.session.user?.user_metadata?.role;
        if (userRole === 'government_officer') {
          navigate('/government/dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/startup/dashboard');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <img src={pragatiLogo} alt="PRAGATI" className="h-12 w-12 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Startup Portal Login</h1>
          <p className="text-gray-500 text-sm">Sign in to solve government challenges and deploy pilots</p>
        </div>

        {/* Demo Account Indicator */}
        <div className="mb-6 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">Demo Account • Sample Data Included</p>
              <p className="text-[11px] text-emerald-700">Pre-filled with AquaSense AI founder profile</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail(DEMO_EMAIL);
              setPassword(DEMO_PASSWORD);
            }}
            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 ml-2"
          >
            Use Demo Account
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full !bg-blue-600 hover:!bg-blue-700 text-white"
            isLoading={loading}
          >
            Login
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          New to Pragati?{' '}
          <Link to="/auth/startup/register" className="text-blue-600 font-medium hover:underline">
            Apply now
          </Link>
        </div>
      </div>
    </div>
  );
}
