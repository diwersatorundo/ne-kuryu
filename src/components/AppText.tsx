import { Text, TextProps, TextStyle } from 'react-native';
import { colors, typography } from '../constants/theme';

export type TextVariant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
}

export function AppText({
  variant = 'body',
  color = colors.text,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[typography[variant] as TextStyle, { color }, style]}
    />
  );
}
