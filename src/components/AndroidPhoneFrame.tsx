import React, { useState, useEffect } from 'react';
import { ActiveTab, ActiveToolView } from '../types';
import {
  Home,
  MessageSquareCode,
  ShieldAlert,
  Settings,
  Wifi,
  Signal,
  BatteryCharging,
  Maximize2,
  Minimize2,
  Smartphone,
  Code2,
  Download,
} from 'lucide-react';

interface AndroidPhoneFrameProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSourceModal: () => void;
}

export const AndroidPhoneFrame: React.FC<AndroidPhoneFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  onOpenSourceModal,
}) => {
  const [currentTime, setCurrentTime] = useState('11:04');
  const [isPhoneFrameMode, setIsPhoneFrameMode] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#06090f] text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none">
      {/* Top Floating Control Bar for Live Preview Environment */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Android 15 • Pixel 9 Pro</span>
        </div>

        <div className="flex items-center gap-2">
          {installPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-medium transition"
              title="Install CyberGuard AI app on Google Chrome / Home Screen"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </button>
          )}

          <button
            onClick={onOpenSourceModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-medium transition"
            title="Inspect Native Android Kotlin / Jetpack Compose Source Code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Kotlin / Compose</span>
          </button>

          <button
            onClick={() => setIsPhoneFrameMode(!isPhoneFrameMode)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title={isPhoneFrameMode ? 'Expand to Full Width' : 'Switch to Phone Frame'}
          >
            {isPhoneFrameMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Flagship Android Phone Body */}
      <div
        className={`relative flex flex-col transition-all duration-300 ${
          isPhoneFrameMode
            ? 'w-full sm:w-[390px] h-[100vh] sm:h-[820px] rounded-none sm:rounded-[48px] border-0 sm:border-[9px] border-[#1e283d] shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_20px_rgba(0,229,255,0.15)] ring-1 ring-white/10'
            : 'w-full max-w-2xl h-[100vh] sm:h-[840px] rounded-none sm:rounded-3xl border-0 sm:border border-slate-800 shadow-2xl'
        } bg-[#090d16] overflow-hidden`}
      >
        {/* Android Top Bezel / Status Bar */}
        <div className="relative z-30 flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold text-slate-300 bg-[#090d16]/95 backdrop-blur-sm select-none">
          {/* Left: Clock */}
          <div className="text-xs font-mono font-bold tracking-tight text-white pl-1">
            {currentTime}
          </div>

          {/* Center: Punch Hole Camera */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-4 h-4 rounded-full bg-black border border-slate-800 shadow-inner flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0a1525] border border-cyan-900/60" />
          </div>

          {/* Right: Android Status Icons (5G, Wi-Fi, Battery) */}
          <div className="flex items-center gap-2 text-slate-300">
            <div className="flex items-center text-[10px] font-bold text-cyan-400">5G</div>
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-slate-300">94%</span>
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Content Viewport */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Android 15 Material 3 Bottom Navigation Bar */}
        <div className="relative z-30 bg-[#0c121e]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1 flex flex-col items-center">
          <div className="w-full grid grid-cols-4 gap-1 py-1">
            {/* 1. Home Tab */}
            <button
              onClick={() => onTabChange('home')}
              className={`flex flex-col items-center py-1 rounded-2xl transition ${
                activeTab === 'home'
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  activeTab === 'home' ? 'bg-cyan-500/20 shadow-sm shadow-cyan-500/20' : ''
                }`}
              >
                <Home className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-wide">Home</span>
            </button>

            {/* 2. AI Security Chat Tab */}
            <button
              onClick={() => onTabChange('chat')}
              className={`flex flex-col items-center py-1 rounded-2xl transition ${
                activeTab === 'chat'
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  activeTab === 'chat' ? 'bg-cyan-500/20 shadow-sm shadow-cyan-500/20' : ''
                }`}
              >
                <MessageSquareCode className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-wide">AI Chat</span>
            </button>

            {/* 3. Defense Scanners Tab */}
            <button
              onClick={() => onTabChange('scan')}
              className={`flex flex-col items-center py-1 rounded-2xl transition ${
                activeTab === 'scan'
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  activeTab === 'scan' ? 'bg-cyan-500/20 shadow-sm shadow-cyan-500/20' : ''
                }`}
              >
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-wide">Scanners</span>
            </button>

            {/* 4. Settings Tab */}
            <button
              onClick={() => onTabChange('settings')}
              className={`flex flex-col items-center py-1 rounded-2xl transition ${
                activeTab === 'settings'
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  activeTab === 'settings' ? 'bg-cyan-500/20 shadow-sm shadow-cyan-500/20' : ''
                }`}
              >
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-wide">Settings</span>
            </button>
          </div>

          {/* Android Gesture Navigation Pill */}
          <div className="w-32 h-1 bg-slate-600/80 rounded-full my-1.5" />
        </div>
      </div>
    </div>
  );
};
