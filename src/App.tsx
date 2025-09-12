import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { LanguageProvider } from './contexts/LanguageContext';
import { SoundProvider } from './contexts/SoundContext';
import { GameProvider } from './contexts/GameContext';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <SoundProvider>
          <GameProvider>
            <NavigationContainer>
              <StatusBar barStyle="light-content" backgroundColor="#2196F3" />
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#2196F3',
                  },
                  headerTintColor: '#fff',
                  headerTitleStyle: {
                    fontWeight: 'bold',
                  },
                }}
              >
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen} 
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="Game" 
                  component={GameScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="Statistics" 
                  component={StatisticsScreen}
                />
                <Stack.Screen 
                  name="Settings" 
                  component={SettingsScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </GameProvider>
        </SoundProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
};

export default App;