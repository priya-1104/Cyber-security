import React, { useState, useEffect } from 'react';
import { ScanHistoryRecord, ThreatLevel } from '../types';
import { getScanHistory, deleteScanRecord, clearAllScanHistory } from '../utils/storage';
import { ThreatScoreGauge } from './ThreatScoreGauge';
import {
  ArrowLeft,
  Trash2,
  Trash,
  Calendar,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  X,
  History,
} from 'lucide-react';

interface ScanHistoryScreenProps {
  onBack: () => void;
}

export const ScanHistoryScreen: React.FC<ScanHistoryScreenProps> = ({ onBack }) => {
  const [history, setHistory] = useState<ScanHistoryRecord[]>([]);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<ScanHistoryRecord | null>(null);

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  const handleDeleteItem = (id: string) => {
    const updated = deleteScanRecord(id);
    setHistory(updated);
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all local scan history?')) {
      const empty = clearAllScanHistory();
      setHistory(empty);
      setSelectedRecord(null);
    }
  };

  const filtered = history.filter((item) => {
    if (filterType === 'ALL') return true;
    return item.scanType === filterType;
  });

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
              SCAN HISTORY
            </h2>
            <p className="text-xs text-cyan-400">Encrypted Local Device Storage</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {['ALL', 'Phishing Check', 'URL Safety', 'Data Privacy Scan', 'Security Text Analyzer'].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                filterType === type
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-[#121929] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {type === 'ALL' ? 'All Records' : type}
            </button>
          )
        )}
      </div>

      {/* List of History Records */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#101726] border border-slate-800 text-center space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Scan Records Found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {filterType === 'ALL'
              ? 'Your on-device security audit trail is currently empty. Run a scan from the Home tab to begin.'
              : `No scans recorded under ${filterType}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const isCritical = item.riskLevel === 'CRITICAL';
            const isHigh = item.riskLevel === 'HIGH';
            const isMedium = item.riskLevel === 'MEDIUM';

            const badgeColor = isCritical
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
              : isHigh
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/30'
              : isMedium
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

            return (
              <div
                key={item.id}
                className="rounded-xl bg-[#101726] border border-slate-800 hover:border-slate-700 p-3.5 space-y-2.5 transition"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white font-['Outfit']">
                        {item.scanType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
                      >
                        {item.riskLevel} ({item.riskScore}/100)
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {item.shortResult}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedRecord(item)}
                      title="View details"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* Delete Item Button */}
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete record"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span className="flex items-center gap-1 text-[10px]">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {item.date}
                  </span>
                  <button
                    onClick={() => setSelectedRecord(item)}
                    className="text-cyan-400 hover:underline text-[10px] font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#0f1728] border border-cyan-500/40 p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Scan Audit Record</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Scan Type:</span>
                <span className="font-bold text-white">{selectedRecord.scanType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date Logged:</span>
                <span className="text-slate-200">{selectedRecord.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Risk Assessment:</span>
                <span className="font-bold text-cyan-400">
                  {selectedRecord.riskLevel} ({selectedRecord.riskScore}/100)
                </span>
              </div>

              <div className="pt-2">
                <div className="text-slate-400 mb-1">Result Summary:</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                  {selectedRecord.shortResult}
                </div>
              </div>

              <div className="pt-1">
                <div className="text-slate-400 mb-1">Content Snippet:</div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] break-all max-h-24 overflow-y-auto">
                  {selectedRecord.detailsSnippet}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => handleDeleteItem(selectedRecord.id)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <Trash className="w-3.5 h-3.5" />
                Delete Record
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
