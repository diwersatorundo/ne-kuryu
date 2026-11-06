import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';
import { AppText } from './AppText';

type BadgeTone = 'neutral' | 'accent' | 'warning' | 'danger' | 'violet';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}

const palette: Record<BadgeTone, { background: string; text: string }> = {
  neutral: {
    background: 'rgba(255, 255, 255, 0.08)',
    text: colors.textSecondary,
  },
  accent: {
    background: colors.accentSoft,
    text: colors.accent,
  },
  warning: {
    background: colors.warningSoft,
    text: colors.warning,
  },
  danger: {
    background: colors.dangerSoft,
    text: colors.danger,
  },
  violet: {
    background: colors.violetSoft,
    text: colors.violet,
  },
};

export function Badge({ label, tone = 'neutral', style }: BadgeProps) {
  const tonePalette = palette[tone];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tonePalette.background },
        style,
      ]}
    >
      <AppText variant="caption" color={tonePalette.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
});
