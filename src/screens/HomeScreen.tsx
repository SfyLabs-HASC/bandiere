import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import { GameMode } from '../contexts/GameContext';

const { width, height } = Dimensions.get('window');

interface GameModeButton {
  mode: GameMode;
  titleKey: string;
  icon: string;
  color: string[];
  description: string;
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { playClick } = useSound();

  const gameModes: GameModeButton[] = [
    {
      mode: 'guessFlag',
      titleKey: 'guessTheFlag',
      icon: 'flag',
      color: ['#FF6B6B', '#FF8E8E'],
      description: 'Identify countries from their flags'
    },
    {
      mode: 'guessCountry',
      titleKey: 'guessTheCountry',
      icon: 'public',
      color: ['#4ECDC4', '#6ED5D1'],
      description: 'Match flags to country names'
    },
    {
      mode: 'timedQuiz',
      titleKey: 'timedQuiz',
      icon: 'timer',
      color: ['#45B7D1', '#6BC5D8'],
      description: 'Race against the clock'
    },
    {
      mode: 'capitalQuiz',
      titleKey: 'capitalQuiz',
      icon: 'location-city',
      color: ['#96CEB4', '#A8D5BA'],
      description: 'Test your knowledge of capitals'
    }
  ];

  const handleGameModePress = (mode: GameMode) => {
    playClick();
    navigation.navigate('Game' as never, { mode } as never);
  };

  const handleNavigateToStats = () => {
    playClick();
    navigation.navigate('Statistics' as never);
  };

  const handleNavigateToSettings = () => {
    playClick();
    navigation.navigate('Settings' as never);
  };

  const renderGameModeButton = (gameMode: GameModeButton, index: number) => (
    <Animatable.View
      key={gameMode.mode}
      animation="fadeInUp"
      delay={index * 200}
      style={styles.gameModeContainer}
    >
      <TouchableOpacity
        style={styles.gameModeButton}
        onPress={() => handleGameModePress(gameMode.mode)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={gameMode.color}
          style={styles.gameModeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.gameModeContent}>
            <Icon name={gameMode.icon} size={40} color="#FFFFFF" />
            <Text style={styles.gameModeTitle}>
              {t(gameMode.titleKey)}
            </Text>
            <Text style={styles.gameModeDescription}>
              {gameMode.description}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.backgroundGradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animatable.View animation="fadeInDown" style={styles.header}>
            <Text style={styles.appTitle}>{t('appTitle')}</Text>
            <Text style={styles.appSubtitle}>🌍 Test Your Geography Knowledge 🌍</Text>
          </Animatable.View>

          {/* Game Mode Buttons */}
          <View style={styles.gameModeGrid}>
            {gameModes.map((gameMode, index) => renderGameModeButton(gameMode, index))}
          </View>

          {/* Bottom Navigation */}
          <Animatable.View animation="fadeInUp" delay={800} style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.bottomNavButton}
              onPress={handleNavigateToStats}
              activeOpacity={0.7}
            >
              <Icon name="bar-chart" size={24} color="#FFFFFF" />
              <Text style={styles.bottomNavText}>{t('statistics')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomNavButton}
              onPress={handleNavigateToSettings}
              activeOpacity={0.7}
            >
              <Icon name="settings" size={24} color="#FFFFFF" />
              <Text style={styles.bottomNavText}>{t('settings')}</Text>
            </TouchableOpacity>
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    opacity: 0.9,
  },
  gameModeGrid: {
    flex: 1,
    justifyContent: 'center',
  },
  gameModeContainer: {
    marginBottom: 20,
  },
  gameModeButton: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gameModeGradient: {
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
  },
  gameModeContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  gameModeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  gameModeDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomNavButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 80,
  },
  bottomNavText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;