import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GameMode = 'guessFlag' | 'guessCountry' | 'timedQuiz' | 'capitalQuiz';

interface GameStats {
  bestScore: number;
  totalGames: number;
  correctAnswers: number;
  totalAnswers: number;
}

interface GameContextType {
  currentScore: number;
  setCurrentScore: (score: number) => void;
  gameStats: { [key in GameMode]: GameStats };
  updateGameStats: (mode: GameMode, score: number, correct: boolean) => void;
  resetCurrentScore: () => void;
}

const initialStats: GameStats = {
  bestScore: 0,
  totalGames: 0,
  correctAnswers: 0,
  totalAnswers: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [gameStats, setGameStats] = useState<{ [key in GameMode]: GameStats }>({
    guessFlag: { ...initialStats },
    guessCountry: { ...initialStats },
    timedQuiz: { ...initialStats },
    capitalQuiz: { ...initialStats },
  });

  React.useEffect(() => {
    loadGameStats();
  }, []);

  const loadGameStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem('gameStats');
      if (savedStats) {
        setGameStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.log('Error loading game stats:', error);
    }
  };

  const saveGameStats = async (newStats: { [key in GameMode]: GameStats }) => {
    try {
      await AsyncStorage.setItem('gameStats', JSON.stringify(newStats));
    } catch (error) {
      console.log('Error saving game stats:', error);
    }
  };

  const updateGameStats = (mode: GameMode, score: number, correct: boolean) => {
    setGameStats(prevStats => {
      const modeStats = prevStats[mode];
      const newStats = {
        ...prevStats,
        [mode]: {
          bestScore: Math.max(modeStats.bestScore, score),
          totalGames: modeStats.totalGames + 1,
          correctAnswers: modeStats.correctAnswers + (correct ? 1 : 0),
          totalAnswers: modeStats.totalAnswers + 1,
        },
      };
      
      saveGameStats(newStats);
      return newStats;
    });
  };

  const resetCurrentScore = () => {
    setCurrentScore(0);
  };

  const contextValue: GameContextType = {
    currentScore,
    setCurrentScore,
    gameStats,
    updateGameStats,
    resetCurrentScore,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};