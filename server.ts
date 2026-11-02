import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.NODE_ENV === 'production'
  ? (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000)
  : 3000;

app.use(express.json({ limit: '10mb' }));

// Enable CORS for universal access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Lazy initialization of Gemini API Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

const DEFENSE_SAFETY_SYSTEM_INSTRUCTION = `You are CyberGuard AI, an expert defensive cybersecurity assistant.
Core Mission: Help users understand and identify potential cybersecurity threats, stay protected, and safeguard their personal data.

Strict Safety Rules:
1. FOCUS EXCLUSIVELY ON DEFENSIVE CYBERSECURITY.
2. NEVER generate malware, exploit payloads, keyloggers, ransomware, phishing templates, credential stealers, destructive commands, or authentication bypass instructions.
3. If a user asks for offensive attack tools or unauthorized access, politely decline and pivot to explaining how defenders detect, prevent, and remediate such threats.
4. When analyzing suspicious content, always remind the user that AI analysis is heuristic and indicator-based, not an absolute guarantee.`;

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'CyberGuard AI',
    version: '1.0.0',
    geminiAvailable: !!process.env.GEMINI_API_KEY,
  });
});

// 2. AI Security Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const client = getGeminiClient();
    if (!client) {
      // Intelligent defensive fallback response if API key is not configured
      const fallbackResponse = generateLocalSecurityChatResponse(message);
      return res.json({ response: fallbackResponse, source: 'offline_defense_engine' });
    }

    const conversationContext = Array.isArray(history)
      ? history.slice(-6).map((h: any) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')
      : '';

    const prompt = `${DEFENSE_SAFETY_SYSTEM_INSTRUCTION}

Recent Conversation:
${conversationContext}

User Query: ${message}

Provide a structured, helpful defensive response covering:
- Simple Explanation (clear, jargon-free)
- Threat Information (how attackers operate & common risks)
- Prevention Steps (actionable hygiene practices)
- Recommended Actions (what the user should do right now)

Keep your tone professional, reassuring, and concise.`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const reply = response.text || 'I analyzed your request from a defensive cybersecurity perspective. Please ensure multi-factor authentication is active.';
    res.json({ response: reply, source: 'gemini_3.8_flash' });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    // Graceful fallback to avoid leaving user hanging
    const fallback = generateLocalSecurityChatResponse(req.body?.message || '');
    res.json({ response: fallback, source: 'offline_fallback', warning: error.message });
  }
});

// 3. Phishing Check
app.post('/api/analyze-phishing', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Content cannot be empty.' });
    }

    const client = getGeminiClient();
    if (!client) {
      const fallback = heuristicPhishingAnalysis(content);
      return res.json(fallback);
    }

    const prompt = `${DEFENSE_SAFETY_SYSTEM_INSTRUCTION}

Analyze the following message (Email, SMS, WhatsApp, or Social Media) for phishing, smishing, or social engineering indicators.
Return a STRICT valid JSON object with NO markdown or formatting backticks.

Schema:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": number (0 to 100),
  "suspiciousWording": { "detected": boolean, "details": "Explanation" },
  "urgencyIndicators": { "detected": boolean, "details": "Explanation" },
  "impersonationIndicators": { "detected": boolean, "details": "Explanation" },
  "suspiciousRequests": { "detected": boolean, "details": "Explanation" },
  "socialEngineeringIndicators": { "detected": boolean, "details": "Explanation" },
  "whyDangerous": "Clear explanation of potential harm",
  "whatToDo": "Specific defensive steps to protect oneself"
}

Message content:
"""
${content.slice(0, 4000)}
"""`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let raw = response.text || '';
    raw = raw.replace(/^```json/m, '').replace(/^```/m, '').trim();
    try {
      const parsed = JSON.parse(raw);
      parsed.disclaimer = 'This is an indicator-based assessment and does not guarantee certainty.';
      return res.json(parsed);
    } catch {
      const fallback = heuristicPhishingAnalysis(content);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Phishing analysis error:', error);
    const fallback = heuristicPhishingAnalysis(req.body?.content || '');
    res.json(fallback);
  }
});

