import { LucideIcon } from 'lucide-react-native';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '../constants/theme';

interface IconTileProps {
  icon: LucideIcon;
  color?: string;
  background?: string;
  size?: number;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
}

export function IconTile({
  icon: Icon,
  color = colors.accent,
  background = colors.accentSoft,
  size = 42,
  iconSize = 20,
  style,
}: IconTileProps) {
  return (
    <View
      style={[
        styles.tile,
        {
          backgroundColor: background,
          height: size,
          width: size,
        },
        style,
      ]}
    >
      <Icon size={iconSize} color={color} strokeWidth={1.8} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    borderRadius: radius.md,
    justifyContent: 'center',
  },
});
