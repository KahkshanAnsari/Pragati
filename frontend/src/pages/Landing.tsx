import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Calendar,
  Landmark,
  Check,
} from 'lucide-react';
import pragatiLogo from '../assets/pragati-logo.png';
import indiaGovHero from '../assets/india-gov-hero.png';
import { api } from '../lib/api';

// Ashoka Emblem SVG Component for National Government Identity
function AshokaEmblem({ className = "w-5 h-5 text-amber-400" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Emblem of India"
    >
      <path d="M12 2C10.9 2 10 2.9 10 4V5.17C7.61 5.61 5.8 7.6 5.8 10C5.8 10.93 6.13 11.78 6.67 12.45L4.5 16H8.5L7.5 21H16.5L15.5 16H19.5L17.33 12.45C17.87 11.78 18.2 10.93 18.2 10C18.2 7.6 16.39 5.61 14 5.17V4C14 2.9 13.1 2 12 2ZM12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM12 9C11.45 9 11 9.45 11 10C11 10.55 11.45 11 12 11C12.55 11 13 10.55 13 10C13 9.45 12.55 9 12 9Z" />
    </svg>
  );
}

export function Landing() {
  const navigate = useNavigate();

  // Accessibility States
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'larger'>('normal');
  const [isHindi, setIsHindi] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'challenges' | 'pilots' | 'procurement'>('all');

  // Dynamic Updates from Platform Problems API
  const [dynamicUpdates, setDynamicUpdates] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    api
      .get('/api/problems')
      .then((res) => {
        if (!isMounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        if (data.length > 0) {
          // Map real DB problems to announcement cards
          const mapped = data.slice(0, 4).map((p: any, idx: number) => {
            const dateObj = p.created_at ? new Date(p.created_at) : new Date();
            const day = dateObj.getDate().toString().padStart(2, '0');
            const month = dateObj.toLocaleString('en-IN', { month: 'short' });
            return {
              id: p.id || `prob-${idx}`,
              day,
              month,
              category: p.sector || 'Civic Tech',
              title: p.title || 'Government Operational Challenge',
              dept: p.department?.name || (p.sector === 'Water & Wastewater' ? 'Water Resources Dept, Nagpur' : 'Smart City Mission'),
              desc: p.expected_outcome || (p.description ? p.description.slice(0, 110) + '...' : 'Structured public sector challenge with 90-day pilot testing.'),
              status: p.status === 'matched' ? 'Pilot Active' : 'Open for Application',
              actionUrl: '/auth/startup/login',
              type: 'challenge',
            };
          });
          setDynamicUpdates(mapped);
        }
      })
      .catch(() => {
        // Fallback gracefully to official curated announcements
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Standard official platform announcements fallback
  const standardUpdates = [
    {
      id: 'update-1',
      day: '12',
      month: 'Mar',
      category: 'Water & Wastewater',
      title: 'AI-Based Urban Water Leakage Detection & Pressure Optimization',
      dept: 'Water Resources Dept, Nagpur',
      desc: 'High-priority challenge with ₹10 Lakh allocated pilot sandbox and real-time acoustic telemetry requirements.',
      status: 'Open for Application',
      actionUrl: '/auth/startup/login',
      type: 'challenge',
    },
    {
      id: 'update-2',
      day: '08',
      month: 'Mar',
      category: 'Smart Mobility',
      title: 'Automated Pothole Detection & Road Surface Quality Mapping',
      dept: 'Smart City Mission, Pune',
      desc: 'Municipal challenge seeking computer vision & mobile LiDAR solutions for automated road safety audits.',
      status: 'Open for Application',
      actionUrl: '/auth/startup/login',
      type: 'challenge',
    },
    {
      id: 'update-3',
      day: '02',
      month: 'Mar',
      category: 'Agriculture & Drone',
      title: 'AI-Based Drone & Satellite Crop Disease Detection',
      dept: 'Department of Agriculture & Farmers Welfare',
      desc: 'Multi-spectral imaging challenge for automated early pest diagnosis and yield protection in rural clusters.',
      status: 'Cohort Active',
      actionUrl: '/auth/startup/login',
      type: 'pilots',
    },
    {
      id: 'update-4',
      day: '25',
      month: 'Feb',
      category: 'Procurement Framework',
      title: 'PRAGATI GFR 2017 Innovation Protocol 2.0 Live',
      dept: 'Procurement Innovation Cell',
      desc: 'Updated compliance dossiers under GFR Rule 149/194 enabled for verified startups completing 90-day sandbox pilots.',
      status: 'Framework Live',
      actionUrl: '/auth/government/login',
      type: 'procurement',
    },
  ];

  const displayUpdates = dynamicUpdates.length >= 3 ? dynamicUpdates : standardUpdates;
  const filteredUpdates =
    activeTab === 'all'
      ? displayUpdates
      : activeTab === 'challenges'
      ? displayUpdates.filter((u) => u.type === 'challenge')
      : activeTab === 'pilots'
      ? displayUpdates.filter((u) => u.type === 'pilots' || u.status?.includes('Active'))
      : displayUpdates.filter((u) => u.type === 'procurement');

  return (
    <div
      className={`min-h-screen bg-white flex flex-col font-sans text-[#0F172A] selection:bg-blue-100 selection:text-blue-900 ${
        fontScale === 'larger' ? 'text-[17px]' : fontScale === 'large' ? 'text-[15px]' : ''
      }`}
    >
      {/* ── 1. GOVERNMENT OF INDIA ACCESSIBILITY & IDENTITY STRIP ───────────────── */}
      <div className="bg-[#0F2747] text-slate-200 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-700/60 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Government of India Identity */}
          <div className="flex items-center gap-2.5">
            <AshokaEmblem className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="font-semibold text-white tracking-wide">
              {isHindi ? 'भारत सरकार' : 'Government of India'}
            </span>
            <span className="text-slate-400">|</span>
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
                className={`px-1 rounded hover:bg-slate-800 ${fontScale === 'larger' ? 'text-amber-300 font-bold' : 'text-slate-300'}`}
              >
                A+
              </button>
              <button
                onClick={() => setFontScale('large')}
                title="Default font size"
                className={`px-1 rounded hover:bg-slate-800 ${fontScale === 'large' ? 'text-amber-300 font-bold' : 'text-slate-300'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontScale('normal')}
                title="Compact font size"
                className={`px-1 rounded hover:bg-slate-800 ${fontScale === 'normal' ? 'text-amber-300 font-bold' : 'text-slate-300'}`}
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
            <span title="Screen Reader & Accessible Interface" className="text-slate-300 cursor-default">
              ♿
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. HEADER & NAVBAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5">
            <img
              src={pragatiLogo}
              alt="PRAGATI Logo"
              className="h-12 w-12 object-contain shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-[#0F2747] tracking-tight leading-none">
                  PRAGATI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded border border-blue-200">
                  National Platform
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] font-medium hidden sm:block mt-0.5">
                National Government Innovation & Procurement Platform
              </span>
            </div>
          </div>

          {/* Clean Navigation in Center */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#64748B]">
            <a
              href="#main-content"
              className="text-[#0F2747] font-semibold border-b-2 border-[#2563EB] pb-0.5"
            >
              Home
            </a>
            <a href="#latest-updates" className="hover:text-[#2563EB] transition-colors">
              Latest Updates
            </a>
            <a href="#core-features" className="hover:text-[#2563EB] transition-colors">
              Core Features
            </a>
            <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
              How It Works
            </a>
            <a href="#trust" className="hover:text-[#2563EB] transition-colors">
              From Challenge to Adoption
            </a>
            <a href="#footer" className="hover:text-[#2563EB] transition-colors">
              Contact Us
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => navigate('/auth/startup/login')}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] hover:bg-slate-50 border border-[#E2E8F0] rounded-lg transition-all shadow-2xs"
            >
              <User className="w-3.5 h-3.5 text-[#2563EB]" />
              Startup Login
            </button>
            <Button
              size="sm"
              onClick={() => navigate('/auth/government/login')}
              className="bg-[#0F2747] hover:bg-[#1E3A6E] text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-300" />
              Government Portal
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* ── 3. HERO SECTION ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC]/90 via-white to-white pt-10 pb-16 lg:pt-16 lg:pb-20 border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Heading, Copy, CTAs, Highlights */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-5"
                >
                  {/* Sovereign Tag */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Government Innovation & Startup Enablement Platform</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-black text-[#0F172A] tracking-tight leading-[1.14]">
                    From Government Problems <br className="hidden sm:inline" />
                    to <span className="text-[#2563EB]">Scalable Solutions.</span>
                  </h1>

                  {/* Supporting Copy */}
                  <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-xl">
                    Pragati connects government challenges with capable startups through
                    AI-powered matching, structured pilots, validation and a clear path to
                    adoption.
                  </p>

                  {/* CTAs */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <Button
                      size="lg"
                      onClick={() => navigate('/auth/government/login')}
                      className="bg-[#0F2747] hover:bg-[#1E3A6E] text-white font-bold px-6 py-3.5 text-sm rounded-xl shadow-sm flex items-center justify-center gap-2.5 transition-all"
                    >
                      <Landmark className="w-4 h-4 text-blue-300" />
                      Explore Government Portal
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate('/auth/startup/login')}
                      className="bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold px-6 py-3.5 text-sm rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-all"
                    >
                      <Rocket className="w-4 h-4 text-[#2563EB]" />
                      Explore Startup Portal
                    </Button>
                  </div>

                  {/* Feature Highlights Strip (Matching Reference Image) */}
                  <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
                      <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <Target className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#0F172A] leading-tight">
                        Find Real Government Challenges
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
                      <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#0F172A] leading-tight">
                        AI-Powered Startup Matching
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
                      <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <FlaskConical className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#0F172A] leading-tight">
                        Structured Pilot Programs
                      </span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
                      <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-[#0F172A] leading-tight">
                        From Validation to Large Scale Adoption
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: India Innovation / Secretariat Building Visual */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0] bg-white group"
                >
                  <img
                    src={indiaGovHero}
                    alt="Indian Government Innovation - Central Secretariat & Rashtrapati Bhavan"
                    className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle gradient vignette to blend into background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Sovereign Watermark Label */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs py-1.5 px-3 rounded-lg border border-slate-200/90 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-[#0F2747] flex items-center gap-1.5">
                      <AshokaEmblem className="w-3.5 h-3.5 text-[#0F2747]" />
                      Smart India Hackathon 2026
                    </span>
                    <span className="text-[#2563EB] font-bold text-[10px] uppercase tracking-wider">
                      National Cohort
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. NEWS / LATEST UPDATES — THE CENTERPIECE IMMEDIATELY BELOW HERO ───── */}
        <section id="latest-updates" className="py-16 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-bold mb-2">
                  <Bell className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>OFFICIAL ANNOUNCEMENTS</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  Latest Updates
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  Important announcements, innovation challenges and platform updates.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#E2E8F0] shadow-2xs self-start md:self-auto text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === 'all'
                      ? 'bg-[#0F2747] text-white'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  All Updates
                </button>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === 'challenges'
                      ? 'bg-[#0F2747] text-white'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Challenges
                </button>
                <button
                  onClick={() => setActiveTab('pilots')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === 'pilots'
                      ? 'bg-[#0F2747] text-white'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Sandboxes
                </button>
                <button
                  onClick={() => setActiveTab('procurement')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    activeTab === 'procurement'
                      ? 'bg-[#0F2747] text-white'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  Procurement
                </button>
              </div>
            </div>

            {/* Updates Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredUpdates.map((item, idx) => (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                  onClick={() => navigate(item.actionUrl || '/auth/startup/login')}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    {/* Date Badge & Category Tag */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#EFF6FF] border border-blue-200 text-[#2563EB] rounded-lg px-2.5 py-1 text-center shrink-0">
                          <span className="block text-xs font-black leading-none">{item.day}</span>
                          <span className="block text-[9px] font-bold uppercase tracking-wider leading-none mt-0.5">
                            {item.month}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[#2563EB] bg-blue-50/70 px-2 py-0.5 rounded border border-blue-100">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Department */}
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.dept}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#2563EB]">
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Section Action */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/auth/startup/login')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0F2747] hover:text-[#2563EB] bg-white border border-[#E2E8F0] px-5 py-2.5 rounded-lg shadow-xs hover:border-blue-300 transition-all"
              >
                <span>View All Updates & Government Challenges</span>
                <ArrowRight className="w-4 h-4 text-[#2563EB]" />
              </button>
            </div>
          </div>
        </section>

        {/* ── 5. KEY FEATURES — MOVED BELOW LATEST UPDATES ───────────────────────── */}
        <section id="core-features" className="py-16 lg:py-24 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Enterprise Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                Key Features
              </h2>
              <p className="text-sm text-[#64748B]">
                A seamless platform to connect, innovate and implement high-impact public technologies.
              </p>
            </div>

            {/* 5-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {[
                {
                  title: 'AI-Powered Matching',
                  desc: 'Find startups aligned with actual government problem requirements through DPIIT recognition and capability indexing.',
                  icon: Sparkles,
                  tag: 'Deterministic Fit',
                },
                {
                  title: 'Pilot Management',
                  desc: 'Track milestones, KPIs and pilot progress with transparent verification before budget release.',
                  icon: Workflow,
                  tag: 'Milestone Escrow',
                },
                {
                  title: 'Validation & Monitoring',
                  desc: 'Measure whether solutions actually work using third-party inspection data and IoT telemetry.',
                  icon: Activity,
                  tag: 'Field Telemetry',
                },
                {
                  title: 'Procurement Readiness',
                  desc: 'Move validated solutions toward government adoption with automated GFR 2017 compliance dossiers.',
                  icon: FileCheck,
                  tag: 'Procurement Pathway',
                },
                {
                  title: 'Analytics & Decision Support',
                  desc: 'Use evidence and pilot outcomes to support better public procurement decisions pan-India.',
                  icon: BarChart3,
                  tag: 'Audit-Ready Insights',
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06, duration: 0.35 }}
                    className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-[#64748B] px-2 py-0.5 rounded border border-[#E2E8F0]">
                          {feature.tag}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-[#0F172A] leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 6. HOW IT WORKS — CLEAN 4-STEP HORIZONTAL PROCESS ─────────────────── */}
        <section id="how-it-works" className="py-16 lg:py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Operational Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                How It Works
              </h2>
              <p className="text-sm text-[#64748B]">
                A structured 4-step horizontal workflow connecting municipal & state challenges to scale.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Subtle connecting line across desktop */}
              <div className="hidden md:block absolute top-12 left-12 right-12 h-0.5 bg-blue-200/70 -z-0" />

              {[
                {
                  step: '01',
                  title: 'Government Posts Challenge',
                  desc: 'Departments articulate technical baseline, budget caps, and KPI targets for critical civic needs.',
                  icon: Building2,
                },
                {
                  step: '02',
                  title: 'AI Matches Suitable Startups',
                  desc: 'Explainable AI screens DPIIT verification, patents, technology stack, and domain readiness.',
                  icon: Sparkles,
                },
                {
                  step: '03',
                  title: 'Pilot & Validate Solution',
                  desc: 'Startups deploy 90-day sandbox trials with field inspections, IoT telemetry, and milestone escrow.',
                  icon: FlaskConical,
                },
                {
                  step: '04',
                  title: 'Scale Successful Solutions',
                  desc: 'Empirically proven solutions receive GFR 2017 dossiers for fast-track public procurement.',
                  icon: Layers,
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-sm transition-all z-10"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-black text-[#2563EB] tracking-tight">
                          {item.step}
                        </span>
                        <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#0F172A] mb-1.5">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#64748B] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. TRUST / PLATFORM VALUE ("From Challenge to Adoption") ────────────── */}
        <section id="trust" className="py-16 lg:py-20 bg-white border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Public Value Chain
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
                From Challenge to Adoption
              </h2>
              <p className="text-sm text-[#64748B]">
                Eliminating procurement risk through empirical evidence and structured milestones.
              </p>
            </div>

            {/* Sequential Value Pipeline */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Node 1 */}
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-2">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Government Challenge</h4>
                  <p className="text-[11px] text-[#64748B] mt-1">Real civic problems with baseline KPIs</p>
                </div>

                {/* Node 2 */}
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">AI-Powered Matching</h4>
                  <p className="text-[11px] text-[#64748B] mt-1">Objective DPIIT & capability ranking</p>
                </div>

                {/* Node 3 */}
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-2">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Pilot Validation</h4>
                  <p className="text-[11px] text-[#64748B] mt-1">90-day sandbox with field inspection</p>
                </div>

                {/* Node 4 */}
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] text-center shadow-2xs">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-2">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F172A]">Evidence-Based Decision</h4>
                  <p className="text-[11px] text-[#64748B] mt-1">Verified KPI attainment replaces claims</p>
                </div>

                {/* Node 5 */}
                <div className="bg-[#0F2747] text-white p-4 rounded-xl border border-[#0F2747] text-center shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center mx-auto mb-2">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Scale & Adoption</h4>
                  <p className="text-[11px] text-blue-200 mt-1">Direct procurement under GFR 2017</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── 8. CLEAN OFFICIAL FOOTER ────────────────────────────────────────── */}
      <footer id="footer" className="bg-[#0F2747] text-slate-300 py-12 border-t border-slate-700/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-700/60">
            {/* Branding Column */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src={pragatiLogo}
                  alt="PRAGATI Logo"
                  className="h-10 w-10 object-contain brightness-110 shrink-0"
                />
                <div>
                  <span className="font-black text-lg text-white tracking-tight">
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

            {/* Platform Portals */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Platform Portals
              </h4>
              <ul className="space-y-2 text-xs">
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
                <li>
                  <a href="#latest-updates" className="hover:text-white transition-colors">
                    Official Announcements
                  </a>
                </li>
              </ul>
            </div>

            {/* Innovation Framework */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Framework
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#core-features" className="hover:text-white transition-colors">
                    Core Capabilities
                  </a>
                </li>
                <li>
                  <a href="#trust" className="hover:text-white transition-colors">
                    From Challenge to Adoption
                  </a>
                </li>
              </ul>
            </div>

            {/* Ministerial Attribution */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                Government Attribution
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                Ministry of Personnel, Public Grievances & Pensions, New Delhi, India.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                <AshokaEmblem className="w-3.5 h-3.5 text-amber-300" />
                <span>Smart India Hackathon 2026</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Strip */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <p>© 2026 PRAGATI. National Government Innovation & Procurement Platform.</p>
            <p>Designed for Transparent Public Sector Problem-Solving & GFR 2017 Compliance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
