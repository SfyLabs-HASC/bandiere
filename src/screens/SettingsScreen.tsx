import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useLanguage } from '../contexts/LanguageContext';
import { useSound } from '../contexts/SoundContext';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
  animationDelay?: number;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  animationDelay = 0,
}) => (
  <Animatable.View animation="fadeInUp" delay={animationDelay}>
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingItemLeft}>
        <View style={styles.settingIconContainer}>
          <Icon name={icon} size={24} color="#2196F3" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.settingItemRight}>
        {rightComponent}
        {onPress && !rightComponent && (
          <Icon name="chevron-right" size={24} color="#B0B0B0" />
        )}
      </View>
    </TouchableOpacity>
  </Animatable.View>
);

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { language, setLanguage, t } = useLanguage();
  const { soundEnabled, setSoundEnabled } = useSound();

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: t('settings'),
      headerStyle: {
        backgroundColor: '#667eea',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, t]);

  const handleLanguagePress = () => {
    const languageOptions = availableLanguages.map(lang => ({
      text: `${lang.flag} ${lang.name}`,
      onPress: () => setLanguage(lang.code),
    }));

    Alert.alert(
      t('language'),
      'Choose your language / Scegli la lingua / Elige tu idioma',
      [
        ...languageOptions,
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const getCurrentLanguageName = () => {
    const currentLang = availableLanguages.find(lang => lang.code === language);
    return currentLang ? `${currentLang.flag} ${currentLang.name}` : 'English';
  };

  const handleSoundToggle = (value: boolean) => {
    setSoundEnabled(value);
  };

  const handleAbout = () => {
    Alert.alert(
      'About Flag Quiz',
      'Flag Quiz v1.0.0\n\nA fun and educational app to test your knowledge of world flags, countries, and capitals.\n\nDeveloped with React Native\n\n© 2024',
      [{ text: 'OK' }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate This App',
      'Thank you for using Flag Quiz! Please rate us on the app store to help others discover this app.',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => {
          // In a real app, this would open the app store
          Alert.alert('Thank you!', 'This would open the app store in a real app.');
        }},
      ]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      'Share Flag Quiz',
      'Share this amazing geography quiz app with your friends and family!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => {
          // In a real app, this would open the share dialog
          Alert.alert('Shared!', 'This would open the share dialog in a real app.');
        }},
      ]
    );
  };

  const handleResetStats = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all your game statistics? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would reset the statistics
            Alert.alert('Statistics Reset', 'All your game statistics have been reset.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.backgroundGradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Game Settings Section */}
          <Animatable.View animation="fadeInDown" style={styles.section}>
            <Text style={styles.sectionTitle}>Game Settings</Text>
            
            <View style={styles.settingsContainer}>
              <SettingItem
                icon="language"
                title={t('language')}
                subtitle={getCurrentLanguageName()}
                onPress={handleLanguagePress}
                animationDelay={100}
              />
              
              <SettingItem
                icon="volume-up"
                title={t('sounds')}
                subtitle="Enable sound effects"
                rightComponent={
                  <Switch
                    value={soundEnabled}
                    onValueChange={handleSoundToggle}
                    trackColor={{ false: '#B0B0B0', true: '#4CAF50' }}
                    thumbColor={soundEnabled ? '#FFFFFF' : '#F4F3F4'}
                  />
                }
                animationDelay={200}
              />
            </View>
          </Animatable.View>

          {/* App Information Section */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            
            <View style={styles.settingsContainer}>
              <SettingItem
                icon="info"
                title="About"
                subtitle="App version and information"
                onPress={handleAbout}
                animationDelay={400}
              />
              
              <SettingItem
                icon="star-rate"
                title="Rate This App"
                subtitle="Help us improve by rating the app"
                onPress={handleRateApp}
                animationDelay={500}
              />
              
              <SettingItem
                icon="share"
                title="Share App"
                subtitle="Tell your friends about Flag Quiz"
                onPress={handleShareApp}
                animationDelay={600}
              />
            </View>
          </Animatable.View>

          {/* Data Management Section */}
          <Animatable.View animation="fadeInUp" delay={700} style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            
            <View style={styles.settingsContainer}>
              <SettingItem
                icon="refresh"
                title="Reset Statistics"
                subtitle="Clear all game statistics and scores"
                onPress={handleResetStats}
                animationDelay={800}
              />
            </View>
          </Animatable.View>

          {/* App Info Footer */}
          <Animatable.View animation="fadeIn" delay={900} style={styles.footer}>
            <Text style={styles.footerText}>Flag Quiz v1.0.0</Text>
            <Text style={styles.footerSubtext}>Made with ❤️ for geography enthusiasts</Text>
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    marginLeft: 5,
  },
  settingsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#E8E8E8',
    opacity: 0.8,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#E8E8E8',
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default SettingsScreen;