import { ProductConfig, ProductConfigMap } from '../types/profile';
import { PRODUCT_ORDER } from '../constants/productTypes';
import { isValidDate } from '../utils/date';

export type FieldErrors = Record<string, string>;

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

function requiredNumber(
  errors: FieldErrors,
  key: string,
  value: number | undefined,
  max: number,
): void {
  if (value === undefined) {
    errors[key] = 'Укажите значение';
    return;
  }
  if (!Number.isFinite(value) || value <= 0) {
    errors[key] = 'Число должно быть больше 0';
    return;
  }
  if (value > max) {
    errors[key] = 'Слишком большое значение';
  }
}

function optionalNumber(
  errors: FieldErrors,
  key: string,
  value: number | undefined,
  max: number,
): void {
  if (value === undefined) {
    return;
  }
  if (!Number.isFinite(value) || value <= 0) {
    errors[key] = 'Число должно быть больше 0';
    return;
  }
  if (value > max) {
    errors[key] = 'Слишком большое значение';
  }
}

export function validateProfileInfo(
  name: string,
  quitAt: Date,
): FieldErrors {
  const errors: FieldErrors = {};
  if (name.trim().length > 60) {
    errors.name = 'Имя слишком длинное';
  }
  if (!isValidDate(quitAt)) {
    errors.quitAt = 'Выберите корректную дату';
  }
  return errors;
}

export function validateProductSelection(
  products: ProductConfigMap,
): FieldErrors {
  if (PRODUCT_ORDER.every((type) => !products[type])) {
    return { products: 'Выберите хотя бы один тип продукта' };
  }
  return {};
}

export function validateProductConfig(config: ProductConfig): FieldErrors {
  const errors: FieldErrors = {};

  switch (config.type) {
    case 'cigarettes':
      requiredNumber(errors, 'cigarettesPerDay', config.cigarettesPerDay, 200);
      requiredNumber(
        errors,
        'cigarettesPerPack',
        config.cigarettesPerPack,
        200,
      );
      requiredNumber(errors, 'pricePerPack', config.pricePerPack, 1_000_000);
      optionalNumber(
        errors,
        'tarMgPerCigarette',
        config.tarMgPerCigarette,
        200,
      );
      break;
    case 'prefilledPods':
      requiredNumber(errors, 'podsPerWeek', config.podsPerWeek, 100);
      requiredNumber(errors, 'pricePerPod', config.pricePerPod, 1_000_000);
      optionalNumber(errors, 'podVolumeMl', config.podVolumeMl, 1000);
      break;
    case 'refillablePods':
      requiredNumber(errors, 'liquidMlPerDay', config.liquidMlPerDay, 1000);
      requiredNumber(errors, 'bottlePrice', config.bottlePrice, 1_000_000);
      requiredNumber(errors, 'bottleVolumeMl', config.bottleVolumeMl, 10000);
      optionalNumber(errors, 'podPrice', config.podPrice, 1_000_000);
      optionalNumber(
        errors,
        'podChangeIntervalDays',
        config.podChangeIntervalDays,
        3650,
      );
      if (
        (config.podPrice === undefined) !==
        (config.podChangeIntervalDays === undefined)
      ) {
        errors.podPrice = 'Заполните цену и частоту замены';
        errors.podChangeIntervalDays = 'Заполните цену и частоту замены';
      }
      break;
    case 'disposables':
      requiredNumber(errors, 'devicesPerWeek', config.devicesPerWeek, 100);
      requiredNumber(
        errors,
        'pricePerDevice',
        config.pricePerDevice,
        1_000_000,
      );
      optionalNumber(
        errors,
        'liquidMlPerDevice',
        config.liquidMlPerDevice,
        1000,
      );
      break;
    case 'refillableVapes':
      requiredNumber(errors, 'liquidMlPerDay', config.liquidMlPerDay, 1000);
      requiredNumber(errors, 'bottlePrice', config.bottlePrice, 1_000_000);
      requiredNumber(errors, 'bottleVolumeMl', config.bottleVolumeMl, 10000);
      optionalNumber(
        errors,
        'consumablesCostPerWeek',
        config.consumablesCostPerWeek,
        1_000_000,
      );
      break;
    case 'heatedTobacco':
      requiredNumber(errors, 'sticksPerDay', config.sticksPerDay, 200);
      requiredNumber(errors, 'sticksPerPack', config.sticksPerPack, 200);
      requiredNumber(errors, 'pricePerPack', config.pricePerPack, 1_000_000);
      break;
  }

  return errors;
}
