package com.cyberguard.ai.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val CyberDark = Color(0xFF090D16)
val CyberSurface = Color(0xFF111726)
val CyberSurfaceVariant = Color(0xFF1B2338)
val CyberCyan = Color(0xFF00E5FF)
val CyberBlue = Color(0xFF00B0FF)
val CyberGreen = Color(0xFF00E676)
val CyberAmber = Color(0xFFFFD600)
val CyberRed = Color(0xFFFF1744)
val CyberTextPrimary = Color(0xFFF1F5F9)
val CyberTextSecondary = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = CyberCyan,
    secondary = CyberBlue,
    tertiary = CyberGreen,
    background = CyberDark,
    surface = CyberSurface,
    surfaceVariant = CyberSurfaceVariant,
    onPrimary = Color.Black,
    onSecondary = Color.Black,
    onTertiary = Color.Black,
    onBackground = CyberTextPrimary,
    onSurface = CyberTextPrimary,
    onSurfaceVariant = CyberTextSecondary,
    error = CyberRed
)

@Composable
fun CyberGuardTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