// 4. URL Safety Check
app.post('/api/analyze-url', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'URL cannot be empty.' });
    }

    const client = getGeminiClient();
    if (!client) {
      const fallback = heuristicUrlAnalysis(url);
      return res.json(fallback);
    }

    const prompt = `${DEFENSE_SAFETY_SYSTEM_INSTRUCTION}

Analyze the following URL strictly from a defensive, structural perspective (e.g. typosquatting, deceptive subdomains, unusual TLDs, IP literals, credential harvesting patterns). Do not perform penetration testing or exploit analysis.
Return a STRICT valid JSON object with NO markdown backticks.

Schema:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": number (0 to 100),
  "suspiciousCharacteristics": ["characteristic 1", "characteristic 2"],
  "safetyRecommendations": ["recommendation 1", "recommendation 2"]
}

URL to inspect:
"${url.trim()}"`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let raw = response.text || '';
    raw = raw.replace(/^```json/m, '').replace(/^```/m, '').trim();
    try {
      const parsed = JSON.parse(raw);
      parsed.disclaimer = 'This is a heuristic AI assessment and does not guarantee that a URL is safe or malicious.';
      return res.json(parsed);
    } catch {
      const fallback = heuristicUrlAnalysis(url);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('URL analysis error:', error);
    const fallback = heuristicUrlAnalysis(req.body?.url || '');
    res.json(fallback);
  }
});

// 5. Data Privacy Scanner & Masking
app.post('/api/analyze-privacy', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text cannot be empty.' });
    }

    const result = scanAndMaskPrivacyData(text);
    return res.json(result);
  } catch (error: any) {
    console.error('Privacy scanner error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. Security Text Analyzer
app.post('/api/analyze-security-text', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Content cannot be empty.' });
    }

    const client = getGeminiClient();
    if (!client) {
      const fallback = heuristicSecurityTextAnalysis(text);
      return res.json(fallback);
    }

    const prompt = `${DEFENSE_SAFETY_SYSTEM_INSTRUCTION}

Examine the following suspicious text (e.g. system log, command line, script snippet, unexpected alert, notification) defensively.
Return a STRICT valid JSON object with NO markdown backticks.

Schema:
{
  "possibleThreat": "Name or classification of the threat",
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "riskScore": number (0 to 100),
  "suspiciousIndicators": ["indicator 1", "indicator 2", "indicator 3"],
  "recommendedDefensiveAction": "Step-by-step guidance on how to safely respond",
  "summary": "Brief executive defensive summary"
}

Suspicious text:
"""
${text.slice(0, 4000)}
"""`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let raw = response.text || '';
    raw = raw.replace(/^```json/m, '').replace(/^```/m, '').trim();
    try {
      const parsed = JSON.parse(raw);
      return res.json(parsed);
    } catch {
      const fallback = heuristicSecurityTextAnalysis(text);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Security text analysis error:', error);
    const fallback = heuristicSecurityTextAnalysis(req.body?.text || '');
    res.json(fallback);
  }
});

// Heuristic Fallback Utilities for robust offline/no-key operation
function generateLocalSecurityChatResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes('phish')) {
    return `### Simple Explanation
Phishing is a deceptive technique where attackers impersonate reputable organizations (like banks, Google, or employers) to trick you into revealing sensitive credentials, passwords, or financial data.

### Threat Information
Attackers rely on urgency, fear, or false rewards (e.g., "Account suspended within 24 hours", "You won a gift card"). They often create identical clone login pages or attach malicious files.

### Prevention Steps
- Always verify the sender's full email address, not just the display name.
- Never click unexpected verification links; visit the service's official website directly.
- Enable hardware or authenticator-based Multi-Factor Authentication (MFA).

### Recommended Actions
1. Mark the suspicious email as Phishing/Spam.
2. If you entered your password, immediately change it on the official website.
3. Review account activity logs for unauthorized sessions.`;
  }

  if (q.includes('gmail') || q.includes('google account')) {
    return `### Simple Explanation
Securing your Google / Gmail account protects your emails, cloud documents, contacts, and Android device backup data.

### Threat Information
Compromised accounts often lead to identity theft, secondary account resets (since password recovery goes to email), and session cookie hijacking.

### Prevention Steps
- Turn on 2-Step Verification using Google Prompt or an Authenticator App (avoid SMS-only 2FA if possible).
- Generate and safely store offline Backup Codes.
- Perform a Google Security Checkup at myaccount.google.com/security-checkup.

### Recommended Actions
1. Revoke access to third-party apps you no longer recognize.
2. Check connected devices and sign out of old phones or computers.
3. Ensure your recovery email and phone number are up to date.`;
  }

  if (q.includes('password') || q.includes('strong password')) {
    return `### Simple Explanation
A strong password is long, unique, and unpredictable, making automated brute-force or dictionary guessing virtually impossible.

### Threat Information
Attackers use credential stuffing (testing passwords leaked from data breaches across hundreds of websites) and rainbow table hash attacks.

### Prevention Steps
- Use a passphrase of 16+ characters (e.g., 4 random unrelated words: "Oven-Cobalt-Bicycle-Falcon!").
- Never reuse the same password across multiple platforms.
- Utilize a reputable password manager (e.g. Bitwarden, 1Password) to generate and store complex keys.

### Recommended Actions
1. Audit your most critical accounts (Email, Banking, Password Manager).
2. Replace any passwords older than 1 year or reused across sites.
3. Enable MFA across all accounts supporting it.`;
  }

  return `### Simple Explanation
CyberGuard AI is analyzing your cybersecurity inquiry to provide defensive guidance and hygiene best practices.

### Threat Information
Digital risks typically exploit human urgency, unpatched software vulnerabilities, weak passwords, and unencrypted data transmission.

### Prevention Steps
- Keep your operating system and applications updated with latest security patches.
- Never share OTPs, recovery tokens, or passwords over chat or voice calls.
- Inspect URLs carefully before inputting credentials.

### Recommended Actions
1. Isolate the affected device or network if an active breach is suspected.
2. Run an antivirus or device malware scan.
3. Contact official IT or platform security support through verified channels.`;
}

