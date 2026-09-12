import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-navy-900 mb-2">Government Officer Registration</h1>
          <p className="text-gray-500">Create your account to start procuring innovation</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Official Email"
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

          <Button type="submit" className="w-full mt-6" isLoading={loading}>
            Register & Go to Dashboard
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/auth/government/login" className="text-navy-600 font-medium hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
