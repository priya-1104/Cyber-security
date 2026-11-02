import { ScanHistoryRecord } from '../types';

const STORAGE_KEY = 'cyberguard_scan_history_v1';

export const getScanHistory = (): ScanHistoryRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with sample demo scan records as requested: "Use sample/demo data where real data is unavailable."
      const demoRecords: ScanHistoryRecord[] = [
        {
          id: 'demo-1',
          scanType: 'Phishing Check',
          date: 'Today, 10:15 AM',
          riskLevel: 'CRITICAL',
          riskScore: 84,
          shortResult: 'Urgent Netflix payment suspension SMS mimicry detected',
          detailsSnippet: 'Contains deceptive link pay-netflix-sec.xyz demanding payment update within 24h.',
        },
        {
          id: 'demo-2',
          scanType: 'URL Safety',
          date: 'Yesterday, 3:40 PM',
          riskLevel: 'HIGH',
          riskScore: 72,
          shortResult: 'Raw IP address host with deceptive login parameters',
          detailsSnippet: 'http://192.168.1.45:8080/secure-update.xyz lacks HTTPS TLS encryption.',
        },
        {
          id: 'demo-3',
          scanType: 'Data Privacy Scan',
          date: 'Sep 05, 1:20 PM',
          riskLevel: 'MEDIUM',
          riskScore: 40,
          shortResult: 'Personal email and phone number masked before sharing',
          detailsSnippet: 'Redacted 2 email addresses and 1 cellular contact number.',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoRecords));
      return demoRecords;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load scan history:', e);
    return [];
  }
};

export const saveScanRecord = (record: Omit<ScanHistoryRecord, 'id' | 'date'>) => {
  try {
    const current = getScanHistory();
    const newRecord: ScanHistoryRecord = {
      ...record,
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }).format(new Date()),
    };
    const updated = [newRecord, ...current].slice(0, 50); // Keep latest 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newRecord;
  } catch (e) {
    console.error('Failed to save scan record:', e);
    return null;
  }
};

export const deleteScanRecord = (id: string) => {
  try {
    const current = getScanHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete scan record:', e);
    return [];
  }
};

export const clearAllScanHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (e) {
    console.error('Failed to clear scan history:', e);
    return [];
  }
};
