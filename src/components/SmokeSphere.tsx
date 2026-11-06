import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '../constants/theme';
import {
  SPHERE_CONFIG,
  getSphereGrowth,
  getSphereScale,
} from '../constants/sphere';
import { usePreferences } from '../context/PreferencesContext';

interface SmokeSphereProps {
  elapsedDays: number;
  isFuture?: boolean;
  style?: StyleProp<ViewStyle>;
}

let sphereInstance = 0;

export const SmokeSphere = memo(function SmokeSphere({
  elapsedDays,
  isFuture = false,
  style,
}: SmokeSphereProps) {
  const { width } = useWindowDimensions();
  const { mode, motionEnabled, reducedMotion } = usePreferences();
  const beautiful = mode === 'beautiful';

  const [idPrefix] = useState(() => {
    sphereInstance += 1;
    return `smoke-${sphereInstance}`;
  });

  const targetScale = getSphereScale(elapsedDays, width, isFuture);
  const growth = getSphereGrowth(elapsedDays, isFuture);
  const targetDiameter = SPHERE_CONFIG.baseDiameter * targetScale;

  const [scale] = useState(() => new Animated.Value(targetScale));
  const [drift] = useState(() => new Animated.Value(0));
  const [breathe] = useState(() => new Animated.Value(0));
  const [press] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reducedMotion) {
      scale.stopAnimation();
      scale.setValue(targetScale);
      return;
    }
    const animation = Animated.timing(scale, {
      toValue: targetScale,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [reducedMotion, scale, targetScale]);

  useEffect(() => {
    if (!motionEnabled) {
      drift.stopAnimation();
      breathe.stopAnimation();
      drift.setValue(0);
      breathe.setValue(0);
      return;
    }

    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    const breatheLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    driftLoop.start();
    breatheLoop.start();

    return () => {
      driftLoop.stop();
      breatheLoop.stop();
    };
  }, [breathe, drift, motionEnabled]);

  useEffect(() => {
    if (!reducedMotion) {
      return;
    }
    press.stopAnimation();
    press.setValue(0);
  }, [press, reducedMotion]);

  const handlePressIn = useCallback(() => {
    if (reducedMotion) {
      return;
    }
    press.stopAnimation();
    Animated.timing(press, {
      toValue: 1,
      duration: 110,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [press, reducedMotion]);

  const handlePressOut = useCallback(() => {
    if (reducedMotion) {
      return;
    }
    Animated.spring(press, {
      toValue: 0,
      friction: 6,
      tension: 180,
      useNativeDriver: true,
    }).start();
  }, [press, reducedMotion]);

  const handlePress = useCallback(() => {
    void Promise.resolve()
      .then(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light))
      .catch(() => undefined);
  }, []);

  const translateX = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-5, 4, -5],
  });
  const translateY = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [4, -4, 4],
  });
  const breatheScale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.018],
  });
  const pressScale = useMemo(
    () =>
      press.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.962],
      }),
    [press],
  );

  const animatedStyle = useMemo(
    () => ({
      transform: [
        { translateX },
        { translateY },
        {
          scale: Animated.multiply(
            Animated.multiply(scale, breatheScale),
            pressScale,
          ),
        },
      ],
    }),
    [breatheScale, pressScale, scale, translateX, translateY],
  );

  const overallOpacity = 0.55 + growth * 0.45;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Сфера дыма"
      accessibilityHint="Короткое нажатие вызывает визуальный отклик"
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.wrapper,
        {
          height: targetDiameter,
          width: targetDiameter,
          opacity: overallOpacity,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.canvas, animatedStyle]}>
        <Svg
          width={SPHERE_CONFIG.baseDiameter}
          height={SPHERE_CONFIG.baseDiameter}
          viewBox="0 0 300 300"
        >
          <Defs>
            <RadialGradient
              id={`${idPrefix}-aura`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor={colors.accent} stopOpacity={0.1} />
              <Stop
                offset="0.32"
                stopColor={colors.accent}
                stopOpacity={0.085}
              />
              <Stop
                offset="0.58"
                stopColor={colors.accent}
                stopOpacity={0.05}
              />
              <Stop
                offset="0.78"
                stopColor={colors.accent}
                stopOpacity={0.018}
              />
              <Stop
                offset="0.92"
                stopColor={colors.accent}
                stopOpacity={0.004}
              />
              <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-haze`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor="#CFFFF0" stopOpacity={0.18} />
              <Stop offset="0.25" stopColor="#CFFFF0" stopOpacity={0.15} />
              <Stop offset="0.48" stopColor="#CFFFF0" stopOpacity={0.11} />
              <Stop offset="0.68" stopColor="#CFFFF0" stopOpacity={0.065} />
              <Stop offset="0.83" stopColor="#CFFFF0" stopOpacity={0.025} />
              <Stop offset="0.94" stopColor="#CFFFF0" stopOpacity={0.006} />
              <Stop offset="1" stopColor="#CFFFF0" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-base`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor="#BFFFE8" stopOpacity={0.34} />
              <Stop offset="0.18" stopColor="#BFFFE8" stopOpacity={0.3} />
              <Stop offset="0.36" stopColor="#BFFFE8" stopOpacity={0.24} />
              <Stop offset="0.54" stopColor="#9BF7D0" stopOpacity={0.17} />
              <Stop offset="0.7" stopColor="#5AC8C2" stopOpacity={0.1} />
              <Stop offset="0.83" stopColor="#2C6E74" stopOpacity={0.045} />
              <Stop offset="0.93" stopColor="#2C6E74" stopOpacity={0.012} />
              <Stop offset="1" stopColor="#2C6E74" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-core`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor="#F4FFF9" stopOpacity={0.4} />
              <Stop offset="0.2" stopColor="#F4FFF9" stopOpacity={0.34} />
              <Stop offset="0.4" stopColor="#D8FFF1" stopOpacity={0.24} />
              <Stop offset="0.58" stopColor="#9BF7D0" stopOpacity={0.14} />
              <Stop offset="0.74" stopColor="#5AC8C2" stopOpacity={0.06} />
              <Stop offset="0.88" stopColor="#2C6E74" stopOpacity={0.015} />
              <Stop offset="1" stopColor="#2C6E74" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-violet`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor={colors.violet} stopOpacity={0.2} />
              <Stop offset="0.3" stopColor={colors.violet} stopOpacity={0.15} />
              <Stop offset="0.55" stopColor={colors.violet} stopOpacity={0.08} />
              <Stop offset="0.76" stopColor={colors.violet} stopOpacity={0.03} />
              <Stop
                offset="0.9"
                stopColor={colors.violet}
                stopOpacity={0.006}
              />
              <Stop offset="1" stopColor={colors.violet} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-mint`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor={colors.accent} stopOpacity={0.16} />
              <Stop
                offset="0.3"
                stopColor={colors.accent}
                stopOpacity={0.12}
              />
              <Stop
                offset="0.55"
                stopColor={colors.accent}
                stopOpacity={0.07}
              />
              <Stop
                offset="0.75"
                stopColor={colors.accent}
                stopOpacity={0.025}
              />
              <Stop
                offset="0.9"
                stopColor={colors.accent}
                stopOpacity={0.005}
              />
              <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-teal`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor="#6FE3D6" stopOpacity={0.16} />
              <Stop offset="0.35" stopColor="#6FE3D6" stopOpacity={0.11} />
              <Stop offset="0.62" stopColor="#5AC8C2" stopOpacity={0.055} />
              <Stop offset="0.82" stopColor="#2C6E74" stopOpacity={0.018} />
              <Stop offset="0.94" stopColor="#2C6E74" stopOpacity={0.003} />
              <Stop offset="1" stopColor="#2C6E74" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-highlight`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.2} />
              <Stop offset="0.28" stopColor="#FFFFFF" stopOpacity={0.14} />
              <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.08} />
              <Stop offset="0.72" stopColor="#FFFFFF" stopOpacity={0.03} />
              <Stop offset="0.88" stopColor="#FFFFFF" stopOpacity={0.006} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
          </Defs>

          {beautiful ? (
            <>
              <Circle
                cx="150"
                cy="150"
                r="149"
                fill={`url(#${idPrefix}-aura)`}
              />
              <Circle
                cx="150"
                cy="150"
                r="136"
                fill={`url(#${idPrefix}-haze)`}
              />
              <Circle
                cx="174"
                cy="174"
                r="106"
                fill={`url(#${idPrefix}-violet)`}
              />
              <Circle
                cx="128"
                cy="156"
                r="96"
                fill={`url(#${idPrefix}-mint)`}
              />
              <Circle
                cx="149"
                cy="149"
                r="128"
                fill={`url(#${idPrefix}-base)`}
              />
              <Circle
                cx="176"
                cy="180"
                r="92"
                fill={`url(#${idPrefix}-teal)`}
              />
              <Circle
                cx="121"
                cy="114"
                r="76"
                fill={`url(#${idPrefix}-core)`}
              />
              <Circle
                cx="112"
                cy="102"
                r="46"
                fill={`url(#${idPrefix}-highlight)`}
              />
            </>
          ) : (
            <>
              <Circle
                cx="150"
                cy="150"
                r="148"
                fill={`url(#${idPrefix}-aura)`}
              />
              <Circle
                cx="149"
                cy="149"
                r="126"
                fill={`url(#${idPrefix}-base)`}
              />
              <Circle
                cx="176"
                cy="178"
                r="94"
                fill={`url(#${idPrefix}-teal)`}
              />
              <Circle
                cx="121"
                cy="114"
                r="78"
                fill={`url(#${idPrefix}-core)`}
              />
            </>
          )}
        </Svg>
      </Animated.View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvas: {
    height: SPHERE_CONFIG.baseDiameter,
    width: SPHERE_CONFIG.baseDiameter,
  },
});
