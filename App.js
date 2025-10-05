import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import Constants from 'expo-constants';

let mobileAds;
try {
  mobileAds = require('react-native-google-mobile-ads').default;
} catch (e) {
  console.log('AdMob not available in this environment');
}

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import HelperSelectScreen from './src/screens/HelperSelectScreen';
import HelperUpgradeScreen from './src/screens/HelperUpgradeScreen';
import ShopScreen from './src/screens/ShopScreen';
import QuizGameScreen from './src/screens/QuizGameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import QuestionManagerScreen from './src/screens/QuestionManagerScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SubmitQuestionScreen from './src/screens/SubmitQuestionScreen';
import ApproveQuestionsScreen from './src/screens/ApproveQuestionsScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#3a4a5a' }
        }}
      >
        {user ? (
          // Authenticated stack
          <>
            <Stack.Screen name="MainMenu" component={MainMenuScreen} />
            <Stack.Screen name="HelperSelect" component={HelperSelectScreen} />
            <Stack.Screen name="HelperUpgrade" component={HelperUpgradeScreen} />
            <Stack.Screen name="Shop" component={ShopScreen} />
            <Stack.Screen name="QuizGame" component={QuizGameScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen name="QuestionManager" component={QuestionManagerScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="SubmitQuestion" component={SubmitQuestionScreen} />
            <Stack.Screen name="ApproveQuestions" component={ApproveQuestionsScreen} />
          </>
        ) : (
          // Auth stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    try {
      // Proper Expo Go detection
      const isExpoGo = Constants.executionEnvironment === 'storeClient';

      console.log('🚀 Quiz Master App Starting...');
      console.log('📱 Environment Info:');
      console.log('  Execution Environment:', Constants.executionEnvironment);
      console.log('  App Ownership:', Constants.appOwnership);
      console.log('  Is Expo Go:', isExpoGo);

      if (!isExpoGo && mobileAds) {
        console.log('📺 Initializing AdMob SDK...');
        mobileAds()
          .initialize()
          .then(adapterStatuses => {
            console.log('✅ AdMob initialized successfully!');
            console.log('Adapter statuses:', JSON.stringify(adapterStatuses, null, 2));
          })
          .catch(error => {
            console.error('❌ AdMob initialization failed:', error);
            console.error('Error message:', error.message);
          });
      } else {
        console.log('📺 Running in Expo Go - simulated ads enabled');
      }
    } catch (error) {
      console.error('❌ Critical error in App initialization:', error);
      console.error('Stack:', error.stack);
    }
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#3a4a5a" />
      <AppNavigator />
    </AuthProvider>
  );
}