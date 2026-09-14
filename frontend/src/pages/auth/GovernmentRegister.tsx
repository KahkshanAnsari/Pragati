import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import pragatiLogo from '../../assets/pragati-logo.png';
import govLoginBg from '../../assets/gov-login-bg.png';
import {
  Globe,
  ChevronDown,
  HelpCircle,
  Check,
} from 'lucide-react';
import { HelpSupportModal } from '../../components/common/HelpSupportModal';

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
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  // Close language menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="min-h-screen flex flex-col font-sans bg-[#F0F7FC]">
      {/* ── TOP BAR: Same as GovernmentLogin ── */}
      <header className="bg-[#123158] text-white px-4 sm:px-8 h-14 flex items-center justify-between z-20 shadow-xs">
        {/* Left: PRAGATI Platform Identity */}
        <div className="flex items-center gap-3">
          <img
            src={pragatiLogo}
            alt="PRAGATI Logo"
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain shrink-0"
          />
          <div className="flex flex-col text-left">
            <span className="text-sm sm:text-base font-black tracking-tight leading-none text-white">
              PRAGATI
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5">
              {language === 'hi' ? 'सरकारी नवाचार और खरीद मंच' : 'Government Innovation & Procurement Platform'}
            </span>
          </div>
        </div>

        {/* Right: Language Switcher & Help */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-slate-200">
          {/* Language Selector */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-slate-700/60 hover:text-white transition-colors cursor-pointer border border-transparent hover:border-slate-600"
              title="Change language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>{language === 'en' ? 'English' : 'हिंदी'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs">
                <button
                  type="button"
                  onClick={() => { setLanguage('en'); setLangMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${language === 'en' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => { setLanguage('hi'); setLangMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${language === 'hi' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                >
                  <span>हिंदी</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            )}
          </div>

          <span className="text-slate-500">|</span>

          {/* Help Button */}
          <button
            type="button"
            onClick={() => setHelpModalOpen(true)}
            className="flex items-center gap-1 hover:text-white transition-colors py-1 px-1.5 rounded hover:bg-slate-700/40 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden sm:inline">{language === 'hi' ? 'सहायता' : 'Help'}</span>
          </button>
        </div>
      </header>

      {/* ── FIXED BACKGROUND LAYER: Exact Tricolour Left + Parliament Right Composition ── */}
      <div
        className="fixed inset-0 z-0 bg-[#F0F7FC] bg-no-repeat bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${govLoginBg})` }}
      />

      {/* ── CENTER AREA: Registration Card ── */}
      <main className="flex-1 relative z-10 flex items-center justify-center p-4 sm:p-6 min-h-[520px]">
        {/* ── EXISTING REGISTRATION CARD — UNCHANGED ── */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative z-10 my-6">
          <div className="text-center mb-8">
            <img src={pragatiLogo} alt="PRAGATI" className="h-12 w-12 object-contain mx-auto mb-4" />
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
              Register &amp; Go to Dashboard
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/auth/government/login" className="text-navy-600 font-medium hover:underline">
              Login here
            </Link>
          </div>
        </div>
      </main>

      {/* ── FOOTER: Same as GovernmentLogin ── */}
      <footer className="bg-[#123158] text-slate-300 px-4 sm:px-8 py-3 text-xs flex flex-wrap items-center justify-center gap-3 sm:gap-6 border-t border-slate-700/60 z-20">
        <Link to="/#about" className="hover:text-white transition-colors">About Us</Link>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <button
          type="button"
          onClick={() => toast.success('PRAGATI Privacy Policy: All government officer data is encrypted and handled per GoI IT guidelines.')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Privacy Policy
        </button>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <button
          type="button"
          onClick={() => toast.success('PRAGATI Terms: Authorized access only for verified department officers.')}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Terms &amp; Conditions
        </button>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <Link to="/#contact" className="hover:text-white transition-colors">Contact Us</Link>
      </footer>

      {/* ── HELP / SUPPORT MODAL ── */}
      <HelpSupportModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </div>
  );
}

export default GovernmentRegister;
