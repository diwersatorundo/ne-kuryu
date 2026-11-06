import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, gradients, radius, shadows } from '../constants/theme';
import { usePreferences } from '../context/PreferencesContext';

export type GlassTone =
  | 'default'
  | 'raised'
  | 'accent'
  | 'violet'
  | 'money'
  | 'danger';

interface GlassSurfaceProps {
  children?: ReactNode;
  tone?: GlassTone;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radiusValue?: number;
}

const toneGradients: Record<GlassTone, readonly [string, string]> = {
  default: gradients.glass,
  raised: gradients.glassRaised,
  accent: gradients.accentDeep,
  violet: gradients.violet,
  money: ['rgba(255, 213, 154, 0.18)', 'rgba(255, 213, 154, 0.05)'],
  danger: gradients.danger,
};

export function GlassSurface({
  children,
  tone = 'default',
  padded = true,
  style,
  contentStyle,
  radiusValue = radius.lg,
}: GlassSurfaceProps) {
  const { mode } = usePreferences();
  const beautiful = mode === 'beautiful';

  const surfaceStyle = useMemo<StyleProp<ViewStyle>>(
    () => [
      styles.outer,
      beautiful ? shadows.card : undefined,
      { borderRadius: radiusValue },
      style,
    ],
    [beautiful, radiusValue, style],
  );

  return (
    <View style={surfaceStyle}>
      <View
        style={[
          styles.inner,
          { borderRadius: radiusValue },
          padded && styles.padded,
          !beautiful && { backgroundColor: colors.surfaceSolid },
          contentStyle,
        ]}
      >
        {beautiful ? (
          <LinearGradient
            colors={toneGradients[tone]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />
        ) : null}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: 'transparent',
  },
  inner: {
    overflow: 'hidden',
  },
  padded: {
    padding: 16,
  },
  content: {
    position: 'relative',
  },
});
