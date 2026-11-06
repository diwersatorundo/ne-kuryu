import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';
import { AppText } from './AppText';

type BadgeTone = 'neutral' | 'accent' | 'warning' | 'danger';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
}

const palette: Record<BadgeTone, { background: string; border: string; text: string }> = {
  neutral: {
    background: colors.surfaceRaised,
    border: colors.border,
    text: colors.textSecondary,
  },
  accent: {
    background: colors.accentSoft,
    border: colors.accentBorder,
    text: colors.accent,
  },
  warning: {
    background: colors.warningSoft,
    border: '#4A3E28',
    text: colors.warning,
  },
  danger: {
    background: colors.dangerSoft,
    border: colors.dangerBorder,
    text: colors.danger,
  },
};

export function Badge({ label, tone = 'neutral', style }: BadgeProps) {
  const tonePalette = palette[tone];
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: tonePalette.background,
          borderColor: tonePalette.border,
        },
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
    borderRadius: radius.xs,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