function heuristicPhishingAnalysis(text: string) {
  const lower = text.toLowerCase();
  let score = 15;
  const indicators: string[] = [];

  const urgentWords = ['urgent', 'immediate', 'suspended', '24 hours', 'verify now', 'action required', 'unauthorized access'];
  const hasUrgency = urgentWords.some(w => lower.includes(w));
  if (hasUrgency) {
    score += 25;
    indicators.push('High-urgency language attempting to induce panic');
  }

  const impersonationWords = ['bank', 'paypal', 'apple support', 'microsoft support', 'irs', 'security team', 'netflix payment'];
  const hasImpersonation = impersonationWords.some(w => lower.includes(w));
  if (hasImpersonation) {
    score += 20;
    indicators.push('Claims to represent a recognized financial or tech entity');
  }

  const suspiciousRequests = ['click here', 'confirm your password', 'send gift card', 'wire transfer', 'otp', 'pin code'];
  const hasSuspiciousReq = suspiciousRequests.some(w => lower.includes(w));
  if (hasSuspiciousReq) {
    score += 25;
    indicators.push('Direct solicitation of credentials, OTPs, or immediate link clicks');
  }

  const hasLinks = /(https?:\/\/[^\s]+)/g.test(text);
  if (hasLinks) {
    score += 15;
    indicators.push('Contains embedded hyperlinked addresses');
  }

  score = Math.min(score, 95);
  let riskLevel = 'LOW';
  if (score > 75) riskLevel = 'CRITICAL';
  else if (score > 50) riskLevel = 'HIGH';
  else if (score > 25) riskLevel = 'MEDIUM';

  return {
    riskLevel,
    riskScore: score,
    suspiciousWording: {
      detected: hasUrgency || hasSuspiciousReq,
      details: hasUrgency ? 'Urgent coercive language detected.' : 'Standard communication tone observed.',
    },
    urgencyIndicators: {
      detected: hasUrgency,
      details: hasUrgency ? 'Demands immediate action to avoid penalty.' : 'No artificial time pressure identified.',
    },
    impersonationIndicators: {
      detected: hasImpersonation,
      details: hasImpersonation ? 'Mentions authority brands or organizations.' : 'No overt brand mimicry detected.',
    },
    suspiciousRequests: {
      detected: hasSuspiciousReq,
      details: hasSuspiciousReq ? 'Solicits sensitive authentication tokens or credentials.' : 'No direct credential harvesting found.',
    },
    socialEngineeringIndicators: {
      detected: score > 40,
      details: score > 40 ? 'Psychological manipulation indicators present.' : 'Low social engineering signature.',
    },
    whyDangerous: 'Phishing messages aim to steal credentials, install malware, or compromise session tokens under false pretenses.',
    whatToDo: 'Do not click links or reply. Forward to your organization\'s spam report address or delete immediately.',
    disclaimer: 'This is an indicator-based assessment and does not guarantee certainty.',
  };
}

