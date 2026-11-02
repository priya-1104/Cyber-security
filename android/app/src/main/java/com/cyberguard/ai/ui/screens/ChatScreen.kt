package com.cyberguard.ai.ui.screens

import android.content.Intent
import android.speech.RecognizerIntent
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.cyberguard.ai.ui.theme.*
import kotlinx.coroutines.launch

data class UIMessage(val id: Long, val isUser: Boolean, val text: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen() {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val scope = rememberCoroutineScope()

    var inputText by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var messages by remember {
        mutableStateOf(
            listOf(
                UIMessage(
                    id = 1,
                    isUser = false,
                    text = "Welcome to CyberGuard AI. I am your defensive cybersecurity assistant. Ask me about threat prevention, suspicious emails, password security, or account protection."
                )
            )
        )
    }

    // Speech-to-text voice recognition contract
    val speechLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.StartActivityForResult()
    ) { result ->
        val spokenText = result.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)?.firstOrNull()
        if (!spokenText.isNullOrBlank()) {
            inputText = spokenText
        }
    }

    val sampleQuestions = listOf(
        "What is phishing?",
        "How can I secure my Gmail account?",
        "How do I create a strong password?",
        "What should I do if I clicked a suspicious link?",
        "How can I protect my personal data?"
    )

    fun sendMessage(text: String) {
        if (text.isBlank()) return
        val userMsg = UIMessage(System.currentTimeMillis(), true, text)
        messages = messages + userMsg
        inputText = ""
        isLoading = true

        // Simulate defensive response / call Gemini
        scope.launch {
            kotlinx.coroutines.delay(1200)
            val reply = "Defensive analysis for: \"$text\"\n\n" +
                    "### Simple Explanation\nAlways enforce principle of least privilege and multi-factor authentication (MFA).\n\n" +
                    "### Threat Information\nAttackers target unpatched software, social engineering urgency, and reused passwords.\n\n" +
                    "### Prevention Steps\n1. Enable authenticator app 2FA.\n2. Verify sender addresses.\n3. Audit app permissions.\n\n" +
                    "### Recommended Actions\nRun a credential audit and isolate untrusted devices."
            messages = messages + UIMessage(System.currentTimeMillis() + 1, false, reply)
            isLoading = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberDark)
    ) {
        // Chat Top Bar
        TopAppBar(
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(36.dp)
                            .clip(CircleShape)
                            .background(CyberCyan.copy(alpha = 0.2f))
                    ) {
                        Icon(Icons.Default.Psychology, contentDescription = null, tint = CyberCyan, modifier = Modifier.size(20.dp))
                    }
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text("AI Security Chat", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = CyberTextPrimary)
                        Text("Defensive Cybersecurity Model", fontSize = 11.sp, color = CyberGreen)
                    }
                }
            },
            actions = {
                IconButton(onClick = {
                    messages = listOf(
                        UIMessage(
                            id = System.currentTimeMillis(),
                            isUser = false,
                            text = "Chat cleared. How can I assist with your cybersecurity defenses today?"
                        )
                    )
                }) {
                    Icon(Icons.Default.DeleteOutline, contentDescription = "Clear Chat", tint = CyberTextSecondary)
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(containerColor = CyberSurface)
        )

        // Sample Questions Chips
        if (messages.size <= 2) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("Suggested defensive topics:", color = CyberTextSecondary, fontSize = 11.sp)
                Spacer(modifier = Modifier.height(6.dp))
                sampleQuestions.take(3).forEach { question ->
                    SuggestionChip(
                        onClick = { sendMessage(question) },
                        label = { Text(question, fontSize = 12.sp, color = CyberCyan) },
                        colors = SuggestionChipDefaults.suggestionChipColors(containerColor = CyberSurfaceVariant),
                        modifier = Modifier.padding(vertical = 2.dp)
                    )
                }
            }
        }

        // Messages List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 12.dp),
            reverseLayout = false
        ) {
            items(messages, key = { it.id }) { msg ->
                ChatBubble(
                    message = msg,
                    onCopy = { clipboardManager.setText(AnnotatedString(msg.text)) },
                    onShare = {
                        val shareIntent = Intent(Intent.ACTION_SEND).apply {
                            type = "text/plain"
                            putExtra(Intent.EXTRA_TEXT, msg.text)
                        }
                        context.startActivity(Intent.createChooser(shareIntent, "Share Security Advice"))
                    },
                    onRegenerate = {
                        if (!msg.isUser) {
                            val lastUser = messages.lastOrNull { it.isUser }?.text
                            if (lastUser != null) sendMessage(lastUser)
                        }
                    }
                )
                Spacer(modifier = Modifier.height(10.dp))
            }
            if (isLoading) {
                item {
                    Row(
                        modifier = Modifier.padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(18.dp),
                            color = CyberCyan,
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Gemini is analyzing defensive countermeasures...", color = CyberTextSecondary, fontSize = 12.sp)
                    }
                }
            }
        }

        // Chat Input Row with Voice STT button
        Surface(
            color = CyberSurface,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Microphone Voice Input
                IconButton(
                    onClick = {
                        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                            putExtra(RecognizerIntent.EXTRA_PROMPT, "Ask CyberGuard AI...")
                        }
                        speechLauncher.launch(intent)
                    },
                    colors = IconButtonDefaults.iconButtonColors(containerColor = CyberSurfaceVariant)
                ) {
                    Icon(Icons.Default.Mic, contentDescription = "Voice Input", tint = CyberCyan)
                }

                Spacer(modifier = Modifier.width(8.dp))

                TextField(
                    value = inputText,
                    onValueChange = { inputText = it },
                    placeholder = { Text("Ask cybersecurity questions...", fontSize = 13.sp, color = CyberTextSecondary) },
                    modifier = Modifier.weight(1f),
                    colors = TextFieldDefaults.colors(
                        focusedContainerColor = CyberSurfaceVariant,
                        unfocusedContainerColor = CyberSurfaceVariant,
                        focusedTextColor = CyberTextPrimary,
                        unfocusedTextColor = CyberTextPrimary,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent
                    ),
                    shape = RoundedCornerShape(20.dp),
                    singleLine = false,
                    maxLines = 3
                )

                Spacer(modifier = Modifier.width(8.dp))

                IconButton(
                    onClick = { sendMessage(inputText) },
                    enabled = inputText.isNotBlank() && !isLoading,
                    colors = IconButtonDefaults.iconButtonColors(
                        containerColor = CyberCyan,
                        contentColor = Color.Black,
                        disabledContainerColor = Color(0xFF1E293B),
                        disabledContentColor = Color(0xFF475569)
                    )
                ) {
                    Icon(Icons.Default.Send, contentDescription = "Send")
                }
            }
        }
    }
}

