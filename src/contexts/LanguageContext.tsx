import React, { createContext, useContext, useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
  language: string;
  translations: any;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Main Menu
    appTitle: 'Flag Quiz',
    guessTheFlag: 'Guess the Flag',
    guessTheCountry: 'Guess the Country',
    timedQuiz: 'Timed Quiz',
    capitalQuiz: 'Capitals Quiz',
    statistics: 'Statistics',
    settings: 'Settings',
    
    // Game
    score: 'Score',
    timeLeft: 'Time Left',
    question: 'Question',
    correct: 'Correct!',
    incorrect: 'Incorrect!',
    gameOver: 'Game Over',
    finalScore: 'Final Score',
    playAgain: 'Play Again',
    home: 'Home',
    
    // Statistics
    bestScore: 'Best Score',
    totalGames: 'Total Games',
    accuracy: 'Accuracy',
    
    // Settings
    language: 'Language',
    sounds: 'Sound Effects',
    
    // Countries and Capitals
    countries: {
      // Major countries
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'FR': 'France',
      'DE': 'Germany',
      'IT': 'Italy',
      'ES': 'Spain',
      'JP': 'Japan',
      'CN': 'China',
      'IN': 'India',
      'BR': 'Brazil',
      'AU': 'Australia',
      'RU': 'Russia',
      'MX': 'Mexico',
      'AR': 'Argentina',
      'EG': 'Egypt',
      'ZA': 'South Africa',
      'NG': 'Nigeria',
      'KE': 'Kenya',
      'MA': 'Morocco',
      // European countries
      'AT': 'Austria',
      'BE': 'Belgium',
      'BG': 'Bulgaria',
      'HR': 'Croatia',
      'CY': 'Cyprus',
      'CZ': 'Czech Republic',
      'DK': 'Denmark',
      'EE': 'Estonia',
      'FI': 'Finland',
      'GR': 'Greece',
      'HU': 'Hungary',
      'IE': 'Ireland',
      'LV': 'Latvia',
      'LT': 'Lithuania',
      'LU': 'Luxembourg',
      'MT': 'Malta',
      'NL': 'Netherlands',
      'PL': 'Poland',
      'PT': 'Portugal',
      'RO': 'Romania',
      'SK': 'Slovakia',
      'SI': 'Slovenia',
      'SE': 'Sweden',
      'NO': 'Norway',
      'CH': 'Switzerland',
      // Asian countries
      'TH': 'Thailand',
      'VN': 'Vietnam',
      'KR': 'South Korea',
      'PH': 'Philippines',
      'ID': 'Indonesia',
      'MY': 'Malaysia',
      'SG': 'Singapore',
      'BD': 'Bangladesh',
      'PK': 'Pakistan',
      'AF': 'Afghanistan',
      'IR': 'Iran',
      'IQ': 'Iraq',
      'SA': 'Saudi Arabia',
      'AE': 'United Arab Emirates',
      'IL': 'Israel',
      'TR': 'Turkey',
      // African countries
      'DZ': 'Algeria',
      'AO': 'Angola',
      'BJ': 'Benin',
      'BW': 'Botswana',
      'BF': 'Burkina Faso',
      'BI': 'Burundi',
      'CM': 'Cameroon',
      'CV': 'Cape Verde',
      'CF': 'Central African Republic',
      'TD': 'Chad',
      'KM': 'Comoros',
      'CG': 'Congo',
      'CD': 'Democratic Republic of Congo',
      'DJ': 'Djibouti',
      'GQ': 'Equatorial Guinea',
      'ER': 'Eritrea',
      'ET': 'Ethiopia',
      'GA': 'Gabon',
      'GM': 'Gambia',
      'GH': 'Ghana',
      'GN': 'Guinea',
      'GW': 'Guinea-Bissau',
      'CI': 'Ivory Coast',
      'LS': 'Lesotho',
      'LR': 'Liberia',
      'LY': 'Libya',
      'MG': 'Madagascar',
      'MW': 'Malawi',
      'ML': 'Mali',
      'MR': 'Mauritania',
      'MU': 'Mauritius',
      'MZ': 'Mozambique',
      'NA': 'Namibia',
      'NE': 'Niger',
      'RW': 'Rwanda',
      'ST': 'São Tomé and Príncipe',
      'SN': 'Senegal',
      'SC': 'Seychelles',
      'SL': 'Sierra Leone',
      'SO': 'Somalia',
      'SS': 'South Sudan',
      'SD': 'Sudan',
      'SZ': 'Eswatini',
      'TZ': 'Tanzania',
      'TG': 'Togo',
      'TN': 'Tunisia',
      'UG': 'Uganda',
      'ZM': 'Zambia',
      'ZW': 'Zimbabwe',
      // American countries
      'AG': 'Antigua and Barbuda',
      'BS': 'Bahamas',
      'BB': 'Barbados',
      'BZ': 'Belize',
      'BO': 'Bolivia',
      'CL': 'Chile',
      'CO': 'Colombia',
      'CR': 'Costa Rica',
      'CU': 'Cuba',
      'DM': 'Dominica',
      'DO': 'Dominican Republic',
      'EC': 'Ecuador',
      'SV': 'El Salvador',
      'GD': 'Grenada',
      'GT': 'Guatemala',
      'GY': 'Guyana',
      'HT': 'Haiti',
      'HN': 'Honduras',
      'JM': 'Jamaica',
      'NI': 'Nicaragua',
      'PA': 'Panama',
      'PY': 'Paraguay',
      'PE': 'Peru',
      'KN': 'Saint Kitts and Nevis',
      'LC': 'Saint Lucia',
      'VC': 'Saint Vincent and the Grenadines',
      'SR': 'Suriname',
      'TT': 'Trinidad and Tobago',
      'UY': 'Uruguay',
      'VE': 'Venezuela',
      // Oceania
      'FJ': 'Fiji',
      'KI': 'Kiribati',
      'MH': 'Marshall Islands',
      'FM': 'Micronesia',
      'NR': 'Nauru',
      'NZ': 'New Zealand',
      'PW': 'Palau',
      'PG': 'Papua New Guinea',
      'WS': 'Samoa',
      'SB': 'Solomon Islands',
      'TO': 'Tonga',
      'TV': 'Tuvalu',
      'VU': 'Vanuatu'
    },
    capitals: {
      'US': 'Washington D.C.',
      'CA': 'Ottawa',
      'GB': 'London',
      'FR': 'Paris',
      'DE': 'Berlin',
      'IT': 'Rome',
      'ES': 'Madrid',
      'JP': 'Tokyo',
      'CN': 'Beijing',
      'IN': 'New Delhi',
      'BR': 'Brasília',
      'AU': 'Canberra',
      'RU': 'Moscow',
      'MX': 'Mexico City',
      'AR': 'Buenos Aires',
      'EG': 'Cairo',
      'ZA': 'Cape Town',
      'NG': 'Abuja',
      'KE': 'Nairobi',
      'MA': 'Rabat',
      'AT': 'Vienna',
      'BE': 'Brussels',
      'BG': 'Sofia',
      'HR': 'Zagreb',
      'CY': 'Nicosia',
      'CZ': 'Prague',
      'DK': 'Copenhagen',
      'EE': 'Tallinn',
      'FI': 'Helsinki',
      'GR': 'Athens',
      'HU': 'Budapest',
      'IE': 'Dublin',
      'LV': 'Riga',
      'LT': 'Vilnius',
      'LU': 'Luxembourg City',
      'MT': 'Valletta',
      'NL': 'Amsterdam',
      'PL': 'Warsaw',
      'PT': 'Lisbon',
      'RO': 'Bucharest',
      'SK': 'Bratislava',
      'SI': 'Ljubljana',
      'SE': 'Stockholm',
      'NO': 'Oslo',
      'CH': 'Bern',
      'TH': 'Bangkok',
      'VN': 'Hanoi',
      'KR': 'Seoul',
      'PH': 'Manila',
      'ID': 'Jakarta',
      'MY': 'Kuala Lumpur',
      'SG': 'Singapore',
      'BD': 'Dhaka',
      'PK': 'Islamabad',
      'AF': 'Kabul',
      'IR': 'Tehran',
      'IQ': 'Baghdad',
      'SA': 'Riyadh',
      'AE': 'Abu Dhabi',
      'IL': 'Jerusalem',
      'TR': 'Ankara'
    }
  },
  it: {
    // Main Menu
    appTitle: 'Quiz Bandiere',
    guessTheFlag: 'Indovina la Bandiera',
    guessTheCountry: 'Indovina il Paese',
    timedQuiz: 'Quiz a Tempo',
    capitalQuiz: 'Quiz Capitali',
    statistics: 'Statistiche',
    settings: 'Impostazioni',
    
    // Game
    score: 'Punteggio',
    timeLeft: 'Tempo Rimasto',
    question: 'Domanda',
    correct: 'Corretto!',
    incorrect: 'Sbagliato!',
    gameOver: 'Partita Finita',
    finalScore: 'Punteggio Finale',
    playAgain: 'Gioca Ancora',
    home: 'Home',
    
    // Statistics
    bestScore: 'Miglior Punteggio',
    totalGames: 'Partite Totali',
    accuracy: 'Precisione',
    
    // Settings
    language: 'Lingua',
    sounds: 'Effetti Sonori',
    
    // Countries
    countries: {
      'US': 'Stati Uniti',
      'CA': 'Canada',
      'GB': 'Regno Unito',
      'FR': 'Francia',
      'DE': 'Germania',
      'IT': 'Italia',
      'ES': 'Spagna',
      'JP': 'Giappone',
      'CN': 'Cina',
      'IN': 'India',
      'BR': 'Brasile',
      'AU': 'Australia',
      'RU': 'Russia',
      'MX': 'Messico',
      'AR': 'Argentina',
      'EG': 'Egitto',
      'ZA': 'Sudafrica',
      'NG': 'Nigeria',
      'KE': 'Kenya',
      'MA': 'Marocco',
      'AT': 'Austria',
      'BE': 'Belgio',
      'BG': 'Bulgaria',
      'HR': 'Croazia',
      'CY': 'Cipro',
      'CZ': 'Repubblica Ceca',
      'DK': 'Danimarca',
      'EE': 'Estonia',
      'FI': 'Finlandia',
      'GR': 'Grecia',
      'HU': 'Ungheria',
      'IE': 'Irlanda',
      'LV': 'Lettonia',
      'LT': 'Lituania',
      'LU': 'Lussemburgo',
      'MT': 'Malta',
      'NL': 'Paesi Bassi',
      'PL': 'Polonia',
      'PT': 'Portogallo',
      'RO': 'Romania',
      'SK': 'Slovacchia',
      'SI': 'Slovenia',
      'SE': 'Svezia',
      'NO': 'Norvegia',
      'CH': 'Svizzera',
      'TH': 'Tailandia',
      'VN': 'Vietnam',
      'KR': 'Corea del Sud',
      'PH': 'Filippine',
      'ID': 'Indonesia',
      'MY': 'Malesia',
      'SG': 'Singapore',
      'BD': 'Bangladesh',
      'PK': 'Pakistan',
      'AF': 'Afghanistan',
      'IR': 'Iran',
      'IQ': 'Iraq',
      'SA': 'Arabia Saudita',
      'AE': 'Emirati Arabi Uniti',
      'IL': 'Israele',
      'TR': 'Turchia'
    },
    capitals: {
      'US': 'Washington D.C.',
      'CA': 'Ottawa',
      'GB': 'Londra',
      'FR': 'Parigi',
      'DE': 'Berlino',
      'IT': 'Roma',
      'ES': 'Madrid',
      'JP': 'Tokyo',
      'CN': 'Pechino',
      'IN': 'Nuova Delhi',
      'BR': 'Brasília',
      'AU': 'Canberra',
      'RU': 'Mosca',
      'MX': 'Città del Messico',
      'AR': 'Buenos Aires',
      'EG': 'Il Cairo',
      'ZA': 'Città del Capo',
      'NG': 'Abuja',
      'KE': 'Nairobi',
      'MA': 'Rabat'
    }
  },
  es: {
    // Main Menu
    appTitle: 'Quiz de Banderas',
    guessTheFlag: 'Adivina la Bandera',
    guessTheCountry: 'Adivina el País',
    timedQuiz: 'Quiz Cronometrado',
    capitalQuiz: 'Quiz de Capitales',
    statistics: 'Estadísticas',
    settings: 'Configuración',
    
    // Game
    score: 'Puntuación',
    timeLeft: 'Tiempo Restante',
    question: 'Pregunta',
    correct: '¡Correcto!',
    incorrect: '¡Incorrecto!',
    gameOver: 'Juego Terminado',
    finalScore: 'Puntuación Final',
    playAgain: 'Jugar de Nuevo',
    home: 'Inicio',
    
    // Statistics
    bestScore: 'Mejor Puntuación',
    totalGames: 'Juegos Totales',
    accuracy: 'Precisión',
    
    // Settings
    language: 'Idioma',
    sounds: 'Efectos de Sonido',
    
    // Countries
    countries: {
      'US': 'Estados Unidos',
      'CA': 'Canadá',
      'GB': 'Reino Unido',
      'FR': 'Francia',
      'DE': 'Alemania',
      'IT': 'Italia',
      'ES': 'España',
      'JP': 'Japón',
      'CN': 'China',
      'IN': 'India',
      'BR': 'Brasil',
      'AU': 'Australia',
      'RU': 'Rusia',
      'MX': 'México',
      'AR': 'Argentina',
      'EG': 'Egipto',
      'ZA': 'Sudáfrica',
      'NG': 'Nigeria',
      'KE': 'Kenia',
      'MA': 'Marruecos'
    },
    capitals: {
      'US': 'Washington D.C.',
      'CA': 'Ottawa',
      'GB': 'Londres',
      'FR': 'París',
      'DE': 'Berlín',
      'IT': 'Roma',
      'ES': 'Madrid',
      'JP': 'Tokio',
      'CN': 'Pekín',
      'IN': 'Nueva Delhi',
      'BR': 'Brasilia',
      'AU': 'Canberra',
      'RU': 'Moscú',
      'MX': 'Ciudad de México',
      'AR': 'Buenos Aires',
      'EG': 'El Cairo',
      'ZA': 'Ciudad del Cabo',
      'NG': 'Abuja',
      'KE': 'Nairobi',
      'MA': 'Rabat'
    }
  }
};

const getDeviceLanguage = (): string => {
  let locale = 'en';
  
  if (Platform.OS === 'ios') {
    locale = NativeModules.SettingsManager?.settings?.AppleLocale ||
             NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
             'en';
  } else {
    locale = NativeModules.I18nManager?.localeIdentifier || 'en';
  }
  
  // Extract language code (e.g., 'it_IT' -> 'it')
  const langCode = locale.split('_')[0].split('-')[0];
  
  // Return supported language or default to English
  return Object.keys(translations).includes(langCode) ? langCode : 'en';
};

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Check if user has previously selected a language
        const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
          setLanguageState(savedLanguage);
        } else {
          // Auto-detect device language
          const deviceLanguage = getDeviceLanguage();
          setLanguageState(deviceLanguage);
        }
      } catch (error) {
        console.log('Error loading language:', error);
        setLanguageState('en');
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = async (lang: string) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', lang);
      setLanguageState(lang);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const contextValue: LanguageContextType = {
    language,
    translations: translations[language as keyof typeof translations],
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};