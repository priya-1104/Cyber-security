import React, { useState } from 'react';
import { UrlAnalysisResult } from '../types';
import { ThreatScoreGauge } from './ThreatScoreGauge';
import { saveScanRecord } from '../utils/storage';
import {
  ArrowLeft,
  Link2,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Info,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface UrlSafetyScreenProps {
  onBack: () => void;
}

const SAMPLE_URLS = [
  { label: 'Suspicious IP Host', url: 'http://192.168.1.45:8080/secure-update.xyz' },
  { label: 'Typosquatted Brand', url: 'https://paypa1-security-center.top/auth' },
  { label: 'High-Risk TLD', url: 'http://account-verification-alert.click/login' },
  { label: 'Legitimate HTTPS', url: 'https://www.google.com/safetycenter' },
];

export const UrlSafetyScreen: React.FC<UrlSafetyScreenProps> = ({ onBack }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<UrlAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (targetUrl?: string) => {
    const raw = (targetUrl || urlInput).trim();
    if (!raw) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: raw }),
      });

      if (!response.ok) {
        throw new Error('URL analysis failed');
      }

      const data: UrlAnalysisResult = await response.json();
      setResult(data);

      saveScanRecord({
        scanType: 'URL Safety',
        riskLevel: data.riskLevel,
        riskScore: data.riskScore,
        shortResult: `URL Risk: ${data.riskLevel} (${data.riskScore}/100) - ${data.suspiciousCharacteristics[0] || 'Clean structural analysis'}`,
        detailsSnippet: raw,
      });
    } catch (err: any) {
      console.error('URL analysis error:', err);
      setErrorMessage('Failed to evaluate URL. Please verify internet connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUrlInput('');
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
              URL SAFETY CHECK
            </h2>
            <p className="text-xs text-sky-400">Defensive Link & Domain Inspector</p>
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

      {/* Input Box */}
      <div className="rounded-2xl bg-[#101726] border border-slate-800 p-4 space-y-3">
        <label className="block text-xs font-semibold text-slate-300">
          Paste URL to inspect:
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Link2 className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://example.com or http://192.168.1.1/login"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#141d2f] border border-slate-700/80 focus:border-sky-400 focus:outline-none text-xs text-white placeholder-slate-500 transition"
            />
          </div>
          <button
            onClick={async () => {
              try {
                const text = await navigator.clipboard.readText();
                setUrlInput(text);
              } catch (e) {
                // Clipboard read blocked
              }
            }}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-cyan-300 transition"
          >
            Paste
          </button>
        </div>

        {/* Sample URLs */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            QUICK SAMPLES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_URLS.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setUrlInput(sample.url);
                  handleAnalyze(sample.url);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-sky-950/60 border border-slate-700/60 hover:border-sky-500/40 text-[11px] text-sky-300 transition"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleAnalyze()}
          disabled={!urlInput.trim() || isAnalyzing}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-950 text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>Analyzing URL Structure...</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span>Analyze URL Safety</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Score & Risk Card */}
          <div className="rounded-2xl bg-[#101726] border border-slate-800 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                URL THREAT EVALUATION
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-white font-['Outfit']">
                  Risk Level:
                </span>
                <span
                  className={`text-2xl font-extrabold ${
                    result.riskLevel === 'CRITICAL'
                      ? 'text-rose-400'
                      : result.riskLevel === 'HIGH'
                      ? 'text-orange-400'
                      : result.riskLevel === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {result.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Risk Score: {result.riskScore}/100
              </p>
            </div>

            <ThreatScoreGauge score={result.riskScore} level={result.riskLevel} size={76} />
          </div>

          {/* Suspicious characteristics */}
          <div className="rounded-2xl bg-[#101726] border border-slate-800 p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Suspicious characteristics
            </h3>
            <div className="space-y-2">
              {result.suspiciousCharacteristics.map((char, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#141c2c] border border-slate-800 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="text-xs text-slate-200 leading-relaxed">{char}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety recommendations */}
          <div className="rounded-2xl bg-[#0e1b1b] border border-emerald-900/40 p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Safety recommendations
            </h3>
            <div className="space-y-2">
              {result.safetyRecommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#112323] border border-emerald-900/40 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {result.disclaimer ||
                'This is a heuristic AI assessment and does not guarantee that a URL is safe or malicious.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
