import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';
import { useGame, GameMode } from '../contexts/GameContext';
import { countries, getRandomCountries, shuffleArray, Country } from '../data/flags';

const { width, height } = Dimensions.get('window');

interface Question {
  correctAnswer: Country;
  options: Country[];
  type: 'flag' | 'country' | 'capital';
}

interface GameScreenProps {
  route: {
    params: {
      mode: GameMode;
    };
  };
}

const GameScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = (route.params as any) || { mode: 'guessFlag' };
  
  const { t } = useLanguage();
  const { playCorrect, playIncorrect, playGameStart, playGameEnd } = useSound();
  const { currentScore, setCurrentScore, updateGameStats } = useGame();

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const maxQuestions = mode === 'timedQuiz' ? 999 : 20;
  const isTimedMode = mode === 'timedQuiz';

  useEffect(() => {
    playGameStart();
    generateNewQuestion();
    setCurrentScore(0);
  }, [mode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimedMode && gameActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isTimedMode && timeLeft <= 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameActive, isTimedMode]);

  const generateNewQuestion = useCallback(() => {
    const correctAnswer = getRandomCountries(1)[0];
    const wrongAnswers = getRandomCountries(3, [correctAnswer.code]);
    const allOptions = shuffleArray([correctAnswer, ...wrongAnswers]);

    let questionType: 'flag' | 'country' | 'capital';
    
    switch (mode) {
      case 'guessFlag':
        questionType = 'flag';
        break;
      case 'guessCountry':
        questionType = 'country';
        break;
      case 'capitalQuiz':
        questionType = 'capital';
        break;
      case 'timedQuiz':
        questionType = Math.random() > 0.5 ? 'flag' : 'country';
        break;
      default:
        questionType = 'flag';
    }

    setCurrentQuestion({
      correctAnswer,
      options: allOptions,
      type: questionType,
    });
    setSelectedOption(null);
    setShowResult(false);
  }, [mode]);

  const handleOptionSelect = (selectedCountry: Country) => {
    if (!gameActive || selectedOption) return;

    const correct = selectedCountry.code === currentQuestion?.correctAnswer.code;
    setSelectedOption(selectedCountry.code);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      playCorrect();
      const newScore = currentScore + (isTimedMode ? 10 : 5);
      setCurrentScore(newScore);
      
      if (isTimedMode) {
        setTimeLeft(prev => Math.min(prev + 5, 60)); // Add bonus time
      }
    } else {
      playIncorrect();
      
      if (isTimedMode) {
        setTimeLeft(prev => Math.max(prev - 3, 0)); // Subtract time penalty
      }
    }

    updateGameStats(mode, currentScore, correct);

    // Auto proceed to next question or end game
    setTimeout(() => {
      if (questionNumber >= maxQuestions && !isTimedMode) {
        endGame();
      } else {
        setQuestionNumber(prev => prev + 1);
        generateNewQuestion();
      }
    }, 1500);
  };

  const endGame = () => {
    setGameActive(false);
    playGameEnd();
    
    setTimeout(() => {
      Alert.alert(
        t('gameOver'),
        `${t('finalScore')}: ${currentScore}`,
        [
          {
            text: t('home'),
            onPress: () => navigation.goBack(),
          },
          {
            text: t('playAgain'),
            onPress: restartGame,
          },
        ]
      );
    }, 500);
  };

  const restartGame = () => {
    setGameActive(true);
    setQuestionNumber(1);
    setTimeLeft(60);
    setCurrentScore(0);
    generateNewQuestion();
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const { correctAnswer, type } = currentQuestion;

    switch (type) {
      case 'flag':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Which country does this flag belong to?</Text>
            <Animatable.View animation="zoomIn" style={styles.flagContainer}>
              <Text style={styles.flagEmoji}>{correctAnswer.flagEmoji}</Text>
            </Animatable.View>
          </View>
        );
      
      case 'country':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Which flag belongs to:</Text>
            <Animatable.View animation="fadeIn" style={styles.countryNameContainer}>
              <Text style={styles.countryName}>{t(`countries.${correctAnswer.code}`) || correctAnswer.name}</Text>
            </Animatable.View>
          </View>
        );
      
      case 'capital':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>What is the capital of:</Text>
            <Animatable.View animation="fadeIn" style={styles.countryNameContainer}>
              <Text style={styles.countryName}>{t(`countries.${correctAnswer.code}`) || correctAnswer.name}</Text>
            </Animatable.View>
            <View style={styles.flagContainer}>
              <Text style={styles.flagEmoji}>{correctAnswer.flagEmoji}</Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderOptions = () => {
    if (!currentQuestion) return null;

    const { options, type, correctAnswer } = currentQuestion;

    return (
      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          const isSelected = selectedOption === option.code;
          const isCorrectOption = option.code === correctAnswer.code;
          const showCorrect = showResult && isCorrectOption;
          const showIncorrect = showResult && isSelected && !isCorrectOption;

          let optionStyle = [styles.optionButton];
          if (showCorrect) {
            optionStyle.push(styles.correctOption);
          } else if (showIncorrect) {
            optionStyle.push(styles.incorrectOption);
          }

          return (
            <Animatable.View
              key={option.code}
              animation="fadeInUp"
              delay={index * 100}
            >
              <TouchableOpacity
                style={optionStyle}
                onPress={() => handleOptionSelect(option)}
                disabled={!gameActive || showResult}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  {type === 'country' ? (
                    <Text style={styles.flagEmoji}>{option.flagEmoji}</Text>
                  ) : type === 'capital' ? (
                    <Text style={styles.optionText}>
                      {t(`capitals.${option.code}`) || option.capital}
                    </Text>
                  ) : (
                    <Text style={styles.optionText}>
                      {t(`countries.${option.code}`) || option.name}
                    </Text>
                  )}
                  
                  {showCorrect && (
                    <Icon name="check-circle" size={24} color="#4CAF50" />
                  )}
                  {showIncorrect && (
                    <Icon name="cancel" size={24} color="#F44336" />
                  )}
                </View>
              </TouchableOpacity>
            </Animatable.View>
          );
        })}
      </View>
    );
  };

  const renderGameHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <View style={styles.gameInfo}>
        <View style={styles.scoreContainer}>
          <Icon name="stars" size={20} color="#FFD700" />
          <Text style={styles.scoreText}>{currentScore}</Text>
        </View>
        
        {isTimedMode ? (
          <View style={styles.timerContainer}>
            <Icon name="timer" size={20} color="#FFFFFF" />
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        ) : (
          <Text style={styles.questionCounter}>
            {questionNumber} / {maxQuestions}
          </Text>
        )}
      </View>
    </View>
  );

  const renderFeedback = () => {
    if (!showResult) return null;

    return (
      <Animatable.View
        animation={isCorrect ? "bounceIn" : "shake"}
        style={[
          styles.feedbackContainer,
          isCorrect ? styles.correctFeedback : styles.incorrectFeedback
        ]}
      >
        <Icon
          name={isCorrect ? "check-circle" : "cancel"}
          size={30}
          color="#FFFFFF"
        />
        <Text style={styles.feedbackText}>
          {isCorrect ? t('correct') : t('incorrect')}
        </Text>
      </Animatable.View>
    );
  };

  if (!gameActive && questionNumber > maxQuestions) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.backgroundGradient}>
          <View style={styles.gameOverContainer}>
            <Animatable.View animation="zoomIn" style={styles.gameOverContent}>
              <Icon name="emoji-events" size={80} color="#FFD700" />
              <Text style={styles.gameOverTitle}>{t('gameOver')}</Text>
              <Text style={styles.finalScoreText}>
                {t('finalScore')}: {currentScore}
              </Text>
              
              <View style={styles.gameOverButtons}>
                <TouchableOpacity
                  style={styles.gameOverButton}
                  onPress={restartGame}
                >
                  <Text style={styles.gameOverButtonText}>{t('playAgain')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.gameOverButton, styles.homeButton]}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.gameOverButtonText}>{t('home')}</Text>
                </TouchableOpacity>
              </View>
            </Animatable.View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.backgroundGradient}>
        {renderGameHeader()}
        
        <View style={styles.gameContent}>
          {renderQuestion()}
          {renderOptions()}
          {renderFeedback()}
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  questionCounter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  questionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  flagContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    minWidth: 160,
  },
  flagEmoji: {
    fontSize: 80,
  },
  countryNameContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  countryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    gap: 15,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 10,
  },
  correctFeedback: {
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
  },
  incorrectFeedback: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gameOverContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 300,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  gameOverButtons: {
    gap: 15,
    width: '100%',
  },
  gameOverButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#2196F3',
  },
  gameOverButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default GameScreen;