import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">Startup Registration</h1>
          <p className="text-gray-500">Step {step} of 3</p>
        </div>
        <ProgressBar value={(step / 3) * 100} color="navy" className="mb-8" />

        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4">
            <Input
              label="Startup Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button type="submit" className="w-full mt-6 !bg-blue-600 text-white">
              Next Step
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-4">
            <Input
              label="Sector"
              required
              placeholder="e.g. Water Tech, Clean Energy, AI"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
            <div className="flex gap-4 mt-6">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1 !bg-blue-600 text-white">
                Next Step
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="DPIIT Recognition Number"
              placeholder="e.g. DIPP12345 (Optional)"
              value={formData.dpiit}
              onChange={(e) => setFormData({ ...formData, dpiit: e.target.value })}
            />
            <div className="flex gap-4 mt-6">
              <Button type="button" variant="secondary" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 !bg-blue-600 text-white"
                isLoading={loading}
              >
                Create Account & Go to Dashboard
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          Already registered?{' '}
          <Link to="/auth/startup/login" className="text-blue-600 font-medium hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
