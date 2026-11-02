import React from 'react';
import { CyberLogo } from './CyberLogo';
import { ActiveToolView } from '../types';
import {
  MessageSquareCode,
  MailWarning,
  Link2,
  ShieldCheck,
  FileSearch,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Lock,
  Activity,
  History,
  Info,
} from 'lucide-react';

interface HomeScreenProps {
  onNavigateToTool: (tool: ActiveToolView) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToTool }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 pb-24 text-slate-100">
      {/* Brand Header */}
      <div className="flex items-center justify-between">
        <CyberLogo size="md" />
        <button
          onClick={() => onNavigateToTool('scan_history')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-xs font-semibold text-cyan-400 transition"
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {/* Subtitle & Tagline */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
          Your AI Cybersecurity Assistant
        </h2>
        <p className="text-sm text-cyan-400 font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Stay Safe. Stay Protected.
        </p>
      </div>

      {/* Security Score Card (82/100 Good) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121b2d] via-[#101726] to-[#0a0f1c] border border-cyan-500/20 p-5 shadow-xl shadow-cyan-950/20">
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              SECURITY SCORE
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-white font-['Outfit']">82</span>
              <span className="text-sm font-semibold text-slate-400">/100</span>
            </div>
            <div className="pt-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Good • Guarded
              </span>
            </div>
          </div>

          {/* Circular Visual Gauge */}
          <div className="relative flex items-center justify-center w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="33"
                stroke="#1e293b"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="33"
                stroke="#00e5ff"
                strokeWidth="7"
                strokeDasharray="207.3"
                strokeDashoffset={207.3 - (82 / 100) * 207.3}
                strokeLinecap="round"
                fill="transparent"
                className="drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Lock className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        {/* Mini Defense Telemetry */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <div className="text-slate-400 text-[10px]">Phishing Filter</div>
            <div className="font-bold text-emerald-400">Active</div>
          </div>
          <div className="border-x border-slate-800">
            <div className="text-slate-400 text-[10px]">Data Masking</div>
            <div className="font-bold text-cyan-400">Ready</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px]">AI Engine</div>
            <div className="font-bold text-white">Gemini 3.8</div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-0.5">
          <span>DEFENSIVE SECURITY MODULES</span>
          <span className="text-[10px] text-cyan-400/80 font-normal lowercase">5 tools active</span>
        </div>

        {/* 1. AI Security Chat */}
        <button
          onClick={() => onNavigateToTool('ai_chat')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#111927] hover:bg-[#162133] border border-slate-800/90 hover:border-cyan-500/40 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                AI Security Chat
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-medium">
                  Voice STT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ChatGPT-style defense Q&A & threat explanations
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* 2. Phishing Check */}
        <button
          onClick={() => onNavigateToTool('phishing_check')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#111927] hover:bg-[#162133] border border-slate-800/90 hover:border-amber-500/40 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <MailWarning className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Phishing Check</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyze emails, SMS & WhatsApp messages
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* 3. URL Safety */}
        <button
          onClick={() => onNavigateToTool('url_safety')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#111927] hover:bg-[#162133] border border-slate-800/90 hover:border-blue-500/40 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">URL Safety</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Heuristic inspection of domains, TLDs & links
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* 4. Data Privacy Scan */}
        <button
          onClick={() => onNavigateToTool('privacy_scanner')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#111927] hover:bg-[#162133] border border-slate-800/90 hover:border-emerald-500/40 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                Data Privacy Scan
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  Masking
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Find leaked credentials & mask sensitive PII
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* 5. Security Text Analyzer */}
        <button
          onClick={() => onNavigateToTool('text_analyzer')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#111927] hover:bg-[#162133] border border-slate-800/90 hover:border-purple-500/40 transition group text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Security Text Analyzer</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect suspicious logs, commands & system text
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
        </button>
      </div>

      {/* Defensive Cybersecurity Tip Card */}
      <div className="rounded-xl bg-[#101726] border border-slate-800 p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          Defensive Security Principle
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Never share temporary One-Time Passwords (OTPs) or recovery codes over chat or phone calls. Legitimate security personnel will never request your active credentials.
        </p>
      </div>
    </div>
  );
};
