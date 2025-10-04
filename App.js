import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import MainMenuScreen from './src/screens/MainMenuScreen';
import HelperSelectScreen from './src/screens/HelperSelectScreen';
import QuizGameScreen from './src/screens/QuizGameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import QuestionManagerScreen from './src/screens/QuestionManagerScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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
            <Stack.Screen name="QuizGame" component={QuizGameScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
            <Stack.Screen name="QuestionManager" component={QuestionManagerScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
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
  return (
    <AuthProvider>
      <StatusBar style="light" backgroundColor="#3a4a5a" />
      <AppNavigator />
    </AuthProvider>
  );
}