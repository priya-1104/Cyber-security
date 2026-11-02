import React from 'react';
import { ThreatLevel } from '../types';

interface ThreatScoreGaugeProps {
  score: number;
  level?: ThreatLevel;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const getThreatLevelFromScore = (score: number): ThreatLevel => {
  if (score <= 25) return 'LOW';
  if (score <= 50) return 'MEDIUM';
  if (score <= 75) return 'HIGH';
  return 'CRITICAL';
};

export const getThreatColors = (level: ThreatLevel) => {
  switch (level) {
    case 'LOW':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        stroke: '#10b981',
        glow: 'rgba(16, 185, 129, 0.4)',
        badge: 'bg-emerald-950 text-emerald-300 border-emerald-800/60',
      };
    case 'MEDIUM':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        stroke: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.4)',
        badge: 'bg-amber-950 text-amber-300 border-amber-800/60',
      };
    case 'HIGH':
      return {
        text: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        stroke: '#f97316',
        glow: 'rgba(249, 115, 22, 0.4)',
        badge: 'bg-orange-950 text-orange-300 border-orange-800/60',
      };
    case 'CRITICAL':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        stroke: '#f43f5e',
        glow: 'rgba(244, 63, 94, 0.4)',
        badge: 'bg-rose-950 text-rose-300 border-rose-800/60',
      };
  }
};

export const ThreatScoreGauge: React.FC<ThreatScoreGaugeProps> = ({
  score,
  level,
  size = 84,
  strokeWidth = 8,
  showLabel = true,
}) => {
  const resolvedLevel = level || getThreatLevelFromScore(score);
  const colors = getThreatColors(resolvedLevel);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease',
              filter: `drop-shadow(0 0 6px ${colors.glow})`,
            }}
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold tracking-tight text-white leading-none">
            {normalizedScore}
          </span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">
            /100
          </span>
        </div>
      </div>

      {showLabel && (
        <span
          className={`mt-2 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full border ${colors.badge}`}
        >
          {resolvedLevel}
        </span>
      )}
    </div>
  );
};
