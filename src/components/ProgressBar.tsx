import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const [value] = useState(() => new Animated.Value(0));
  const clamped = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    Animated.timing(value, {
      toValue: clamped,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [clamped, value]);

  const width = value.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    borderRadius: radius.full,
    height: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    height: '100%',
  },
});
