import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Rocket, ShieldCheck, Activity, BarChart3,
  ArrowRight, CheckCircle2, Building2, ChevronRight, FileText,
  Lock, Globe, Award,
} from 'lucide-react';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

export function Landing() {
  const navigate = useNavigate();

  const METRICS = [
    { label: 'Problems Solved',      value: 18,  suffix: '+' },
    { label: 'Active Pilots',        value: 24,  suffix: '+' },
    { label: 'Verified Startups',    value: 380, suffix: '+' },
    { label: 'Innovation Challenges',value: 45,  suffix: '+' },
  ];

  const HOW_IT_WORKS = [
    {
      step: '01',
      title: 'Government Posts Challenge',
      desc: 'Nodal officers define departmental problem statements with measurable KPIs, eligibility criteria, and sandbox budget limits.',
      badge: 'Public Sector Need',
    },
    {
      step: '02',
      title: 'AI Finds Best Startups',
      desc: 'Our deterministic 6-dimension fit engine evaluates verified startups against required capabilities, sensor tech stacks, and track records.',
      badge: 'Explainable AI',
    },
    {
      step: '03',
      title: 'Pilot → Scale → Procurement',
      desc: 'Live field inspections, immutable milestone verifications, and automated procurement readiness dossiers under GFR 2017 standards.',
      badge: 'GovTech Sandbox',
    },
  ];

  const FEATURES = [
    {
      title: 'AI Startup Matching',
      desc: 'Objective 100-point rubric analyzing sector fit, technology capabilities, and past track records with explainable matching reasons.',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Pilot Management',
      desc: 'Sandbox execution tracker with immutable success criteria, milestone fund releases, and verified progress telemetry.',
      icon: Rocket,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      title: 'Procurement Readiness',
      desc: 'Automated compliance audits generating consolidated technical dossiers ready for government procurement review.',
      icon: ShieldCheck,
      color: 'text-slate-700 bg-slate-100',
    },
    {
      title: 'Monitoring Dashboard',
      desc: 'Real-time multi-department pilot health, on-ground inspector verification logs, and milestone completion percentages.',
      icon: Activity,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Analytics & Auditability',
      desc: 'Comprehensive departmental expenditure metrics, trust scores, and immutable audit trails for complete public transparency.',
      icon: BarChart3,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      title: 'Validated Solutions',
      desc: 'Inter-departmental repository of proven innovations ready for rapid replication across states and municipal bodies.',
      icon: Award,
      color: 'text-slate-700 bg-slate-100',
    },
  ];

  const TESTIMONIALS = [
    {
      quote: 'PRAGATI reduced our innovation validation cycle from 14 months to 90 days. The AI matching surfaced a water leak detection startup that delivered an 18% loss reduction.',
      author: 'Rajesh Kumar',
      role: 'Joint Commissioner, Department of Water Resources',
      dept: 'Maharashtra State Water Authority',
    },
    {
      quote: 'As a DPIIT-recognized startup, pitching to government departments was traditionally opaque. PRAGATI gave us direct sandbox access with transparent milestone-linked funding.',
      author: 'Dr. Anika Patel',
      role: 'Founder & CEO',
      dept: 'AquaSense Technologies',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ── Top Navbar ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center font-black text-sm shadow-sm">
              P
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-navy-900">PRAGATI</span>
              <span className="ml-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest hidden sm:inline">
                National GovTech Innovation Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/auth/startup/login')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            >
              Startup Login
            </button>
            <button
              onClick={() => navigate('/auth/government/login')}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-navy-900 text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-glow-blue"
            >
              Government Portal
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-100">
        {/* Subtle animated neural/grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>National Hackathon & SIH 2026 Edition</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-navy-900 max-w-4xl mx-auto leading-tight"
          >
            Transforming Government Challenges into{' '}
            <span className="text-gradient-blue">Scalable Innovation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered platform connecting government departments with verified startups for problem solving, pilot execution and procurement readiness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/auth/government/login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold bg-navy-900 text-white hover:bg-slate-800 transition-all shadow-card hover:shadow-glow-blue flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-blue-400" />
              Enter Government Portal
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/auth/startup/login')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold bg-white text-navy-900 hover:bg-slate-50 transition-all border border-slate-300 shadow-card flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 text-cyan-600" />
              Enter Startup Portal
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Metrics Section ───────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {METRICS.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-card text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight tabular-nums mb-1">
                  <AnimatedCounter target={m.value} suffix={m.suffix} duration={1200} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works (3-Step Visual Timeline) ─────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Structured Lifecycle
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight mt-3">
              How PRAGATI Bridges the Innovation Gap
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              From departmental problem identification to field sandbox and compliance validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-card relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-blue-600 tabular-nums">{item.step}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-slate-200 text-slate-600">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Showcase ──────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Enterprise GovTech Stack
            </span>
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight mt-3">
              Built for Government Governance Standards
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Engineered to meet statutory compliance, auditability, and national scalability standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-white rounded-xl p-6 border border-slate-200 shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-navy-900 mb-2">{feat.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials Section ──────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
              Validated in Real Public Pilots
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Hear directly from nodal department heads and innovators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-card flex flex-col justify-between"
              >
                <p className="text-sm leading-relaxed text-slate-700 italic mb-6">
                  "{t.quote}"
                </p>
                <div>
                  <p className="font-bold text-sm text-navy-900">{t.author}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                  <p className="text-[11px] font-semibold text-blue-600 mt-0.5">{t.dept}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                P
              </div>
              <div>
                <span className="font-bold text-sm text-white tracking-tight">PRAGATI</span>
                <p className="text-[11px] text-slate-400">Government Innovation Procurement Platform</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-slate-300">
              <button onClick={() => navigate('/auth/government/login')} className="hover:text-white transition-colors">
                Government Officer Login
              </button>
              <button onClick={() => navigate('/auth/startup/login')} className="hover:text-white transition-colors">
                Startup Access
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 PRAGATI. Built for Smart India Hackathon (SIH) National Mission.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              100% GFR 2017 & DPIIT Compliant Innovation Sandbox
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
