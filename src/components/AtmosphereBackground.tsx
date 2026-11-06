import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Defs,
  Ellipse,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { colors, gradients } from '../constants/theme';
import { usePreferences } from '../context/PreferencesContext';

export const AtmosphereBackground = memo(function AtmosphereBackground() {
  const { mode } = usePreferences();
  const beautiful = mode === 'beautiful';

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={gradients.screen}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {beautiful ? (
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <RadialGradient id="atmoViolet" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={colors.violet} stopOpacity="0.2" />
              <Stop offset="0.55" stopColor={colors.violet} stopOpacity="0.06" />
              <Stop offset="1" stopColor={colors.violet} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="atmoMint" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={colors.accent} stopOpacity="0.16" />
              <Stop offset="0.6" stopColor={colors.accent} stopOpacity="0.04" />
              <Stop offset="1" stopColor={colors.accent} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="atmoDeep" cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor="#1B2432" stopOpacity="0.8" />
              <Stop offset="1" stopColor="#1B2432" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Ellipse cx="16" cy="12" rx="44" ry="38" fill="url(#atmoViolet)" />
          <Ellipse cx="92" cy="46" rx="40" ry="42" fill="url(#atmoMint)" />
          <Ellipse cx="46" cy="102" rx="62" ry="38" fill="url(#atmoDeep)" />
        </Svg>
      ) : null}
    </View>
  );
});
