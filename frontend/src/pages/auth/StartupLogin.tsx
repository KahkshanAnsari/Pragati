import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export function StartupLogin() {
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Startup Login</h1>
          <p className="text-gray-500">Sign in to solve government challenges</p>
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
