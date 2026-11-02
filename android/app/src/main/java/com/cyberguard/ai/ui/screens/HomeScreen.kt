package com.cyberguard.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.cyberguard.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    onNavigateToChat: () -> Unit,
    onNavigateToPhishing: () -> Unit,
    onNavigateToUrlSafety: () -> Unit,
    onNavigateToPrivacy: () -> Unit,
    onNavigateToTextAnalyzer: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // App Header with Original CyberGuard AI Logo
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp, bottom = 16.dp)
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Brush.linearGradient(listOf(Color(0xFF00E5FF), Color(0xFF0072FF))))
            ) {
                Icon(
                    imageVector = Icons.Default.Shield,
                    contentDescription = "CyberGuard AI Logo",
                    tint = Color.Black,
                    modifier = Modifier.size(28.dp)
                )
            }
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = "CYBERGUARD AI",
                    color = CyberTextPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "Intelligent Cybersecurity Assistant",
                    color = CyberCyan,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        // Subtitle / Tagline Card
        Text(
            text = "Stay Safe. Stay Protected.",
            color = CyberTextSecondary,
            fontSize = 15.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Security Score Card (82/100 Good)
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = CyberSurface)
        ) {
            Row(
                modifier = Modifier.padding(20.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "SECURITY SCORE",
                        color = CyberTextSecondary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.Bottom) {
                        Text(
                            text = "82",
                            color = CyberCyan,
                            fontSize = 40.sp,
                            fontWeight = FontWeight.ExtraBold
                        )
                        Text(
                            text = "/100",
                            color = CyberTextSecondary,
                            fontSize = 18.sp,
                            modifier = Modifier.padding(bottom = 6.dp, start = 2.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Surface(
                        color = CyberGreen.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(
                            text = "Good • Protected",
                            color = CyberGreen,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                        )
                    }
                }

                // Visual Circular Ring Score
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.size(76.dp)
                ) {
                    CircularProgressIndicator(
                        progress = { 0.82f },
                        modifier = Modifier.size(76.dp),
                        color = CyberCyan,
                        trackColor = Color(0xFF1E293B),
                        strokeWidth = 7.dp
                    )
                    Icon(
                        imageVector = Icons.Default.VerifiedUser,
                        contentDescription = "Protected",
                        tint = CyberCyan,
                        modifier = Modifier.size(30.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Quick Action Buttons Title
        Text(
            text = "QUICK ACTIONS",
            color = CyberTextSecondary,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.sp,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Five Quick Action Buttons
        ActionFeatureButton(
            title = "AI Security Chat",
            subtitle = "Ask cybersecurity questions, get prevention steps",
            icon = Icons.Default.Psychology,
            accentColor = CyberCyan,
            onClick = onNavigateToChat
        )
        ActionFeatureButton(
            title = "Phishing Check",
            subtitle = "Scan emails, SMS & messages for social engineering",
            icon = Icons.Default.MarkEmailUnread,
            accentColor = Color(0xFFFF9100),
            onClick = onNavigateToPhishing
        )
        ActionFeatureButton(
            title = "URL Safety",
            subtitle = "Heuristic analysis for deceptive links & spoofing",
            icon = Icons.Default.Link,
            accentColor = CyberBlue,
            onClick = onNavigateToUrlSafety
        )
        ActionFeatureButton(
            title = "Data Privacy Scan",
            subtitle = "Detect leaked PII, tokens, keys with 1-click masking",
            icon = Icons.Default.LockReset,
            accentColor = CyberGreen,
            onClick = onNavigateToPrivacy
        )
        ActionFeatureButton(
            title = "Security Text Analyzer",
            subtitle = "Inspect commands, logs & suspicious alerts",
            icon = Icons.Default.FindInPage,
            accentColor = Color(0xFFE040FB),
            onClick = onNavigateToTextAnalyzer
        )
    }
}

@Composable
fun ActionFeatureButton(
    title: String,
    subtitle: String,
    icon: ImageVector,
    accentColor: Color,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 5.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = CyberSurfaceVariant)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(accentColor.copy(alpha = 0.15f))
            ) {
                Icon(icon, contentDescription = title, tint = accentColor, modifier = Modifier.size(24.dp))
            }
            Spacer(modifier = Modifier.width(14.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, color = CyberTextPrimary, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                Text(subtitle, color = CyberTextSecondary, fontSize = 12.sp)
            }
            Icon(Icons.Default.ChevronRight, contentDescription = "Open", tint = Color(0xFF64748B))
        }
    }
}
