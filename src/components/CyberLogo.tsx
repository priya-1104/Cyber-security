import React from 'react';

interface CyberLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const CyberLogo: React.FC<CyberLogoProps> = ({ size = 'md', showSubtitle = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3">
      {/* Original CyberGuard AI Shield Graphic */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20`}
      >
        <div className="w-full h-full bg-[#0d1424] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Circuit nodes pattern overlay */}
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:6px_6px]" />
          
          {/* Custom SVG Shield & Defense Node Vector */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-3/5 h-3/5 text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" stroke="#00e5ff" strokeWidth="2.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`${titleSizes[size]} font-extrabold tracking-wider text-white font-['Outfit']`}>
            CYBERGUARD <span className="text-cyan-400">AI</span>
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 tracking-wider">
            DEFENSE
          </span>
        </div>
        {showSubtitle && (
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            Intelligent Cybersecurity Assistant
          </span>
        )}
      </div>
    </div>
  );
};
