import { Info } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { getCurrency } from '../../constants/currencies';
import { PRODUCTS } from '../../constants/products';
import { colors, radius, spacing } from '../../constants/theme';
import { CurrencyCode, ProductConfig } from '../../types/profile';
import { getProductDailySpend } from '../../calculations/calculations';
import { formatMoney } from '../../utils/format';
import { AppText } from '../../components/AppText';
import { IconTile } from '../../components/IconTile';
import { InlineError } from '../../components/InlineError';
import { NumberField } from '../../components/NumberField';
import { FieldErrors, hasErrors } from '../validation';

interface ConsumptionStepProps {
  config: ProductConfig;
  currency: CurrencyCode;
  errors: FieldErrors;
  onChange: (config: ProductConfig) => void;
}

export function ConsumptionStep({
  config,
  currency,
  errors,
  onChange,
}: ConsumptionStepProps) {
  const product = PRODUCTS[config.type];
  const symbol = getCurrency(currency).symbol;

  const setField = (key: string, value: number | undefined) => {
    onChange({ ...config, [key]: value } as ProductConfig);
  };

  const dailySpend = getProductDailySpend(config);

  return (
    <View style={styles.wrapper}>
      <View style={styles.productHeader}>
        <IconTile
          icon={product.icon}
          color={product.accent}
          background={product.accentSoft}
          size={48}
          iconSize={23}
        />
        <View style={styles.productText}>
          <AppText variant="h1">{product.title}</AppText>
          <AppText variant="small" color={colors.textMuted}>
            {product.description}
          </AppText>
        </View>
      </View>

      <AppText variant="body" color={colors.textSecondary}>
        Сколько вы использовали раньше? Эти данные нужны только для оценки
        прогресса.
      </AppText>

      {hasErrors(errors) ? (
        <InlineError message="Проверьте выделенные поля." />
      ) : null}

      <View style={styles.fields}>
        {config.type === 'cigarettes' ? (
          <>
            <NumberField
              label="Сигарет в день"
              value={config.cigarettesPerDay}
              onChange={(value) => setField('cigarettesPerDay', value)}
              unit="шт."
              placeholder="например, 10"
              error={errors.cigarettesPerDay}
            />
            <NumberField
              label="Сигарет в пачке"
              value={config.cigarettesPerPack}
              onChange={(value) => setField('cigarettesPerPack', value)}
              unit="шт."
              placeholder="например, 20"
              hint="Обычно 20, но бывает иначе."
              error={errors.cigarettesPerPack}
            />
            <NumberField
              label="Цена одной пачки"
              value={config.pricePerPack}
              onChange={(value) => setField('pricePerPack', value)}
              unit={symbol}
              placeholder="например, 180"
              error={errors.pricePerPack}
            />
            <NumberField
              label="Смола в одной сигарете"
              value={config.tarMgPerCigarette}
              onChange={(value) => setField('tarMgPerCigarette', value)}
              unit="мг"
              placeholder="например, 10"
              hint="Необязательно. Значение с упаковки. Если не знаете — «Не знаю»."
              optional
              error={errors.tarMgPerCigarette}
            />
          </>
        ) : null}

        {config.type === 'prefilledPods' ? (
          <>
            <NumberField
              label="Картриджей в неделю"
              value={config.podsPerWeek}
              onChange={(value) => setField('podsPerWeek', value)}
              unit="шт."
              placeholder="например, 2"
              error={errors.podsPerWeek}
            />
            <NumberField
              label="Цена одного картриджа"
              value={config.pricePerPod}
              onChange={(value) => setField('pricePerPod', value)}
              unit={symbol}
              placeholder="например, 350"
              error={errors.pricePerPod}
            />
            <NumberField
              label="Объём картриджа"
              value={config.podVolumeMl}
              onChange={(value) => setField('podVolumeMl', value)}
              unit="мл"
              placeholder="например, 2"
              hint="Необязательно. Обычно указан на упаковке."
              optional
              error={errors.podVolumeMl}
            />
          </>
        ) : null}

        {config.type === 'refillablePods' ? (
          <>
            <NumberField
              label="Жидкости в день"
              value={config.liquidMlPerDay}
              onChange={(value) => setField('liquidMlPerDay', value)}
              unit="мл"
              placeholder="например, 3"
              error={errors.liquidMlPerDay}
            />
            <NumberField
              label="Цена флакона жидкости"
              value={config.bottlePrice}
              onChange={(value) => setField('bottlePrice', value)}
              unit={symbol}
              placeholder="например, 900"
              error={errors.bottlePrice}
            />
            <NumberField
              label="Объём флакона"
              value={config.bottleVolumeMl}
              onChange={(value) => setField('bottleVolumeMl', value)}
              unit="мл"
              placeholder="например, 30"
              hint="Нужно, чтобы посчитать стоимость 1 мл."
              error={errors.bottleVolumeMl}
            />
            <NumberField
              label="Цена сменного картриджа"
              value={config.podPrice}
              onChange={(value) => setField('podPrice', value)}
              unit={symbol}
              placeholder="например, 400"
              hint="Необязательно. Укажите вместе с частотой замены."
              optional
              error={errors.podPrice}
            />
            <NumberField
              label="Менял картридж раз в"
              value={config.podChangeIntervalDays}
              onChange={(value) => setField('podChangeIntervalDays', value)}
              unit="дн."
              placeholder="например, 14"
              hint="Необязательно. Если не знаете — оставьте пустым."
              optional
              error={errors.podChangeIntervalDays}
            />
          </>
        ) : null}

        {config.type === 'disposables' ? (
          <>
            <NumberField
              label="Одноразок в неделю"
              value={config.devicesPerWeek}
              onChange={(value) => setField('devicesPerWeek', value)}
              unit="шт."
              placeholder="например, 1"
              error={errors.devicesPerWeek}
            />
            <NumberField
              label="Цена одной одноразки"
              value={config.pricePerDevice}
              onChange={(value) => setField('pricePerDevice', value)}
              unit={symbol}
              placeholder="например, 1200"
              error={errors.pricePerDevice}
            />
            <NumberField
              label="Жидкости внутри устройства"
              value={config.liquidMlPerDevice}
              onChange={(value) => setField('liquidMlPerDevice', value)}
              unit="мл"
              placeholder="например, 8"
              hint="Необязательно. Если объём неизвестен — «Не знаю»."
              optional
              error={errors.liquidMlPerDevice}
            />
          </>
        ) : null}

        {config.type === 'refillableVapes' ? (
          <>
            <NumberField
              label="Жидкости в день"
              value={config.liquidMlPerDay}
              onChange={(value) => setField('liquidMlPerDay', value)}
              unit="мл"
              placeholder="например, 5"
              error={errors.liquidMlPerDay}
            />
            <NumberField
              label="Цена флакона жидкости"
              value={config.bottlePrice}
              onChange={(value) => setField('bottlePrice', value)}
              unit={symbol}
              placeholder="например, 700"
              error={errors.bottlePrice}
            />
            <NumberField
              label="Объём флакона"
              value={config.bottleVolumeMl}
              onChange={(value) => setField('bottleVolumeMl', value)}
              unit="мл"
              placeholder="например, 30"
              error={errors.bottleVolumeMl}
            />
            <NumberField
              label="Испарители и расходники"
              value={config.consumablesCostPerWeek}
              onChange={(value) => setField('consumablesCostPerWeek', value)}
              unit={`${symbol}/нед.`}
              placeholder="например, 300"
              hint="Необязательно. Средняя сумма за неделю."
              optional
              error={errors.consumablesCostPerWeek}
            />
          </>
        ) : null}

        {config.type === 'heatedTobacco' ? (
          <>
            <NumberField
              label="Стиков в день"
              value={config.sticksPerDay}
              onChange={(value) => setField('sticksPerDay', value)}
              unit="шт."
              placeholder="например, 15"
              error={errors.sticksPerDay}
            />
            <NumberField
              label="Стиков в пачке"
              value={config.sticksPerPack}
              onChange={(value) => setField('sticksPerPack', value)}
              unit="шт."
              placeholder="например, 20"
              error={errors.sticksPerPack}
            />
            <NumberField
              label="Цена одной пачки"
              value={config.pricePerPack}
              onChange={(value) => setField('pricePerPack', value)}
              unit={symbol}
              placeholder="например, 200"
              error={errors.pricePerPack}
            />
          </>
        ) : null}
      </View>

      {dailySpend > 0 ? (
        <View style={styles.preview}>
          <View style={styles.previewTop}>
            <AppText variant="label" color={colors.textMuted}>
              ПРИМЕРНЫЙ РАСХОД
            </AppText>
            <Info size={14} color={colors.textMuted} />
          </View>
          <AppText variant="h2" color={product.accent}>
            ≈ {formatMoney(dailySpend, currency, 1)} в день
          </AppText>
          <AppText variant="small" color={colors.textMuted}>
            Оценка по введённым данным. Не точная сумма чеков.
          </AppText>
        </View>
      ) : null}

      <View style={styles.note}>
        <Info size={16} color={colors.textMuted} />
        <AppText variant="small" color={colors.textMuted} style={styles.noteText}>
          Необязательные поля можно оставить пустыми. Скрытые показатели не
          будут придумываться.
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
  productHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  productText: {
    flex: 1,
    gap: 2,
  },
  fields: {
    gap: 14,
  },
  preview: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    gap: 4,
    padding: 14,
  },
  previewTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  note: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
  },
  noteText: {
    flex: 1,
  },
});
