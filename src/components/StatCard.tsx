import { LucideIcon } from 'lucide-react-native';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';
import { AppText } from './AppText';
import { Card } from './Card';

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
    <Card style={[styles.card, style]} contentStyle={styles.content}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: accentSoft }]}>
          <Icon size={15} color={accent} strokeWidth={1.9} />
        </View>
        <AppText
          variant="caption"
          color={colors.textMuted}
          numberOfLines={1}
          style={styles.title}
        >
          {title.toUpperCase()}
        </AppText>
      </View>
      <View style={styles.valueRow}>
        <AppText
          color={colors.text}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
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
          style={styles.subtitle}
        >
          {subtitle}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 126,
  },
  content: {
    gap: 10,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: radius.sm,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  title: {
    flex: 1,
    textAlign: 'right',
    letterSpacing: 0.6,
  },
  valueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 5,
  },
  value: {
    flexShrink: 1,
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: -0.9,
    lineHeight: 33,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontWeight: '600',
  },
  subtitle: {
    minHeight: 38,
  },
});
