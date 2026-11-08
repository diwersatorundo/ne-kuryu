import { Gauge, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../constants/theme';
import { VisualMode } from '../context/PreferencesContext';
import { AppText } from './AppText';
import { Card } from './Card';

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
    description: 'Без размытия и постоянных анимаций',
    icon: Gauge,
  },
];

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <Card contentStyle={styles.wrapper}>
      <Pressable
        accessibilityRole="radiogroup"
        accessibilityLabel="Режим визуальных эффектов"
        style={styles.row}
      >
        {options.map((option) => {
          const selected = mode === option.key;
          const Icon = option.icon;
          return (
            <Pressable
              key={option.key}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
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
      </Pressable>
      <AppText variant="small" color={colors.textMuted}>
        {mode === 'beautiful'
          ? 'Размытие используется только на поддерживаемых устройствах. Анимации отключаются системной настройкой «Уменьшение движения».'
          : 'Непрозрачные плитки, статичная сфера и никаких постоянных анимаций. Данные и расчёты не меняются.'}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    minHeight: 118,
    padding: 14,
  },
  optionSelected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
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
