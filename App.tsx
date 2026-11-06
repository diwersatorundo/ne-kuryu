import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/constants/theme';
import { AppText } from './src/components/AppText';
import { useProfile } from './src/hooks/useProfile';
import { OnboardingFlow } from './src/onboarding/OnboardingFlow';
import { TabBar, TabKey } from './src/navigation/TabBar';
import { MainScreen } from './src/screens/MainScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Profile } from './src/types/profile';

type EditingState = 'profile' | 'products' | null;

export default function App() {
  const { profile, loading, persist, reset } = useProfile();
  const [tab, setTab] = useState<TabKey>('home');
  const [editing, setEditing] = useState<EditingState>(null);

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
    void reset();
    setEditing(null);
    setTab('home');
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.root}>
        {loading ? (
          <View style={styles.loading}>
            <AppText variant="caption" color={colors.accent} style={styles.brand}>
              НЕ КУРЮ
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
            <TabBar active={tab} onChange={setTab} />
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
  },
  brand: {
    fontWeight: '700',
    letterSpacing: 2.6,
  },
});
