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
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.cyberguard.ai.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PrivacyScannerScreen(onBack: () -> Unit) {
    val clipboardManager = LocalClipboardManager.current
    var inputText by remember { mutableStateOf("") }
    var scanned by remember { mutableStateOf(false) }
    var maskedText by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
            .verticalScroll(rememberScrollState())
    ) {
        TopAppBar(
            title = { Text("DATA PRIVACY SCANNER", fontWeight = FontWeight.Bold, fontSize = 17.sp) },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = CyberTextPrimary)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = CyberSurface)
        )

        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Scan text for leaked emails, phone numbers, API keys, access tokens, passwords, credit card numbers, and PII. Mask sensitive data with 1-tap.",
                color = CyberTextSecondary,
                fontSize = 13.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                placeholder = { Text("Paste code, message, or notes containing possible sensitive data...") },
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

            Spacer(modifier = Modifier.height(8.dp))

            Button(
                onClick = {
                    inputText = "Contact john@gmail.com or call +1-555-019-2834. Also use secret AWS key AKIAIOSFODNN7EXAMPLE for database postgres://admin:P@ssword123@db.internal:5432"
                },
                colors = ButtonDefaults.buttonColors(containerColor = CyberSurfaceVariant),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text("Load Sample PII & Secret Data", fontSize = 11.sp, color = CyberCyan)
            }

            Spacer(modifier = Modifier.height(16.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    onClick = {
                        if (inputText.isNotBlank()) {
                            scanned = true
                            maskedText = inputText
                                .replace(Regex("([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})")) { m ->
                                    "${m.groupValues[1].first()}***@${m.groupValues[2]}"
                                }
                                .replace(Regex("(\\+?\\d{1,3}[-.]?)?(\\(?\\d{3}\\)?[-.]?)?\\d{3}[-.]?\\d{4}")) {
                                    "+1-555-***-**34"
                                }
                                .replace("AKIAIOSFODNN7EXAMPLE", "AKIA************MPLE")
                                .replace("postgres://admin:P@ssword123@db.internal:5432", "postgres://[MASKED]:[MASKED]@db.internal:5432")
                        }
                    },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = CyberCyan, contentColor = Color.Black),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.Search, contentDescription = null)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Scan Privacy", fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = {
                        if (maskedText.isNotBlank()) {
                            clipboardManager.setText(AnnotatedString(maskedText))
                        }
                    },
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(containerColor = CyberGreen, contentColor = Color.Black),
                    shape = RoundedCornerShape(12.dp),
                    enabled = scanned
                ) {
                    Icon(Icons.Default.Shield, contentDescription = null)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("MASK SENSITIVE DATA", fontWeight = FontWeight.Bold, fontSize = 11.sp)
                }
            }

            if (scanned) {
                Spacer(modifier = Modifier.height(20.dp))

                Text("DETECTED SENSITIVE EXPOSURES", color = CyberTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(8.dp))

                PrivacyFindingCard("Personal Email", "MEDIUM", "john@gmail.com", "Mask before sharing publicly.")
                PrivacyFindingCard("Phone Number (PII)", "MEDIUM", "+1-555-019-2834", "Redact contact data from untrusted logs.")
                PrivacyFindingCard("AWS Access Key Token", "CRITICAL", "AKIAIOSFODNN7...", "REVOKE and regenerate token immediately in IAM.")
                PrivacyFindingCard("Database Connection URI", "CRITICAL", "postgres://admin:P@ss...", "Rotate database credentials. Never commit hardcoded URI strings.")

                Spacer(modifier = Modifier.height(16.dp))

                Text("MASKED OUTPUT (SAFE TO SHARE)", color = CyberCyan, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))

                Surface(
                    color = CyberSurfaceVariant,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(maskedText, color = CyberTextPrimary, fontSize = 13.sp)
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.End, modifier = Modifier.fillMaxWidth()) {
                            TextButton(onClick = { clipboardManager.setText(AnnotatedString(maskedText)) }) {
                                Icon(Icons.Default.ContentCopy, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Copy Masked Text", color = CyberCyan, fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PrivacyFindingCard(finding: String, severity: String, pattern: String, action: String) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        colors = CardDefaults.cardColors(containerColor = CyberSurface),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(finding, color = CyberTextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Surface(
                    color = if (severity == "CRITICAL") CyberRed.copy(alpha = 0.2f) else CyberAmber.copy(alpha = 0.2f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text(
                        severity,
                        color = if (severity == "CRITICAL") CyberRed else CyberAmber,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text("Pattern: $pattern", color = CyberTextSecondary, fontSize = 12.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text("Action: $action", color = CyberGreen, fontSize = 12.sp)
        }
    }
}
