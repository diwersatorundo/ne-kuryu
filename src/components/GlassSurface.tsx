import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode, useMemo } from 'react';
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, gradients, radius } from '../constants/theme';
import { useGlassBlurTarget } from '../context/GlassBlurContext';
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
  money: ['rgba(255, 213, 154, 0.12)', 'rgba(255, 213, 154, 0.035)'],
  danger: gradients.danger,
};

const toneBorders: Record<GlassTone, string> = {
  default: colors.border,
  raised: colors.borderStrong,
  accent: colors.accentBorder,
  violet: colors.borderStrong,
  money: 'rgba(255, 213, 154, 0.2)',
  danger: colors.dangerBorder,
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
  const blurTarget = useGlassBlurTarget();
  const beautiful = mode === 'beautiful';

  const surfaceStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.outer, { borderRadius: radiusValue }, style],
    [radiusValue, style],
  );

  return (
    <View style={surfaceStyle}>
      <View
        style={[
          styles.inner,
          {
            borderColor: toneBorders[tone],
            borderRadius: radiusValue,
          },
          padded && styles.padded,
          { backgroundColor: beautiful ? colors.surface : colors.surfaceSolid },
          contentStyle,
        ]}
      >
        {beautiful ? (
          <>
            <BlurView
              intensity={20}
              tint="dark"
              blurTarget={blurTarget ?? undefined}
              blurMethod="dimezisBlurViewSdk31Plus"
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
            <LinearGradient
              colors={toneGradients[tone]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            />
          </>
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
    borderWidth: 1,
    overflow: 'hidden',
  },
  padded: {
    padding: 16,
  },
  content: {
    position: 'relative',
  },
});
