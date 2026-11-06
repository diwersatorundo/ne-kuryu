import {
  Calendar,
  Cigarette,
  Droplets,
  Flame,
  Package,
  Zap,
} from 'lucide-react-native';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Profile } from '../types/profile';
import {
  calculateStats,
  ProductStats,
} from '../calculations/calculations';
import { PRODUCTS } from '../constants/products';
import { getSphereDiameter } from '../constants/sphere';
import { colors, radius } from '../constants/theme';
import {
  formatClockDuration,
  formatDateTime,
  getDurationParts,
  MS_DAY,
  MS_HOUR,
} from '../utils/date';
import {
  formatMl,
  formatMoney,
  formatNumber,
  pluralRu,
} from '../utils/format';
import { useNow } from '../hooks/useNow';
import { AppText } from '../components/AppText';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { IconTile } from '../components/IconTile';
import { Screen } from '../components/Screen';
import { SectionHeader } from '../components/SectionHeader';
import { SmokeSphere } from '../components/SmokeSphere';
import { StatCard } from '../components/StatCard';

interface MainScreenProps {
  profile: Profile;
}

interface HeroContent {
  eyebrow: string;
  value: string;
  unit: string;
  subline: string;
}

function getHeroContent(profile: Profile, now: Date): HeroContent {
  const quitAt = new Date(profile.quitAt);
  const difference = now.getTime() - quitAt.getTime();
  const isFuture = difference < 0;
  const parts = getDurationParts(Math.abs(difference));

  const eyebrow = isFuture
    ? 'До отказа осталось'
    : profile.name.trim()
      ? `${profile.name.trim()}, вы не курите уже`
      : 'Вы не курите уже';

  let value: string;
  let unit: string;
  let subline: string;

  if (parts.days >= 1) {
    value = formatNumber(parts.days, 0);
    unit = pluralRu(parts.days, 'день', 'дня', 'дней');
    subline = isFuture
      ? formatClockDuration(parts)
      : `${parts.hours} ч ${String(parts.minutes).padStart(2, '0')} мин`;
  } else if (parts.hours >= 1) {
    value = formatNumber(parts.hours, 0);
    unit = pluralRu(parts.hours, 'час', 'часа', 'часов');
    subline = `${parts.minutes} мин ${String(parts.seconds).padStart(2, '0')} с`;
  } else if (parts.minutes >= 1) {
    value = formatNumber(parts.minutes, 0);
    unit = pluralRu(parts.minutes, 'минута', 'минуты', 'минут');
    subline = `${parts.seconds} с`;
  } else {
    value = formatNumber(parts.seconds, 0);
    unit = pluralRu(parts.seconds, 'секунда', 'секунды', 'секунд');
    subline = isFuture ? 'меньше минуты' : 'только что';
  }

  return { eyebrow, value, unit, subline };
}

function getMotivation(elapsedMs: number, isFuture: boolean): string {
  if (isFuture) {
    return 'Дата отказа сохранена. Отсчёт начнётся автоматически.';
  }
  if (elapsedMs < MS_HOUR) {
    return 'Первый час — это уже начало.';
  }
  if (elapsedMs < MS_DAY) {
    return 'Первый день идёт. Продолжайте в своём темпе.';
  }
  const days = elapsedMs / MS_DAY;
  if (days < 7) {
    return 'Первая неделя. Спокойно двигайтесь дальше.';
  }
  if (days < 30) {
    return 'Вы держите выбранный курс.';
  }
  return 'Каждый день складывается в заметный результат.';
}

function tarDisplay(grams: number): string {
  if (grams < 0.01) {
    return '<0,01';
  }
  if (grams < 1) {
    return formatNumber(grams, 2);
  }
  return formatNumber(grams, 1);
}

function categoryDetail(stat: ProductStats): string {
  switch (stat.type) {
    case 'cigarettes': {
      const count = Math.round(stat.cigarettesAvoided ?? 0);
      return `${formatNumber(count, 0)} ${pluralRu(
        count,
        'сигарета',
        'сигареты',
        'сигарет',
      )} не выкурено`;
    }
    case 'prefilledPods':
      return `${formatNumber(stat.podsAvoided ?? 0, 1)} ${pluralRu(
        stat.podsAvoided ?? 0,
        'картридж',
        'картриджа',
        'картриджей',
      )} не куплено`;
    case 'refillablePods':
      return `${formatMl(stat.liquidMlAvoided ?? 0)} жидкости не использовано`;
    case 'disposables':
      return `${formatNumber(stat.devicesAvoided ?? 0, 1)} ${pluralRu(
        stat.devicesAvoided ?? 0,
        'одноразка',
        'одноразки',
        'одноразок',
      )} не куплено`;
    case 'refillableVapes':
      return `${formatMl(stat.liquidMlAvoided ?? 0)} жидкости не использовано`;
    case 'heatedTobacco': {
      const count = Math.round(stat.sticksAvoided ?? 0);
      return `${formatNumber(count, 0)} ${pluralRu(
        count,
        'стик',
        'стика',
        'стиков',
      )} не использовано`;
    }
  }
}

