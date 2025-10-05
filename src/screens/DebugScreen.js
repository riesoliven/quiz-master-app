import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Constants from 'expo-constants';
import { showRewardedAd, isRewardedAdReady, getAdDiagnostics } from '../services/adService';

// Capture console logs
let capturedLogs = [];
const originalLog = console.log;
const originalError = console.error;

console.log = (...args) => {
  const message = args.join(' ');
  // Only capture ad-related logs
  if (message.includes('✅') || message.includes('❌') || message.includes('📺') || message.includes('🔍')) {
    capturedLogs.push(message);
    if (capturedLogs.length > 50) capturedLogs.shift(); // Keep last 50
  }
  originalLog(...args);
};

console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('✅') || message.includes('❌') || message.includes('📺') || message.includes('🔍')) {
    capturedLogs.push('ERROR: ' + message);
    if (capturedLogs.length > 50) capturedLogs.shift();
  }
  originalError(...args);
};

const DebugScreen = ({ navigation }) => {
  const [adTestResult, setAdTestResult] = useState('Not tested yet');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Refresh logs every 500ms
    const interval = setInterval(() => {
      setLogs([...capturedLogs]);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const testAd = async () => {
    setAdTestResult('Testing ad...');
    console.log('🧪 DEBUG: Starting ad test');
    console.log('🧪 executionEnvironment:', Constants.executionEnvironment);
    console.log('🧪 isStandalone check:', (Constants.executionEnvironment === 'standalone' || Constants.executionEnvironment === 'bare'));

    try {
      const result = await showRewardedAd();
      const resultText = `Ad completed! Reward: ${result}\n\nCheck if it was a real video ad or 2-second simulation`;
      setAdTestResult(resultText);
      console.log('🧪 Ad test result:', result);
    } catch (error) {
      setAdTestResult(`Ad test failed: ${error.message}`);
      console.error('🧪 Ad test error:', error);
    }
  };

  let admobInfo = 'Not available';
  let admobDetails = '';
  try {
    const admob = require('react-native-google-mobile-ads');
    admobInfo = admob ? 'Module loaded ✅' : 'Module not loaded ❌';

    // Get detailed status from adService
    const adService = require('../services/adService');
    admobDetails = `Check console logs for detailed ad loading status`;
  } catch (e) {
    admobInfo = `Failed to load: ${e.message}`;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔍 Debug Info</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environment Detection</Text>
          <DebugRow label="Execution Environment" value={Constants.executionEnvironment} />
          <DebugRow label="App Ownership" value={Constants.appOwnership} />
          <DebugRow
            label="Is Expo Go?"
            value={Constants.executionEnvironment === 'storeClient' ? 'YES ❌' : 'NO ✅'}
          />
          <DebugRow
            label="Is Standalone?"
            value={(Constants.executionEnvironment === 'standalone' || Constants.executionEnvironment === 'bare') ? 'YES ✅' : 'NO ❌'}
          />
          <DebugRow
            label="Expected Ads"
            value={(Constants.executionEnvironment === 'standalone' || Constants.executionEnvironment === 'bare') ? 'Real Google Test Ads' : 'Simulated'}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AdMob Module</Text>
          <DebugRow label="AdMob Status" value={admobInfo} />
          <DebugRow label="Ad Ready?" value={isRewardedAdReady() ? 'YES ✅' : 'NO ❌'} />

          {(() => {
            const diag = getAdDiagnostics();
            return (
              <>
                <DebugRow label="isStandalone (internal)" value={diag.isStandalone ? 'YES ✅' : 'NO ❌'} />
                <DebugRow label="admobAvailable (internal)" value={diag.admobAvailable ? 'YES ✅' : 'NO ❌'} />
                <DebugRow label="hasRewardedAd (internal)" value={diag.hasRewardedAd ? 'YES ✅' : 'NO ❌'} />
                <DebugRow label="hasInstance (internal)" value={diag.hasRewardedAdInstance ? 'YES ✅' : 'NO ❌'} />
                <DebugRow label="Ad Unit ID" value={diag.adUnitId || 'undefined'} />
                <DebugRow label="Test ID (Expected)" value={diag.testAdId || 'undefined'} />
              </>
            );
          })()}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Info</Text>
          <DebugRow label="Platform" value={Constants.platform?.ios ? 'iOS' : 'Android'} />
          <DebugRow label="App Version" value={Constants.expoConfig?.version || 'N/A'} />
          <DebugRow label="SDK Version" value={Constants.expoConfig?.sdkVersion || 'N/A'} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ad Test</Text>

          <View style={{backgroundColor: 'rgba(255,200,0,0.2)', padding: 10, borderRadius: 5, marginBottom: 10}}>
            <Text style={{color: '#faca3a', fontSize: 13, fontWeight: 'bold'}}>
              Expected Ad Type:
            </Text>
            <Text style={{color: 'white', fontSize: 12, marginTop: 5}}>
              {(Constants.executionEnvironment === 'standalone' || Constants.executionEnvironment === 'bare')
                ? '✅ REAL Google test video ad (skip after 5 sec)'
                : '⚠️ Simulated (2 second delay)'}
            </Text>
          </View>

          <TouchableOpacity style={styles.testButton} onPress={testAd}>
            <Text style={styles.testButtonText}>Test Ad Loading</Text>
          </TouchableOpacity>
          <Text style={styles.testResult}>{adTestResult}</Text>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back to Main Menu</Text>
        </TouchableOpacity>

        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>📋 What to Check:</Text>
          <Text style={styles.instructionsText}>
            1. "Execution Environment" should be "standalone" (not "storeClient"){'\n'}
            2. "Is Expo Go?" should be "NO ✅"{'\n'}
            3. "AdMob Status" should be "Module loaded ✅"{'\n'}
            4. "Ad Ready?" should be "YES ✅"{'\n'}
            5. Test the ad and see if it's real or simulated
          </Text>
        </View>

        <View style={styles.logsSection}>
          <Text style={styles.sectionTitle}>📝 Console Logs (Live)</Text>
          <ScrollView style={styles.logsContainer} nestedScrollEnabled>
            {logs.length === 0 ? (
              <Text style={styles.logText}>Waiting for logs...</Text>
            ) : (
              logs.map((log, index) => (
                <Text key={index} style={styles.logText}>{log}</Text>
              ))
            )}
          </ScrollView>
          <Text style={styles.logsHint}>
            Look for:{'\n'}
            ✅✅✅ "Real test ad LOADED" = Success!{'\n'}
            ❌❌❌ "Test ad FAILED" = Shows error{'\n'}
            Neither = Ad stuck loading (the problem!)
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const DebugRow = ({ label, value }) => (
  <View style={styles.debugRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{String(value)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3a4a5a',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    color: '#faca3a',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  sectionTitle: {
    color: '#faca3a',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    color: '#9aaa9a',
    fontSize: 14,
    flex: 1,
  },
  value: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  testButton: {
    backgroundColor: '#4a9a4a',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testResult: {
    color: '#faca3a',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    backgroundColor: 'rgba(90, 106, 122, 0.5)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionsBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(74, 154, 74, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4a9a4a',
  },
  instructionsTitle: {
    color: '#4aca4a',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionsText: {
    color: '#9aaa9a',
    fontSize: 12,
    lineHeight: 18,
  },
  logsSection: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#6a7a8a',
  },
  logsContainer: {
    maxHeight: 300,
    backgroundColor: '#1a1a1a',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  logText: {
    color: '#00ff00',
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 3,
  },
  logsHint: {
    color: '#faca3a',
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 5,
  },
});

export default DebugScreen;
