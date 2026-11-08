import { Pencil } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { getCurrency } from '../../constants/currencies';
import { getOrderedConfigs, PRODUCTS } from '../../constants/products';
import { colors, radius, spacing } from '../../constants/theme';
import { ProfileDraft, ProductType } from '../../types/profile';
import {
  calculateProductStats,
  getProductDailySpend,
  getTimeState,
} from '../../calculations/calculations';
import { formatDateTime } from '../../utils/date';
import {
  formatDayLabel,
  formatMoney,
  formatMl,
  pluralRu,
} from '../../utils/format';
import { describeConsumption } from '../../utils/describeProduct';
import { AppText } from '../../components/AppText';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { IconTile } from '../../components/IconTile';
import { SectionHeader } from '../../components/SectionHeader';

interface SummaryStepProps {
  draft: ProfileDraft;
  onEditProfile: () => void;
  onEditProducts: () => void;
  onEditConsumption: (type: ProductType) => void;
}

export function SummaryStep({
  draft,
  onEditProfile,
  onEditProducts,
  onEditConsumption,
}: SummaryStepProps) {
  const now = new Date();
  const time = getTimeState(draft.quitAt, now);
  const configs = getOrderedConfigs(draft.products);
  const rows = configs.map((config) => ({
    config,
    dailySpend: getProductDailySpend(config),
    stats: calculateProductStats(config, time.elapsedDays),
  }));
  const dailySpend = rows.reduce((sum, row) => sum + row.dailySpend, 0);
  const saved = rows.reduce((sum, row) => sum + (row.stats?.moneySaved ?? 0), 0);
  const liquid = rows.reduce(
    (sum, row) => sum + (row.stats?.liquidMlAvoided ?? 0),
    0,
  );
  const liquidIsPartial = rows.some(
    (row) =>
      (row.config.type === 'prefilledPods' ||
        row.config.type === 'disposables') &&
      row.stats?.liquidMlAvoided === undefined,
  );
  const currency = draft.currency;
  const currencySymbol = getCurrency(currency).symbol;

  return (
    <View style={styles.wrapper}>
      <View style={styles.intro}>
        <AppText variant="h1">Проверьте перед стартом</AppText>
        <AppText variant="body" color={colors.textSecondary}>
          Можно изменить любой ответ. После сохранения всё будет доступно в
          настройках.
        </AppText>
      </View>

      <Card style={styles.summaryCard}>
        <View style={styles.cardHeader}>
          <AppText variant="label" color={colors.textMuted}>
            ПРОФИЛЬ
          </AppText>
          <Pressable
            accessibilityRole="button"
            onPress={onEditProfile}
            hitSlop={8}
            style={({ pressed }) => [styles.editLink, pressed && styles.pressed]}
          >
            <Pencil size={13} color={colors.accent} />
            <AppText variant="caption" color={colors.accent}>
              Изменить
            </AppText>
          </Pressable>
        </View>
        <SummaryRow label="Имя" value={draft.name.trim() || 'Без имени'} />
        <SummaryRow label="Дата отказа" value={formatDateTime(draft.quitAt)} />
        <SummaryRow
          label="Валюта"
          value={`${currencySymbol} · ${currency}`}
        />
      </Card>

      <View style={styles.block}>
        <SectionHeader
          title="Продукты"
          subtitle={`${configs.length} ${pluralRu(
            configs.length,
            'категория',
            'категории',
            'категорий',
          )}`}
          right={
            <Pressable
              accessibilityRole="button"
              onPress={onEditProducts}
              hitSlop={8}
              style={({ pressed }) => [styles.editLink, pressed && styles.pressed]}
            >
              <Pencil size={13} color={colors.accent} />
              <AppText variant="caption" color={colors.accent}>
                Изменить
              </AppText>
            </Pressable>
          }
          style={styles.sectionHeader}
        />
        <View style={styles.productList}>
          {rows.map(({ config, dailySpend: productDailySpend }) => {
            const product = PRODUCTS[config.type];
            return (
              <Card key={config.type} padded={false} radiusValue={radius.lg}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Изменить параметры: ${product.title}`}
                  onPress={() => onEditConsumption(config.type)}
                  style={({ pressed }) => [
                    styles.productRow,
                    pressed && styles.pressed,
                  ]}
                >
                  <IconTile
                    icon={product.icon}
                    color={product.accent}
                    background={product.accentSoft}
                    size={38}
                    iconSize={18}
                  />
                  <View style={styles.productText}>
                    <AppText variant="h3">{product.title}</AppText>
                    <AppText
                      variant="small"
                      color={colors.textMuted}
                      numberOfLines={2}
                    >
                      {describeConsumption(config, currency)}
                    </AppText>
                  </View>
                  <View style={styles.productRight}>
                    <AppText variant="small" color={product.accent}>
                      {productDailySpend > 0
                        ? `${formatMoney(productDailySpend, currency, 1)}/день`
                        : '—'}
                    </AppText>
                    <Pencil size={13} color={colors.textMuted} />
                  </View>
                </Pressable>
              </Card>
            );
          })}
        </View>
      </View>

      <Card style={styles.savingsCard}>
        <View style={styles.cardHeader}>
          <AppText variant="label" color={colors.textMuted}>
            ПРИМЕРНАЯ ЭКОНОМИЯ
          </AppText>
          <Badge label="оценка" tone="warning" />
        </View>
        <View style={styles.metrics}>
          <View style={styles.metric}>
            <AppText variant="caption" color={colors.textMuted}>
              В ДЕНЬ
            </AppText>
            <AppText variant="h2" color={colors.accent}>
              {formatMoney(dailySpend, currency, 1)}
            </AppText>
          </View>
          <View style={styles.metric}>
            <AppText variant="caption" color={colors.textMuted}>
              ЗА 30 ДНЕЙ
            </AppText>
            <AppText variant="h2">
              {formatMoney(dailySpend * 30, currency, 0)}
            </AppText>
          </View>
        </View>
        {time.isFuture ? (
          <AppText variant="small" color={colors.warning}>
            Дата отказа в будущем — на главном экране будет обратный отсчёт.
          </AppText>
        ) : time.elapsedDays >= 1 ? (
          <AppText variant="small" color={colors.textSecondary}>
            Прошло {formatDayLabel(Math.floor(time.elapsedDays))}
            {saved > 0.01
              ? ` · уже сэкономлено ${formatMoney(saved, currency, 0)}`
              : ''}
          </AppText>
        ) : (
          <AppText variant="small" color={colors.textSecondary}>
            Отсчёт уже идёт. Статистика появится на главном экране.
          </AppText>
        )}
        {liquid > 0 ? (
          <AppText variant="small" color={colors.textMuted}>
            Не использовано примерно {formatMl(liquid)} жидкости
            {liquidIsPartial ? ' по известным объёмам' : ''}.
          </AppText>
        ) : null}
        <AppText variant="caption" color={colors.textMuted}>
          Это ориентир по вашим прежним расходам, а не точная сумма. Все суммы
          указаны в {currencySymbol}.
        </AppText>
      </Card>
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <AppText variant="small" color={colors.textMuted}>
        {label}
      </AppText>
      <AppText
        variant="small"
        color={colors.text}
        style={styles.summaryValue}
        numberOfLines={2}
      >
        {value}
      </AppText>
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
  summaryCard: {
    gap: 10,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editLink: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    minHeight: 44,
    paddingHorizontal: 4,
  },
  pressed: {
    opacity: 0.65,
  },
  summaryRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  summaryValue: {
    flex: 1,
    textAlign: 'right',
  },
  block: {
    gap: 0,
  },
  sectionHeader: {
    marginTop: 0,
    marginBottom: 10,
  },
  productList: {
    gap: 8,
  },
  productRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
  },
  productText: {
    flex: 1,
    gap: 1,
  },
  productRight: {
    alignItems: 'flex-end',
    gap: 5,
  },
  savingsCard: {
    gap: 10,
  },
  metrics: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 14,
  },
  metric: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    flex: 1,
    gap: 3,
    padding: 12,
  },
});
