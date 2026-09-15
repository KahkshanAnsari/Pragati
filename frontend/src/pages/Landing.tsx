import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Building2,
  Rocket,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  BarChart3,
  ShieldCheck,
  Layers,
  Activity,
  Workflow,
  Target,
  Bell,
  ChevronRight,
  ChevronDown,
  Globe,
  User,
  FlaskConical,
  Compass,
  FileText,
  Landmark,
  Lock,
} from 'lucide-react';
import pragatiLogo from '../assets/pragati-logo.png';
import indiaGovHero from '../assets/india-gov-hero.jpg';

// Ashoka Emblem SVG Component for National Government Identity
function AshokaEmblem({ className = "w-4 h-4 text-slate-200" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Emblem of India"
    >
      <path d="M12 2C10.9 2 10 2.9 10 4V5.17C7.61 5.61 5.8 7.6 5.8 10C5.8 10.93 6.13 11.78 6.67 12.45L4.5 16H8.5L7.5 21H16.5L15.5 16H19.5L17.33 12.45C17.87 11.78 18.2 10.93 18.2 10C18.2 7.6 16.39 5.61 14 5.17V4C14 2.9 13.1 2 12 2ZM12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM12 9C11.45 9 11 9.45 11 10C11 10.55 11.45 11 12 11C12.55 11 13 10.55 13 10C13 9.45 12.55 9 12 9Z" />
    </svg>
  );
}

