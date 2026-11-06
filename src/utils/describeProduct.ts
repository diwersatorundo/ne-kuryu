import { CurrencyCode, ProductConfig } from '../types/profile';
import { formatMoney, formatMl, formatQuantity } from './format';

export function describeConsumption(
  config: ProductConfig,
  currency: CurrencyCode,
): string {
  switch (config.type) {
    case 'cigarettes': {
      const parts: string[] = [];
      if (config.cigarettesPerDay) {
        parts.push(`${formatQuantity(config.cigarettesPerDay, 'шт.')} в день`);
      }
      if (config.cigarettesPerPack) {
        parts.push(`пачка ${formatQuantity(config.cigarettesPerPack, 'шт.')}`);
      }
      if (config.pricePerPack) {
        parts.push(formatMoney(config.pricePerPack, currency));
      }
      if (config.tarMgPerCigarette) {
        parts.push(`смола ${formatQuantity(config.tarMgPerCigarette, 'мг')}`);
      }
      return parts.join(' · ');
    }
    case 'prefilledPods': {
      const parts: string[] = [];
      if (config.podsPerWeek) {
        parts.push(
          `${formatQuantity(config.podsPerWeek, 'шт.', 1)} в неделю`,
        );
      }
      if (config.pricePerPod) {
        parts.push(`${formatMoney(config.pricePerPod, currency)}/шт.`);
      }
      if (config.podVolumeMl) {
        parts.push(`объём ${formatMl(config.podVolumeMl)}`);
      }
      return parts.join(' · ');
    }
    case 'refillablePods': {
      const parts: string[] = [];
      if (config.liquidMlPerDay) {
        parts.push(`${formatMl(config.liquidMlPerDay)} в день`);
      }
      if (config.bottleVolumeMl && config.bottlePrice) {
        parts.push(
          `флакон ${formatMl(config.bottleVolumeMl)} за ${formatMoney(
            config.bottlePrice,
            currency,
          )}`,
        );
      }
      if (config.podPrice && config.podChangeIntervalDays) {
        parts.push(
          `картридж раз в ${formatQuantity(
            config.podChangeIntervalDays,
            'дн.',
            0,
          )}`,
        );
      }
      return parts.join(' · ');
    }
    case 'disposables': {
      const parts: string[] = [];
      if (config.devicesPerWeek) {
        parts.push(
          `${formatQuantity(config.devicesPerWeek, 'шт.', 1)} в неделю`,
        );
      }
      if (config.pricePerDevice) {
        parts.push(formatMoney(config.pricePerDevice, currency));
      }
      if (config.liquidMlPerDevice) {
        parts.push(`${formatMl(config.liquidMlPerDevice)} в устройстве`);
      }
      return parts.join(' · ');
    }
    case 'refillableVapes': {
      const parts: string[] = [];
      if (config.liquidMlPerDay) {
        parts.push(`${formatMl(config.liquidMlPerDay)} в день`);
      }
      if (config.bottleVolumeMl && config.bottlePrice) {
        parts.push(
          `флакон ${formatMl(config.bottleVolumeMl)} за ${formatMoney(
            config.bottlePrice,
            currency,
          )}`,
        );
      }
      if (config.consumablesCostPerWeek) {
        parts.push(
          `расходники ${formatMoney(
            config.consumablesCostPerWeek,
            currency,
          )}/нед.`,
        );
      }
      return parts.join(' · ');
    }
    case 'heatedTobacco': {
      const parts: string[] = [];
      if (config.sticksPerDay) {
        parts.push(`${formatQuantity(config.sticksPerDay, 'стик.')} в день`);
      }
      if (config.sticksPerPack) {
        parts.push(`пачка ${formatQuantity(config.sticksPerPack, 'шт.')}`);
      }
      if (config.pricePerPack) {
        parts.push(formatMoney(config.pricePerPack, currency));
      }
      return parts.join(' · ');
    }
  }
}
