import React from 'react';
import { ActiveToolView } from '../types';
import {
  MailWarning,
  Link2,
  ShieldCheck,
  FileSearch,
  History,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';

interface ScanHubViewProps {
  onSelectTool: (tool: ActiveToolView) => void;
}

export const ScanHubView: React.FC<ScanHubViewProps> = ({ onSelectTool }) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 pb-24 text-slate-100">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide font-['Outfit']">
          DEFENSE SCANNERS
        </h2>
        <p className="text-xs text-slate-400">
          Specialized defensive engines powered by Google Gemini AI
        </p>
      </div>

      {/* Grid / List of Scanners */}
      <div className="space-y-3">
        {/* Phishing Check */}
        <button
          onClick={() => onSelectTool('phishing_check')}
          className="w-full p-4 rounded-2xl bg-[#101726] hover:bg-[#141e30] border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between group text-left shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition">
              <MailWarning className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Phishing Check
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-medium">
                  5 Indicators
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyze emails, SMS, WhatsApp & social messages
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* URL Safety */}
        <button
          onClick={() => onSelectTool('url_safety')}
          className="w-full p-4 rounded-2xl bg-[#101726] hover:bg-[#141e30] border border-slate-800 hover:border-sky-500/40 transition flex items-center justify-between group text-left shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                URL Safety Check
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-medium">
                  Heuristics
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect typosquatting, raw IP hosts & deceptive TLDs
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-sky-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* Data Privacy Scanner */}
        <button
          onClick={() => onSelectTool('privacy_scanner')}
          className="w-full p-4 rounded-2xl bg-[#101726] hover:bg-[#141e30] border border-slate-800 hover:border-emerald-500/40 transition flex items-center justify-between group text-left shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Data Privacy Scanner
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  Masking
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Detect emails, phone numbers, API keys & mask secrets
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* Security Text Analyzer */}
        <button
          onClick={() => onSelectTool('text_analyzer')}
          className="w-full p-4 rounded-2xl bg-[#101726] hover:bg-[#141e30] border border-slate-800 hover:border-purple-500/40 transition flex items-center justify-between group text-left shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Security Text Analyzer
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-medium">
                  Report Card
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyze commands, scripts, anomalies & system logs
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition" />
        </button>

        {/* Scan History Audit Trail */}
        <button
          onClick={() => onSelectTool('scan_history')}
          className="w-full p-4 rounded-2xl bg-[#0c1322] hover:bg-[#10182a] border border-cyan-500/30 hover:border-cyan-400 transition flex items-center justify-between group text-left shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Scan History</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit on-device records of past threat checks
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
        </button>
      </div>
    </div>
  );
};
