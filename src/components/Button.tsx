import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius } from '../constants/theme';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const backgrounds: Record<ButtonVariant, string> = {
  primary: colors.accent,
  secondary: colors.surfaceRaised,
  ghost: 'transparent',
  danger: colors.dangerSoft,
};

const pressedBackgrounds: Record<ButtonVariant, string> = {
  primary: colors.accentStrong,
  secondary: colors.surfacePressed,
  ghost: colors.surface,
  danger: '#332020',
};

const labelColors: Record<ButtonVariant, string> = {
  primary: colors.accentInk,
  secondary: colors.text,
  ghost: colors.textSecondary,
  danger: colors.danger,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        {
          backgroundColor: pressed
            ? pressedBackgrounds[variant]
            : backgrounds[variant],
          borderColor:
            variant === 'secondary'
              ? colors.border
              : variant === 'danger'
                ? colors.dangerBorder
                : 'transparent',
          borderWidth: variant === 'secondary' || variant === 'danger' ? 1 : 0,
        },
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={labelColors[variant]} />
      ) : (
        <View style={styles.content}>
          {icon}
          <AppText
            variant="bodyMedium"
            color={labelColors[variant]}
            style={styles.label}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    paddingHorizontal: 18,
  },
  md: {
    minHeight: 46,
  },
  lg: {
    minHeight: 52,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.45,
  },
});