@Composable
fun ChatBubble(
    message: UIMessage,
    onCopy: () -> Unit,
    onShare: () -> Unit,
    onRegenerate: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (message.isUser) Alignment.End else Alignment.Start
    ) {
        Surface(
            color = if (message.isUser) Color(0xFF0072FF) else CyberSurfaceVariant,
            shape = RoundedCornerShape(
                topStart = 16.dp,
                topEnd = 16.dp,
                bottomStart = if (message.isUser) 16.dp else 2.dp,
                bottomEnd = if (message.isUser) 2.dp else 16.dp
            ),
            modifier = Modifier.widthIn(max = 320.dp)
        ) {
            Text(
                text = message.text,
                color = CyberTextPrimary,
                fontSize = 14.sp,
                lineHeight = 20.sp,
                modifier = Modifier.padding(12.dp)
            )
        }

        if (!message.isUser) {
            Row(modifier = Modifier.padding(top = 4.dp)) {
                IconButton(onClick = onCopy, modifier = Modifier.size(28.dp)) {
                    Icon(Icons.Default.ContentCopy, contentDescription = "Copy", tint = CyberTextSecondary, modifier = Modifier.size(14.dp))
                }
                IconButton(onClick = onShare, modifier = Modifier.size(28.dp)) {
                    Icon(Icons.Default.Share, contentDescription = "Share", tint = CyberTextSecondary, modifier = Modifier.size(14.dp))
                }
                IconButton(onClick = onRegenerate, modifier = Modifier.size(28.dp)) {
                    Icon(Icons.Default.Refresh, contentDescription = "Regenerate", tint = CyberTextSecondary, modifier = Modifier.size(14.dp))
                }
            }
        }
    }
}
