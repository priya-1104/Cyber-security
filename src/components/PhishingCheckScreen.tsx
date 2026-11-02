import React, { useState } from 'react';
import { PhishingAnalysisResult, ThreatLevel } from '../types';
import { ThreatScoreGauge } from './ThreatScoreGauge';
import { saveScanRecord } from '../utils/storage';
import {
  ArrowLeft,
  MailWarning,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Info,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface PhishingCheckScreenProps {
  onBack: () => void;
}

const SAMPLE_MESSAGES = [
  {
    type: 'SMS',
    label: 'Netflix Payment SMS',
    text: 'URGENT: Your Netflix membership payment has failed. Your account will be suspended in 24 hours. Update your billing details now: http://pay-netflix-sec.xyz/verify',
  },
  {
    type: 'Email',
    label: 'Bank Fraud Alert Email',
    text: 'Security Alert: We detected an unauthorized login attempt from an unknown device. If this was not you, confirm your credentials immediately to avoid permanent account lock: https://secure-chase-auth.top/login',
  },
  {
    type: 'WhatsApp',
    label: 'WhatsApp Job Offer',
    text: 'Hi dear! I am HR manager at Amazon Prime. You have been selected for part-time remote work $500/day. Send your CV and $50 verification deposit via Bitcoin link: http://remote-crypto-hire.club',
  },
];

export const PhishingCheckScreen: React.FC<PhishingCheckScreenProps> = ({ onBack }) => {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PhishingAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || content).trim();
    if (!text) return;

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-phishing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text }),
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const data: PhishingAnalysisResult = await response.json();
      setResult(data);

      // Save to local device scan history
      saveScanRecord({
        scanType: 'Phishing Check',
        riskLevel: data.riskLevel,
        riskScore: data.riskScore,
        shortResult: data.whyDangerous.slice(0, 75) + '...',
        detailsSnippet: text.slice(0, 100),
      });
    } catch (err: any) {
      console.error('Phishing check error:', err);
      setErrorMessage('Unable to connect to analysis engine. Please try again.');
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
      {/* Top Header */}
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
              PHISHING CHECK
            </h2>
            <p className="text-xs text-amber-400">Social Engineering & Scam Inspector</p>
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
      <div className="rounded-2xl bg-[#101726] border border-slate-800/90 p-4 space-y-3">
        <label className="block text-xs font-semibold text-slate-300">
          Paste Email, SMS, WhatsApp, or Social Media text:
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="e.g., URGENT: Your account has been suspended! Verify your credentials within 24 hours to restore access: http://suspicious-link.com"
          rows={4}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#141d2f] border border-slate-700/80 focus:border-amber-400 focus:outline-none text-xs text-white placeholder-slate-500 transition resize-none leading-relaxed"
        />

        {/* Quick Sample Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            OR TEST WITH A SAMPLE:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_MESSAGES.map((sample, i) => (
              <button
                key={i}
                onClick={() => {
                  setContent(sample.text);
                  handleAnalyze(sample.text);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-950/60 border border-slate-700/60 hover:border-amber-500/40 text-[11px] text-amber-300 transition"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleAnalyze()}
          disabled={!content.trim() || isAnalyzing}
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-slate-950 text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>Analyzing with Gemini Defensive Engine...</span>
            </>
          ) : (
            <>
              <MailWarning className="w-4 h-4" />
              <span>Analyze Phishing Indicators</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Threat Score Card */}
          <div className="rounded-2xl bg-[#101726] border border-slate-800 p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                PHISHING RISK ASSESSMENT
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
                Calculated Risk Score: {result.riskScore}/100
              </p>
            </div>

            <ThreatScoreGauge score={result.riskScore} level={result.riskLevel} size={76} />
          </div>

          {/* 5 Mandatory Indicator Checks */}
          <div className="rounded-2xl bg-[#101726] border border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              INDICATOR ANALYSIS BREAKDOWN
            </div>

            <div className="space-y-2.5">
              <IndicatorCheckRow
                title="Suspicious wording"
                detected={result.suspiciousWording.detected}
                details={result.suspiciousWording.details}
              />
              <IndicatorCheckRow
                title="Urgency indicators"
                detected={result.urgencyIndicators.detected}
                details={result.urgencyIndicators.details}
              />
              <IndicatorCheckRow
                title="Impersonation indicators"
                detected={result.impersonationIndicators.detected}
                details={result.impersonationIndicators.details}
              />
              <IndicatorCheckRow
                title="Suspicious requests"
                detected={result.suspiciousRequests.detected}
                details={result.suspiciousRequests.details}
              />
              <IndicatorCheckRow
                title="Potential social engineering indicators"
                detected={result.socialEngineeringIndicators.detected}
                details={result.socialEngineeringIndicators.details}
              />
            </div>
          </div>

          {/* Why this may be dangerous */}
          <div className="rounded-2xl bg-[#17131e] border border-rose-900/40 p-4 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Why this may be dangerous
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {result.whyDangerous}
            </p>
          </div>

          {/* What you should do */}
          <div className="rounded-2xl bg-[#0f1d1c] border border-emerald-900/40 p-4 space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              What you should do
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {result.whatToDo}
            </p>
          </div>

          {/* Mandated Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {result.disclaimer ||
                'This is an indicator-based assessment and does not guarantee certainty.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const IndicatorCheckRow: React.FC<{
  title: string;
  detected: boolean;
  details: string;
}> = ({ title, detected, details }) => {
  return (
    <div className="p-2.5 rounded-xl bg-[#141c2c] border border-slate-800/80 flex items-start gap-2.5">
      <div className="mt-0.5">
        {detected ? (
          <XCircle className="w-4 h-4 text-rose-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white">✓ {title}</span>
          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
              detected
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {detected ? 'Flagged' : 'Clean'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">{details}</p>
      </div>
    </div>
  );
};
