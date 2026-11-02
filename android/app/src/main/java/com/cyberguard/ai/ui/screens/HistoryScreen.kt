package com.cyberguard.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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

data class HistoryItem(
    val id: String,
    val scanType: String,
    val date: String,
    val riskLevel: String,
    val shortResult: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ScanHistoryScreen(onBack: () -> Unit) {
    var historyItems by remember {
        mutableStateOf(
            listOf(
                HistoryItem("1", "Phishing Check", "Today, 10:15 AM", "CRITICAL", "Netflix billing urgency spoof detected"),
                HistoryItem("2", "URL Safety", "Yesterday, 4:20 PM", "HIGH", "Raw IP literal address with suspicious payload query"),
                HistoryItem("3", "Data Privacy Scan", "Sep 05, 2:10 PM", "MEDIUM", "2 emails and 1 phone number masked securely"),
                HistoryItem("4", "Security Text Analyzer", "Sep 04, 11:45 AM", "LOW", "Standard legitimate curl command verified")
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
    ) {
        TopAppBar(
            title = { Text("SCAN HISTORY", fontWeight = FontWeight.Bold, fontSize = 17.sp) },
            navigationIcon = {
                IconButton(onClick = onBack) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = CyberTextPrimary)
                }
            },
            actions = {
                if (historyItems.isNotEmpty()) {
                    IconButton(onClick = { historyItems = emptyList() }) {
                        Icon(Icons.Default.DeleteSweep, contentDescription = "Clear History", tint = CyberRed)
                    }
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = CyberSurface)
        )

        if (historyItems.isEmpty()) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.HistoryToggleOff, contentDescription = null, tint = CyberTextSecondary, modifier = Modifier.size(54.dp))
                    Spacer(modifier = Modifier.height(12.dp))
                    Text("No Scan Records", color = CyberTextPrimary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Text("Local device history is clear.", color = CyberTextSecondary, fontSize = 13.sp)
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(historyItems, key = { it.id }) { item ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(14.dp),
                        colors = CardDefaults.cardColors(containerColor = CyberSurface)
                    ) {
                        Row(
                            modifier = Modifier.padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(item.scanType, color = CyberTextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Surface(
                                        color = when (item.riskLevel) {
                                            "CRITICAL" -> CyberRed.copy(alpha = 0.2f)
                                            "HIGH" -> Color(0xFFFF9100).copy(alpha = 0.2f)
                                            "MEDIUM" -> CyberAmber.copy(alpha = 0.2f)
                                            else -> CyberGreen.copy(alpha = 0.2f)
                                        },
                                        shape = RoundedCornerShape(6.dp)
                                    ) {
                                        Text(
                                            item.riskLevel,
                                            color = when (item.riskLevel) {
                                                "CRITICAL" -> CyberRed
                                                "HIGH" -> Color(0xFFFF9100)
                                                "MEDIUM" -> CyberAmber
                                                else -> CyberGreen
                                            },
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(item.shortResult, color = CyberTextSecondary, fontSize = 12.sp)
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(item.date, color = Color(0xFF64748B), fontSize = 11.sp)
                            }
                            IconButton(
                                onClick = { historyItems = historyItems.filter { it.id != item.id } }
                            ) {
                                Icon(Icons.Default.Close, contentDescription = "Delete", tint = Color(0xFF64748B), modifier = Modifier.size(18.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}
