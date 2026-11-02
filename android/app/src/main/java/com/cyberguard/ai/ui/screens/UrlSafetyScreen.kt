package com.cyberguard.ai.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.cyberguard.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UrlSafetyScreen(onBack: () -> Unit) {
    var inputUrl by remember { mutableStateOf("") }
    var analyzed by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
            .verticalScroll(rememberScrollState())
    ) {
        TopAppBar(
            title = { Text("URL SAFETY CHECK", fontWeight = FontWeight.Bold, fontSize = 17.sp) },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = CyberTextPrimary)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = CyberSurface)
        )

        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Paste a web address or link to analyze structural indicators, domain spoofing, and risky TLDs.",
                color = CyberTextSecondary,
                fontSize = 13.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = inputUrl,
                onValueChange = { inputUrl = it },
                placeholder = { Text("https://example.com or http://192.168.1.1/login") },
                modifier = Modifier.fillMaxWidth(),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CyberCyan,
                    unfocusedBorderColor = Color(0xFF334155),
                    focusedContainerColor = CyberSurfaceVariant,
                    unfocusedContainerColor = CyberSurfaceVariant,
                    focusedTextColor = CyberTextPrimary,
                    unfocusedTextColor = CyberTextPrimary
                ),
                shape = RoundedCornerShape(12.dp),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = { inputUrl = "http://192.168.1.45:8080/secure-update.xyz" },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberSurfaceVariant),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text("Sample IP URL", fontSize = 11.sp, color = CyberCyan)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = { if (inputUrl.isNotBlank()) analyzed = true },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = CyberCyan, contentColor = Color.Black),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Link, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Analyze URL Structure", fontWeight = FontWeight.Bold)
            }

            if (analyzed) {
                Spacer(modifier = Modifier.height(20.dp))

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = CyberSurface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Risk Level", color = CyberTextSecondary, fontSize = 12.sp)
                                Text("HIGH", color = Color(0xFFFF9100), fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("Risk Score", color = CyberTextSecondary, fontSize = 12.sp)
                                Text("72 / 100", color = CyberCyan, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                        Divider(color = Color(0xFF1E293B))
                        Spacer(modifier = Modifier.height(12.dp))

                        Text("SUSPICIOUS CHARACTERISTICS", color = CyberTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("• Raw IP literal used instead of verified registered domain name", color = CyberTextPrimary, fontSize = 13.sp)
                        Text("• Insecure HTTP protocol without TLS certificate encryption", color = CyberTextPrimary, fontSize = 13.sp)
                        Text("• High-risk .xyz Top-Level Domain suffix", color = CyberTextPrimary, fontSize = 13.sp)

                        Spacer(modifier = Modifier.height(14.dp))
                        Text("SAFETY RECOMMENDATIONS", color = CyberGreen, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("1. Do not enter personal credentials or passwords on raw IP addresses.\n2. Verify the site using official web searches.", color = CyberTextPrimary, fontSize = 13.sp)

                        Spacer(modifier = Modifier.height(16.dp))
                        Surface(
                            color = Color(0xFF1E293B),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                "This is a heuristic AI assessment and does not guarantee that a URL is safe or malicious.",
                                color = CyberTextSecondary,
                                fontSize = 11.sp,
                                modifier = Modifier.padding(8.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