export function Landing() {
  const navigate = useNavigate();

  // Accessibility & UI States
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'larger'>('normal');
  const [isHindi, setIsHindi] = useState(false);
  const [updatesTab, setUpdatesTab] = useState<'updates' | 'links'>('updates');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const portalDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionIds = ['hero', 'key-features', 'how-it-works', 'about', 'resources', 'contact', 'footer'];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Close portal dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (portalDropdownRef.current && !portalDropdownRef.current.contains(event.target as Node)) {
        setPortalDropdownOpen(false);
      }
    }
    if (portalDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [portalDropdownOpen]);

  const navActive = (id: string) =>
    activeSection === id
      ? 'text-[#0F2747] font-semibold border-b-2 border-[#2563EB] pb-0.5'
      : 'hover:text-[#2563EB] transition-colors';

  return (
    <div
      className={`min-h-screen bg-white flex flex-col font-sans text-[#0F172A] selection:bg-blue-100 selection:text-blue-900 ${
        fontScale === 'larger' ? 'text-[17px]' : fontScale === 'large' ? 'text-[15px]' : ''
      }`}
    >
      {/* ── 1. GOVERNMENT OF INDIA ACCESSIBILITY & IDENTITY STRIP ───────────────── */}
      <div className="bg-[#0B192C] text-slate-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-700/60 z-50">
        {/* Hidden Skip Link for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-50 focus:px-3 focus:py-1.5 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg focus:outline-none text-xs font-medium"
        >
          {isHindi ? 'मुख्य सामग्री पर जाएं' : 'Skip to main content'}
        </a>

        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Government Identity */}
          <div className="flex items-center">
            <span className="font-semibold text-white tracking-wide text-xs sm:text-[13px]">
              {isHindi ? 'राष्ट्रीय सरकारी नवाचार मंच' : 'National Government Innovation Platform'}
            </span>
          </div>

          {/* Top Header Right Controls: Portal Access | English | हिंदी */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-300">
            {/* Moved Portal Access Dropdown */}
            <div className="relative" ref={portalDropdownRef}>
              <button
                type="button"
                id="portal-access-btn"
                onClick={() => setPortalDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/90 border border-slate-700 hover:bg-slate-700 text-slate-200 hover:text-white text-[11px] font-semibold rounded transition-colors cursor-pointer"
                aria-haspopup="true"
                aria-expanded={portalDropdownOpen}
              >
                <Lock className="w-3 h-3 text-slate-400" />
                <span>{isHindi ? 'पोर्टल एक्सेस' : 'Portal Access'}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${portalDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {portalDropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-64 bg-white text-slate-900 rounded-xl shadow-xl border border-[#E2E8F0] overflow-hidden z-50"
                  role="menu"
                >
                  {/* Header */}
                  <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                    <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                      {isHindi ? 'पोर्टल एक्सेस' : 'Portal Access'}
                    </p>
                  </div>

                  {/* Startup Portal */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setPortalDropdownOpen(false); navigate('/auth/startup/login'); }}
                    className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
                      <Rocket className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{isHindi ? 'स्टार्टअप पोर्टल' : 'Startup Portal'}</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{isHindi ? 'पंजीकृत स्टार्टअप के लिए' : 'For registered startups'}</p>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="h-px bg-[#F1F5F9] mx-4" />

                  {/* Government Portal */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setPortalDropdownOpen(false); navigate('/auth/government/login'); }}
                    className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{isHindi ? 'सरकारी पोर्टल' : 'Government Portal'}</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{isHindi ? 'सरकारी विभागों के लिए' : 'For government departments'}</p>
                    </div>
                  </button>

                  {/* Divider */}
                  <div className="h-px bg-[#F1F5F9] mx-4" />

                  {/* Admin Portal */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setPortalDropdownOpen(false); navigate('/auth/admin/login'); }}
                    className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-slate-200 transition-colors">
                      <ShieldCheck className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{isHindi ? 'एडमिन पोर्टल' : 'Admin Portal'}</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{isHindi ? 'प्लेटफ़ॉर्म निगरानी के लिए' : 'For platform monitoring'}</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <span className="text-slate-600">|</span>

            {/* Language Selector with Selectable Options */}
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <div className="inline-flex items-center rounded bg-slate-800/90 p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsHindi(false)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    !isHindi
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setIsHindi(true)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    isHindi
                      ? 'bg-blue-600 text-white font-bold shadow-2xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. HEADER / NAVBAR ────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <img
              src={pragatiLogo}
              alt="PRAGATI Logo"
              className="h-11 w-11 object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-[22px] font-black text-[#0F2747] tracking-tight leading-none">
                PRAGATI
              </span>
              <span className="text-[11px] text-[#64748B] font-medium hidden sm:block mt-0.5">
                {isHindi ? 'राष्ट्रीय सरकारी नवाचार और खरीद मंच' : 'National Government Innovation & Procurement Platform'}
              </span>
            </div>
          </div>

          {/* Clean Single-Line Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-[#64748B] whitespace-nowrap">
            <a href="#hero" className={navActive('hero')}>{isHindi ? 'होम' : 'Home'}</a>
            <a href="#about" className={navActive('about')}>{isHindi ? 'प्रगति के बारे में' : 'About PRAGATI'}</a>
            <a href="#how-it-works" className={navActive('how-it-works')}>{isHindi ? 'यह कैसे काम करता है' : 'How It Works'}</a>
            <a href="#key-features" className={navActive('key-features')}>{isHindi ? 'मुख्य विशेषताएँ' : 'Core Features'}</a>
            <a href="#resources" className={navActive('resources')}>{isHindi ? 'संसाधन' : 'Resources'}</a>
            <a href="#contact" className={navActive('contact')}>{isHindi ? 'संपर्क करें' : 'Contact Us'}</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-3.5 shrink-0 ml-auto lg:ml-6 xl:ml-10">
            <Button
              size="sm"
              onClick={() => navigate('/auth/startup/login')}
              className="bg-[#0F2747] hover:bg-[#1E3A6E] text-white text-xs sm:text-sm font-semibold px-4 sm:px-4.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-blue-300" />
              <span>{isHindi ? 'स्टार्टअप लॉगिन' : 'Startup Login'}</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/auth/government/login')}
              className="bg-[#0F2747] hover:bg-[#1E3A6E] text-white text-xs sm:text-sm font-semibold px-4 sm:px-4.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              <span>{isHindi ? 'सरकारी पोर्टल' : 'Government Portal'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* ── 3. HERO SECTION — FADED BACKGROUND (REFERENCE MATCH) ──────────── */}
        <section
          id="hero"
          className="relative overflow-hidden bg-white border-b border-[#E2E8F0]"
          style={{ minHeight: '370px' }}
        >
          {/* Background image — anchored to right, covers ~62% of width, full height */}
          <div
            className="absolute inset-y-0 right-0 hidden lg:block"
            style={{ width: '62%' }}
          >
            <img
              src={indiaGovHero}
              alt="Rashtrapati Bhavan, New Delhi"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Gradient overlay: solid white on left → transparent on right */}
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                'linear-gradient(to right, #ffffff 0%, #ffffff 35%, rgba(255,255,255,0.88) 47%, rgba(255,255,255,0.25) 62%, transparent 76%)',
            }}
          />

          {/* Mobile fallback — light blue tint */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F0F6FF]/60 via-white to-white lg:hidden" />

          {/* Content — left-aligned, above gradient */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
            <div className="w-full lg:max-w-[52%] space-y-5 text-left">
              {/* Sovereign Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>{isHindi ? 'सरकारी नवाचार एवं स्टार्टअप सक्षमता मंच' : 'Government Innovation & Startup Enablement Platform'}</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#0F172A] tracking-tight leading-[1.18]">
                {isHindi ? (
                  <>
                    सरकारी समस्याओं से लेकर <br />
                    <span className="text-[#2563EB]">स्केलेबल समाधान तक।</span>
                  </>
                ) : (
                  <>
                    From Government Problems <br />
                    to <span className="text-[#2563EB]">Scalable Solutions.</span>
                  </>
                )}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed max-w-lg">
                {isHindi
                  ? 'प्रगति एआई-संचालित मिलान, संरचित पायलट, सत्यापन और स्पष्ट अंगीकरण पथ के माध्यम से सरकारी चुनौतियों को सक्षम स्टार्टअप से जोड़ती है।'
                  : 'Pragati connects government challenges with capable startups through AI-powered matching, structured pilots, validation and a clear path to adoption.'}
              </p>

              {/* Dual CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth/government/login')}
                  className="bg-[#0F2747] hover:bg-[#1E3A6E] text-white font-bold px-6 py-3 text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Landmark className="w-4 h-4 text-blue-300" />
                  <span>{isHindi ? 'सरकारी पोर्टल देखें' : 'Explore Government Portal'}</span>
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate('/auth/startup/login')}
                  className="bg-[#0F2747] hover:bg-[#1E3A6E] text-white font-bold px-6 py-3 text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Rocket className="w-4 h-4 text-blue-300" />
                  <span>{isHindi ? 'स्टार्टअप पोर्टल देखें' : 'Explore Startup Portal'}</span>
                </Button>
              </div>

              {/* Feature Strip — 4 Compact Pills */}
              <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/90 border border-[#E2E8F0] shadow-2xs backdrop-blur-sm">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#0F172A] leading-tight">
                    Find Real Government Challenges
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/90 border border-[#E2E8F0] shadow-2xs backdrop-blur-sm">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#0F172A] leading-tight">
                    AI-Powered Startup Matching
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/90 border border-[#E2E8F0] shadow-2xs backdrop-blur-sm">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <FlaskConical className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#0F172A] leading-tight">
                    Structured Pilot Programs
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/90 border border-[#E2E8F0] shadow-2xs backdrop-blur-sm">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#0F172A] leading-tight">
                    From Validation to Large Scale Adoption
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. KEY FEATURES (LEFT) + LATEST UPDATES (RIGHT CORNER) ────────────── */}
        <section id="key-features" className="py-8 lg:py-10 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols): Key Features (4-Card Grid) */}
              <div className="lg:col-span-8">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    {isHindi ? 'मुख्य विशेषताएँ' : 'Key Features'}
                  </h2>
                  <p className="text-sm text-[#64748B] mt-1">
                    A seamless platform to connect, innovate and implement.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* Card 1: Government Portal */}
                  <div className="bg-blue-50/40 border border-blue-100/80 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-[#0F172A]">Government Portal</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Post challenges, manage pilots and track outcomes.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/auth/government/login')}
                      className="mt-4 text-xs font-semibold text-blue-600 flex items-center gap-1 hover:underline text-left"
                    >
                      <span>Learn More</span> <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Card 2: Startup Portal */}
                  <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Rocket className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-[#0F172A]">Startup Portal</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Discover opportunities, apply and build solutions.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/auth/startup/login')}
                      className="mt-4 text-xs font-semibold text-emerald-600 flex items-center gap-1 hover:underline text-left"
                    >
                      <span>Learn More</span> <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Card 3: DPIT Startup Sandbox */}
                  <div className="bg-purple-50/40 border border-purple-100/80 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                        <Search className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-[#0F172A]">DPIT Startup Sandbox</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Test, validate and scale innovative solutions.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/auth/startup/login')}
                      className="mt-4 text-xs font-semibold text-purple-600 flex items-center gap-1 hover:underline text-left"
                    >
                      <span>Learn More</span> <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Card 4: Transparent AI Matching */}
                  <div className="bg-amber-50/40 border border-amber-100/80 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-[#0F172A]">Transparent AI Matching</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Smart matching for effective collaboration.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/auth/government/login')}
                      className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1 hover:underline text-left"
                    >
                      <span>Learn More</span> <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column (4 cols): Latest Updates / Quick Links */}
              <div className="lg:col-span-4" id="latest-updates">
                <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden">
                  {/* Tabs Header */}
                  <div className="flex border-b border-gray-200 bg-slate-50/60">
                    <button
                      onClick={() => setUpdatesTab('updates')}
                      className={`flex-1 py-2.5 px-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        updatesTab === 'updates'
                          ? 'bg-[#2563EB] text-white'
                          : 'text-gray-600 hover:text-gray-900 bg-transparent'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Latest Updates</span>
                    </button>
                    <button
                      onClick={() => setUpdatesTab('links')}
                      className={`flex-1 py-2.5 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        updatesTab === 'links'
                          ? 'bg-[#2563EB] text-white'
                          : 'text-gray-600 hover:text-gray-900 bg-transparent'
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Quick Links</span>
                    </button>
                  </div>

                  {/* Tab 1: Latest Updates Content */}
                  {updatesTab === 'updates' ? (
                    <div className="divide-y divide-gray-100">
                      <div
                        onClick={() => navigate('/auth/startup/login')}
                        className="p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <div className="bg-blue-50 text-[#2563EB] border border-blue-100 rounded-md px-2 py-1 text-center shrink-0">
                          <span className="block text-xs font-black leading-none">12</span>
                          <span className="block text-[9px] uppercase font-bold leading-none mt-0.5">Mar</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-tight">
                            New Government Challenges Released
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                            10 new challenges added across multiple sectors.
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>

                      <div
                        onClick={() => navigate('/auth/startup/login')}
                        className="p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <div className="bg-blue-50 text-[#2563EB] border border-blue-100 rounded-md px-2 py-1 text-center shrink-0">
                          <span className="block text-xs font-black leading-none">05</span>
                          <span className="block text-[9px] uppercase font-bold leading-none mt-0.5">Mar</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-tight">
                            Startup Application Window Open
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                            Apply now for the next round of innovation pilots.
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>

                      <div
                        onClick={() => navigate('/auth/government/login')}
                        className="p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <div className="bg-blue-50 text-[#2563EB] border border-blue-100 rounded-md px-2 py-1 text-center shrink-0">
                          <span className="block text-xs font-black leading-none">28</span>
                          <span className="block text-[9px] uppercase font-bold leading-none mt-0.5">Feb</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-tight">
                            PRAGATI Portal Enhanced
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                            Improved matching algorithm and faster onboarding.
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 text-xs">
                      <a href="#how-it-works" className="p-3 flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-slate-50">
                        <span>How PRAGATI Works Protocol</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                      <button onClick={() => navigate('/auth/government/login')} className="w-full p-3 flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-slate-50 text-left">
                        <span>GFR 2017 Procurement Guidelines</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button onClick={() => navigate('/auth/startup/login')} className="w-full p-3 flex items-center justify-between text-gray-700 hover:text-blue-600 hover:bg-slate-50 text-left">
                        <span>DPIIT Startup Sandbox Manual</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="p-3 bg-slate-50/50 border-t border-gray-100 text-left">
                    <button
                      onClick={() => navigate('/auth/startup/login')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <span>View All Updates</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-10 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Operational Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {isHindi ? 'यह कैसे काम करता है' : 'How It Works'}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                A structured 4-step horizontal process from challenge posting to national adoption.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
              <div className="hidden md:block absolute top-10 left-12 right-12 h-0.5 bg-blue-200/70 -z-0" />

              {[
                {
                  step: '01',
                  title: 'Government Posts Challenge',
                  desc: 'Departments publish municipal and state operational problems with baseline KPIs.',
                  icon: Building2,
                },
                {
                  step: '02',
                  title: 'AI Matches Suitable Startups',
                  desc: 'Deterministic AI screens DPIIT verification, technical fit, and relevant capabilities.',
                  icon: Sparkles,
                },
                {
                  step: '03',
                  title: 'Pilot & Validate Solution',
                  desc: 'Controlled 90-day sandbox pilots with third-party field inspection & telemetry.',
                  icon: FlaskConical,
                },
                {
                  step: '04',
                  title: 'Scale Successful Solutions',
                  desc: 'Validated solutions transition into GFR 2017 procurement dossiers for scale.',
                  icon: Layers,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all z-10"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-[#2563EB] tracking-tight">
                          {item.step}
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0F172A] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 6. TRUST / FROM CHALLENGE TO ADOPTION ─────────────────────────── */}
        <section id="about" className="py-10 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Platform Overview
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {isHindi ? 'प्रगति के बारे में' : 'About PRAGATI'}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                PRAGATI connects government departments with DPIIT-registered startups to solve real civic challenges through a structured, evidence-based process.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-stretch">
                <div className="bg-[#F0F6FF]/70 hover:bg-[#F0F6FF] p-4 rounded-xl border border-blue-100/90 text-center shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#2563EB] border border-blue-100 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Government Challenge</h4>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-snug">Real civic problems with baseline KPIs</p>
                </div>

                <div className="bg-[#F0F6FF]/70 hover:bg-[#F0F6FF] p-4 rounded-xl border border-blue-100/90 text-center shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#2563EB] border border-blue-100 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">AI-Powered Matching</h4>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-snug">Objective DPIIT & capability ranking</p>
                </div>

                <div className="bg-[#F0F6FF]/70 hover:bg-[#F0F6FF] p-4 rounded-xl border border-blue-100/90 text-center shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#2563EB] border border-blue-100 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Pilot Validation</h4>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-snug">90-day sandbox with field inspection</p>
                </div>

                <div className="bg-[#F0F6FF]/70 hover:bg-[#F0F6FF] p-4 rounded-xl border border-blue-100/90 text-center shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#2563EB] border border-blue-100 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Evidence-Based Decision</h4>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-snug">Verified KPI attainment replaces claims</p>
                </div>

                <div className="bg-[#F0F6FF]/70 hover:bg-[#F0F6FF] p-4 rounded-xl border border-blue-100/90 text-center shadow-2xs hover:shadow-xs transition-all flex flex-col items-center justify-center">
                  <div className="w-8 h-8 rounded-lg bg-white text-[#2563EB] border border-blue-100 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Scale & Adoption</h4>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-snug">Validated solutions ready for wider adoption</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. RESOURCES ─────────────────────────────────────────────────── */}
        <section id="resources" className="py-10 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Platform Resources
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {isHindi ? 'प्रगति संसाधन' : 'PRAGATI Resources'}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Guidance and references for government departments, startups and innovation teams working through the PRAGATI platform.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                {
                  title: 'Startup Recognition',
                  desc: 'Understand DPIIT recognition, startup eligibility and government innovation opportunities.',
                  tag: 'DPIIT & Eligibility',
                  icon: ShieldCheck,
                  url: 'https://www.startupindia.gov.in/content/sih/en/startupgov/startup-recognition.html',
                  isExternal: true,
                },
                {
                  title: 'Government Procurement',
                  desc: 'Explore relevant government procurement pathways for validated startup solutions.',
                  tag: 'Procurement Pathway',
                  icon: Landmark,
                  url: 'https://gem.gov.in',
                  isExternal: true,
                },
                {
                  title: 'Pilot & Validation',
                  desc: 'Guidance for testing startup solutions through structured government pilots, measurable KPIs and outcome-based validation.',
                  tag: 'PRAGATI Framework',
                  icon: FlaskConical,
                  url: '#how-it-works',
                  isExternal: false,
                },
                {
                  title: 'Procurement Readiness',
                  desc: 'Understand how validated solutions can progress from successful pilots toward government adoption.',
                  tag: 'Adoption Pathway',
                  icon: FileCheck,
                  url: '#about',
                  isExternal: false,
                },
              ].map((res) => {
                const Icon = res.icon;
                return (
                  <a
                    key={res.title}
                    href={res.url}
                    {...(res.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition-all text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] uppercase tracking-wide">
                          {res.tag}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                        {res.title}
                      </h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {res.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2563EB] group-hover:text-blue-700">
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 8. CONTACT US ────────────────────────────────────────────────────── */}
        <section id="contact" className="py-10 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Get In Touch
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {isHindi ? 'प्रगति से संपर्क करें' : 'Contact PRAGATI'}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Reach out through the relevant channel below. Our team will respond within 2 working days.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">For Government Departments</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">Interested in posting a challenge or onboarding your department? Our government liaison team will guide you through the process.</p>
                <button onClick={() => navigate('/auth/government/login')} className="mt-2 text-xs font-semibold text-[#2563EB] flex items-center gap-1 hover:underline">
                  Access Government Portal <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">For Startups & Innovators</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">DPIIT-registered startups can apply to open challenges, track pilot status and access support through the Startup Portal.</p>
                <button onClick={() => navigate('/auth/startup/login')} className="mt-2 text-xs font-semibold text-[#2563EB] flex items-center gap-1 hover:underline">
                  Access Startup Portal <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 space-y-3 hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#0F172A]">General Platform Support</h3>
                <p className="text-xs text-[#64748B] leading-relaxed">For technical issues, platform feedback, or general enquiries about PRAGATI, submit a support request after logging in to the platform.</p>
                <span className="mt-2 text-xs text-[#64748B] inline-block">Login to submit a support request</span>
              </div>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-[#0F172A] leading-relaxed">
                  PRAGATI is India's National Innovation &amp; Procurement Platform, connecting government challenges with innovative startups and supporting structured validation, field pilots, and public procurement adoption.
                </p>
                <p className="text-xs text-[#64748B] mt-1 font-medium">
                  Ministry of Personnel, Public Grievances &amp; Pensions, New Delhi, India.
                </p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => navigate('/auth/government/login')}
                  className="px-4 py-2 text-xs font-semibold bg-[#0F2747] text-white rounded-lg hover:bg-[#1E3A6E] transition-colors shadow-xs"
                >
                  Government Portal
                </button>
                <button
                  onClick={() => navigate('/auth/startup/login')}
                  className="px-4 py-2 text-xs font-semibold bg-[#0F2747] text-white rounded-lg hover:bg-[#1E3A6E] transition-colors shadow-xs"
                >
                  Startup Portal
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ── 8. FOOTER ──────────────────────────────────────────────────────── */}
      <footer id="footer" className="bg-[#0F2747] text-slate-300 py-10 border-t border-slate-700/80">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700/60">
            {/* Branding */}
            <div className="space-y-2 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <img
                  src={pragatiLogo}
                  alt="PRAGATI Logo"
                  className="h-9 w-9 object-contain brightness-110 shrink-0"
                />
                <div>
                  <span className="font-black text-base text-white tracking-tight">
                    PRAGATI
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">
                    National Innovation Platform
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                National Government Innovation & Procurement Platform designed for rapid public sector problem-solving and startup enablement.
              </p>
            </div>

            {/* Portals */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                Platform Portals
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    onClick={() => navigate('/auth/government/login')}
                    className="hover:text-white transition-colors"
                  >
                    Government Officer Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/auth/startup/login')}
                    className="hover:text-white transition-colors"
                  >
                    DPIIT Startup Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Framework */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                Innovation Framework
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#key-features" className="hover:text-white transition-colors">
                    Core Features
                  </a>
                </li>

              </ul>
            </div>

            {/* Government Attribution */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5">
                Government Attribution
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                Ministry of Personnel, Public Grievances & Pensions, New Delhi, India.
              </p>
            </div>
          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 PRAGATI. National Government Innovation & Procurement Platform.</p>
            
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
