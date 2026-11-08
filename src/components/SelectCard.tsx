import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../constants/theme';
import { ProductInfo } from '../constants/products';
import { AppText } from './AppText';
import { Card } from './Card';
import { IconTile } from './IconTile';

interface SelectCardProps {
  product: ProductInfo;
  selected: boolean;
  onPress: () => void;
}

export function SelectCard({ product, selected, onPress }: SelectCardProps) {
  const [focused, setFocused] = useState(false);

  return (
    <Card padded={false} tone={selected ? 'accent' : 'default'}>
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
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: 12,
    minHeight: 80,
    padding: 12,
  },
  cardSelected: {
    backgroundColor: colors.accentSoft,
  },
  cardPressed: {
    opacity: 0.78,
  },
  cardFocused: {
    backgroundColor: colors.surfaceRaised,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  check: {
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.full,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  checkSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
