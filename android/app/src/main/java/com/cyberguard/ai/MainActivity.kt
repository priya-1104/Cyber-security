package com.cyberguard.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Psychology
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.cyberguard.ai.ui.screens.*
import com.cyberguard.ai.ui.theme.CyberGuardTheme

enum class NavItem(val route: String, val title: String, val icon: ImageVector) {
    HOME("home", "Home", Icons.Default.Home),
    AI("ai_chat", "AI", Icons.Default.Psychology),
    SCAN("scan", "Scan", Icons.Default.Security),
    SETTINGS("settings", "Settings", Icons.Default.Settings)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CyberGuardTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        NavigationBar(
                            containerColor = Color(0xFF0F1420),
                            contentColor = Color(0xFFE2E8F0)
                        ) {
                            NavItem.values().forEach { item ->
                                val selected = currentRoute == item.route
                                NavigationBarItem(
                                    selected = selected,
                                    onClick = {
                                        if (currentRoute != item.route) {
                                            navController.navigate(item.route) {
                                                popUpTo(navController.graph.startDestinationId) {
                                                    saveState = true
                                                }
                                                launchSingleTop = true
                                                restoreState = true
                                            }
                                        }
                                    },
                                    icon = { Icon(item.icon, contentDescription = item.title) },
                                    label = { Text(item.title) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = Color(0xFF00E5FF),
                                        selectedTextColor = Color(0xFF00E5FF),
                                        unselectedIconColor = Color(0xFF64748B),
                                        unselectedTextColor = Color(0xFF64748B),
                                        indicatorColor = Color(0xFF1E293B)
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = NavItem.HOME.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(NavItem.HOME.route) {
                            HomeScreen(
                                onNavigateToChat = { navController.navigate(NavItem.AI.route) },
                                onNavigateToPhishing = { navController.navigate("phishing") },
                                onNavigateToUrlSafety = { navController.navigate("url_safety") },
                                onNavigateToPrivacy = { navController.navigate("privacy_scan") },
                                onNavigateToTextAnalyzer = { navController.navigate("text_analyzer") }
                            )
                        }
                        composable(NavItem.AI.route) {
                            ChatScreen()
                        }
                        composable(NavItem.SCAN.route) {
                            ScanHubScreen(
                                onNavigateToPhishing = { navController.navigate("phishing") },
                                onNavigateToUrlSafety = { navController.navigate("url_safety") },
                                onNavigateToPrivacy = { navController.navigate("privacy_scan") },
                                onNavigateToTextAnalyzer = { navController.navigate("text_analyzer") },
                                onNavigateToHistory = { navController.navigate("history") }
                            )
                        }
                        composable(NavItem.SETTINGS.route) {
                            SettingsScreen(
                                onNavigateToHistory = { navController.navigate("history") }
                            )
                        }
                        composable("phishing") {
                            PhishingCheckScreen(onBack = { navController.popBackStack() })
                        }
                        composable("url_safety") {
                            UrlSafetyScreen(onBack = { navController.popBackStack() })
                        }
                        composable("privacy_scan") {
                            PrivacyScannerScreen(onBack = { navController.popBackStack() })
                        }
                        composable("text_analyzer") {
                            SecurityTextAnalyzerScreen(onBack = { navController.popBackStack() })
                        }
                        composable("history") {
                            ScanHistoryScreen(onBack = { navController.popBackStack() })
                        }
                    }
                }
            }
        }
    }
}
