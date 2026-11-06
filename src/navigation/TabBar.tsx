import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { House, Settings } from 'lucide-react-native';
import { ComponentRef, RefObject, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, gradients, radius, shadows } from '../constants/theme';
import { usePreferences } from '../context/PreferencesContext';
import { AppText } from '../components/AppText';

export type TabKey = 'home' | 'settings';

interface TabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  blurTarget?: RefObject<ComponentRef<typeof View> | null>;
}

const tabs = [
  { key: 'home' as const, label: 'Главная', icon: House },
  { key: 'settings' as const, label: 'Настройки', icon: Settings },
];

export function TabBar({ active, onChange, blurTarget }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { mode } = usePreferences();
  const beautiful = mode === 'beautiful';
  const [focused, setFocused] = useState<TabKey | null>(null);

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      <View style={[styles.bar, beautiful ? shadows.floating : undefined]}>
        <View style={styles.clip}>
          {beautiful ? (
            <BlurView
              intensity={36}
              tint="dark"
              blurTarget={blurTarget}
              blurMethod="dimezisBlurViewSdk31Plus"
              style={StyleSheet.absoluteFill}
            />
          ) : null}
          <LinearGradient
            colors={
              beautiful
                ? gradients.glassRaised
                : ['rgba(24, 30, 39, 0.98)', 'rgba(18, 22, 29, 0.98)']
            }
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.content}>
            {tabs.map((tab) => {
              const selected = active === tab.key;
              const Icon = tab.icon;
              return (
                <Pressable
                  key={tab.key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  onPress={() => onChange(tab.key)}
                  onFocus={() => setFocused(tab.key)}
                  onBlur={() => setFocused(null)}
                  style={({ pressed }) => [
                    styles.tab,
                    selected && styles.tabActive,
                    focused === tab.key && styles.tabFocused,
                    pressed && styles.pressed,
                  ]}
                >
                  <Icon
                    size={20}
                    color={selected ? colors.accent : colors.textMuted}
                    strokeWidth={selected ? 2.2 : 1.8}
                  />
                  <AppText
                    variant="caption"
                    color={selected ? colors.accent : colors.textMuted}
                    style={selected ? styles.activeLabel : undefined}
                  >
                    {tab.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  bar: {
    backgroundColor: 'transparent',
    borderRadius: radius.xxl,
  },
  clip: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    gap: 6,
    padding: 7,
  },
  tab: {
    alignItems: 'center',
    borderRadius: radius.xl,
    flex: 1,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 10,
  },
  tabActive: {
    backgroundColor: colors.accentSoft,
  },
  tabFocused: {
    backgroundColor: colors.surfaceRaised,
  },
  pressed: {
    opacity: 0.7,
  },
  activeLabel: {
    fontWeight: '700',
  },
});
