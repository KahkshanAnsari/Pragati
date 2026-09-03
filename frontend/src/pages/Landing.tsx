import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import {
  Building2,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  FileCheck,
  Scale,
  Layers,
  BarChart3,
  Cpu,
  Lock,
  Globe2,
} from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-white font-bold text-xl shadow-xs">
            P
          </div>
          <div>
            <div className="text-xl font-extrabold text-navy-900 tracking-tight leading-none">PRAGATI</div>
            <div className="text-[10px] uppercase font-semibold text-blue-700 tracking-wider">
              Gov-Tech Innovation & Procurement Platform
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#how-it-works"
            className="hidden md:inline-block text-xs font-semibold text-gray-600 hover:text-navy-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            How It Works
          </a>
          <a
            href="#why-pragati"
            className="hidden md:inline-block text-xs font-semibold text-gray-600 hover:text-navy-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Why Pragati
          </a>
          <Button
            size="sm"
            onClick={() => navigate('/auth/government/login')}
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold py-2 px-3.5 shadow-xs"
          >
            Login as Government
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/auth/startup/login')}
            className="border-gray-300 hover:bg-gray-50 text-navy-900 text-xs font-bold py-2 px-3.5"
          >
            Login as Startup
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative overflow-hidden pt-16 pb-20 px-6 lg:px-12 bg-gradient-to-b from-blue-50/40 via-white to-gray-50">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            Empowering Public Sector Modernization under GFR 2017
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 leading-[1.15] tracking-tight"
          >
            From Government Problems to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-700 to-navy-900">
              Scalable Solutions.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            PRAGATI connects government departments with verified DPIIT startups to discover, pilot, evaluate, and procure high-impact innovations with statutory compliance, explainable AI matching, and procurement readiness dossiers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/auth/government/login')}
              className="w-full sm:w-auto bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-3.5 text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4 text-blue-300" /> Enter as Government Department
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/auth/startup/login')}
              className="w-full sm:w-auto border-2 border-navy-900 text-navy-900 hover:bg-navy-50 font-bold px-8 py-3.5 text-sm flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 text-blue-600" /> Enter as DPIIT Startup
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Visual Lifecycle Progression */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">End-to-End Governance Loop</span>
            <h2 className="text-xl font-bold text-navy-900 mt-1">The Pragati Innovation Lifecycle</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs">
            {[
              { step: '01', title: 'Problem', desc: 'Department registers challenge' },
              { step: '02', title: 'Match', desc: 'AI ranks verified startups' },
              { step: '03', title: 'Evaluate', desc: 'Transparent scoring matrix' },
              { step: '04', title: 'Pilot', desc: 'Milestone-tranche sandbox' },
              { step: '05', title: 'Measure', desc: 'Telemetry & field inspection' },
              { step: '06', title: 'Procure', desc: 'GFR 2017 procurement dossier' },
              { step: '07', title: 'Scale', desc: 'Cross-department adoption' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 block">{item.step}</span>
                  <span className="font-bold text-navy-900 block mt-0.5">{item.title}</span>
                </div>
                <span className="text-[11px] text-gray-500 mt-1 leading-tight">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Pragati Works (01 - 06) */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Operational Architecture</span>
            <h2 className="text-3xl font-extrabold text-navy-900">How Pragati Works</h2>
            <p className="text-sm text-gray-600">
              A structured six-stage procurement protocol that de-risks public sector innovation adoption.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Identify & Structure',
                desc: 'Government officers publish unstructured municipal or departmental challenges. Pragati AI converts them into structured technical specifications with KPIs and pilot budgets.',
                icon: Search,
              },
              {
                num: '02',
                title: 'Explainable AI Matching',
                desc: 'Multidimensional matching engine evaluates sector fit, patent capabilities, past government pilot track records, and statutory DPIIT credentials without black-box bias.',
                icon: Sparkles,
              },
              {
                num: '03',
                title: 'Milestone Sandbox Pilot',
                desc: 'Selected startups receive phased budget allocations. Fund releases are tied strictly to verified milestone deliverables under sandbox operating guidelines.',
                icon: Rocket,
              },
              {
                num: '04',
                title: 'Live Telemetry & Inspection',
                desc: 'Continuous measurement of target vs actual KPIs coupled with geo-tagged third-party field inspection evidence uploaded directly to the platform.',
                icon: BarChart3,
              },
              {
                num: '05',
                title: 'Automated Procurement Dossier',
                desc: 'Upon successful pilot completion, Pragati compiles an 8-point GFR 2017 compliance package and generates verified procurement readiness packages.',
                icon: FileCheck,
              },
              {
                num: '06',
                title: 'Cross-Department Scale',
                desc: 'Proven solutions enter the National Validated Solutions Repository, allowing other states, municipalities, and ministries to adopt pre-validated innovations without repeating pilots.',
                icon: Globe2,
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-gray-400">{card.num}</span>
                    </div>
                    <h3 className="font-bold text-base text-navy-900">{card.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Pragati (6 Differentiators) */}
      <section id="why-pragati" className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs uppercase font-bold text-blue-600 tracking-wider">Public Value Proposition</span>
            <h2 className="text-3xl font-extrabold text-navy-900">Why Governments Choose Pragati</h2>
            <p className="text-sm text-gray-600">
              Engineered specifically for Indian public procurement rules, transparency mandates, and startup innovation frameworks.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Statutory GFR 2017 Compliance',
                desc: 'Fully aligned with General Financial Rules (Rule 149 & Rule 194) for pilot sandbox procurement and accelerated procurement review.',
                icon: Scale,
              },
              {
                title: 'Audit-Proof Verification',
                desc: 'Immutable audit logs track every status change, milestone verification, and inspector sign-off to satisfy CAG scrutiny.',
                icon: Lock,
              },
              {
                title: 'Phased Tranche De-Risking',
                desc: 'Budget is never disbursed upfront. Tranches release only upon verified milestone evidence and field inspector approval.',
                icon: ShieldCheck,
              },
              {
                title: 'Explainable AI Decision Support',
                desc: 'Every recommendation displays an audit trail breaking down sector fit, technology compatibility, and track record score.',
                icon: Cpu,
              },
              {
                title: 'Zero Repeat Pilots',
                desc: 'Once a startup solution is validated by one department, other government entities can fast-track adoption via repository data.',
                icon: Layers,
              },
              {
                title: 'Direct Procurement Review',
                desc: 'Validated procurement cases transition pilot-tested solutions directly into departmental procurement review pipelines.',
                icon: ShoppingBag,
              },
            ].map((diff, i) => {
              const Icon = diff.icon;
              return (
                <div key={i} className="p-5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-navy-900 text-white flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-sm text-navy-900">{diff.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{diff.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual Persona Comparison Cards: For Government & For Startups */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* For Government */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-white flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-900">For Government Departments</h3>
                  <p className="text-xs text-gray-500">Solve complex public service delivery challenges</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Convert vague departmental problems into structured technical challenge tenders.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Automate shortlisting with explainable AI matching across verified DPIIT startups.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Execute monitored 90-day sandbox pilots with milestone escrow budget controls.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Receive audit-ready GFR 2017 dossiers for seamless scale-up and procurement review.</span>
                </li>
              </ul>

              <Button
                onClick={() => navigate('/auth/government/login')}
                className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-2.5 text-xs"
              >
                Access Government Portal
              </Button>
            </div>

            {/* For Startups */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-navy-900">For DPIIT Recognized Startups</h3>
                  <p className="text-xs text-gray-500">Access high-value public procurement opportunities</p>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Direct visibility into high-priority state and central government challenges.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Zero-tender pilot entry through sandbox provisions bypassing legacy turnover rules.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Guaranteed milestone-based milestone payment disbursements on verified progress.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Direct transition to validated procurement cases and cross-state scalability.</span>
                </li>
              </ul>

              <Button
                variant="secondary"
                onClick={() => navigate('/auth/startup/login')}
                className="w-full border-2 border-navy-900 text-navy-900 hover:bg-gray-50 font-bold py-2.5 text-xs"
              >
                Access Startup Portal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12 border-t border-navy-800">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-lg font-bold tracking-wider text-white">PRAGATI</div>
            <p className="text-xs text-navy-200">
              National Government Innovation & Public Procurement Acceleration Platform
            </p>
            <p className="text-[11px] text-gray-400">
              Built for Smart India Hackathon (SIH) 2026 • Compliant with GFR 2017
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-navy-200">
            <button onClick={() => navigate('/auth/government/login')} className="hover:text-white transition-colors">
              Government Login
            </button>
            <span>•</span>
            <button onClick={() => navigate('/auth/startup/login')} className="hover:text-white transition-colors">
              Startup Login
            </button>
            <span>•</span>
            <a href="mailto:support@pragati.gov.in" className="hover:text-white transition-colors">
              Help & Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
