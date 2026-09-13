import React, { useState } from 'react';
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
  Globe,
  User,
  FlaskConical,
  Compass,
  FileText,
  Landmark,
  Home,
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

  return (
    <div
      className={`min-h-screen bg-white flex flex-col font-sans text-[#0F172A] selection:bg-blue-100 selection:text-blue-900 ${
        fontScale === 'larger' ? 'text-[17px]' : fontScale === 'large' ? 'text-[15px]' : ''
      }`}
    >
      {/* ── 1. GOVERNMENT OF INDIA ACCESSIBILITY & IDENTITY STRIP ───────────────── */}
      <div className="bg-[#0B192C] text-slate-200 text-xs py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-700/60 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Government Identity */}
          <div className="flex items-center gap-2">
            <AshokaEmblem className="w-4 h-4 text-slate-200 shrink-0" />
            <span className="font-semibold text-white tracking-wide">
              {isHindi ? 'भारत सरकार' : 'Government of India'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 hidden md:inline text-[11px]">
              {isHindi
                ? 'कार्मिक, लोक शिकायत और पेंशन मंत्रालय'
                : 'Ministry of Personnel, Public Grievances & Pensions'}
            </span>
          </div>

          {/* Accessibility & Language Controls */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-300">
            <a
              href="#main-content"
              className="hover:text-white transition-colors underline-offset-4 hover:underline hidden sm:inline"
            >
              Skip to main content
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>

            {/* Font Resize Controls */}
            <div className="flex items-center gap-1.5 font-mono">
              <button
                onClick={() => setFontScale('larger')}
                title="Increase font size"
                className={`px-1 rounded hover:bg-slate-800 ${fontScale === 'larger' ? 'text-white font-bold' : 'text-slate-300'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontScale('large')}
                title="Default font size"
                className={`px-1 rounded hover:bg-slate-800 ${fontScale === 'large' ? 'text-white font-bold' : 'text-slate-300'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontScale('normal')}
                title="Compact font size"
                className={`px-1 rounded hover:bg-slate-800 ${fontScale === 'normal' ? 'text-white font-bold' : 'text-slate-300'}`}
              >
                A-
              </button>
            </div>

            <span className="text-slate-600">|</span>

            {/* Language Switch */}
            <button
              onClick={() => setIsHindi(!isHindi)}
              className="flex items-center gap-1 hover:text-white transition-colors"
              title="Toggle language"
            >
              <Globe className="w-3 h-3 text-blue-400" />
              <span>{isHindi ? 'English' : 'हिंदी'}</span>
            </button>

            <span className="text-slate-600">|</span>

            {/* Accessibility Symbol */}
            <span title="Accessible Interface" className="text-slate-300 cursor-default">
              ♿
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. HEADER / NAVBAR (EXACT REFERENCE MATCH) ────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Platform Title (No "National Platform" Badge) */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={pragatiLogo}
              alt="PRAGATI Logo"
              className="h-12 w-12 object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#0F2747] tracking-tight leading-none">
                PRAGATI
              </span>
              <span className="text-[11px] text-[#64748B] font-medium hidden sm:block mt-1">
                National Government Innovation & Procurement Platform
              </span>
            </div>
          </div>

          {/* Clean Single-Line Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#64748B] whitespace-nowrap">
            <a
              href="#main-content"
              className="text-[#0F2747] font-semibold border-b-2 border-[#2563EB] pb-0.5 flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Home</span>
            </a>
            <a href="#trust" className="hover:text-[#2563EB] transition-colors">
              About PRAGATI
            </a>
            <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
              How It Works
            </a>
            <a href="#key-features" className="hover:text-[#2563EB] transition-colors">
              Core Features
            </a>
            <a href="#latest-updates" className="hover:text-[#2563EB] transition-colors">
              Resources
            </a>
            <a href="#footer" className="hover:text-[#2563EB] transition-colors">
              Contact Us
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => navigate('/auth/startup/login')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] hover:bg-slate-50 border border-[#E2E8F0] rounded-lg transition-all shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Startup Login</span>
            </button>
            <Button
              size="sm"
              onClick={() => navigate('/auth/government/login')}
              className="bg-[#0F2747] hover:bg-[#1E3A6E] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              <span>Government Portal</span>
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* ── 3. HERO SECTION — FADED BACKGROUND (REFERENCE MATCH) ──────────── */}
        <section
          id="hero"
          className="relative overflow-hidden bg-white border-b border-[#E2E8F0]"
          style={{ minHeight: '430px' }}
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
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="w-full lg:max-w-[52%] space-y-5 text-left">
              {/* Sovereign Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>Government Innovation & Startup Enablement Platform</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#0F172A] tracking-tight leading-[1.18]">
                From Government Problems <br />
                to <span className="text-[#2563EB]">Scalable Solutions.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed max-w-lg">
                Pragati connects government challenges with capable startups through
                AI-powered matching, structured pilots, validation and a clear path to
                adoption.
              </p>

              {/* Dual CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth/government/login')}
                  className="bg-[#0F2747] hover:bg-[#1E3A6E] text-white font-bold px-6 py-3 text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Landmark className="w-4 h-4 text-blue-300" />
                  <span>Explore Government Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/auth/startup/login')}
                  className="bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold px-6 py-3 text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Rocket className="w-4 h-4 text-[#2563EB]" />
                  <span>Explore Startup Portal</span>
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
        <section id="key-features" className="py-12 lg:py-16 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols): Key Features (4-Card Grid) */}
              <div className="lg:col-span-8">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                    Key Features
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
        <section id="how-it-works" className="py-14 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Operational Workflow
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                How It Works
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
        <section id="trust" className="py-14 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Platform Value
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                From Challenge to Adoption
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Eliminating procurement risk through empirical evidence and structured milestones.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] text-center shadow-2xs">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Government Challenge</h4>
                  <p className="text-[10px] text-[#64748B] mt-0.5">Real civic problems with baseline KPIs</p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] text-center shadow-2xs">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">AI-Powered Matching</h4>
                  <p className="text-[10px] text-[#64748B] mt-0.5">Objective DPIIT & capability ranking</p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] text-center shadow-2xs">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-1.5">
                    <FlaskConical className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Pilot Validation</h4>
                  <p className="text-[10px] text-[#64748B] mt-0.5">90-day sandbox with field inspection</p>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-[#E2E8F0] text-center shadow-2xs">
                  <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-1.5">
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Evidence-Based Decision</h4>
                  <p className="text-[10px] text-[#64748B] mt-0.5">Verified KPI attainment replaces claims</p>
                </div>

                <div className="bg-[#0F2747] text-white p-3.5 rounded-lg border border-[#0F2747] text-center shadow-2xs">
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto mb-1.5">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Scale & Adoption</h4>
                  <p className="text-[10px] text-blue-200 mt-0.5">Direct procurement under GFR 2017</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── 7. FOOTER ──────────────────────────────────────────────────────── */}
      <footer id="footer" className="bg-[#0F2747] text-slate-300 py-10 border-t border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <li>
                  <a href="#trust" className="hover:text-white transition-colors">
                    From Challenge to Adoption
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
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                <AshokaEmblem className="w-3.5 h-3.5 text-slate-200" />
                <span>Smart India Hackathon 2026</span>
              </div>
            </div>
          </div>

          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>© 2026 PRAGATI. National Government Innovation & Procurement Platform.</p>
            <p>Designed for Public Sector Problem-Solving & GFR 2017 Compliance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
