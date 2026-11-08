import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { gradients } from '../constants/theme';

export const AtmosphereBackground = memo(function AtmosphereBackground() {
  return (
    <LinearGradient
      colors={gradients.screen}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.85, y: 1 }}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
});
