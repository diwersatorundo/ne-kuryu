import {
  Calculator,
  ChevronRight,
  Database,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { getCurrency } from '../constants/currencies';
import { PRODUCTS } from '../constants/products';
import { colors, radius, spacing } from '../constants/theme';
import { Profile } from '../types/profile';
import {
  getProductDailySpend,
  getTimeState,
} from '../calculations/calculations';
import { formatDateTime } from '../utils/date';
import {
  formatDayLabel,
  formatMoney,
  pluralRu,
} from '../utils/format';
import { describeConsumption } from '../utils/describeProduct';
import { AppModal } from '../components/AppModal';
import { AppText } from '../components/AppText';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { IconTile } from '../components/IconTile';
import { Screen } from '../components/Screen';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeader } from '../components/SectionHeader';
import { ExplanationScreen } from './ExplanationScreen';

interface SettingsScreenProps {
  profile: Profile;
  onEditProfile: () => void;
  onEditProducts: () => void;
  onReset: () => void;
}

export function SettingsScreen({
  profile,
  onEditProfile,
  onEditProducts,
  onReset,
}: SettingsScreenProps) {
  const [explanationVisible, setExplanationVisible] = useState(false);
  const [resetVisible, setResetVisible] = useState(false);

  useEffect(() => {
    if (!explanationVisible) {
      return;
    }
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setExplanationVisible(false);
      return true;
    });
    return () => subscription.remove();
  }, [explanationVisible]);

  if (explanationVisible) {
    return <ExplanationScreen onBack={() => setExplanationVisible(false)} />;
  }

  const now = new Date();
  const time = getTimeState(profile.quitAt, now);
  const currency = profile.currency;
  const symbol = getCurrency(currency).symbol;
  const dailySpend = profile.products.reduce(
    (sum, config) => sum + getProductDailySpend(config),
    0,
  );
  const daysLabel = time.isFuture
    ? 'Обратный отсчёт'
    : time.elapsedDays >= 1
      ? formatDayLabel(Math.floor(time.elapsedDays))
      : 'Меньше дня';

  return (
    <Screen edges={['top']} contentContainerStyle={styles.content}>
      <ScreenHeader
        title="Настройки"
        subtitle="Профиль, продукты и данные"
      />

      <Card style={styles.profileCard}>
        <View style={styles.profileTop}>
          <View style={styles.profileText}>
            <AppText variant="label" color={colors.textMuted}>
              ПРОФИЛЬ
            </AppText>
            <AppText variant="h2">{profile.name.trim() || 'Без имени'}</AppText>
          </View>
          <Badge label={daysLabel} tone="accent" />
        </View>

        <View style={styles.divider} />

        <InfoRow
          label="Дата отказа"
          value={formatDateTime(new Date(profile.quitAt))}
        />
        <InfoRow label="Валюта" value={`${symbol} · ${currency}`} />
        <InfoRow
          label="Прежний расход"
          value={
            dailySpend > 0
              ? `≈ ${formatMoney(dailySpend, currency, 1)} в день`
              : 'Недостаточно данных'
          }
        />

        <Button
          label="Изменить профиль"
          variant="secondary"
          onPress={onEditProfile}
          icon={<Pencil size={15} color={colors.accent} />}
          style={styles.profileButton}
        />
      </Card>

      <View style={styles.section}>
        <SectionHeader
          title="Продукты"
          subtitle={`${profile.products.length} ${pluralRu(
            profile.products.length,
            'категория',
            'категории',
            'категорий',
          )}`}
          right={
            <Pressable
              accessibilityRole="button"
              onPress={onEditProducts}
              hitSlop={8}
              style={({ pressed }) => [
                styles.linkButton,
                pressed && styles.pressed,
              ]}
            >
              <Plus size={14} color={colors.accent} />
              <AppText variant="caption" color={colors.accent}>
                Изменить
              </AppText>
            </Pressable>
          }
          style={styles.sectionHeader}
        />

        <View style={styles.productList}>
          {profile.products.map((config) => {
            const product = PRODUCTS[config.type];
            const productDailySpend = getProductDailySpend(config);
            return (
              <Pressable
                key={config.type}
                accessibilityRole="button"
                onPress={onEditProducts}
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
                  <AppText variant="caption" color={colors.textMuted}>
                    {productDailySpend > 0
                      ? `≈ ${formatMoney(productDailySpend, currency, 1)}/день`
                      : '—'}
                  </AppText>
                  <ChevronRight size={16} color={colors.textMuted} />
                </View>
              </Pressable>
            );
          })}
        </View>

        <Button
          label="Добавить или убрать продукты"
          variant="ghost"
          onPress={onEditProducts}
          icon={<Plus size={15} color={colors.textSecondary} />}
          style={styles.addButton}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          title="Данные и расчёты"
          style={styles.sectionHeader}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => setExplanationVisible(true)}
          style={({ pressed }) => [
            styles.menuRow,
            pressed && styles.pressed,
          ]}
        >
          <IconTile
            icon={Calculator}
            color={colors.accent}
            background={colors.accentSoft}
            size={38}
            iconSize={18}
          />
          <View style={styles.menuText}>
            <AppText variant="h3">Как считаются показатели</AppText>
            <AppText variant="small" color={colors.textMuted}>
              Формулы, оценки и ограничения
            </AppText>
          </View>
          <ChevronRight size={16} color={colors.textMuted} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Хранилище" style={styles.sectionHeader} />
        <Card style={styles.storageCard}>
          <View style={styles.storageTop}>
            <Database size={17} color={colors.textMuted} />
            <AppText variant="small" color={colors.textSecondary} style={styles.storageText}>
              Данные хранятся только на этом устройстве. Работает без интернета и
              без аккаунта.
            </AppText>
          </View>

          <Button
            label="Сбросить данные приложения"
            variant="danger"
            onPress={() => setResetVisible(true)}
            icon={<Trash2 size={15} color={colors.danger} />}
          />
        </Card>
      </View>

      <View style={styles.footer}>
        <AppText variant="caption" color={colors.textMuted}>
          «Не курю» · версия 1.0
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Приложение не заменяет медицинскую помощь.
        </AppText>
      </View>

      <AppModal
        visible={resetVisible}
        onClose={() => setResetVisible(false)}
        title="Сбросить все данные?"
        footer={
          <View style={styles.modalFooter}>
            <Button
              label="Отмена"
              variant="secondary"
              onPress={() => setResetVisible(false)}
              style={styles.modalButton}
            />
            <Button
              label="Сбросить"
              variant="danger"
              onPress={() => {
                setResetVisible(false);
                onReset();
              }}
              style={styles.modalButton}
            />
          </View>
        }
      >
        <AppText variant="body" color={colors.textSecondary}>
          Профиль, продукты и вся статистика будут удалены с этого устройства.
          Приложение вернётся к первоначальной настройке.
        </AppText>
        <AppText variant="small" color={colors.danger} style={styles.resetWarning}>
          Это действие нельзя отменить.
        </AppText>
      </AppModal>
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <AppText variant="small" color={colors.textMuted}>
        {label}
      </AppText>
      <AppText variant="small" style={styles.infoValue} numberOfLines={2}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 28,
    paddingTop: 10,
  },
  profileCard: {
    gap: 10,
  },
  profileTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  profileText: {
    flex: 1,
    gap: 2,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 2,
  },
  infoRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
  },
  profileButton: {
    marginTop: 4,
  },
  section: {
    marginTop: 2,
  },
  sectionHeader: {
    marginTop: spacing.xl,
    marginBottom: 10,
  },
  linkButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  pressed: {
    opacity: 0.65,
  },
  productList: {
    gap: 8,
  },
  productRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  productText: {
    flex: 1,
    gap: 1,
  },
  productRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  addButton: {
    marginTop: 8,
  },
  menuRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
  menuText: {
    flex: 1,
    gap: 1,
  },
  storageCard: {
    gap: 12,
  },
  storageTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 9,
  },
  storageText: {
    flex: 1,
  },
  footer: {
    gap: 4,
    marginTop: 26,
    paddingHorizontal: 2,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 8,
  },
  modalButton: {
    flex: 1,
  },
  resetWarning: {
    marginTop: 10,
  },
});
