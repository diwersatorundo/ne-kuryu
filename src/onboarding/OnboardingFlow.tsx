import { X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import {
  createEmptyProductConfig,
  getOrderedConfigs,
  PRODUCTS,
  PRODUCT_ORDER,
} from '../constants/products';
import { colors, radius, spacing } from '../constants/theme';
import {
  Profile,
  ProfileDraft,
  ProductConfig,
  ProductConfigMap,
  ProductType,
} from '../types/profile';
import { productMapFromList } from '../storage/profileStorage';
import { AppText } from '../components/AppText';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { Screen } from '../components/Screen';
import { ProfileStep } from './steps/ProfileStep';
import { ProductsStep } from './steps/ProductsStep';
import { ConsumptionStep } from './steps/ConsumptionStep';
import { SummaryStep } from './steps/SummaryStep';
import {
  FieldErrors,
  hasErrors,
  validateProductConfig,
  validateProductSelection,
  validateProfileInfo,
} from './validation';

type Step =
  | { kind: 'profile' }
  | { kind: 'products' }
  | { kind: 'consumption'; type: ProductType }
  | { kind: 'summary' };

interface OnboardingFlowProps {
  initialProfile: Profile | null;
  initialStep?: 'profile' | 'products';
  onComplete: (profile: Profile) => void;
  onCancel?: () => void;
}

function createDraft(profile: Profile | null): ProfileDraft {
  if (!profile) {
    return {
      name: '',
      quitAt: new Date(),
      currency: 'RUB',
      products: {},
    };
  }
  return {
    name: profile.name,
    quitAt: new Date(profile.quitAt),
    currency: profile.currency,
    products: productMapFromList(profile.products),
  };
}

export function OnboardingFlow({
  initialProfile,
  initialStep = 'profile',
  onComplete,
  onCancel,
}: OnboardingFlowProps) {
  const isEditing = initialProfile !== null;
  const [draft, setDraft] = useState<ProfileDraft>(() =>
    createDraft(initialProfile),
  );
  const [index, setIndex] = useState(() =>
    initialStep === 'products' ? 1 : 0,
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const steps = useMemo<Step[]>(() => {
    const consumptionSteps: Step[] = PRODUCT_ORDER.filter(
      (type) => draft.products[type],
    ).map((type) => ({ kind: 'consumption', type }));
    return [
      { kind: 'profile' },
      { kind: 'products' },
      ...consumptionSteps,
      { kind: 'summary' },
    ];
  }, [draft.products]);

  const safeIndex = Math.min(index, steps.length - 1);
  const currentStep = steps[safeIndex];

  const updateDraft = (patch: Partial<ProfileDraft>) => {
    setDraft((previous) => ({ ...previous, ...patch }));
    setErrors({});
  };

  const toggleProduct = (type: ProductType) => {
    setDraft((previous) => {
      const products: ProductConfigMap = { ...previous.products };
      if (products[type]) {
        delete products[type];
      } else {
        products[type] = createEmptyProductConfig(type);
      }
      return { ...previous, products };
    });
    setErrors({});
  };

  const updateProduct = (type: ProductType, config: ProductConfig) => {
    setDraft((previous) => ({
      ...previous,
      products: { ...previous.products, [type]: config },
    }));
    setErrors({});
  };

  const goBack = useCallback(() => {
    if (safeIndex > 0) {
      setIndex(safeIndex - 1);
      setErrors({});
      return;
    }
    if (isEditing) {
      onCancel?.();
    }
  }, [isEditing, onCancel, safeIndex]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (safeIndex > 0) {
          goBack();
          return true;
        }
        if (isEditing) {
          onCancel?.();
          return true;
        }
        return false;
      },
    );
    return () => subscription.remove();
  }, [goBack, isEditing, onCancel, safeIndex]);

  const finish = () => {
    const profileErrors = validateProfileInfo(draft.name, draft.quitAt);
    if (hasErrors(profileErrors)) {
      setErrors(profileErrors);
      setIndex(0);
      return;
    }

    const selectionErrors = validateProductSelection(draft.products);
    if (hasErrors(selectionErrors)) {
      setErrors(selectionErrors);
      setIndex(1);
      return;
    }

    for (const type of PRODUCT_ORDER) {
      const config = draft.products[type];
      if (!config) {
        continue;
      }
      const configErrors = validateProductConfig(config);
      if (hasErrors(configErrors)) {
        setErrors(configErrors);
        const targetIndex = steps.findIndex(
          (step) => step.kind === 'consumption' && step.type === type,
        );
        if (targetIndex >= 0) {
          setIndex(targetIndex);
        }
        return;
      }
    }

    const nowIso = new Date().toISOString();
    const profile: Profile = {
      schemaVersion: 1,
      name: draft.name.trim(),
      quitAt: draft.quitAt.toISOString(),
      currency: draft.currency,
      products: getOrderedConfigs(draft.products),
      onboardingCompleted: true,
      createdAt: initialProfile?.createdAt ?? nowIso,
      updatedAt: nowIso,
    };
    onComplete(profile);
  };

  const goNext = () => {
    if (currentStep.kind === 'summary') {
      finish();
      return;
    }

    let stepErrors: FieldErrors = {};

    if (currentStep.kind === 'profile') {
      stepErrors = validateProfileInfo(draft.name, draft.quitAt);
    } else if (currentStep.kind === 'products') {
      stepErrors = validateProductSelection(draft.products);
    } else if (currentStep.kind === 'consumption') {
      const config = draft.products[currentStep.type];
      stepErrors = config ? validateProductConfig(config) : {};
    }

    if (hasErrors(stepErrors)) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    let nextIndex = Math.min(safeIndex + 1, steps.length - 1);
    while (nextIndex < steps.length - 1) {
      const nextStep = steps[nextIndex];
      if (nextStep.kind !== 'consumption') {
        break;
      }
      const nextConfig = draft.products[nextStep.type];
      if (!nextConfig || hasErrors(validateProductConfig(nextConfig))) {
        break;
      }
      nextIndex += 1;
    }
    setIndex(nextIndex);
  };

  const goToProfile = () => {
    setErrors({});
    setIndex(0);
  };

  const goToProducts = () => {
    setErrors({});
    setIndex(1);
  };

  const goToConsumption = (type: ProductType) => {
    const targetIndex = steps.findIndex(
      (step) => step.kind === 'consumption' && step.type === type,
    );
    if (targetIndex >= 0) {
      setErrors({});
      setIndex(targetIndex);
    }
  };

  const stepLabel =
    currentStep.kind === 'profile'
      ? 'Профиль'
      : currentStep.kind === 'products'
        ? 'Продукты'
        : currentStep.kind === 'consumption'
          ? PRODUCTS[currentStep.type].shortTitle
          : 'Сводка';

  const stepKey =
    currentStep.kind === 'consumption'
      ? `consumption-${currentStep.type}`
      : currentStep.kind;

  const footer = (
    <View style={styles.footerRow}>
      {safeIndex > 0 ? (
        <Button
          label="Назад"
          variant="secondary"
          onPress={goBack}
          style={styles.footerButton}
        />
      ) : null}
      <Button
        label={
          currentStep.kind === 'summary'
            ? isEditing
              ? 'Сохранить'
              : 'Начать'
            : 'Далее'
        }
        onPress={goNext}
        style={styles.footerButton}
      />
    </View>
  );

  return (
    <Screen key={stepKey} footer={footer}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <AppText variant="caption" color={colors.accent} style={styles.brand}>
            NICOTINY
          </AppText>
          {isEditing && onCancel ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Закрыть настройку"
              onPress={onCancel}
              hitSlop={10}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.pressed,
              ]}
            >
              <X size={17} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
        <View style={styles.stepInfo}>
          <AppText variant="caption" color={colors.textMuted}>
            ШАГ {safeIndex + 1} ИЗ {steps.length}
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {stepLabel}
          </AppText>
        </View>
        <ProgressBar progress={(safeIndex + 1) / steps.length} />
      </View>

      {currentStep.kind === 'profile' ? (
        <ProfileStep draft={draft} errors={errors} onChange={updateDraft} />
      ) : null}

      {currentStep.kind === 'products' ? (
        <ProductsStep
          products={draft.products}
          errors={errors}
          onToggle={toggleProduct}
        />
      ) : null}

      {currentStep.kind === 'consumption' && draft.products[currentStep.type] ? (
        <ConsumptionStep
          config={draft.products[currentStep.type]!}
          currency={draft.currency}
          errors={errors}
          onChange={(config) => updateProduct(currentStep.type, config)}
        />
      ) : null}

      {currentStep.kind === 'summary' ? (
        <SummaryStep
          draft={draft}
          onEditProfile={goToProfile}
          onEditProducts={goToProducts}
          onEditConsumption={goToConsumption}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    paddingTop: 6,
    paddingBottom: 14,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  brand: {
    letterSpacing: 3,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  pressed: {
    opacity: 0.65,
  },
  stepInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerButton: {
    flex: 1,
  },
});
