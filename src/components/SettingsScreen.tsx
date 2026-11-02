import React, { useState } from 'react';
import { clearAllScanHistory } from '../utils/storage';
import {
  Moon,
  Bell,
  Languages,
  Trash2,
  Shield,
  Info,
  ChevronRight,
  Check,
  Code2,
  FileCode,
  X,
  ExternalLink,
} from 'lucide-react';

interface SettingsScreenProps {
  onOpenSourceModal?: () => void;
  onClearChat?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onOpenSourceModal,
  onClearChat,
}) => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [selectedLang, setSelectedLang] = useState('English (US)');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleClearHistory = () => {
    if (window.confirm('Clear all local scan history?')) {
      clearAllScanHistory();
      setActionNotice('Scan history cleared.');
      setTimeout(() => setActionNotice(null), 2500);
    }
  };

  const handleClearChatHistory = () => {
    if (window.confirm('Clear conversational chat memory?')) {
      if (onClearChat) onClearChat();
      setActionNotice('Chat conversation memory reset.');
      setTimeout(() => setActionNotice(null), 2500);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5 pb-24 text-slate-100">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide font-['Outfit']">
          SETTINGS
        </h2>
        <p className="text-xs text-slate-400">Device Preferences & Data Controls</p>
      </div>

      {actionNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Preferences Section */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-0.5">
          APP PREFERENCES
        </div>
        <div className="rounded-2xl bg-[#101726] border border-slate-800 divide-y divide-slate-800/80">
          {/* Dark Mode */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Dark Mode</div>
                <div className="text-xs text-slate-400">CyberGuard high-contrast theme</div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                darkMode ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                  darkMode ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Notifications</div>
                <div className="text-xs text-slate-400">Threat updates & security alerts</div>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                notifications ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform absolute top-0.5 ${
                  notifications ? 'translate-x-6.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Language */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <Languages className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Language</div>
                <div className="text-xs text-slate-400">Application display locale</div>
              </div>
            </div>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-cyan-300 focus:outline-none"
            >
              <option value="English (US)">English (US)</option>
              <option value="Español">Español</option>
              <option value="Français">Français</option>
              <option value="Deutsch">Deutsch</option>
              <option value="日本語">日本語</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-0.5">
          DATA MANAGEMENT
        </div>
        <div className="rounded-2xl bg-[#101726] border border-slate-800 divide-y divide-slate-800/80">
          {/* Clear Chat */}
          <button
            onClick={handleClearChatHistory}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 transition">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Clear Chat</div>
                <div className="text-xs text-slate-400">Wipe session conversation memory</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
          </button>

          {/* Clear Scan History */}
          <button
            onClick={handleClearHistory}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-rose-400 group-hover:bg-rose-500/20 transition">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Clear Scan History</div>
                <div className="text-xs text-slate-400">Delete all local threat inspection records</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
          </button>
        </div>
      </div>

      {/* Native Android Project Inspector Button */}
      {onOpenSourceModal && (
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 px-0.5">
            NATIVE ANDROID DEVELOPMENT
          </div>
          <button
            onClick={onOpenSourceModal}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/40 hover:border-cyan-400 flex items-center justify-between transition group text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  Kotlin / Jetpack Compose Source
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    android/
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Inspect Android Studio project files & Gradle config
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition" />
          </button>
        </div>
      )}

      {/* About & Privacy Section */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-0.5">
          ABOUT & LEGAL
        </div>
        <div className="rounded-2xl bg-[#101726] border border-slate-800 divide-y divide-slate-800/80">
          {/* Privacy Information */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Privacy Information</div>
                <div className="text-xs text-slate-400">Zero data retention guarantee</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
          </button>

          {/* About CyberGuard AI */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">About CyberGuard AI</div>
                <div className="text-xs text-slate-400">Version 1.0.0 (Native Android)</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition" />
          </button>
        </div>
      </div>

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f1728] border border-cyan-500/40 p-5 space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Privacy Information
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong>CyberGuard AI</strong> is designed with defensive cybersecurity ethics at its core:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>Your text inputs are inspected exclusively for defensive threat assessment.</li>
                <li>No sensitive personal passwords, tokens, or credentials are saved without encryption.</li>
                <li>Scan histories are saved strictly to on-device Android storage.</li>
                <li>Zero sale or transmission of personal behavioral analytics.</li>
              </ul>
            </div>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f1728] border border-cyan-500/40 p-5 space-y-3 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                About CyberGuard AI
              </h3>
              <button
                onClick={() => setShowAboutModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
              <p className="font-semibold text-white">
                CyberGuard AI • Intelligent Cybersecurity Assistant
              </p>
              <p className="text-slate-400">
                Built natively for Android utilizing Kotlin, Jetpack Compose, Material 3, and Google Gemini AI.
              </p>
              <p className="text-slate-400">
                <strong>Defensive Directive:</strong> Does not generate malware, exploit payloads, or penetration attacks. Focuses strictly on consumer and developer protection, identifying phishing, validating links, and redacting private credentials.
              </p>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
