import { memo, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
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
  const { mode, motionEnabled } = usePreferences();
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

  useEffect(() => {
    if (!motionEnabled) {
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
  }, [motionEnabled, scale, targetScale]);

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

  const translateX = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-7, 6, -7],
  });
  const translateY = drift.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [5, -6, 5],
  });
  const breatheScale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.025],
  });

  const animatedStyle = useMemo(
    () => ({
      transform: [
        { translateX },
        { translateY },
        { scale: Animated.multiply(scale, breatheScale) },
      ],
    }),
    [breatheScale, scale, translateX, translateY],
  );

  const haloOpacity = 0.35 + growth * 0.65;

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.wrapper,
        {
          height: targetDiameter,
          width: targetDiameter,
          opacity: haloOpacity,
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
              id={`${idPrefix}-halo`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop
                offset="0"
                stopColor={colors.accent}
                stopOpacity={beautiful ? 0.18 : 0.12}
              />
              <Stop
                offset="0.55"
                stopColor={colors.accent}
                stopOpacity={0.06}
              />
              <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-body`}
              cx="42%"
              cy="36%"
              r="64%"
              fx="36%"
              fy="30%"
            >
              <Stop offset="0" stopColor="#EDFFF7" stopOpacity={0.96} />
              <Stop offset="0.28" stopColor="#9BF7D0" stopOpacity={0.82} />
              <Stop offset="0.6" stopColor="#5AC8C2" stopOpacity={0.4} />
              <Stop offset="0.84" stopColor="#2C6E74" stopOpacity={0.16} />
              <Stop offset="1" stopColor="#2C6E74" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-shade`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor="#04090C" stopOpacity={0} />
              <Stop offset="0.68" stopColor="#04090C" stopOpacity={0} />
              <Stop offset="0.92" stopColor="#04090C" stopOpacity={0.32} />
              <Stop offset="1" stopColor="#04090C" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-highlight`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.34} />
              <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.08} />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-violet`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor={colors.violet} stopOpacity={0.24} />
              <Stop offset="1" stopColor={colors.violet} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-mint`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor={colors.accent} stopOpacity={0.3} />
              <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
            </RadialGradient>
            <RadialGradient
              id={`${idPrefix}-rim`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <Stop offset="0" stopColor="#D8FFF1" stopOpacity={0} />
              <Stop offset="0.8" stopColor="#D8FFF1" stopOpacity={0} />
              <Stop offset="0.9" stopColor="#D8FFF1" stopOpacity={0.26} />
              <Stop offset="1" stopColor="#D8FFF1" stopOpacity={0} />
            </RadialGradient>
          </Defs>

          <Circle cx="150" cy="150" r="142" fill={`url(#${idPrefix}-halo)`} />

          {beautiful ? (
            <>
              <Circle
                cx="126"
                cy="118"
                r="68"
                fill={`url(#${idPrefix}-mint)`}
              />
              <Circle
                cx="178"
                cy="188"
                r="76"
                fill={`url(#${idPrefix}-violet)`}
              />
            </>
          ) : null}

          <Circle cx="150" cy="150" r="106" fill={`url(#${idPrefix}-body)`} />

          {beautiful ? (
            <>
              <Circle
                cx="150"
                cy="150"
                r="105"
                fill={`url(#${idPrefix}-shade)`}
              />
              <Circle
                cx="122"
                cy="116"
                r="54"
                fill={`url(#${idPrefix}-highlight)`}
              />
              <Circle
                cx="150"
                cy="150"
                r="103"
                fill={`url(#${idPrefix}-rim)`}
              />
            </>
          ) : null}
        </Svg>
      </Animated.View>
    </View>
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
