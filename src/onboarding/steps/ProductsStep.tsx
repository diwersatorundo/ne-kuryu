import { StyleSheet, View } from 'react-native';
import { PRODUCT_ORDER, PRODUCTS } from '../../constants/products';
import { colors, spacing } from '../../constants/theme';
import { ProductConfigMap, ProductType } from '../../types/profile';
import { InlineError } from '../../components/InlineError';
import { SelectCard } from '../../components/SelectCard';
import { AppText } from '../../components/AppText';
import { FieldErrors } from '../validation';

interface ProductsStepProps {
  products: ProductConfigMap;
  errors: FieldErrors;
  onToggle: (type: ProductType) => void;
}

export function ProductsStep({ products, errors, onToggle }: ProductsStepProps) {
  const selectedCount = PRODUCT_ORDER.filter((type) => products[type]).length;

  return (
    <View style={styles.wrapper}>
      <View style={styles.intro}>
        <AppText variant="h1">Что вы использовали?</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Можно выбрать несколько вариантов. Для каждого продукта зададим
          отдельные вопросы.
        </AppText>
      </View>

      {errors.products ? <InlineError message={errors.products} /> : null}

      <View style={styles.list}>
        {PRODUCT_ORDER.map((type) => (
          <SelectCard
            key={type}
            product={PRODUCTS[type]}
            selected={Boolean(products[type])}
            onPress={() => onToggle(type)}
          />
        ))}
      </View>

      <View style={styles.counter}>
        <AppText variant="small" color={colors.textMuted}>
          {selectedCount > 0
            ? `Выбрано категорий: ${selectedCount}`
            : 'Пока ничего не выбрано'}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.lg,
    paddingTop: 8,
  },
  intro: {
    gap: 8,
  },
  list: {
    gap: 9,
  },
  counter: {
    alignItems: 'center',
  },
});
