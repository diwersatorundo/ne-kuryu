import { Info } from 'lucide-react-native';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';

interface ExplanationScreenProps {
  onBack: () => void;
}

function Formula({ children }: { children: string }) {
  return (
    <View style={styles.formula}>
      <AppText variant="small" color={colors.accent} style={styles.formulaText}>
        {children}
      </AppText>
    </View>
  );
}

function ExplanationBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card style={styles.block}>
      <AppText variant="h3">{title}</AppText>
      <View style={styles.blockBody}>{children}</View>
    </Card>
  );
}

export function ExplanationScreen({ onBack }: ExplanationScreenProps) {
  return (
    <Screen edges={['top']} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Как считаем"
        subtitle="Формулы и ограничения"
        onBack={onBack}
      />

      <View style={styles.intro}>
        <Info size={17} color={colors.accent} />
        <AppText variant="small" color={colors.textSecondary} style={styles.introText}>
          Все цифры в приложении — оценки на основе ваших прежних расходов. Это
          не медицинские показатели и не точная сумма чеков.
        </AppText>
      </View>

      <ExplanationBlock title="Время без никотина">
        <AppText variant="small" color={colors.textSecondary}>
          Отсчёт идёт от даты и времени отказа. Если дата в будущем, приложение
          показывает обратный отсчёт и не считает вас бросившим раньше времени.
        </AppText>
        <Formula>прошедшее время = сейчас − дата отказа</Formula>
      </ExplanationBlock>

      <ExplanationBlock title="Экономия денег">
        <AppText variant="small" color={colors.textSecondary}>
          Для каждой категории считаем средний расход в день, затем умножаем на
          прошедшее время. Стоимость жидкости считается через цену и объём
          флакона.
        </AppText>
        <Formula>
          сигареты: (в день ÷ в пачке) × цена пачки × дни
        </Formula>
        <Formula>POD-картриджи: в неделю × цена × дни ÷ 7</Formula>
        <Formula>одноразки: в неделю × цена × дни ÷ 7</Formula>
        <Formula>
          жидкость: (мл в день ÷ объём флакона) × цена × дни
        </Formula>
        <Formula>
          нагревание табака: (стиков в день ÷ в пачке) × цена × дни
        </Formula>
        <AppText variant="small" color={colors.textSecondary}>
          Для POD-систем и вейпов дополнительно учитываем сменные картриджи,
          испарители и расходники, если вы указали их стоимость.
        </AppText>
      </ExplanationBlock>

      <ExplanationBlock title="Невыкуренные сигареты">
        <AppText variant="small" color={colors.textSecondary}>
          Показываем только для обычных сигарет. Использование электронок,
          POD-систем и нагревания табака не переводим в «сигареты»: это разные
          продукты.
        </AppText>
        <Formula>невыкурено = сигарет в день × прошедшие дни</Formula>
      </ExplanationBlock>

      <ExplanationBlock title="Смола">
        <AppText variant="small" color={colors.textSecondary}>
          Показатель появляется, только если вы указали содержание смолы с
          упаковки. Это грубая арифметическая оценка, а не количество смолы,
          которое попало бы в лёгкие. Для электронок и POD-систем смолу не
          считаем.
        </AppText>
        <Formula>
          граммы = невыкуренные сигареты × мг смолы ÷ 1000
        </Formula>
      </ExplanationBlock>

      <ExplanationBlock title="Жидкость и устройства">
        <AppText variant="small" color={colors.textSecondary}>
          Для картриджей, одноразок и вейпов считаем неиспользованный объём,
          только если известен объём устройства или картриджа. Некоторые
          производители не указывают его — тогда показатель скрыт или помечен как
          частичный по известным объёмам.
        </AppText>
        <AppText variant="small" color={colors.textSecondary}>
          Количество никотина в жидкости не равно количеству никотина,
          усвоенному организмом. Поэтому мы не делаем таких пересчётов.
        </AppText>
      </ExplanationBlock>

      <ExplanationBlock title="Что приложение не делает">
        <AppText variant="small" color={colors.textSecondary}>
          Не ставит медицинских диагнозов, не обещает сроков восстановления
          здоровья и не утверждает, что электронные устройства безвредны.
          Приложение помогает наблюдать за прогрессом и расходами.
        </AppText>
      </ExplanationBlock>

      <View style={styles.footerNote}>
        <AppText variant="caption" color={colors.textMuted}>
          Данные хранятся локально на устройстве. Приложение работает без
          интернета.
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
    paddingTop: 10,
  },
  intro: {
    alignItems: 'flex-start',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: 9,
    marginBottom: spacing.md,
    padding: 14,
  },
  introText: {
    flex: 1,
  },
  block: {
    gap: 9,
    marginBottom: 10,
  },
  blockBody: {
    gap: 8,
  },
  formula: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  formulaText: {
    fontWeight: '500',
    lineHeight: 19,
  },
  footerNote: {
    marginTop: 8,
    paddingHorizontal: 2,
  },
});
