import { House, Settings } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';
import { AppText } from '../components/AppText';

export type TabKey = 'home' | 'settings';

interface TabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs = [
  { key: 'home' as const, label: 'Главная', icon: House },
  { key: 'settings' as const, label: 'Настройки', icon: Settings },
];

export function TabBar({ active, onChange }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      {tabs.map((tab) => {
        const selected = active === tab.key;
        const Icon = tab.icon;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [styles.tab, pressed && styles.pressed]}
          >
            <View style={[styles.indicator, selected && styles.indicatorActive]} />
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
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.backgroundElevated,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingTop: 5,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    paddingBottom: 4,
    paddingTop: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  indicator: {
    backgroundColor: 'transparent',
    borderRadius: 2,
    height: 2,
    marginBottom: 4,
    width: 18,
  },
  indicatorActive: {
    backgroundColor: colors.accent,
  },
  activeLabel: {
    fontWeight: '600',
  },
});