function heuristicUrlAnalysis(url: string) {
  let score = 10;
  const characteristics: string[] = [];
  const recommendations: string[] = [];
  const clean = url.trim().toLowerCase();

  if (!clean.startsWith('https://')) {
    score += 20;
    characteristics.push('Missing HTTPS TLS encryption (insecure HTTP transport)');
    recommendations.push('Avoid submitting passwords or sensitive data on unencrypted connections.');
  }

  if (/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.test(clean)) {
    score += 40;
    characteristics.push('Direct numeric IP address instead of recognized registered domain name');
    recommendations.push('Legitimate services use standard domain names; numeric IPs frequently host malicious servers.');
  }

  const suspiciousTLDs = ['.xyz', '.top', '.buzz', '.work', '.click', '.loan', '.tk', '.ml', '.ga', '.cf'];
  if (suspiciousTLDs.some(tld => clean.includes(tld))) {
    score += 25;
    characteristics.push('Uses high-risk low-cost Top-Level Domain (TLD) commonly abused in spam campaigns');
    recommendations.push('Verify legitimacy of the organization using alternative official channels.');
  }

  const typos = ['paypa1', 'g00gle', 'micros0ft', 'app1e', 'netfl1x', 'amaz0n', 'wellsfarg0'];
  if (typos.some(t => clean.includes(t))) {
    score += 45;
    characteristics.push('Typosquatting/Homograph indicator mimicking established brand name');
    recommendations.push('Close the tab immediately; do not enter login credentials.');
  }

  if (clean.includes('@') || clean.split('.').length > 5) {
    score += 20;
    characteristics.push('Unusual URL structure or deeply nested subdomains');
  }

  score = Math.min(Math.max(score, 10), 95);
  let riskLevel = 'LOW';
  if (score > 75) riskLevel = 'CRITICAL';
  else if (score > 50) riskLevel = 'HIGH';
  else if (score > 25) riskLevel = 'MEDIUM';

  if (recommendations.length === 0) {
    recommendations.push('Always check the browser padlock icon and address bar before entering login details.');
    recommendations.push('Keep browser safe-browsing protections enabled.');
  }

  return {
    riskScore: score,
    riskLevel,
    suspiciousCharacteristics: characteristics.length > 0 ? characteristics : ['Standard web URL structure detected', 'No immediate structural red flags found'],
    safetyRecommendations: recommendations,
    disclaimer: 'This is a heuristic AI assessment and does not guarantee that a URL is safe or malicious.',
  };
}

