import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useLanguage } from '../contexts/LanguageContext';
import { useGame, GameMode } from '../contexts/GameContext';

interface StatCardProps {
  title: string;
  icon: string;
  color: string[];
  bestScore: number;
  totalGames: number;
  accuracy: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  color,
  bestScore,
  totalGames,
  accuracy,
}) => (
  <Animatable.View animation="fadeInUp" style={styles.statCard}>
    <LinearGradient
      colors={color}
      style={styles.statCardGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.statCardHeader}>
        <Icon name={icon} size={30} color="#FFFFFF" />
        <Text style={styles.statCardTitle}>{title}</Text>
      </View>
      
      <View style={styles.statCardContent}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Best Score</Text>
          <Text style={styles.statValue}>{bestScore}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Games Played</Text>
          <Text style={styles.statValue}>{totalGames}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Accuracy</Text>
          <Text style={styles.statValue}>{accuracy.toFixed(1)}%</Text>
        </View>
      </View>
    </LinearGradient>
  </Animatable.View>
);

const StatisticsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();
  const { gameStats } = useGame();

  const getGameModeTitle = (mode: GameMode): string => {
    switch (mode) {
      case 'guessFlag':
        return t('guessTheFlag');
      case 'guessCountry':
        return t('guessTheCountry');
      case 'timedQuiz':
        return t('timedQuiz');
      case 'capitalQuiz':
        return t('capitalQuiz');
      default:
        return '';
    }
  };

  const getGameModeIcon = (mode: GameMode): string => {
    switch (mode) {
      case 'guessFlag':
        return 'flag';
      case 'guessCountry':
        return 'public';
      case 'timedQuiz':
        return 'timer';
      case 'capitalQuiz':
        return 'location-city';
      default:
        return 'help';
    }
  };

  const getGameModeColor = (mode: GameMode): string[] => {
    switch (mode) {
      case 'guessFlag':
        return ['#FF6B6B', '#FF8E8E'];
      case 'guessCountry':
        return ['#4ECDC4', '#6ED5D1'];
      case 'timedQuiz':
        return ['#45B7D1', '#6BC5D8'];
      case 'capitalQuiz':
        return ['#96CEB4', '#A8D5BA'];
      default:
        return ['#9B59B6', '#BB6BD9'];
    }
  };

  const calculateAccuracy = (correct: number, total: number): number => {
    return total > 0 ? (correct / total) * 100 : 0;
  };

  const getTotalStats = () => {
    let totalBestScore = 0;
    let totalGames = 0;
    let totalCorrect = 0;
    let totalAnswers = 0;

    Object.values(gameStats).forEach(stats => {
      totalBestScore = Math.max(totalBestScore, stats.bestScore);
      totalGames += stats.totalGames;
      totalCorrect += stats.correctAnswers;
      totalAnswers += stats.totalAnswers;
    });

    return {
      bestScore: totalBestScore,
      totalGames,
      accuracy: calculateAccuracy(totalCorrect, totalAnswers),
    };
  };

  const totalStats = getTotalStats();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: t('statistics'),
      headerStyle: {
        backgroundColor: '#667eea',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, t]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.backgroundGradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Overall Stats Header */}
          <Animatable.View animation="fadeInDown" style={styles.overallStatsContainer}>
            <Text style={styles.overallStatsTitle}>Overall Performance</Text>
            <View style={styles.overallStatsGrid}>
              <View style={styles.overallStatItem}>
                <Icon name="emoji-events" size={32} color="#FFD700" />
                <Text style={styles.overallStatValue}>{totalStats.bestScore}</Text>
                <Text style={styles.overallStatLabel}>Best Score</Text>
              </View>
              
              <View style={styles.overallStatItem}>
                <Icon name="games" size={32} color="#4CAF50" />
                <Text style={styles.overallStatValue}>{totalStats.totalGames}</Text>
                <Text style={styles.overallStatLabel}>Games Played</Text>
              </View>
              
              <View style={styles.overallStatItem}>
                <Icon name="trending-up" size={32} color="#2196F3" />
                <Text style={styles.overallStatValue}>{totalStats.accuracy.toFixed(1)}%</Text>
                <Text style={styles.overallStatLabel}>Accuracy</Text>
              </View>
            </View>
          </Animatable.View>

          {/* Game Mode Statistics */}
          <View style={styles.gameModeStatsContainer}>
            <Text style={styles.sectionTitle}>Game Mode Statistics</Text>
            
            {(Object.keys(gameStats) as GameMode[]).map((mode, index) => {
              const stats = gameStats[mode];
              const accuracy = calculateAccuracy(stats.correctAnswers, stats.totalAnswers);
              
              return (
                <StatCard
                  key={mode}
                  title={getGameModeTitle(mode)}
                  icon={getGameModeIcon(mode)}
                  color={getGameModeColor(mode)}
                  bestScore={stats.bestScore}
                  totalGames={stats.totalGames}
                  accuracy={accuracy}
                />
              );
            })}
          </View>

          {/* Achievements Section */}
          <Animatable.View animation="fadeInUp" delay={600} style={styles.achievementsContainer}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            
            <View style={styles.achievementsList}>
              {totalStats.totalGames >= 10 && (
                <View style={styles.achievementItem}>
                  <Icon name="local-fire-department" size={24} color="#FF5722" />
                  <Text style={styles.achievementText}>Dedicated Player - 10+ Games</Text>
                </View>
              )}
              
              {totalStats.bestScore >= 50 && (
                <View style={styles.achievementItem}>
                  <Icon name="star" size={24} color="#FFD700" />
                  <Text style={styles.achievementText}>High Scorer - 50+ Points</Text>
                </View>
              )}
              
              {totalStats.accuracy >= 80 && (
                <View style={styles.achievementItem}>
                  <Icon name="precision-manufacturing" size={24} color="#4CAF50" />
                  <Text style={styles.achievementText}>Precision Master - 80%+ Accuracy</Text>
                </View>
              )}
              
              {totalStats.bestScore >= 100 && (
                <View style={styles.achievementItem}>
                  <Icon name="emoji-events" size={24} color="#9C27B0" />
                  <Text style={styles.achievementText}>Champion - 100+ Points</Text>
                </View>
              )}

              {totalStats.totalGames === 0 && (
                <View style={styles.noAchievementsContainer}>
                  <Icon name="sports-esports" size={48} color="#FFFFFF" opacity={0.5} />
                  <Text style={styles.noAchievementsText}>
                    Play some games to unlock achievements!
                  </Text>
                </View>
              )}
            </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  overallStatsContainer: {
    marginBottom: 30,
  },
  overallStatsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  overallStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  overallStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  overallStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  overallStatLabel: {
    fontSize: 12,
    color: '#E8E8E8',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  gameModeStatsContainer: {
    marginBottom: 30,
  },
  statCard: {
    marginBottom: 15,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statCardGradient: {
    borderRadius: 15,
    padding: 20,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  statCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  statCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#E8E8E8',
    marginBottom: 5,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  achievementsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  achievementsList: {
    gap: 15,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    gap: 15,
  },
  achievementText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  noAchievementsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noAchievementsText: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    marginTop: 15,
    opacity: 0.8,
  },
});

export default StatisticsScreen;