import { LucideIcon } from 'lucide-react-native';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';
import { AppText } from './AppText';

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  accent?: string;
  accentSoft?: string;
  style?: StyleProp<ViewStyle>;
}

export function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  accent = colors.accent,
  accentSoft = colors.accentSoft,
  style,
}: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <AppText
          variant="caption"
          color={colors.textMuted}
          numberOfLines={2}
          style={styles.title}
        >
          {title.toUpperCase()}
        </AppText>
        <View style={[styles.iconWrap, { backgroundColor: accentSoft }]}>
          <Icon size={15} color={accent} strokeWidth={1.9} />
        </View>
      </View>
      <View style={styles.valueRow}>
        <AppText
          color={colors.text}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.72}
          style={styles.value}
        >
          {value}
        </AppText>
        {unit ? (
          <AppText variant="small" color={colors.textMuted} style={styles.unit}>
            {unit}
          </AppText>
        ) : null}
      </View>
      {subtitle ? (
        <AppText
          variant="small"
          color={colors.textMuted}
          numberOfLines={2}
        >
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 10,
    minHeight: 118,
    padding: 13,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: radius.sm,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  valueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 30,
    fontVariant: ['tabular-nums'],
    flexShrink: 1,
  },
  unit: {
    fontWeight: '600',
  },
});