function scanAndMaskPrivacyData(input: string) {
  let masked = input;
  const findings: Array<{
    finding: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    detectedPattern: string;
    recommendedAction: string;
  }> = [];

  // Email regex
  const emailRegex = /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  let match;
  while ((match = emailRegex.exec(input)) !== null) {
    const full = match[0];
    const user = match[1];
    const domain = match[2];
    const maskedEmail = `${user.charAt(0)}***@${domain}`;
    masked = masked.replace(full, maskedEmail);
    findings.push({
      finding: 'Personal / Business Email Address',
      severity: 'MEDIUM',
      detectedPattern: full,
      recommendedAction: 'Mask email before public posting to avoid credential stuffing and email harvesting spam.',
    });
  }

  // Phone number regex
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  while ((match = phoneRegex.exec(input)) !== null) {
    const full = match[0];
    if (full.replace(/\D/g, '').length >= 10) {
      const maskedPhone = full.slice(0, 3) + '-***-**' + full.slice(-2);
      masked = masked.replace(full, maskedPhone);
      findings.push({
        finding: 'Phone Number (PII)',
        severity: 'MEDIUM',
        detectedPattern: full,
        recommendedAction: 'Redact personal contact details to protect against SMS phishing and social engineering.',
      });
    }
  }

  // API Keys / Access Tokens
  const apiKeyPatterns = [
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z-_]{35}/g, severity: 'CRITICAL' as const },
    { name: 'AWS Access Key ID', regex: /(?:AKIA|ABIA|ACCA)[0-9A-Z]{16}/g, severity: 'CRITICAL' as const },
    { name: 'GitHub Personal Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/g, severity: 'CRITICAL' as const },
    { name: 'Bearer Token / JWT Pattern', regex: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g, severity: 'CRITICAL' as const },
    { name: 'Generic Secret Key Token', regex: /(?:secret|token|apikey|api_key|password)\s*[:=]\s*['"]?([a-zA-Z0-9_\-]{12,})['"]?/gi, severity: 'CRITICAL' as const },
  ];

  for (const p of apiKeyPatterns) {
    while ((match = p.regex.exec(input)) !== null) {
      const full = match[0];
      const maskedVal = full.slice(0, 4) + '****************' + full.slice(-4);
      masked = masked.replace(full, maskedVal);
      findings.push({
        finding: p.name,
        severity: p.severity,
        detectedPattern: full.slice(0, 8) + '...',
        recommendedAction: 'REVOKE and regenerate this credential immediately! Never commit secrets or API tokens to client source code.',
      });
    }
  }

  // Credit Card-like patterns
  const cardRegex = /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12})\b/g;
  while ((match = cardRegex.exec(input)) !== null) {
    const full = match[0];
    const maskedCard = '****-****-****-' + full.slice(-4);
    masked = masked.replace(full, maskedCard);
    findings.push({
      finding: 'Payment Card Number (PCI PII)',
      severity: 'CRITICAL',
      detectedPattern: 'Card ending in ' + full.slice(-4),
      recommendedAction: 'Never transmit unencrypted card data across untrusted channels. Report any unauthorized transactions to your issuer.',
    });
  }

  // Database connection strings
  const dbRegex = /(postgres|postgresql|mysql|mongodb|redis):\/\/[a-zA-Z0-9_\-\.]+:[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9_\-\.]+/gi;
  while ((match = dbRegex.exec(input)) !== null) {
    const full = match[0];
    masked = masked.replace(full, 'db://[REDACTED_USER]:[REDACTED_PASS]@[HOST]');
    findings.push({
      finding: 'Database Connection String with Embedded Credentials',
      severity: 'CRITICAL',
      detectedPattern: 'database URI',
      recommendedAction: 'Rotate database passwords immediately. Use environment variables or secrets managers.',
    });
  }

  return {
    originalTextLength: input.length,
    findingsCount: findings.length,
    findings,
    maskedText: masked,
  };
}

function heuristicSecurityTextAnalysis(text: string) {
  const lower = text.toLowerCase();
  let threat = 'Suspicious Log / Activity Anomaly';
  let score = 25;
  const indicators: string[] = [];

  if (lower.includes('powershell') || lower.includes('cmd.exe') || lower.includes('bash -i') || lower.includes('/bin/sh')) {
    score += 40;
    threat = 'Command Execution / Shell Invocation';
    indicators.push('Direct command line shell invocation detected');
  }

  if (lower.includes('curl') || lower.includes('wget') || lower.includes('bitsadmin') || lower.includes('certutil')) {
    score += 25;
    threat = 'Remote Ingress File Download Tool';
    indicators.push('Command attempting external resource download');
  }

  if (lower.includes('failed login') || lower.includes('authentication failure') || lower.includes('invalid password')) {
    score += 20;
    threat = 'Authentication Failure / Brute Force Indicator';
    indicators.push('Repeated rejected login attempts in system logs');
  }

  if (lower.includes('base64') || lower.includes('eval(') || lower.includes('unescape(') || lower.includes('exec(')) {
    score += 30;
    threat = 'Obfuscated Code Execution';
    indicators.push('Dynamic code evaluation or encoded payload pattern');
  }

  score = Math.min(score, 90);
  let riskLevel = 'LOW';
  if (score > 70) riskLevel = 'CRITICAL';
  else if (score > 45) riskLevel = 'HIGH';
  else if (score > 25) riskLevel = 'MEDIUM';

  return {
    possibleThreat: threat,
    riskLevel,
    riskScore: score,
    suspiciousIndicators: indicators.length > 0 ? indicators : ['General unclassified system text', 'No high-severity exploit signatures detected'],
    recommendedDefensiveAction: 'Review source IP and host logs. If unauthorized, isolate the system and terminate associated processes.',
    summary: `Heuristic defensive analysis assigned a ${riskLevel} risk assessment (${score}/100) based on detected patterns.`,
  };
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const candidatePaths = [
      path.join(process.cwd(), 'dist'),
      path.resolve(__dirname, 'dist'),
      path.resolve(__dirname),
      '/dist',
      '/app/dist'
    ];
    const distPath = candidatePaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CyberGuard AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
