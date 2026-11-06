import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';
import { AppText } from './AppText';

interface ChoiceChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ChoiceChip({ label, selected, onPress, style }: ChoiceChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.selected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <AppText
        variant="small"
        color={selected ? colors.accent : colors.textSecondary}
        style={selected && styles.selectedLabel}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 12,
  },
  selected: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accentBorder,
  },
  pressed: {
    opacity: 0.7,
  },
  selectedLabel: {
    fontWeight: '600',
  },
});
