export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ActiveTab = 'home' | 'chat' | 'scan' | 'settings';
export type ScreenTab = ActiveTab;

export type ActiveToolView =
  | 'overview'
  | 'ai_chat'
  | 'phishing_check'
  | 'url_safety'
  | 'privacy_scanner'
  | 'text_analyzer'
  | 'scan_history';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface PhishingAnalysisResult {
  riskLevel: ThreatLevel;
  riskScore: number;
  suspiciousWording: { detected: boolean; details: string };
  urgencyIndicators: { detected: boolean; details: string };
  impersonationIndicators: { detected: boolean; details: string };
  suspiciousRequests: { detected: boolean; details: string };
  socialEngineeringIndicators: { detected: boolean; details: string };
  whyDangerous: string;
  whatToDo: string;
  disclaimer: string;
}

export interface UrlAnalysisResult {
  riskLevel: ThreatLevel;
  riskScore: number;
  suspiciousCharacteristics: string[];
  safetyRecommendations: string[];
  disclaimer: string;
}

export interface PrivacyFinding {
  finding: string;
  severity: ThreatLevel;
  detectedPattern: string;
  recommendedAction: string;
}

export interface PrivacyScanResult {
  originalTextLength: number;
  findingsCount: number;
  findings: PrivacyFinding[];
  maskedText: string;
}

export interface SecurityTextAnalysisResult {
  possibleThreat: string;
  riskLevel: ThreatLevel;
  riskScore: number;
  suspiciousIndicators: string[];
  recommendedDefensiveAction: string;
  summary: string;
}

export interface ScanHistoryRecord {
  id: string;
  scanType: 'Phishing Check' | 'URL Safety' | 'Data Privacy Scan' | 'Security Text Analyzer';
  date: string;
  riskLevel: ThreatLevel;
  riskScore: number;
  shortResult: string;
  detailsSnippet: string;
}
