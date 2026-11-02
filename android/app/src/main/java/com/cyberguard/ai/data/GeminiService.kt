package com.cyberguard.ai.data

import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Defensive AI Cybersecurity Service powered by Google Gemini.
 * Follows defensive cybersecurity principles: never generates exploit payloads or malware.
 */
class GeminiSecurityService(private val apiKey: String) {

    private val generativeModel by lazy {
        GenerativeModel(
            modelName = "gemini-3.8-flash",
            apiKey = apiKey,
            systemInstruction = content {
                text("""
                    You are CyberGuard AI, an expert defensive cybersecurity assistant.
                    Help users understand and identify potential cybersecurity threats, stay protected, and safeguard their personal data.
                    Strict Safety Rules:
                    1. Focus exclusively on defensive cybersecurity.
                    2. Never generate malware, exploit payloads, keyloggers, ransomware, phishing templates, or destructive commands.
                    3. If asked for malicious tools, explain defensive detection and remediation instead.
                    4. When analyzing suspicious content, emphasize that AI analysis is heuristic and indicator-based.
                """.trimIndent())
            }
        )
    }

    suspend fun sendSecurityChatMessage(query: String): String = withContext(Dispatchers.IO) {
        try {
            val response = generativeModel.generateContent(
                """
                User query: $query
                Provide a structured response:
                - Simple Explanation
                - Threat Information
                - Prevention Steps
                - Recommended Actions
                """.trimIndent()
            )
            response.text ?: "Defensive security analysis completed. Maintain active MFA and updated security patches."
        } catch (e: Exception) {
            "Analysis unavailable: ${e.localizedMessage}. Please check internet connection."
        }
    }

    suspend fun analyzePhishing(content: String): String = withContext(Dispatchers.IO) {
        val prompt = """
            Analyze defensively for phishing, smishing, or social engineering indicators:
            "$content"
            Provide:
            1. Risk Level (LOW, MEDIUM, HIGH, CRITICAL)
            2. Risk Score (0-100)
            3. Suspicious wording, urgency, impersonation, suspicious requests, social engineering
            4. Why this may be dangerous
            5. What you should do
        """.trimIndent()
        generativeModel.generateContent(prompt).text ?: "Phishing evaluation could not be processed."
    }

    suspend fun analyzeUrl(url: String): String = withContext(Dispatchers.IO) {
        val prompt = """
            Defensively analyze the URL structure: "$url"
            Assess domain spoofing, suspicious TLDs, IP literals, typosquatting.
            Provide Risk Score (0-100), Risk Level, Suspicious characteristics, and Safety recommendations.
            Explicitly note that this is a heuristic AI assessment.
        """.trimIndent()
        generativeModel.generateContent(prompt).text ?: "URL assessment unavailable."
    }

    suspend fun analyzeSecurityText(text: String): String = withContext(Dispatchers.IO) {
        val prompt = """
            Analyze this suspicious log/command/text defensively:
            "$text"
            Identify: Possible threat, Risk level, Suspicious indicators, and Recommended defensive action.
        """.trimIndent()
        generativeModel.generateContent(prompt).text ?: "Security text analysis unavailable."
    }
}
