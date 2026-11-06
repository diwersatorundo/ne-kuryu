import { Check } from 'lucide-react-native';
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
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <IconTile
        icon={product.icon}
        color={product.accent}
        background={product.accentSoft}
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
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 66,
    padding: 12,
  },
  cardSelected: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.accentBorder,
  },
  cardPressed: {
    opacity: 0.78,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  check: {
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
});
