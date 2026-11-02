import React, { useState } from 'react';
import { PrivacyFinding, PrivacyScanResult } from '../types';
import { ThreatScoreGauge } from './ThreatScoreGauge';
import { saveScanRecord } from '../utils/storage';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  EyeOff,
  Copy,
  Check,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';

interface PrivacyScannerScreenProps {
  onBack: () => void;
}

const SAMPLE_TEXT = `Team, here are the production credentials:
Owner email: john@gmail.com and emergency mobile: +1-555-019-2834.
AWS Root Access Token: AKIAIOSFODNN7EXAMPLE
Google Maps API Key: AIzaSyD3x9-SampleMockKeyToken123456789
Test card for billing verification: 4532-1188-9920-3341
Main database connection string: postgres://admin:SuperSecretPass99!@db.internal.cyberguard.org:5432/users`;

export const PrivacyScannerScreen: React.FC<PrivacyScannerScreenProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<PrivacyScanResult | null>(null);
  const [maskedOutput, setMaskedOutput] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleScan = async (rawText?: string) => {
    const text = (rawText || inputText).trim();
    if (!text) return;

    setIsScanning(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-privacy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Privacy scan failed');
      }

      const data: PrivacyScanResult = await response.json();
      setResult(data);
      // Pre-calculate masked text
      setMaskedOutput(data.maskedText);

      // Save record without storing actual sensitive raw secrets
      saveScanRecord({
        scanType: 'Data Privacy Scan',
        riskLevel: data.findingsCount > 2 ? 'CRITICAL' : data.findingsCount > 0 ? 'HIGH' : 'LOW',
        riskScore: Math.min(data.findingsCount * 25, 95),
        shortResult: `Detected and masked ${data.findingsCount} sensitive data exposures`,
        detailsSnippet: `Scan processed ${data.originalTextLength} characters; identified PII & credentials.`,
      });
    } catch (err: any) {
      console.error('Privacy scanner error:', err);
      setErrorMessage('Privacy analysis failed. Please retry.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleMaskClick = () => {
    if (result) {
      setMaskedOutput(result.maskedText);
      // Feedback
      const el = document.getElementById('masked-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyMasked = () => {
    if (maskedOutput) {
      navigator.clipboard.writeText(maskedOutput);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setMaskedOutput(null);
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
              DATA PRIVACY SCANNER
            </h2>
            <p className="text-xs text-emerald-400">PII & Secret Credential Redactor</p>
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
          Paste text, logs, code, or notes to detect sensitive exposures:
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste text containing emails, phone numbers, API keys, passwords, database strings..."
          rows={4}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d2f] border border-slate-700/80 focus:border-emerald-400 focus:outline-none text-xs text-white placeholder-slate-500 transition resize-none leading-relaxed"
        />

        {/* Quick Sample Button */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              setInputText(SAMPLE_TEXT);
              handleScan(SAMPLE_TEXT);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-950/60 border border-slate-700/60 hover:border-emerald-500/40 text-[11px] text-emerald-300 transition"
          >
            Load Sample PII & Secret Credentials
          </button>
        </div>

        {/* Scan Button */}
        <button
          onClick={() => handleScan()}
          disabled={!inputText.trim() || isScanning}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-950 text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {isScanning ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>Scanning for Sensitive Exposures...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Scan Privacy & Leaks</span>
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
          {/* Summary & Mask Button Bar */}
          <div className="rounded-2xl bg-[#101726] border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SCAN FINDINGS
                </span>
                <div className="text-xl font-extrabold text-white font-['Outfit'] flex items-center gap-2">
                  <span>{result.findingsCount} Sensitive Items Detected</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  result.findingsCount > 2
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : result.findingsCount > 0
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {result.findingsCount > 2 ? 'CRITICAL RISK' : result.findingsCount > 0 ? 'RISK' : 'SAFE'}
              </span>
            </div>

            {/* MASK SENSITIVE DATA BUTTON */}
            <button
              onClick={handleMaskClick}
              className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-400/20"
            >
              <EyeOff className="w-4 h-4" />
              <span>[ MASK SENSITIVE DATA ]</span>
            </button>
          </div>

          {/* Masked Output Preview */}
          {maskedOutput && (
            <div
              id="masked-section"
              className="rounded-2xl bg-[#121c2d] border border-cyan-500/40 p-4 space-y-2.5 shadow-lg shadow-cyan-950/30"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  MASKED REDACTED OUTPUT
                </span>
                <button
                  onClick={handleCopyMasked}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Masked</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#090e18] border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                {maskedOutput}
              </div>
              <p className="text-[11px] text-slate-400">
                Notice how personal emails become <code className="text-cyan-300">j***@domain.com</code>, phone numbers are redacted, and secret tokens are masked before sharing.
              </p>
            </div>
          )}

          {/* Finding Cards */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-0.5">
              DETAILED EXPOSURE AUDIT
            </div>

            {result.findings.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#101726] border border-emerald-900/40 text-center text-xs text-emerald-300">
                No sensitive PII, passwords, or API secrets detected in provided text.
              </div>
            ) : (
              result.findings.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#101726] border border-slate-800/90 p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <AlertOctagon
                        className={`w-3.5 h-3.5 ${
                          item.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'
                        }`}
                      />
                      {item.finding}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    <span className="text-slate-500">Pattern: </span>
                    <code className="text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded">
                      {item.detectedPattern}
                    </code>
                  </div>

                  <div className="text-xs text-emerald-300 bg-emerald-950/30 border border-emerald-900/30 p-2 rounded-lg">
                    <span className="font-semibold">Recommended action: </span>
                    {item.recommendedAction}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
