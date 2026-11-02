package com.cyberguard.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.cyberguard.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScanHubScreen(
    onNavigateToPhishing: () -> Unit,
    onNavigateToUrlSafety: () -> Unit,
    onNavigateToPrivacy: () -> Unit,
    onNavigateToTextAnalyzer: () -> Unit,
    onNavigateToHistory: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
            .verticalScroll(rememberScrollState())
    ) {
        TopAppBar(
            title = { Text("DEFENSE SCAN HUB", fontWeight = FontWeight.Bold, fontSize = 18.sp) },
            actions = {
                IconButton(onClick = onNavigateToHistory) {
                    Icon(Icons.Default.History, contentDescription = "History", tint = CyberCyan)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = CyberSurface)
        )

        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Select a specialized defensive cybersecurity scanner below to inspect suspicious messages, links, PII leaks, or raw commands.",
                color = CyberTextSecondary,
                fontSize = 13.sp
            )

            Spacer(modifier = Modifier.height(16.dp))

            ActionFeatureButton(
                title = "Phishing Check",
                subtitle = "Detect social engineering, urgency tactics, and fraudulent requests",
                icon = Icons.Default.MarkEmailUnread,
                accentColor = Color(0xFFFF9100),
                onClick = onNavigateToPhishing
            )

            ActionFeatureButton(
                title = "URL Safety Check",
                subtitle = "Evaluate domain spoofing, risky TLDs, and IP literals",
                icon = Icons.Default.Link,
                accentColor = CyberBlue,
                onClick = onNavigateToUrlSafety
            )

            ActionFeatureButton(
                title = "Data Privacy Scanner",
                subtitle = "Inspect text for leaked credentials, emails & phone numbers + 1-tap masking",
                icon = Icons.Default.LockReset,
                accentColor = CyberGreen,
                onClick = onNavigateToPrivacy
            )

            ActionFeatureButton(
                title = "Security Text Analyzer",
                subtitle = "Deep-dive analysis of suspicious logs, scripts, and commands",
                icon = Icons.Default.FindInPage,
                accentColor = Color(0xFFE040FB),
                onClick = onNavigateToTextAnalyzer
            )

            Spacer(modifier = Modifier.height(20.dp))

            ActionFeatureButton(
                title = "View Scan History",
                subtitle = "Audit past threat scans saved locally on your device",
                icon = Icons.Default.History,
                accentColor = CyberCyan,
                onClick = onNavigateToHistory
            )
        }
    }
}
