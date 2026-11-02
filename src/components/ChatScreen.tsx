import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import {
  Send,
  Mic,
  MicOff,
  Copy,
  Share2,
  RotateCw,
  Trash2,
  Sparkles,
  Shield,
  Check,
  AlertCircle,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';

interface ChatScreenProps {
  onBack?: () => void;
}

const SAMPLE_PROMPTS = [
  'What is phishing?',
  'How can I secure my Gmail account?',
  'How do I create a strong password?',
  'What should I do if I clicked a suspicious link?',
  'How can I protect my personal data?',
];

export const ChatScreen: React.FC<ChatScreenProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello! I am **CyberGuard AI**, your personal defensive cybersecurity assistant.\n\nAsk me anything about threats, securing your accounts, password hygiene, or protecting your digital privacy.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [micPermissionState, setMicPermissionState] = useState<'idle' | 'prompting' | 'granted' | 'denied'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Voice speech-to-text setup using browser Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setMicPermissionState('granted');
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setMicPermissionState('denied');
          setErrorMessage('Microphone permission denied. Please allow microphone access in your browser settings.');
        } else {
          setErrorMessage(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleToggleVoice = async () => {
    setErrorMessage(null);
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!recognitionRef.current) {
      setErrorMessage('Speech recognition is not supported in this browser environment. You can type your query below.');
      return;
    }

    try {
      setMicPermissionState('prompting');
      // Explicitly check for navigator.mediaDevices permission as in native Android permission contract
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermissionState('granted');
      }
      recognitionRef.current.start();
    } catch (err: any) {
      console.warn('Microphone permission failed:', err);
      setMicPermissionState('denied');
      setErrorMessage('Microphone access was denied. Please allow audio permission or type your question.');
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantReply: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date()),
      };

      setMessages((prev) => [...prev, assistantReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackReply: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `### Simple Explanation\nI encountered a network issue, but CyberGuard AI defensive guidance applies: always keep your accounts secured with hardware MFA or an authenticator app, and review unexpected messages critically.\n\n### Threat Information\nAttackers rely on network disruptions or panic to lower defenses.\n\n### Prevention Steps\n1. Verify internet connectivity.\n2. Never execute unsolicited security scripts.\n\n### Recommended Actions\nRetry your request or inspect your network connection.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (id: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CyberGuard AI Security Advice',
          text,
        });
        setSharedId(id);
        setTimeout(() => setSharedId(null), 2000);
      } catch (err) {
        // user cancelled or share failed, fallback to copy
        handleCopy(id, text);
      }
    } else {
      handleCopy(id, text);
      setSharedId(id);
      setTimeout(() => setSharedId(null), 2000);
    }
  };

  const handleRegenerate = (index: number) => {
    // Find the nearest preceding user message
    for (let i = index - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        handleSendMessage(messages[i].content);
        return;
      }
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat cleared. Ask me any defensive cybersecurity question!`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Helper to format structured cybersecurity responses with styled sections
  const renderFormattedContent = (content: string) => {
    // Split by Markdown headers (### or **)
    const sections = content.split(/(?=###|\n\*\*)/);

    return (
      <div className="space-y-3 text-sm leading-relaxed">
        {sections.map((section, idx) => {
          const trimmed = section.trim();
          if (!trimmed) return null;

          let title = '';
          let body = trimmed;
          let badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';

          if (trimmed.startsWith('### Simple Explanation') || trimmed.startsWith('**Simple Explanation**')) {
            title = 'Simple Explanation';
            body = trimmed.replace(/^(###|\*\*)\s*Simple Explanation\s*(\*\*|:)?/i, '').trim();
            badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
          } else if (trimmed.startsWith('### Threat Information') || trimmed.startsWith('**Threat Information**')) {
            title = 'Threat Information';
            body = trimmed.replace(/^(###|\*\*)\s*Threat Information\s*(\*\*|:)?/i, '').trim();
            badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
          } else if (trimmed.startsWith('### Prevention Steps') || trimmed.startsWith('**Prevention Steps**')) {
            title = 'Prevention Steps';
            body = trimmed.replace(/^(###|\*\*)\s*Prevention Steps\s*(\*\*|:)?/i, '').trim();
            badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
          } else if (trimmed.startsWith('### Recommended Actions') || trimmed.startsWith('**Recommended Actions**')) {
            title = 'Recommended Actions';
            body = trimmed.replace(/^(###|\*\*)\s*Recommended Actions\s*(\*\*|:)?/i, '').trim();
            badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
          }

          if (title) {
            return (
              <div key={idx} className="rounded-lg bg-slate-900/60 p-2.5 border border-slate-800/80">
                <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border mb-1.5 ${badgeColor}`}>
                  {title}
                </span>
                <p className="text-slate-200 text-xs whitespace-pre-line leading-relaxed">
                  {body}
                </p>
              </div>
            );
          }

          return (
            <p key={idx} className="whitespace-pre-line text-slate-200 text-xs leading-relaxed">
              {trimmed.replace(/###/g, '').replace(/\*\*/g, '')}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0f1523] border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Security Chat
              <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.2 rounded bg-emerald-500/15">
                Defensive
              </span>
            </h2>
            <p className="text-[10px] text-slate-400">Powered by Google Gemini</p>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          title="Clear chat"
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Questions Chips (Visible when chat is fresh) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2.5 bg-[#0c121e] border-b border-slate-800/50">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">
            SUGGESTED CYBERSECURITY QUESTIONS
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SAMPLE_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/70 hover:bg-cyan-950/60 border border-slate-700/60 hover:border-cyan-500/40 text-xs text-cyan-300 transition shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-xs shadow-md'
                    : 'bg-[#121929] border border-slate-800 text-slate-200 rounded-bl-xs shadow-md'
                }`}
              >
                {isUser ? (
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                ) : (
                  renderFormattedContent(message.content)
                )}
              </div>

              {/* Action Buttons for AI Responses */}
              {!isUser && (
                <div className="flex items-center gap-1 mt-1.5 px-1 text-slate-400">
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="p-1.5 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition flex items-center gap-1 text-[11px]"
                    title="Copy response"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleShare(message.id, message.content)}
                    className="p-1.5 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition flex items-center gap-1 text-[11px]"
                    title="Share response"
                  >
                    {sharedId === message.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-cyan-400 text-[10px]">Shared</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">Share</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleRegenerate(index)}
                    className="p-1.5 hover:text-cyan-400 hover:bg-slate-800/50 rounded transition flex items-center gap-1 text-[11px]"
                    title="Regenerate response"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="text-[10px]">Regenerate</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#121929] border border-slate-800 max-w-[80%]">
            <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span className="text-xs text-slate-400 font-medium">
              Gemini is formulating defensive countermeasures...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error alert if mic was denied */}
      {errorMessage && (
        <div className="mx-4 mb-2 p-2 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Voice Listening Wave Indicator */}
      {isListening && (
        <div className="mx-4 mb-2 p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-between text-cyan-300 text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-semibold">Listening to your question...</span>
          </div>
          <button
            onClick={() => recognitionRef.current?.stop()}
            className="text-[11px] underline text-slate-400 hover:text-white"
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-[#0f1523] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone Voice Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            title={isListening ? 'Stop recording' : 'Speak cybersecurity question'}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center ${
              isListening
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-cyan-400'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isListening ? 'Listening...' : 'Ask CyberGuard AI...'}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#141d2f] border border-slate-700/80 focus:border-cyan-400 focus:outline-none text-sm text-white placeholder-slate-500 transition"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition flex items-center justify-center shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
