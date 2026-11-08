import { ChevronLeft } from 'lucide-react-native';
import { ReactNode, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';
import { AppText } from './AppText';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
}: ScreenHeaderProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Назад"
            onPress={onBack}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backButton,
              focused && styles.backFocused,
              pressed && styles.backPressed,
            ]}
          >
            <ChevronLeft size={20} color={colors.text} />
          </Pressable>
        ) : null}
        <View style={styles.textBlock}>
          <AppText variant="h1">{title}</AppText>
          {subtitle ? (
            <AppText variant="small" color={colors.textMuted}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    paddingTop: 8,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  backPressed: {
    backgroundColor: colors.surfaceRaised,
  },
  backFocused: {
    elevation: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
});
