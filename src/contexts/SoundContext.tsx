import React, { createContext, useContext, useEffect, useState } from 'react';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SoundContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playClick: () => void;
  playGameStart: () => void;
  playGameEnd: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');

export const SoundProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [sounds, setSounds] = useState<{[key: string]: Sound}>({});

  useEffect(() => {
    const initializeSounds = async () => {
      try {
        // Load sound preference
        const savedSoundPref = await AsyncStorage.getItem('soundEnabled');
        if (savedSoundPref !== null) {
          setSoundEnabledState(JSON.parse(savedSoundPref));
        }

        // Initialize sound objects with placeholder sounds
        // In a real app, you would load actual audio files
        const correctSound = new Sound('correct.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load correct sound', error);
          }
        });

        const incorrectSound = new Sound('incorrect.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load incorrect sound', error);
          }
        });

        const clickSound = new Sound('click.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load click sound', error);
          }
        });

        const gameStartSound = new Sound('game_start.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load game start sound', error);
          }
        });

        const gameEndSound = new Sound('game_end.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load game end sound', error);
          }
        });

        setSounds({
          correct: correctSound,
          incorrect: incorrectSound,
          click: clickSound,
          gameStart: gameStartSound,
          gameEnd: gameEndSound,
        });
      } catch (error) {
        console.log('Error initializing sounds:', error);
      }
    };

    initializeSounds();

    return () => {
      // Release sound resources
      Object.values(sounds).forEach(sound => {
        if (sound) {
          sound.release();
        }
      });
    };
  }, []);

  const setSoundEnabled = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('soundEnabled', JSON.stringify(enabled));
      setSoundEnabledState(enabled);
    } catch (error) {
      console.log('Error saving sound preference:', error);
    }
  };

  const playSound = (soundKey: string) => {
    if (soundEnabled && sounds[soundKey]) {
      sounds[soundKey].play((success) => {
        if (!success) {
          console.log('Failed to play sound:', soundKey);
        }
      });
    }
  };

  const playCorrect = () => playSound('correct');
  const playIncorrect = () => playSound('incorrect');
  const playClick = () => playSound('click');
  const playGameStart = () => playSound('gameStart');
  const playGameEnd = () => playSound('gameEnd');

  const contextValue: SoundContextType = {
    soundEnabled,
    setSoundEnabled,
    playCorrect,
    playIncorrect,
    playClick,
    playGameStart,
    playGameEnd,
  };

  return (
    <SoundContext.Provider value={contextValue}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};