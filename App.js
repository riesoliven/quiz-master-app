import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import MainMenuScreen from './src/screens/MainMenuScreen';
import HelperSelectScreen from './src/screens/HelperSelectScreen';
import QuizGameScreen from './src/screens/QuizGameScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import QuestionManagerScreen from './src/screens/QuestionManagerScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#3a4a5a" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainMenu"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#3a4a5a' }
          }}
        >
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="HelperSelect" component={HelperSelectScreen} />
          <Stack.Screen name="QuizGame" component={QuizGameScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="QuestionManager" component={QuestionManagerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}