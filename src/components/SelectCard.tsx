import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';
import { ProductInfo } from '../constants/products';
import { AppText } from './AppText';
import { IconTile } from './IconTile';

interface SelectCardProps {
  product: ProductInfo;
  selected: boolean;
  onPress: () => void;
}

export function SelectCard({ product, selected, onPress }: SelectCardProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        focused && styles.cardFocused,
        pressed && styles.cardPressed,
      ]}
    >
      <IconTile
        icon={product.icon}
        color={product.accent}
        background={product.accentSoft}
        size={44}
        iconSize={20}
      />
      <View style={styles.textBlock}>
        <AppText variant="h3">{product.title}</AppText>
        <AppText variant="small" color={colors.textMuted}>
          {product.description}
        </AppText>
      </View>
      <View style={[styles.check, selected && styles.checkSelected]}>
        {selected ? (
          <Check size={14} color={colors.accentInk} strokeWidth={2.6} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: 12,
    minHeight: 72,
    padding: 12,
  },
  cardSelected: {
    backgroundColor: colors.surfaceRaised,
  },
  cardPressed: {
    opacity: 0.78,
  },
  cardFocused: {
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  check: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: radius.full,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkSelected: {
    backgroundColor: colors.accent,
  },
});
