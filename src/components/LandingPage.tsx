import React from 'react';
import { motion } from 'motion/react';
import {
  Gavel,
  Shield,
  FileText,
  Award,
  UserCheck,
  Cpu,
  Sparkles,
  BookOpen,
  Scale,
  CheckCircle,
  Landmark,
  ArrowRight
} from 'lucide-react';
import { sfx } from '../utils/sfx';

interface LandingPageProps {
  onOpenCreate: () => void;
  onOpenJoin: () => void;
  onOpenPractice: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenCreate,
  onOpenJoin,
  onOpenPractice
}) => {
  return (
    <div className="min-h-screen aurora-bg text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 relative overflow-hidden">
      {/* Top Indian Legal Banner */}
      <div className="bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-xs py-2.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-emerald-500/20 shadow-md">
        <Landmark className="w-4 h-4 text-amber-400" />
        <span>
          Indian Virtual Moot Court Simulator — Integrated with Bharatiya Nyaya Sanhita (BNS 2023), IPC 1860, BNSS & BSA 2023
        </span>
        <span className="hidden md:inline bg-emerald-900/80 text-amber-300 text-[10px] px-2.5 py-0.5 rounded-full font-serif border border-emerald-500/40 font-bold">
          Satyameva Jayate
        </span>
      </div>

      {/* Hero Section with Framer Motion animations */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-16 text-center relative z-10">
        {/* Subtle Background Aurora Glow Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none animate-aurora"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 mb-6 text-emerald-300 text-xs font-semibold tracking-wider uppercase shadow-lg"
        >
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Designed for Indian Law Students, NLUs & Moot Court Societies</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6 drop-shadow-md"
        >
          Master Indian Jurisprudence & Oral Advocacy. <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
            From BNS 2023 to Constitutional Writs.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
        >
          A real-time virtual moot court simulation platform engineered for Indian law colleges. Features live WebRTC courtroom video, automated court stenography, BNS <span className="font-semibold text-amber-300">⇄</span> IPC statutory mapping, BSA electronic evidence verification, and AI judicial evaluation.
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto mb-16"
        >
          <button
            onClick={() => {
              sfx.playGavel();
              onOpenCreate();
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-7 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all shadow-xl shadow-emerald-900/30 flex items-center gap-2 border border-emerald-400 hover:scale-105 active:scale-95"
          >
            <Gavel className="w-4 h-4 text-amber-950" />
            <span>Create Moot Courtroom</span>
          </button>

          <button
            onClick={() => {
              sfx.playJoinChime();
              onOpenJoin();
            }}
            className="glass-card hover:bg-slate-800/80 text-emerald-300 px-7 py-3.5 rounded-xl text-sm font-bold transition-all border border-emerald-500/30 flex items-center gap-2 shadow-lg hover:border-emerald-400 hover:scale-105 active:scale-95"
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Join Court Room</span>
          </button>

          <button
            onClick={() => {
              sfx.playCallBell();
              onOpenPractice();
            }}
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-6 py-3.5 rounded-xl text-sm font-bold transition-all border border-amber-500/40 flex items-center gap-2 shadow-lg hover:border-amber-400 hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Student Practice (AI Bench)</span>
          </button>
        </motion.div>

        {/* Indian Statutory Highlights Bar with Glass Card animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          {[
            {
              icon: BookOpen,
              title: 'BNS 2023 & IPC',
              desc: 'Cross-reference Bharatiya Nyaya Sanhita alongside former Indian Penal Code sections.'
            },
            {
              icon: Shield,
              title: 'BNSS 2023 & CrPC',
              desc: 'Simulate criminal procedure, bail applications, police custody, and remand rules.'
            },
            {
              icon: FileText,
              title: 'BSA 2023 Evidence',
              desc: 'Bharatiya Sakshya Adhiniyam Section 61 electronic evidence certification tags.'
            },
            {
              icon: Award,
              title: 'Moot Rubric Matrix',
              desc: '130-Point Indian Moot Court evaluation rubric & Supreme Court decree exports.'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                className="glass-card glass-card-hover rounded-2xl p-5"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">{item.title}</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">{item.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </header>

      {/* Statutory Comparison Spotlight Section */}
      <section className="py-16 relative border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="glass-pill text-emerald-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
              Indian Legal Reform Built-In
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-3 mb-2">
              Seamlessly Master the 2023 Criminal Laws (BNS, BNSS, BSA)
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto">
              Law students can instantly compare Bharatiya Nyaya Sanhita (BNS) provisions against classic IPC sections during live oral arguments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 border-emerald-500/30"
            >
              <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-3">
                <span className="font-serif font-bold text-emerald-200 text-sm">Bharatiya Nyaya Sanhita</span>
                <span className="bg-emerald-900/80 text-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">BNS 2023</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-emerald-300">BNS Sec 103</span>
                  <span className="text-slate-400 font-mono text-[11px]">Former IPC Sec 302 (Murder)</span>
                </li>
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-emerald-300">BNS Sec 111</span>
                  <span className="text-slate-400 font-mono text-[11px]">Organized Crime Syndicate</span>
                </li>
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-emerald-300">BNS Sec 356</span>
                  <span className="text-slate-400 font-mono text-[11px]">Former IPC Sec 499 (Defamation)</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 border-teal-500/30"
            >
              <div className="flex items-center justify-between mb-4 border-b border-teal-500/20 pb-3">
                <span className="font-serif font-bold text-teal-200 text-sm">Bharatiya Nagarik Suraksha</span>
                <span className="bg-teal-900/80 text-teal-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-500/40">BNSS 2023</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-teal-300">BNSS Sec 187</span>
                  <span className="text-slate-400 font-mono text-[11px]">Former CrPC Sec 167 (Custody)</span>
                </li>
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-teal-300">BNSS Sec 480</span>
                  <span className="text-slate-400 font-mono text-[11px]">Former CrPC Sec 437 (Bail Rules)</span>
                </li>
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-teal-300">BNSS Sec 223</span>
                  <span className="text-slate-400 font-mono text-[11px]">Pre-cognizance Notice</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-6 border-amber-500/30"
            >
              <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-3">
                <span className="font-serif font-bold text-amber-200 text-sm">Bharatiya Sakshya Adhiniyam</span>
                <span className="bg-amber-950/80 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40">BSA 2023</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-amber-300">BSA Sec 61</span>
                  <span className="text-slate-400 font-mono text-[11px]">Former Evidence Act Sec 65B</span>
                </li>
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-amber-300">BSA Sec 62</span>
                  <span className="text-slate-400 font-mono text-[11px]">Primary Electronic Evidence</span>
                </li>
                <li className="flex justify-between items-center glass-pill p-2.5 rounded-xl">
                  <span className="font-semibold text-amber-300">BSA Sec 24</span>
                  <span className="text-slate-400 font-mono text-[11px]">Former Evidence Act Sec 27</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Moot Court Operates */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
            How Court Proceedings Are Conducted
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Simulating authentic Indian Supreme Court & High Court moot proceedings with strict courtroom etiquette.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Create Bench & Proposition',
              desc: 'Presiding Judge or Court Registrar sets up courtroom, inputs BNS/IPC case facts, issues, and generates room code.'
            },
            {
              step: '2',
              title: 'Counsel Roll Call',
              desc: 'Students join as Petitioner Senior Counsel, Respondent ASG, Court Registrar, or Spectators.'
            },
            {
              step: '3',
              title: 'Oral Arguments & BSA Exhibits',
              desc: 'Advocates submit arguments, cite precedents, handle Bench interrogatives, and tender BSA Section 61 evidence.'
            },
            {
              step: '4',
              title: 'Judgment & PDF Decree',
              desc: 'The Bench evaluates performances on a 130-point matrix, issues final judgment decree, and downloads official PDF.'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-6 relative"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-900 text-amber-300 font-serif font-bold flex items-center justify-center border border-emerald-500/50 mb-4 text-sm shadow-md">
                {item.step}
              </div>
              <h3 className="text-sm font-bold text-emerald-200 mb-2">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Spotlights */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2 font-bold">
                <Gavel className="w-4 h-4 text-amber-400" /> Presiding Judicial Control
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">
                Full Judicial Authority Over Courtroom Proceedings
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Presiding Judges manage speaking floors, grant time extensions to Learned Counsel, rule on objections, issue instant judicial interrogatives, and declare court recess or judgment pronouncement.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Mute individual speakers or control advocate mic feeds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Sustain or overrule student objections with instant room notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Issue formal Bench interrogatives directly onto the court floor
                </li>
              </ul>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-2xl p-6 border-emerald-500/30"
            >
              <div className="glass-pill p-4 font-mono text-xs text-slate-200 space-y-3 rounded-xl">
                <div className="text-emerald-200 font-serif font-bold border-b border-white/10 pb-2 flex justify-between items-center">
                  <span>PRESIDING BENCH CONTROL</span>
                  <span className="text-emerald-300 font-sans text-[11px] font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    ● BENCH IN SESSION
                  </span>
                </div>
                <div className="flex justify-between items-center glass-pill p-2.5 rounded-lg">
                  <span className="font-sans text-xs text-slate-200">
                    <strong className="text-emerald-300">Floor:</strong> Learned Sr. Adv. Akash Sankar
                  </span>
                  <span className="text-emerald-300 font-bold bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/50">
                    08:45
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                  <button className="bg-emerald-600 text-slate-950 p-2 rounded-lg text-center font-bold hover:bg-emerald-500">
                    Grant Petitioner Floor
                  </button>
                  <button className="glass-card text-slate-200 p-2 rounded-lg text-center font-bold hover:bg-slate-800">
                    Call Union ASG
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Law Clerk Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="order-2 md:order-1 glass-card rounded-2xl p-6 border-amber-500/30"
            >
              <div className="glass-pill p-4 font-mono text-xs text-slate-200 space-y-3 rounded-xl">
                <div className="text-amber-200 font-serif font-bold border-b border-white/10 pb-2 flex justify-between items-center">
                  <span>NYAYA AI LAW CLERK</span>
                  <span className="text-amber-300 font-sans text-[11px] font-semibold bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    BNS / IPC INTELLIGENCE
                  </span>
                </div>
                <div className="space-y-2.5 font-sans text-xs">
                  <div className="bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/30">
                    <span className="font-bold text-amber-300">User Query:</span> "What Supreme Court precedent balances BNS Section 111 with Article 19(1)(a)?"
                  </div>
                  <div className="glass-pill p-2.5 rounded-lg text-slate-200 leading-relaxed">
                    <strong className="text-emerald-300">Nyaya AI:</strong> "Refer to Shreya Singhal v. Union of India (2015) 5 SCC 1 and K.S. Puttaswamy v. Union of India (2017) 10 SCC 1. Under BNS Section 111, state restrictions must satisfy narrow tailoring and clear syndicate criminal nexus."
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2 font-bold">
                <Cpu className="w-4 h-4 text-amber-400" /> Nyaya AI Law Clerk
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4">
                Instant Indian Legal Research & Section Mapping
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Ask the Nyaya AI Clerk to clarify BNS 2023 provisions, retrieve corresponding IPC 1860 sections, draft case summaries, or analyze oral transcript arguments against landmark Supreme Court judgments.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> BNS 2023, IPC 1860, BNSS & BSA 2023 statutory converter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Instant citations from Supreme Court of India & High Courts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-300 font-serif font-bold text-sm">
            <Scale className="w-4 h-4 text-amber-400" /> BHARAT VIRTUAL COURTROOM
          </div>
          <div className="text-slate-300 font-serif italic">"Satyameva Jayate" — Truth Alone Triumphs</div>
          <div className="text-emerald-300 font-semibold glass-pill px-3 py-1 rounded-full border border-emerald-500/30">
            Indian Academic Law Edition 2026
          </div>
        </div>
      </footer>
    </div>
  );
};