export function MainScreen({ profile }: MainScreenProps) {
  const now = useNow(1000);
  const { width } = useWindowDimensions();
  const stats = calculateStats(profile, now);
  const hero = getHeroContent(profile, now);
  const motivation = getMotivation(stats.time.elapsedMs, stats.time.isFuture);
  const currency = profile.currency;
  const sphereDays = Math.floor(stats.time.elapsedDays * 24) / 24;
  const sphereDiameter = getSphereDiameter(
    sphereDays,
    width,
    stats.time.isFuture,
  );
  const sphereFrameHeight = Math.max(196, Math.min(312, sphereDiameter * 0.9));

  return (
    <Screen edges={['top']} contentContainerStyle={styles.content}>
      <View style={styles.brandRow}>
        <View style={styles.brandLockup}>
          <View style={styles.brandDot} />
          <AppText variant="caption" color={colors.accent} style={styles.brand}>
            NICOTINY
          </AppText>
        </View>
        <View style={styles.datePill}>
          <Calendar size={13} color={colors.textMuted} />
          <AppText variant="caption" color={colors.textMuted}>
            {formatDateTime(new Date(profile.quitAt))}
          </AppText>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={[styles.sphereFrame, { height: sphereFrameHeight }]}>
          <SmokeSphere
            elapsedDays={sphereDays}
            isFuture={stats.time.isFuture}
          />
        </View>

        <View style={styles.heroContent}>
          <AppText
            variant="body"
            color={colors.textSecondary}
            style={styles.eyebrow}
          >
            {hero.eyebrow}
          </AppText>
          <View style={styles.heroValueRow}>
            <AppText
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.48}
              style={styles.heroValue}
            >
              {hero.value}
            </AppText>
            <AppText style={styles.heroUnit}>{hero.unit}</AppText>
          </View>
          <AppText variant="small" color={colors.textMuted}>
            {hero.subline}
          </AppText>
          <View style={styles.motivationPill}>
            <View style={styles.motivationDot} />
            <AppText
              variant="small"
              color={colors.textSecondary}
              style={styles.motivation}
            >
              {motivation}
            </AppText>
          </View>
        </View>
      </View>

      {stats.time.isFuture ? (
        <Card tone="violet" style={styles.futureCard} radiusValue={radius.xl}>
          <View style={styles.cardHeader}>
            <AppText variant="h3">План готов</AppText>
            <Badge label="обратный отсчёт" tone="warning" />
          </View>
          <AppText variant="small" color={colors.textMuted}>
            Статистика и экономия появятся после выбранной даты. Пока показываем
            обратный отсчёт.
          </AppText>
          {stats.dailySpend > 0 ? (
            <View style={styles.futureStats}>
              <View style={styles.futureMetric}>
                <AppText variant="caption" color={colors.textMuted}>
                  ПОСЛЕ ОТКАЗА
                </AppText>
                <AppText variant="bodyMedium" color={colors.accent}>
                  ≈ {formatMoney(stats.dailySpend, currency, 1)} в день
                </AppText>
              </View>
              <View style={styles.futureMetric}>
                <AppText variant="caption" color={colors.textMuted}>
                  ЗА 30 ДНЕЙ
                </AppText>
                <AppText variant="bodyMedium">
                  {formatMoney(stats.dailySpend * 30, currency, 0)}
                </AppText>
              </View>
            </View>
          ) : null}
        </Card>
      ) : (
        <>
          {stats.dailySpend > 0 ? (
            <Card tone="accent" style={styles.moneyCard} radiusValue={radius.xl}>
              <View style={styles.cardHeader}>
                <AppText variant="label" color={colors.accent}>
                  СЭКОНОМЛЕНО
                </AppText>
                <Badge label="оценка" tone="warning" />
              </View>
              <AppText
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}
                style={styles.moneyValue}
              >
                {formatMoney(stats.moneySaved, currency, 1)}
              </AppText>
              <AppText variant="small" color={colors.textSecondary}>
                ≈ {formatMoney(stats.dailySpend, currency, 1)} в день по прежним
                расходам
              </AppText>
            </Card>
          ) : null}

          <View style={styles.statsGrid}>
            {stats.cigarettesAvoided > 0 ? (
              <StatCard
                title="Сигареты"
                value={formatNumber(Math.round(stats.cigarettesAvoided), 0)}
                unit={pluralRu(
                  Math.round(stats.cigarettesAvoided),
                  'сигарета',
                  'сигареты',
                  'сигарет',
                )}
                subtitle="Не выкурено по прежнему темпу"
                icon={Cigarette}
                accent={PRODUCTS.cigarettes.accent}
                accentSoft={PRODUCTS.cigarettes.accentSoft}
                style={styles.statCard}
              />
            ) : null}

            {stats.tarGrams !== null && stats.tarGrams > 0 ? (
              <StatCard
                title="Смола"
                value={tarDisplay(stats.tarGrams)}
                unit="г"
                subtitle="Избежено, оценка"
                icon={Flame}
                accent={colors.warning}
                accentSoft={colors.warningSoft}
                style={styles.statCard}
              />
            ) : null}

            {stats.podsAvoided > 0 ? (
              <StatCard
                title="Картриджи"
                value={formatNumber(stats.podsAvoided, 1)}
                unit="шт."
                subtitle="Не использовано"
                icon={Package}
                accent={PRODUCTS.prefilledPods.accent}
                accentSoft={PRODUCTS.prefilledPods.accentSoft}
                style={styles.statCard}
              />
            ) : null}

            {stats.disposablesAvoided > 0 ? (
              <StatCard
                title="Одноразки"
                value={formatNumber(stats.disposablesAvoided, 1)}
                unit="шт."
                subtitle="Не куплено"
                icon={Zap}
                accent={PRODUCTS.disposables.accent}
                accentSoft={PRODUCTS.disposables.accentSoft}
                style={styles.statCard}
              />
            ) : null}

            {stats.liquidMlAvoided > 0 ? (
              <StatCard
                title="Жидкость"
                value={formatNumber(stats.liquidMlAvoided, 1)}
                unit="мл"
                subtitle={
                  stats.liquidIsPartial
                    ? 'По известным объёмам'
                    : 'Не использовано'
                }
                icon={Droplets}
                accent={PRODUCTS.refillablePods.accent}
                accentSoft={PRODUCTS.refillablePods.accentSoft}
                style={styles.statCard}
              />
            ) : null}

            {stats.sticksAvoided > 0 ? (
              <StatCard
                title="Стики"
                value={formatNumber(Math.round(stats.sticksAvoided), 0)}
                unit="шт."
                subtitle="Не сожжено"
                icon={Flame}
                accent={PRODUCTS.heatedTobacco.accent}
                accentSoft={PRODUCTS.heatedTobacco.accentSoft}
                style={styles.statCard}
              />
            ) : null}
          </View>

          {stats.productStats.length > 0 ? (
            <View style={styles.categories}>
              <SectionHeader
                title="По категориям"
                subtitle="Экономия за всё время"
                style={styles.categoriesHeader}
              />
              <Card padded={false} style={styles.categoryCard}>
                <View style={styles.categoryList}>
                  {stats.productStats.map((stat) => {
                    const product = PRODUCTS[stat.type];
                    return (
                      <View key={stat.type} style={styles.categoryRow}>
                        <IconTile
                          icon={product.icon}
                          color={product.accent}
                          background={product.accentSoft}
                          size={42}
                          iconSize={19}
                        />
                        <View style={styles.categoryText}>
                          <AppText variant="h3">{product.shortTitle}</AppText>
                          <AppText
                            variant="small"
                            color={colors.textMuted}
                            numberOfLines={2}
                          >
                            {categoryDetail(stat)}
                          </AppText>
                        </View>
                        <View style={styles.categoryRight}>
                          <AppText variant="bodyMedium" color={product.accent}>
                            {formatMoney(stat.moneySaved, currency, 1)}
                          </AppText>
                          <AppText variant="caption" color={colors.textMuted}>
                            ≈ {formatMoney(stat.dailySpend, currency, 1)}/день
                          </AppText>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </Card>
            </View>
          ) : null}
        </>
      )}

      <View style={styles.footnote}>
        <AppText variant="caption" color={colors.textMuted}>
          Все показатели — приблизительные оценки на основе введённых данных. Они
          обновляются автоматически. Приложение не заменяет медицинскую помощь.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    zIndex: 2,
  },
  brandLockup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  brandDot: {
    backgroundColor: colors.accent,
    borderRadius: 4,
    height: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    width: 8,
  },
  brand: {
    fontWeight: '700',
    letterSpacing: 3,
  },
  datePill: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  hero: {
    marginTop: 6,
  },
  sphereFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -18,
  },
  heroContent: {
    alignItems: 'center',
    gap: 6,
  },
  eyebrow: {
    textAlign: 'center',
  },
  heroValueRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  heroValue: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 92,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    letterSpacing: -5,
    lineHeight: 98,
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 22,
  },
  heroUnit: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  motivationPill: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    flexDirection: 'row',
    gap: 7,
    marginTop: 8,
    maxWidth: '100%',
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  motivationDot: {
    backgroundColor: colors.accent,
    borderRadius: 3,
    height: 6,
    marginTop: 6,
    width: 6,
  },
  motivation: {
    flexShrink: 1,
  },
  moneyCard: {
    marginTop: 22,
    gap: 6,
  },
  cardHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moneyValue: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1.6,
    lineHeight: 46,
    fontVariant: ['tabular-nums'],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statCard: {
    width: '48%',
  },
  categories: {
    marginTop: 2,
  },
  categoriesHeader: {
    marginTop: 26,
  },
  categoryCard: {
    borderRadius: radius.xl,
  },
  categoryList: {
    gap: 4,
    padding: 8,
  },
  categoryRow: {
    alignItems: 'center',
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: 12,
    padding: 10,
  },
  categoryText: {
    flex: 1,
    gap: 2,
  },
  categoryRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  futureCard: {
    marginTop: 24,
    gap: 10,
  },
  futureStats: {
    flexDirection: 'row',
    gap: 18,
  },
  futureMetric: {
    gap: 2,
  },
  footnote: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
});
