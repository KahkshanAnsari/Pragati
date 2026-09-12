import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Building2, Rocket, Search, ShieldCheck, Sparkles, ArrowRight,
  CheckCircle2, ShoppingBag, BarChart3, Cpu, Globe2, FileText,
  Activity, TrendingUp, Users, ChevronRight, Star, Award, Lock,
  Target, Zap, PieChart,
} from 'lucide-react';

/* ─── Helpers ─────────────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── Lifecycle SVG Diagram ───────────────────────────────────────────── */
function LifecycleDiagram() {
  const steps = [
    { icon: FileText,   label: 'Problem',   color: '#0F2040', sub: 'Govt posts challenge' },
    { icon: Sparkles,   label: 'AI Match',  color: '#2D5099', sub: 'Best startups found' },
    { icon: Users,      label: 'Startup',   color: '#3B6CC7', sub: 'Apply & connect' },
    { icon: Rocket,     label: 'Pilot',     color: '#0d9488', sub: 'Real-world testing' },
    { icon: Activity,   label: 'Monitor',   color: '#14b8a6', sub: 'KPIs tracked live' },
    { icon: ShieldCheck,label: 'Validate',  color: '#15803D', sub: 'Outcomes verified' },
    { icon: ShoppingBag,label: 'Procure',   color: '#15803D', sub: 'Procurement ready' },
    { icon: TrendingUp, label: 'Scale',     color: '#15803D', sub: 'Wider adoption' },
  ];

  return (
    <div className="relative w-full overflow-x-auto pb-4">
      <div className="flex items-center gap-0 min-w-max mx-auto px-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                className="flex flex-col items-center gap-2 relative"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md border-2 border-white/20"
                  style={{ background: step.color }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">{step.label}</p>
                  <p className="text-[10px] text-white/60 mt-0.5 w-20 text-center leading-tight">{step.sub}</p>
                </div>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                  className="flex items-center justify-center h-14 mx-1 origin-left"
                >
                  <div className="flex items-center gap-0.5">
                    {[0, 1, 2].map(j => (
                      <motion.div
                        key={j}
                        className="w-1.5 h-1.5 rounded-full bg-white/40"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.4, delay: j * 0.3, repeat: Infinity }}
                      />
                    ))}
                    <ChevronRight className="w-4 h-4 text-white/50 ml-0.5" />
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ─── How it Works Step ───────────────────────────────────────────────── */
const HOW_STEPS = [
  { num: '01', title: 'IDENTIFY', desc: 'Government departments post real-world challenges with requirements, budget and timeline.', icon: FileText, color: 'text-navy-900 bg-navy-900/10 border-navy-900/20' },
  { num: '02', title: 'MATCH',    desc: 'AI analyses registered startups and ranks them on 6 dimensions: sector, technology, capabilities, experience, government track record and verification.', icon: Sparkles, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { num: '03', title: 'APPLY',    desc: 'Shortlisted startups submit detailed applications with proposed approach, cost and expected outcomes.', icon: FileText, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { num: '04', title: 'PILOT',    desc: 'Selected solutions are tested in real government environments with defined milestones and success criteria.', icon: Rocket, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { num: '05', title: 'VALIDATE', desc: 'KPIs, milestones and outcomes are monitored continuously. Budget utilization and risks are tracked in real time.', icon: Activity, color: 'text-success-700 bg-success-50 border-success-200' },
  { num: '06', title: 'SCALE',    desc: 'Validated solutions with verified outcomes move toward government procurement and wider adoption across departments.', icon: TrendingUp, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
];

/* ─── Why Pragati Features ────────────────────────────────────────────── */
const WHY_FEATURES = [
  { icon: Sparkles,    title: 'AI-Powered Matching',      desc: 'Explainable startup recommendations across 6 compatibility dimensions with evidence-backed reasoning.', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { icon: Rocket,      title: 'Pilot Validation',          desc: 'Real-world testing with defined milestones, measurable outcomes and structured success criteria.', color: 'bg-teal-50 text-teal-600 border-teal-100' },
  { icon: BarChart3,   title: 'Outcome Monitoring',        desc: 'KPIs, progress, budget utilization and risk status tracked continuously for every active pilot.', color: 'bg-navy-900/8 text-navy-900 border-navy-900/15' },
  { icon: ShoppingBag, title: 'Procurement Readiness',     desc: 'Evidence-backed readiness assessment for government procurement review with compliance tracking.', color: 'bg-success-50 text-success-700 border-success-100' },
  { icon: ShieldCheck, title: 'Validated Solutions',       desc: 'Government-verified solution repository for reuse across departments and future procurement cycles.', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { icon: Lock,        title: 'Compliance & Audit Trail',  desc: 'Complete audit logs for all actions, decisions and status changes — ready for government review.', color: 'bg-slate-50 text-slate-600 border-slate-200' },
];

/* ─── Stats ───────────────────────────────────────────────────────────── */
const STATS = [
  { value: '11+',  label: 'Active Challenges' },
  { value: '7+',   label: 'Verified Startups' },
  { value: '5',    label: 'Pilots Underway' },
  { value: '87%',  label: 'Avg Procurement Score' },
];

/* ─── Main Landing Component ──────────────────────────────────────────── */
export function Landing() {
  const navigate = useNavigate();
  const howRef = useReveal();
  const whyRef = useReveal();
  const statsRef = useReveal();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased">

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-base tracking-tight">P</span>
            </div>
            <div>
              <div className="font-extrabold text-lg text-navy-900 tracking-tight leading-none">PRAGATI</div>
              <div className="text-[9px] uppercase font-bold text-teal-600 tracking-widest mt-0.5">
                Gov-Tech Innovation Platform
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {['How It Works', 'Why PRAGATI', 'Features'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs font-semibold text-slate-600 hover:text-navy-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/auth/startup/login')}
              className="hidden sm:flex text-xs"
            >
              Startup Login
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/auth/government/login')}
              className="text-xs"
            >
              Government Login
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        {/* Subtle dot grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white/90 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              Smart India Hackathon 2026 — Government Technology Innovation
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-5">
              From Government Problems
              <br />
              <span className="text-teal-400">to Scalable Solutions</span>
            </h1>
            <p className="text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
              PRAGATI connects government challenges with the right startups, validates solutions through pilots, and helps move successful innovations toward procurement and scale.
            </p>
          </motion.div>

          {/* Two-path CTA Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12"
          >
            {/* Government Path */}
            <button
              onClick={() => navigate('/auth/government/login')}
              className="group bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/35 rounded-2xl p-6 text-left transition-all duration-250 cursor-pointer active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-3 group-hover:bg-white/20 transition-colors">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Government Portal</h3>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                Post challenges • Discover startups • Run pilots • Monitor outcomes
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 group-hover:gap-2.5 transition-all">
                Login as Government <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Startup Path */}
            <button
              onClick={() => navigate('/auth/startup/login')}
              className="group bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/35 rounded-2xl p-6 text-left transition-all duration-250 cursor-pointer active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/30 flex items-center justify-center mb-3 group-hover:bg-teal-500/40 transition-colors">
                <Rocket className="w-5 h-5 text-teal-300" />
              </div>
              <h3 className="font-bold text-white text-base mb-1">Startup Portal</h3>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                Discover challenges • Apply • Run pilots • Scale solutions
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-300 group-hover:gap-2.5 transition-all">
                Login as Startup <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </motion.div>

          {/* Lifecycle Diagram */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pb-12"
          >
            <p className="text-center text-xs font-semibold text-white/50 uppercase tracking-widest mb-6">
              Innovation Lifecycle
            </p>
            <LifecycleDiagram />
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────── */}
      <div ref={statsRef.ref} className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={statsRef.visible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="text-2xl font-extrabold text-navy-900 tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How It Works ────────────────────────────────────────────── */}
      <section id="how-it-works" ref={howRef.ref} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={howRef.visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 block">Process</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How PRAGATI Works</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">
              A structured six-stage process from problem identification to large-scale government adoption.
            </p>
          </motion.div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  animate={howRef.visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-white rounded-xl border border-slate-200 shadow-card p-6 flex gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="shrink-0">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-slate-400 tracking-widest">{step.num}</span>
                      <span className="text-sm font-extrabold text-slate-900 tracking-tight">{step.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why PRAGATI ─────────────────────────────────────────────── */}
      <section id="why-pragati" ref={whyRef.ref} className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={whyRef.visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 block">Capabilities</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why PRAGATI</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">
              Purpose-built for Indian government innovation procurement — not a generic dashboard.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={whyRef.visible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 hover:bg-white hover:shadow-card hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-3 ${feat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <Award className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold tracking-tight mb-3">
            Ready to Transform Government Innovation?
          </h2>
          <p className="text-white/70 text-sm mb-8 leading-relaxed">
            Join PRAGATI — where government challenges meet startup innovation through a transparent, evidence-backed process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={() => navigate('/auth/government/login')}
              className="bg-white text-navy-900 hover:bg-slate-100 font-bold shadow-lg px-8"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Government Portal
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/auth/startup/login')}
              className="bg-teal-500/20 hover:bg-teal-500/30 text-white border border-teal-400/40 font-bold px-8"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Startup Portal
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-navy-900 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">P</span>
            </div>
            <span className="font-bold text-navy-900 text-sm">PRAGATI</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Government Innovation Procurement Platform</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>Ministry of Electronics & IT</span>
            <span>•</span>
            <span>Smart India Hackathon 2026</span>
            <span>•</span>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
