import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

const DEMO_EMAIL = 'rajesh.kumar@waterresources.gov.in';
const DEMO_PASSWORD = 'GovDemo@2026';

// Bilingual translations dictionary
const I18N = {
  en: {
    platformTitle: 'PRAGATI',
    platformSubtitle: 'Government Innovation & Procurement Platform',
    help: 'Help',
    portalLogin: 'Government Portal Login',
    portalSub: 'Sign in to manage problems, pilots, and public procurement',
    demoTitle: 'Demo Account • Sample Data Included',
    demoSub: 'Pre-filled with Joint Commissioner profile',
    useDemo: 'Use Demo Account',
    officialEmail: 'Official Email',
    emailPlaceholder: 'Enter your email address',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    login: 'Login',
    loggingIn: 'Signing in...',
    noAccount: "Don't have an account?",
    registerHere: 'Register here',
    aboutUs: 'About Us',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    contactUs: 'Contact Us',
    privacyNotice: 'PRAGATI Privacy Policy: All government officer data is encrypted and handled per GoI IT guidelines.',
    termsNotice: 'PRAGATI Terms: Authorized access only for verified department officers.',
  },
  hi: {
    platformTitle: 'PRAGATI',
    platformSubtitle: 'सरकारी नवाचार और खरीद मंच',
    help: 'सहायता',
    portalLogin: 'सरकारी पोर्टल लॉगिन',
    portalSub: 'समस्याओं, पायलटों और सार्वजनिक खरीद के प्रबंधन के लिए साइन इन करें',
    demoTitle: 'डेमो अकाउंट • नमूना डेटा शामिल',
    demoSub: 'संयुक्त आयुक्त प्रोफ़ाइल के साथ पूर्व-भरा',
    useDemo: 'डेमो अकाउंट का उपयोग करें',
    officialEmail: 'आधिकारिक ईमेल',
    emailPlaceholder: 'अपना ईमेल पता दर्ज करें',
    password: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    login: 'लॉगिन',
    loggingIn: 'साइन इन हो रहा है...',
    noAccount: 'खाता नहीं है?',
    registerHere: 'यहाँ पंजीकरण करें',
    aboutUs: 'हमारे बारे में',
    privacyPolicy: 'गोपनीयता नीति',
    termsConditions: 'नियम एवं शर्तें',
    contactUs: 'संपर्क करें',
    privacyNotice: 'PRAGATI गोपनीयता नीति: सभी सरकारी अधिकारियों का डेटा एन्क्रिप्टेड और भारत सरकार के आईटी दिशानिर्देशों के अनुसार है।',
    termsNotice: 'PRAGATI नियम: केवल सत्यापित विभागीय अधिकारियों के लिए अधिकृत पहुँच।',
  },
};

export function GovernmentLogin() {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const t = I18N[language];

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
        toast.success(language === 'hi' ? 'सफलतापूर्वक साइन इन किया गया।' : 'Signed in successfully.');

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
      toast.error(err.message || (language === 'hi' ? 'लॉगिन विफल रहा' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F0F7FC]">
      {/* ── TOP BAR: Government & PRAGATI Branding + Language Switcher ── */}
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
              {t.platformTitle}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5">
              {t.platformSubtitle}
            </span>
          </div>
        </div>

        {/* Right: Working Language Switcher & Help */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-slate-200">
          {/* Language Selector Dropdown */}
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
                  onClick={() => {
                    setLanguage('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    language === 'en' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>English</span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('hi');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    language === 'hi' ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>हिंदी</span>
                  {language === 'hi' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            )}
          </div>

          <span className="text-slate-500">|</span>

          {/* Help Link */}
          <Link
            to="/#footer"
            className="flex items-center gap-1 hover:text-white transition-colors py-1 px-1.5 rounded hover:bg-slate-700/40"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden sm:inline">{t.help}</span>
          </Link>
        </div>
      </header>

      {/* ── CENTER AREA: Parliament Background with Login Card ── */}
      <main
        className="flex-1 relative flex items-center justify-center p-4 sm:p-6 bg-[#F0F7FC] bg-no-repeat bg-center bg-cover min-h-[520px]"
        style={{ backgroundImage: `url(${govLoginBg})` }}
      >
        {/* Centered Login Card */}
        <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl border border-slate-200/90 p-7 sm:p-9 text-center relative z-10">
          {/* Card Top: PRAGATI Logo (border removed as in Image 2) */}
          <div className="mx-auto mb-3.5 flex items-center justify-center">
            <img
              src={pragatiLogo}
              alt="PRAGATI Logo"
              className="h-14 w-14 object-contain"
            />
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-2xl font-bold text-[#0F2747] tracking-tight leading-tight">
            {t.portalLogin}
          </h1>
          <p className="text-xs text-[#64748B] mt-1 whitespace-nowrap">
            {t.portalSub}
          </p>

          {/* Demo Account Indicator Box */}
          <div className="my-5 p-3 sm:p-3.5 rounded-xl bg-[#F0F6FF] border border-blue-200/90 flex items-center justify-between text-xs text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <div className="min-w-0">
                <p className="font-bold text-[#0F2747] text-xs leading-tight whitespace-nowrap">
                  {t.demoTitle}
                </p>
                <p className="text-[11px] text-blue-600 mt-0.5 whitespace-nowrap">
                  {t.demoSub}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline shrink-0 ml-4 cursor-pointer whitespace-nowrap"
            >
              {t.useDemo}
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {/* Official Email */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A]">
                {t.officialEmail} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-[#0F172A]"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0F172A]">
                {t.password} <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-[#0F172A]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0E2442] hover:bg-[#16335a] text-white font-bold py-2.5 px-4 text-sm rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer mt-4"
            >
              {loading ? t.loggingIn : t.login}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-5 text-center text-xs text-[#64748B]">
            {t.noAccount}{' '}
            <Link
              to="/auth/government/register"
              className="font-bold text-blue-700 hover:underline"
            >
              {t.registerHere}
            </Link>
          </div>
        </div>
      </main>

      {/* ── FOOTER: Links Bar ── */}
      <footer className="bg-[#123158] text-slate-300 px-4 sm:px-8 py-3 text-xs flex flex-wrap items-center justify-center gap-3 sm:gap-6 border-t border-slate-700/60 z-20">
        <Link to="/#about" className="hover:text-white transition-colors">
          {t.aboutUs}
        </Link>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <button
          type="button"
          onClick={() => toast.success(t.privacyNotice)}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {t.privacyPolicy}
        </button>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <button
          type="button"
          onClick={() => toast.success(t.termsNotice)}
          className="hover:text-white transition-colors cursor-pointer"
        >
          {t.termsConditions}
        </button>
        <span className="text-slate-500 hidden sm:inline">|</span>
        <Link to="/#contact" className="hover:text-white transition-colors">
          {t.contactUs}
        </Link>
      </footer>
    </div>
  );
}

export default GovernmentLogin;
