import React from 'react';
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
  Cpu,
  Layers,
  Activity,
  Workflow,
  Target,
} from 'lucide-react';
import pragatiLogo from '../assets/pragati-logo.png';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#0F172A] selection:bg-blue-100 selection:text-blue-900">
      {/* ── 1. NAVBAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
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
                <span className="text-xl font-black text-[#0F172A] tracking-tight leading-none">
                  PRAGATI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded border border-blue-200">
                  GovTech
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] font-medium hidden sm:block mt-0.5">
                National Government Innovation & Procurement Platform
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B]">
            <a
              href="#value-strip"
              className="hover:text-[#0F172A] transition-colors"
            >
              Overview
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#0F172A] transition-colors"
            >
              How It Works
            </a>
            <a
              href="#core-features"
              className="hover:text-[#0F172A] transition-colors"
            >
              Core Features
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => navigate('/auth/startup/login')}
              className="px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] hover:bg-slate-50 border border-[#E2E8F0] rounded-lg transition-colors"
            >
              Startup Login
            </button>
            <Button
              size="sm"
              onClick={() => navigate('/auth/government/login')}
              className="bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-lg shadow-xs"
            >
              Government Portal
            </Button>
          </div>
        </div>
      </header>

      {/* ── 2. HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Sovereign Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span>Smart India Hackathon 2026 • GFR 2017 Innovation Framework</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.12]">
                From Government Problems to{' '}
                <span className="text-[#2563EB]">Scalable Solutions.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed max-w-2xl">
                Pragati connects government challenges with verified startups through AI-powered matching, structured pilots and a path to scalable adoption.
              </p>

              {/* Primary & Secondary Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth/government/login')}
                  className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-7 py-3.5 text-sm rounded-xl shadow-sm flex items-center justify-center gap-2.5 transition-all"
                >
                  <Building2 className="w-4 h-4 text-blue-400" />
                  Explore Government Portal
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/auth/startup/login')}
                  className="bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold px-7 py-3.5 text-sm rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-all"
                >
                  <Rocket className="w-4 h-4 text-[#2563EB]" />
                  Explore Startup Portal
                </Button>
              </div>

              {/* Micro Trust Points */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span>DPIIT Startup Sandbox</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Transparent AI Matching</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Milestone Escrow Governance</span>
                </div>
              </div>
            </motion.div>

            {/* Right Visual: Elegant AI / Network Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 shadow-sm overflow-hidden">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                      Pragati Neural Mesh
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                    GFR 2017 Live
                  </span>
                </div>

                {/* SVG Network Graph */}
                <div className="relative h-64 w-full flex items-center justify-center">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 360 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Grid Background Lines */}
                    <path
                      d="M20 64 H340 M20 128 H340 M20 192 H340 M90 20 V236 M180 20 V236 M270 20 V236"
                      stroke="#E2E8F0"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />

                    {/* Dynamic Network Connecting Lines */}
                    <path
                      d="M60 70 L180 128 M60 186 L180 128 M180 128 L300 70 M180 128 L300 186"
                      stroke="#93C5FD"
                      strokeWidth="2"
                    />

                    {/* Data Flow Pulses */}
                    <circle cx="120" cy="99" r="3" fill="#2563EB" />
                    <circle cx="120" cy="157" r="3" fill="#2563EB" />
                    <circle cx="240" cy="99" r="3" fill="#2563EB" />
                    <circle cx="240" cy="157" r="3" fill="#2563EB" />

                    {/* Central AI Match Hub Outer Pulse */}
                    <circle
                      cx="180"
                      cy="128"
                      r="28"
                      fill="#EFF6FF"
                      stroke="#BFDBFE"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="180"
                      cy="128"
                      r="18"
                      fill="#2563EB"
                      className="opacity-95"
                    />

                    {/* Node 1: Govt Department */}
                    <circle cx="60" cy="70" r="14" fill="#0F172A" />
                    {/* Node 2: Problem Statement */}
                    <circle cx="60" cy="186" r="14" fill="#0F172A" />
                    {/* Node 3: Verified Startup */}
                    <circle cx="300" cy="70" r="14" fill="#2563EB" />
                    {/* Node 4: Milestone Sandbox */}
                    <circle cx="300" cy="186" r="14" fill="#0F172A" />
                  </svg>

                  {/* HTML Overlay Badges on Top of SVG Nodes */}
                  <div className="absolute top-2 left-2 bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-xs text-[10px] font-bold text-[#0F172A]">
                    Govt Department
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-xs text-[10px] font-bold text-[#0F172A]">
                    Problem Registry
                  </div>
                  <div className="absolute top-2 right-2 bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-xs text-[10px] font-bold text-[#2563EB]">
                    Verified Startups
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white px-2.5 py-1 rounded-md border border-[#E2E8F0] shadow-xs text-[10px] font-bold text-[#0F172A]">
                    Scale Dossier
                  </div>

                  {/* Center Hub Indicator */}
                  <div className="absolute flex flex-col items-center pointer-events-none">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Micro Metric Banner inside Visual */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0] grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-lg border border-[#E2E8F0]">
                    <div className="text-xs font-black text-[#0F172A]">100%</div>
                    <div className="text-[9px] text-[#64748B] font-medium">Explainable AI</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-[#E2E8F0]">
                    <div className="text-xs font-black text-[#2563EB]">GFR 2017</div>
                    <div className="text-[9px] text-[#64748B] font-medium">Compliance</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-[#E2E8F0]">
                    <div className="text-xs font-black text-[#0F172A]">90-Day</div>
                    <div className="text-[9px] text-[#64748B] font-medium">Sandbox Pilot</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. TRUST / VALUE STRIP ────────────────────────────────────────────── */}
      <section id="value-strip" className="py-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              End-to-End Governance Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1">
              Structured Public Innovation Pipeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: 'Phase 01',
                title: 'Government Challenges',
                desc: 'Departments publish municipal and state challenges with clear baseline KPIs.',
                icon: Building2,
              },
              {
                step: 'Phase 02',
                title: 'AI Matching',
                desc: 'Deterministic algorithm evaluates startup tech stack, DPIIT status, and capacity.',
                icon: Sparkles,
              },
              {
                step: 'Phase 03',
                title: 'Pilot Validation',
                desc: 'Controlled 90-day sandbox pilots with third-party field inspection & telemetry.',
                icon: Target,
              },
              {
                step: 'Phase 04',
                title: 'National Scale',
                desc: 'Validated solutions transition into GFR 2017 procurement dossiers for pan-India scale.',
                icon: Layers,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-blue-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-[#2563EB] tracking-wide">
                        {item.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-bold text-sm text-[#0F172A] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. HOW PRAGATI WORKS (5 STEPS) ────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Operational Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              How Pragati Works
            </h2>
            <p className="text-sm text-[#64748B]">
              A step-by-step protocol for discovering, de-risking, and scaling high-impact technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {[
              {
                num: '01',
                title: 'Identify',
                desc: 'Government departments post real problems.',
                icon: Search,
              },
              {
                num: '02',
                title: 'Match',
                desc: 'AI evaluates startups based on technology, capabilities and relevant experience.',
                icon: Sparkles,
              },
              {
                num: '03',
                title: 'Pilot',
                desc: 'Selected solutions are tested in controlled government pilots.',
                icon: Rocket,
              },
              {
                num: '04',
                title: 'Validate',
                desc: 'KPIs and outcomes are monitored.',
                icon: BarChart3,
              },
              {
                num: '05',
                title: 'Scale',
                desc: 'Validated solutions move toward wider adoption/procurement.',
                icon: Layers,
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-[#F8FAFC] p-6 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-[#2563EB]">
                        {step.num}
                      </span>
                      <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-[#0F172A]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. CORE FEATURES (4 CARDS) ────────────────────────────────────────────── */}
      <section id="core-features" className="py-20 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Enterprise GovTech Features
            </h2>
            <p className="text-sm text-[#64748B]">
              Purpose-built tools for public officials, project inspectors, and innovative enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI-Powered Matching',
                desc: 'Find startups aligned with the actual problem requirements.',
                icon: Sparkles,
                tag: 'Objective Scoring',
              },
              {
                title: 'Pilot Management',
                desc: 'Track milestones, KPIs and pilot progress.',
                icon: Workflow,
                tag: 'Escrow Tranches',
              },
              {
                title: 'Validation & Monitoring',
                desc: 'Measure whether the solution actually works.',
                icon: Activity,
                tag: 'Field Telemetry',
              },
              {
                title: 'Procurement Readiness',
                desc: 'Move validated solutions toward government adoption.',
                icon: FileCheck,
                tag: 'GFR 2017 Dossier',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-[#64748B] px-2 py-0.5 rounded border border-[#E2E8F0]">
                        {feature.tag}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A]">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#EFF6FF] border-b border-[#E2E8F0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-xs border border-blue-200 text-[#2563EB] mx-auto p-1">
            <img
              src={pragatiLogo}
              alt="PRAGATI Logo"
              className="h-full w-full object-contain"
            />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            Turn Government Challenges into Measurable Solutions.
          </h2>

          <p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto">
            Join state departments, municipal corporations, and DPIIT-recognized startups accelerating India’s public sector innovation.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              size="lg"
              onClick={() => navigate('/auth/government/login')}
              className="w-full sm:w-auto bg-[#0F172A] hover:bg-slate-800 text-white font-bold px-8 py-3.5 text-sm rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              Government Portal
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/auth/startup/login')}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] font-bold px-8 py-3.5 text-sm rounded-xl shadow-xs flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 text-[#2563EB]" />
              Startup Portal
            </Button>
          </div>
        </div>
      </section>

      {/* ── 7. FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-white py-12 text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#E2E8F0] pb-8">
            {/* Logo & Info */}
            <div className="flex items-center gap-3">
              <img
                src={pragatiLogo}
                alt="PRAGATI Logo"
                className="h-10 w-10 object-contain shrink-0"
              />
              <div>
                <span className="font-bold text-sm text-[#0F172A] tracking-tight">
                  PRAGATI
                </span>
                <p className="text-[11px] text-[#64748B]">
                  National Government Innovation & Procurement Platform
                </p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-xs font-semibold text-[#0F172A]">
              <button
                onClick={() => navigate('/auth/government/login')}
                className="hover:text-[#2563EB] transition-colors"
              >
                Government Portal
              </button>
              <button
                onClick={() => navigate('/auth/startup/login')}
                className="hover:text-[#2563EB] transition-colors"
              >
                Startup Portal
              </button>
              <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
                How It Works
              </a>
              <a href="#core-features" className="hover:text-[#2563EB] transition-colors">
                Core Features
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64748B]">
            <p>© 2026 PRAGATI. Built for Smart India Hackathon (SIH) National Mission.</p>
            <p className="flex items-center gap-1.5 font-medium text-[#0F172A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              100% GFR 2017 & DPIIT Compliant Innovation Sandbox
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
