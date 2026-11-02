import React, { useState } from 'react';
import { X, Copy, Check, Terminal, FileCode, FolderTree } from 'lucide-react';

interface AndroidCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANDROID_FILES = [
  {
    path: 'app/src/main/java/com/cyberguard/ai/MainActivity.kt',
    name: 'MainActivity.kt',
    description: 'Jetpack Compose Navigation Graph & Material 3 Scaffold',
    code: `package com.cyberguard.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.navigation.compose.*
import com.cyberguard.ai.ui.screens.*
import com.cyberguard.ai.ui.theme.CyberGuardTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CyberGuardTheme {
                val navController = rememberNavController()
                Scaffold(
                    bottomBar = { CyberGuardBottomNav(navController) }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "home",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("home") { HomeScreen(navController) }
                        composable("chat") { ChatScreen() }
                        composable("phishing") { PhishingCheckScreen() }
                        composable("url") { UrlSafetyScreen() }
                        composable("privacy") { PrivacyScannerScreen() }
                        composable("text_analyzer") { SecurityTextAnalyzerScreen() }
                        composable("history") { ScanHistoryScreen() }
                        composable("settings") { SettingsScreen() }
                    }
                }
            }
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/cyberguard/ai/data/GeminiService.kt',
    name: 'GeminiService.kt',
    description: 'Google Generative AI Gemini 3.8 Flash Client',
    code: `package com.cyberguard.ai.data

import com.google.ai.client.generativeai.GenerativeModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class GeminiSecurityService(private val apiKey: String) {
    private val generativeModel = GenerativeModel(
        modelName = "gemini-3.8-flash",
        apiKey = apiKey
    )

    suspend fun analyzePhishing(content: String): String = withContext(Dispatchers.IO) {
        val prompt = """
            Analyze the following message strictly for defensive phishing and scam indicators:
            "$content"
            Provide:
            1. Risk Level (LOW, MEDIUM, HIGH, CRITICAL)
            2. Risk Score (0-100)
            3. Suspicious wording, urgency, impersonation, requests, and social engineering indicators.
            4. Why this may be dangerous
            5. What you should do
        """.trimIndent()

        generativeModel.generateContent(prompt).text ?: "Analysis unavailable"
    }

    suspend fun analyzeUrl(url: String): String = withContext(Dispatchers.IO) {
        val prompt = "Analyze the structural safety of URL '$url' for spoofing, deceptive TLDs, and suspicious IP literals."
        generativeModel.generateContent(prompt).text ?: "URL assessment unavailable"
    }
}`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    description: 'Android Permissions (Microphone, Internet, Network State)',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.CyberGuardAI">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.CyberGuardAI">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`,
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    description: 'Kotlin 2.0 & Jetpack Compose dependencies',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.cyberguard.ai"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.cyberguard.ai"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.navigation.compose)
    implementation("com.google.ai.client.generativeai:generativeai:0.9.0")
    implementation("androidx.room:room-runtime:2.6.1")
}`,
  },
];

export const AndroidCodeModal: React.FC<AndroidCodeModalProps> = ({ isOpen, onClose }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const current = ANDROID_FILES[selectedIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#0d1424] border border-cyan-500/40 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#10192d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-['Outfit']">
                Native Android Kotlin & Compose Source
              </h3>
              <p className="text-[11px] text-slate-400">
                Found in <code className="text-cyan-300 font-mono">/android/</code> workspace directory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex gap-1 overflow-x-auto p-2 bg-[#090d16] border-b border-slate-800 scrollbar-none">
          {ANDROID_FILES.map((file, i) => (
            <button
              key={i}
              onClick={() => setSelectedIdx(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
                selectedIdx === i
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {file.name}
            </button>
          ))}
        </div>

        {/* File Path & Copy Bar */}
        <div className="px-4 py-2 bg-[#0f1728] border-b border-slate-800/80 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono truncate max-w-[70%]">
            {current.path}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#080c14] font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre overflow-x-auto">
            <code>{current.code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#10192d] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Ready to sync with Android Studio & Gradle</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
