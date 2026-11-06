import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { GlassSurface, GlassTone } from './GlassSurface';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  padded?: boolean;
  tone?: GlassTone;
  radiusValue?: number;
}

export function Card({
  children,
  style,
  contentStyle,
  padded = true,
  tone = 'default',
  radiusValue,
}: CardProps) {
  return (
    <GlassSurface
      tone={tone}
      padded={padded}
      style={style}
      contentStyle={contentStyle}
      radiusValue={radiusValue}
    >
      {children}
    </GlassSurface>
  );
}
