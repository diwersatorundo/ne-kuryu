import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, gradients, radius } from '../constants/theme';
import { usePreferences } from '../context/PreferencesContext';
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
  primary: colors.accentStrong,
  secondary: colors.surface,
  ghost: 'transparent',
  danger: colors.dangerSoft,
};

const pressedBackgrounds: Record<ButtonVariant, string> = {
  primary: colors.accent,
  secondary: colors.surfaceRaised,
  ghost: colors.surface,
  danger: 'rgba(255, 130, 130, 0.22)',
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
  const { mode } = usePreferences();
  const [focused, setFocused] = useState(false);
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';
  const useGradient = isPrimary && mode === 'beautiful';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        {
          backgroundColor: pressed
            ? pressedBackgrounds[variant]
            : backgrounds[variant],
        },
        pressed && styles.pressed,
        focused && styles.focused,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {useGradient ? (
        <LinearGradient
          colors={gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFill, styles.gradient]}
          pointerEvents="none"
        />
      ) : null}
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
    borderRadius: radius.md,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gradient: {
    borderRadius: radius.md,
  },
  md: {
    minHeight: 50,
  },
  lg: {
    minHeight: 56,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  label: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  focused: {
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  disabled: {
    opacity: 0.4,
  },
});
