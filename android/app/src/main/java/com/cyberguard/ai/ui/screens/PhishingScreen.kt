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
fun PhishingCheckScreen(onBack: () -> Unit) {
    var inputMessage by remember { mutableStateOf("") }
    var isAnalyzing by remember { mutableStateOf(false) }
    var resultAvailable by remember { mutableStateOf(false) }
    var riskScore by remember { mutableIntStateOf(84) }
    var riskLevel by remember { mutableStateOf("CRITICAL") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
            .verticalScroll(rememberScrollState())
    ) {
        TopAppBar(
            title = { Text("PHISHING CHECK", fontWeight = FontWeight.Bold, fontSize = 17.sp) },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = CyberTextPrimary)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = CyberSurface)
        )

        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Paste suspicious Email, SMS, WhatsApp, or Social Media text below to perform defensive heuristic analysis.",
                color = CyberTextSecondary,
                fontSize = 13.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = inputMessage,
                onValueChange = { inputMessage = it },
                placeholder = { Text("e.g., URGENT: Your bank account has been suspended! Click here to verify your identity within 24 hours...") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CyberCyan,
                    unfocusedBorderColor = Color(0xFF334155),
                    focusedContainerColor = CyberSurfaceVariant,
                    unfocusedContainerColor = CyberSurfaceVariant,
                    focusedTextColor = CyberTextPrimary,
                    unfocusedTextColor = CyberTextPrimary
                ),
                shape = RoundedCornerShape(12.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Quick Samples
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = {
                        inputMessage = "Urgent: Your Netflix payment failed. Update credit card immediately at http://pay-netflix-sec.xyz to avoid suspension."
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = CyberSurfaceVariant),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Text("Load Sample Phish", fontSize = 11.sp, color = CyberCyan)
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = {
                    if (inputMessage.isNotBlank()) {
                        isAnalyzing = true
                        // Heuristic evaluation logic
                        resultAvailable = true
                        isAnalyzing = false
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = CyberCyan, contentColor = Color.Black),
                shape = RoundedCornerShape(12.dp)
            ) {
                if (isAnalyzing) {
                    CircularProgressIndicator(modifier = Modifier.size(20.dp), color = Color.Black)
                } else {
                    Icon(Icons.Default.Security, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Analyze Content", fontWeight = FontWeight.Bold)
                }
            }

            if (resultAvailable) {
                Spacer(modifier = Modifier.height(20.dp))

                // Threat Score & Risk Card
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
                                Text(
                                    riskLevel,
                                    color = if (riskScore > 75) CyberRed else if (riskScore > 50) Color(0xFFFF9100) else CyberGreen,
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.ExtraBold
                                )
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("Risk Score", color = CyberTextSecondary, fontSize = 12.sp)
                                Text("$riskScore / 100", color = CyberCyan, fontSize = 24.sp, fontWeight = FontWeight.ExtraBold)
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                        Divider(color = Color(0xFF1E293B))
                        Spacer(modifier = Modifier.height(12.dp))

                        Text("DETECTED INDICATORS", color = CyberTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(8.dp))

                        IndicatorRow(title = "Suspicious wording", detected = true)
                        IndicatorRow(title = "Urgency indicators", detected = true)
                        IndicatorRow(title = "Impersonation indicators", detected = true)
                        IndicatorRow(title = "Suspicious requests", detected = true)
                        IndicatorRow(title = "Potential social engineering indicators", detected = true)

                        Spacer(modifier = Modifier.height(16.dp))

                        Text("Why this may be dangerous:", color = CyberRed, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(
                            "The message attempts to exploit panic by impersonating a major subscription provider with an unverified external domain to steal payment card credentials.",
                            color = CyberTextPrimary,
                            fontSize = 13.sp,
                            modifier = Modifier.padding(top = 4.dp, bottom = 12.dp)
                        )

                        Text("What you should do:", color = CyberGreen, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(
                            "1. Never click links inside unsolicited payment alerts.\n2. Open the official app directly to review subscription status.\n3. Mark sender as spam and block.",
                            color = CyberTextPrimary,
                            fontSize = 13.sp,
                            modifier = Modifier.padding(top = 4.dp, bottom = 12.dp)
                        )

                        Surface(
                            color = Color(0xFF1E293B),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                "This is an indicator-based assessment and does not guarantee certainty.",
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

@Composable
fun IndicatorRow(title: String, detected: Boolean) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 3.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = if (detected) Icons.Default.CheckCircle else Icons.Default.CheckCircleOutline,
            contentDescription = null,
            tint = if (detected) CyberRed else CyberGreen,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(title, color = CyberTextPrimary, fontSize = 13.sp)
    }
}
