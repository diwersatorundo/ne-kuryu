import { Gauge, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';
import { VisualMode } from '../context/PreferencesContext';
import { AppText } from './AppText';

interface ModeSwitcherProps {
  mode: VisualMode;
  onChange: (mode: VisualMode) => void;
}

const options = [
  {
    key: 'beautiful' as const,
    title: 'Красивый',
    description: 'Стекло, сфера и мягкие анимации',
    icon: Sparkles,
  },
  {
    key: 'performance' as const,
    title: 'Производительный',
    description: 'Меньше эффектов и нагрузки',
    icon: Gauge,
  },
];

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {options.map((option) => {
          const selected = mode === option.key;
          const Icon = option.icon;
          return (
            <Pressable
              key={option.key}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(option.key)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                size={19}
                color={selected ? colors.accent : colors.textMuted}
                strokeWidth={1.9}
              />
              <AppText
                variant="bodyMedium"
                color={selected ? colors.text : colors.textSecondary}
                style={styles.optionTitle}
              >
                {option.title}
              </AppText>
              <AppText
                variant="caption"
                color={selected ? colors.accent : colors.textMuted}
                numberOfLines={2}
                style={styles.optionText}
              >
                {option.description}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      <AppText variant="small" color={colors.textMuted}>
        {mode === 'beautiful'
          ? 'Полный визуальный режим. Анимации сферы можно отключить системной настройкой «Уменьшение движения».'
          : 'Сфера остаётся на месте, тяжёлые эффекты и постоянные анимации отключены. Данные и расчёты не меняются.'}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flex: 1,
    gap: 4,
    minHeight: 118,
    padding: 14,
  },
  optionSelected: {
    backgroundColor: colors.accentSoft,
  },
  optionTitle: {
    fontWeight: '700',
    marginTop: 4,
  },
  optionText: {
    lineHeight: 15,
  },
  pressed: {
    opacity: 0.75,
  },
});
