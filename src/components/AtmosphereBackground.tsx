import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

export const AtmosphereBackground = memo(function AtmosphereBackground() {
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.fill]} />;
});

const styles = StyleSheet.create({
  fill: {
    backgroundColor: colors.background,
  },
});
