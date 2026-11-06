import { StatusBar } from 'expo-status-bar';
import { BlurTargetView } from 'expo-blur';
import { ComponentRef, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/constants/theme';
import { AppText } from './src/components/AppText';
import { AtmosphereBackground } from './src/components/AtmosphereBackground';
import {
  PreferencesProvider,
  usePreferences,
} from './src/context/PreferencesContext';
import { useProfile } from './src/hooks/useProfile';
import { OnboardingFlow } from './src/onboarding/OnboardingFlow';
import { TabBar, TabKey } from './src/navigation/TabBar';
import { MainScreen } from './src/screens/MainScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Profile } from './src/types/profile';

type EditingState = 'profile' | 'products' | null;

export default function App() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <AppContent />
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { profile, loading, persist, reset } = useProfile();
  const { reset: resetPreferences } = usePreferences();
  const [tab, setTab] = useState<TabKey>('home');
  const [editing, setEditing] = useState<EditingState>(null);
  const blurTargetRef = useRef<ComponentRef<typeof View> | null>(null);

  useEffect(() => {
    if (!profile || editing || tab !== 'settings') {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setTab('home');
      return true;
    });
    return () => subscription.remove();
  }, [profile, editing, tab]);

  const handleComplete = (next: Profile) => {
    const wasEditing = editing !== null;
    void persist(next);
    setEditing(null);
    setTab(wasEditing ? 'settings' : 'home');
  };

  const handleReset = () => {
    void Promise.all([reset(), resetPreferences()])
      .then(() => {
        setEditing(null);
        setTab('home');
      })
      .catch(() => {
        Alert.alert(
          'Не удалось удалить данные',
          'Попробуйте ещё раз. Некоторые данные могли остаться на устройстве.',
        );
      });
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.root}>
        <AtmosphereBackground />
        {loading ? (
          <View style={styles.loading}>
            <View style={styles.brandMark} />
            <AppText
              variant="caption"
              color={colors.accent}
              style={styles.brand}
            >
              NICOTINY
            </AppText>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : !profile ? (
          <OnboardingFlow initialProfile={null} onComplete={handleComplete} />
        ) : editing ? (
          <OnboardingFlow
            initialProfile={profile}
            initialStep={editing}
            onComplete={handleComplete}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <>
            <BlurTargetView ref={blurTargetRef} style={styles.flex}>
              {tab === 'home' ? (
                <MainScreen profile={profile} />
              ) : (
                <SettingsScreen
                  profile={profile}
                  onEditProfile={() => setEditing('profile')}
                  onEditProducts={() => setEditing('products')}
                  onReset={handleReset}
                />
              )}
            </BlurTargetView>
            <TabBar
              active={tab}
              onChange={setTab}
              blurTarget={blurTargetRef}
            />
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
  },
  brandMark: {
    backgroundColor: colors.accent,
    borderRadius: 26,
    height: 52,
    opacity: 0.9,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    width: 52,
  },
  brand: {
    fontWeight: '700',
    letterSpacing: 4,
  },
});
