import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { gradients, radius } from '../constants/theme';

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const [value] = useState(() => new Animated.Value(0));
  const clamped = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    Animated.timing(value, {
      toValue: clamped,
      duration: 320,
      useNativeDriver: false,
    }).start();
  }, [clamped, value]);

  const width = value.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, { width }]}>
        <LinearGradient
          colors={gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: radius.full,
    height: 5,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: radius.full,
    height: '100%',
    overflow: 'hidden',
  },
});
