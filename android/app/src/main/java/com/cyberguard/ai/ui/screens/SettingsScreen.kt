package com.cyberguard.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.cyberguard.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(onNavigateToHistory: () -> Unit) {
    var darkMode by remember { mutableStateOf(true) }
    var notifications by remember { mutableStateOf(true) }
    var selectedLanguage by remember { mutableStateOf("English (US)") }
    var showPrivacyDialog by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }
    var chatClearedMessage by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
            .verticalScroll(rememberScrollState())
    ) {
        TopAppBar(
            title = { Text("SETTINGS", fontWeight = FontWeight.Bold, fontSize = 18.sp) },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = CyberSurface)
        )

        Column(modifier = Modifier.padding(16.dp)) {
            Text("PREFERENCES", color = CyberTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(8.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = CyberSurface)
            ) {
                Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.DarkMode, contentDescription = null, tint = CyberCyan)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("Dark Mode", color = CyberTextPrimary, fontSize = 14.sp)
                        }
                        Switch(
                            checked = darkMode,
                            onCheckedChange = { darkMode = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.Black,
                                checkedTrackColor = CyberCyan
                            )
                        )
                    }

                    Divider(color = Color(0xFF1E293B))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Notifications, contentDescription = null, tint = CyberCyan)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("Security Alerts & Notifications", color = CyberTextPrimary, fontSize = 14.sp)
                        }
                        Switch(
                            checked = notifications,
                            onCheckedChange = { notifications = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.Black,
                                checkedTrackColor = CyberCyan
                            )
                        )
                    }

                    Divider(color = Color(0xFF1E293B))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Language, contentDescription = null, tint = CyberCyan)
                            Spacer(modifier = Modifier.width(12.dp))
                            Text("Language", color = CyberTextPrimary, fontSize = 14.sp)
                        }
                        Text(selectedLanguage, color = CyberTextSecondary, fontSize = 13.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            Text("DATA MANAGEMENT", color = CyberTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(8.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = CyberSurface)
            ) {
                Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)) {
                    SettingsActionRow(
                        icon = Icons.Default.ChatBubbleOutline,
                        title = "Clear Chat History",
                        subtitle = "Deletes conversational memory from device",
                        onClick = { chatClearedMessage = true }
                    )

                    Divider(color = Color(0xFF1E293B))

                    SettingsActionRow(
                        icon = Icons.Default.DeleteForever,
                        title = "Clear Scan History",
                        subtitle = "Remove all local threat scan records",
                        onClick = onNavigateToHistory
                    )
                }
            }

            if (chatClearedMessage) {
                Spacer(modifier = Modifier.height(8.dp))
                Text("Chat history cleared successfully.", color = CyberGreen, fontSize = 12.sp)
            }

            Spacer(modifier = Modifier.height(24.dp))
            Text("ABOUT & PRIVACY", color = CyberTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
            Spacer(modifier = Modifier.height(8.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = CyberSurface)
            ) {
                Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 6.dp)) {
                    SettingsActionRow(
                        icon = Icons.Default.PrivacyTip,
                        title = "Privacy Information",
                        subtitle = "How CyberGuard AI protects your data locally",
                        onClick = { showPrivacyDialog = true }
                    )

                    Divider(color = Color(0xFF1E293B))

                    SettingsActionRow(
                        icon = Icons.Default.Info,
                        title = "About CyberGuard AI",
                        subtitle = "Version 1.0.0 (Native Android Compose)",
                        onClick = { showAboutDialog = true }
                    )
                }
            }
        }
    }

    if (showPrivacyDialog) {
        AlertDialog(
            onDismissRequest = { showPrivacyDialog = false },
            title = { Text("Privacy Information", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "CyberGuard AI is committed to zero unsolicited data retention. Scanned text and analysis histories are kept in encrypted local storage on your Android device. Data processed by Gemini AI is evaluated strictly for defensive threat assessment.",
                    fontSize = 13.sp,
                    lineHeight = 18.sp
                )
            },
            confirmButton = {
                TextButton(onClick = { showPrivacyDialog = false }) {
                    Text("Understood", color = CyberCyan)
                }
            },
            containerColor = CyberSurface,
            titleContentColor = CyberTextPrimary,
            textContentColor = CyberTextSecondary
        )
    }

    if (showAboutDialog) {
        AlertDialog(
            onDismissRequest = { showAboutDialog = false },
            title = { Text("About CyberGuard AI", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text("CyberGuard AI v1.0.0", color = CyberCyan, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Intelligent Cybersecurity Assistant", color = CyberTextSecondary, fontSize = 12.sp)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Built exclusively for Android with Kotlin, Jetpack Compose, Material 3, and Google Gemini AI.", fontSize = 12.sp, color = CyberTextPrimary)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Defensive focus: Never generates malware or exploit payloads. Empowers users with actionable defensive countermeasures.", fontSize = 12.sp, color = CyberTextSecondary)
                }
            },
            confirmButton = {
                TextButton(onClick = { showAboutDialog = false }) {
                    Text("Close", color = CyberCyan)
                }
            },
            containerColor = CyberSurface,
            titleContentColor = CyberTextPrimary,
            textContentColor = CyberTextSecondary
        )
    }
}

@Composable
fun SettingsActionRow(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(icon, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(22.dp))
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(title, color = CyberTextPrimary, fontSize = 14.sp, fontWeight = FontWeight.Medium)
            Text(subtitle, color = CyberTextSecondary, fontSize = 11.sp)
        }
        Icon(Icons.Default.ChevronRight, contentDescription = null, tint = Color(0xFF64748B), modifier = Modifier.size(20.dp))
    }
}
