import React, { useState } from 'react';
import { ActiveTab, ActiveToolView } from './types';
import { AndroidPhoneFrame } from './components/AndroidPhoneFrame';
import { HomeScreen } from './components/HomeScreen';
import { ChatScreen } from './components/ChatScreen';
import { PhishingCheckScreen } from './components/PhishingCheckScreen';
import { UrlSafetyScreen } from './components/UrlSafetyScreen';
import { PrivacyScannerScreen } from './components/PrivacyScannerScreen';
import { TextAnalyzerScreen } from './components/TextAnalyzerScreen';
import { ScanHistoryScreen } from './components/ScanHistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ScanHubView } from './components/ScanHubView';
import { AndroidCodeModal } from './components/AndroidCodeModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeTool, setActiveTool] = useState<ActiveToolView | null>(null);
  const [showSourceModal, setShowSourceModal] = useState(false);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'chat') {
      setActiveTool('ai_chat');
    } else if (tab === 'scan') {
      setActiveTool(null);
    } else {
      setActiveTool(null);
    }
  };

  const handleNavigateToTool = (tool: ActiveToolView) => {
    setActiveTool(tool);
    if (tool === 'ai_chat') {
      setActiveTab('chat');
    } else {
      setActiveTab('scan');
    }
  };

  const handleBackToHub = () => {
    setActiveTool(null);
  };

  // Render view based on state
  const renderContent = () => {
    if (activeTool === 'ai_chat' || activeTab === 'chat') {
      return <ChatScreen />;
    }

    if (activeTool === 'phishing_check') {
      return <PhishingCheckScreen onBack={handleBackToHub} />;
    }

    if (activeTool === 'url_safety') {
      return <UrlSafetyScreen onBack={handleBackToHub} />;
    }

    if (activeTool === 'privacy_scanner') {
      return <PrivacyScannerScreen onBack={handleBackToHub} />;
    }

    if (activeTool === 'text_analyzer') {
      return <TextAnalyzerScreen onBack={handleBackToHub} />;
    }

    if (activeTool === 'scan_history') {
      return <ScanHistoryScreen onBack={handleBackToHub} />;
    }

    if (activeTab === 'scan') {
      return <ScanHubView onSelectTool={handleNavigateToTool} />;
    }

    if (activeTab === 'settings') {
      return (
        <SettingsScreen
          onOpenSourceModal={() => setShowSourceModal(true)}
          onClearChat={() => {}}
        />
      );
    }

    // Default: Home Screen
    return <HomeScreen onNavigateToTool={handleNavigateToTool} />;
  };

  return (
    <>
      <AndroidPhoneFrame
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenSourceModal={() => setShowSourceModal(true)}
      >
        {renderContent()}
      </AndroidPhoneFrame>

      {/* Kotlin / Jetpack Compose Source Code Modal */}
      <AndroidCodeModal
        isOpen={showSourceModal}
        onClose={() => setShowSourceModal(false)}
      />
    </>
  );
}
