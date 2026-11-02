# CyberGuard AI - Native Android Application

**CyberGuard AI** is an intelligent personal cybersecurity assistant app built natively for Android using Kotlin, Jetpack Compose, Material 3, and Google Gemini AI.

## Architecture
- **Language**: Kotlin 2.0.21
- **UI Toolkit**: Jetpack Compose with Material 3 (M3)
- **AI Integration**: Google Generative AI (Gemini 3.8 Flash model)
- **Local Persistence**: Android Jetpack Room / Encrypted SharedPreferences
- **Target SDK**: Android 15 (API level 35), Min SDK: Android 8.0 (API level 26)

## Features
1. **Defensive AI Security Chat**: ChatGPT-style conversational assistant with voice speech-to-text recognition, copy, share, regenerate, and structured defense guidance (Simple explanation, Threat information, Prevention steps, Recommended actions).
2. **Phishing Check**: Deep heuristic scan for suspicious wording, urgency tactics, brand impersonation, suspicious requests, and social engineering indicators.
3. **URL Safety Check**: Structural URL inspector for typosquatting, raw IP literal domains, and dangerous TLDs.
4. **Data Privacy Scanner**: Fast regex & AI scan detecting leaked emails, phone numbers, API keys, AWS tokens, passwords, credit card numbers, and database strings, with 1-tap `[ MASK SENSITIVE DATA ]` redaction.
5. **Security Text Analyzer**: General analyzer evaluating suspicious command lines, shell scripts, and system alerts with clean security report cards.
6. **Threat Score Gauge**: Circular progress indicators color-coded by severity (LOW 0-25, MEDIUM 26-50, HIGH 51-75, CRITICAL 76-100).
7. **Local Scan History**: Persistent on-device audit trail with view and deletion controls.
8. **Material 3 Dark Theme**: Cyber-inspired aesthetic, rounded cards, and responsive navigation.

## Opening in Android Studio
1. Open **Android Studio** (Koala or newer).
2. Select **File > Open** and choose the `android` folder.
3. Sync Gradle dependencies.
4. Run on an Android phone or emulator.
