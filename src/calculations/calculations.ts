import {
  ProductConfig,
  ProductType,
  Profile,
} from '../types/profile';
import { MS_DAY } from '../utils/date';

export interface ProductStats {
  type: ProductType;
  dailySpend: number;
  moneySaved: number;
  cigarettesAvoided?: number;
  tarGrams?: number;
  podsAvoided?: number;
  devicesAvoided?: number;
  liquidMlAvoided?: number;
  sticksAvoided?: number;
}

export interface TimeState {
  isFuture: boolean;
  elapsedMs: number;
  futureMs: number;
  elapsedDays: number;
}

export interface StatsTotals {
  time: TimeState;
  dailySpend: number;
  moneySaved: number;
  cigarettesAvoided: number;
  tarGrams: number | null;
  podsAvoided: number;
  disposablesAvoided: number;
  liquidMlAvoided: number;
  liquidIsPartial: boolean;
  sticksAvoided: number;
  productStats: ProductStats[];
}

function positive(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function optionalPositive(value: number | undefined): number | undefined {
  return positive(value) ? value : undefined;
}

export function getTimeState(quitAt: string | Date, now: Date): TimeState {
  const quitDate = quitAt instanceof Date ? quitAt : new Date(quitAt);
  if (Number.isNaN(quitDate.getTime())) {
    return { isFuture: false, elapsedMs: 0, futureMs: 0, elapsedDays: 0 };
  }
  const difference = now.getTime() - quitDate.getTime();
  const isFuture = difference < 0;
  const elapsedMs = isFuture ? 0 : difference;
  const futureMs = isFuture ? Math.abs(difference) : 0;
  return {
    isFuture,
    elapsedMs,
    futureMs,
    elapsedDays: elapsedMs / MS_DAY,
  };
}

export function getProductDailySpend(config: ProductConfig): number {
  switch (config.type) {
    case 'cigarettes': {
      if (
        !positive(config.cigarettesPerDay) ||
        !positive(config.cigarettesPerPack) ||
        !positive(config.pricePerPack)
      ) {
        return 0;
      }
      return (
        (config.cigarettesPerDay / config.cigarettesPerPack) *
        config.pricePerPack
      );
    }
    case 'prefilledPods': {
      if (!positive(config.podsPerWeek) || !positive(config.pricePerPod)) {
        return 0;
      }
      return (config.podsPerWeek * config.pricePerPod) / 7;
    }
    case 'refillablePods': {
      if (
        !positive(config.liquidMlPerDay) ||
        !positive(config.bottlePrice) ||
        !positive(config.bottleVolumeMl)
      ) {
        return 0;
      }
      const liquidCostPerDay =
        (config.liquidMlPerDay / config.bottleVolumeMl) * config.bottlePrice;
      const podCostPerDay =
        positive(config.podPrice) && positive(config.podChangeIntervalDays)
          ? config.podPrice / config.podChangeIntervalDays
          : 0;
      return liquidCostPerDay + podCostPerDay;
    }
    case 'disposables': {
      if (!positive(config.devicesPerWeek) || !positive(config.pricePerDevice)) {
        return 0;
      }
      return (config.devicesPerWeek * config.pricePerDevice) / 7;
    }
    case 'refillableVapes': {
      if (
        !positive(config.liquidMlPerDay) ||
        !positive(config.bottlePrice) ||
        !positive(config.bottleVolumeMl)
      ) {
        return 0;
      }
      const liquidCostPerDay =
        (config.liquidMlPerDay / config.bottleVolumeMl) * config.bottlePrice;
      const consumablesPerDay = positive(config.consumablesCostPerWeek)
        ? config.consumablesCostPerWeek / 7
        : 0;
      return liquidCostPerDay + consumablesPerDay;
    }
    case 'heatedTobacco': {
      if (
        !positive(config.sticksPerDay) ||
        !positive(config.sticksPerPack) ||
        !positive(config.pricePerPack)
      ) {
        return 0;
      }
      return (
        (config.sticksPerDay / config.sticksPerPack) * config.pricePerPack
      );
    }
  }
}

export function calculateProductStats(
  config: ProductConfig,
  elapsedDays: number,
): ProductStats | null {
  const safeDays = Math.max(0, elapsedDays);

  switch (config.type) {
    case 'cigarettes': {
      if (
        !positive(config.cigarettesPerDay) ||
        !positive(config.cigarettesPerPack) ||
        !positive(config.pricePerPack)
      ) {
        return null;
      }
      const dailySpend =
        (config.cigarettesPerDay / config.cigarettesPerPack) *
        config.pricePerPack;
      const cigarettesAvoided = config.cigarettesPerDay * safeDays;
      const tar = optionalPositive(config.tarMgPerCigarette);
      return {
        type: config.type,
        dailySpend,
        moneySaved: dailySpend * safeDays,
        cigarettesAvoided,
        tarGrams: tar === undefined ? undefined : (cigarettesAvoided * tar) / 1000,
      };
    }
    case 'prefilledPods': {
      if (!positive(config.podsPerWeek) || !positive(config.pricePerPod)) {
        return null;
      }
      const dailySpend = (config.podsPerWeek * config.pricePerPod) / 7;
      const podsAvoided = (config.podsPerWeek * safeDays) / 7;
      const volume = optionalPositive(config.podVolumeMl);
      return {
        type: config.type,
        dailySpend,
        moneySaved: dailySpend * safeDays,
        podsAvoided,
        liquidMlAvoided: volume === undefined ? undefined : podsAvoided * volume,
      };
    }
    case 'refillablePods': {
      if (
        !positive(config.liquidMlPerDay) ||
        !positive(config.bottlePrice) ||
        !positive(config.bottleVolumeMl)
      ) {
        return null;
      }
      const liquidCostPerDay =
        (config.liquidMlPerDay / config.bottleVolumeMl) * config.bottlePrice;
      const hasPodCost =
        positive(config.podPrice) && positive(config.podChangeIntervalDays);
      const podCostPerDay = hasPodCost
        ? config.podPrice! / config.podChangeIntervalDays!
        : 0;
      const dailySpend = liquidCostPerDay + podCostPerDay;
      return {
        type: config.type,
        dailySpend,
        moneySaved: dailySpend * safeDays,
        liquidMlAvoided: config.liquidMlPerDay * safeDays,
        podsAvoided: hasPodCost
          ? safeDays / config.podChangeIntervalDays!
          : undefined,
      };
    }
    case 'disposables': {
      if (
        !positive(config.devicesPerWeek) ||
        !positive(config.pricePerDevice)
      ) {
        return null;
      }
      const dailySpend = (config.devicesPerWeek * config.pricePerDevice) / 7;
      const devicesAvoided = (config.devicesPerWeek * safeDays) / 7;
      const volume = optionalPositive(config.liquidMlPerDevice);
      return {
        type: config.type,
        dailySpend,
        moneySaved: dailySpend * safeDays,
        devicesAvoided,
        liquidMlAvoided:
          volume === undefined ? undefined : devicesAvoided * volume,
      };
    }
    case 'refillableVapes': {
      if (
        !positive(config.liquidMlPerDay) ||
        !positive(config.bottlePrice) ||
        !positive(config.bottleVolumeMl)
      ) {
        return null;
      }
      const liquidCostPerDay =
        (config.liquidMlPerDay / config.bottleVolumeMl) * config.bottlePrice;
      const consumablesPerDay = positive(config.consumablesCostPerWeek)
        ? config.consumablesCostPerWeek / 7
        : 0;
      const dailySpend = liquidCostPerDay + consumablesPerDay;
      return {
        type: config.type,
        dailySpend,
        moneySaved: dailySpend * safeDays,
        liquidMlAvoided: config.liquidMlPerDay * safeDays,
      };
    }
    case 'heatedTobacco': {
      if (
        !positive(config.sticksPerDay) ||
        !positive(config.sticksPerPack) ||
        !positive(config.pricePerPack)
      ) {
        return null;
      }
      const dailySpend =
        (config.sticksPerDay / config.sticksPerPack) * config.pricePerPack;
      return {
        type: config.type,
        dailySpend,
        moneySaved: dailySpend * safeDays,
        sticksAvoided: config.sticksPerDay * safeDays,
      };
    }
  }
}

export function calculateStats(profile: Profile, now: Date): StatsTotals {
  const time = getTimeState(profile.quitAt, now);
  const productStats = profile.products
    .map((config) => calculateProductStats(config, time.elapsedDays))
    .filter((stats): stats is ProductStats => stats !== null);

  let dailySpend = 0;
  let moneySaved = 0;
  let cigarettesAvoided = 0;
  let tarGrams: number | null = null;
  let podsAvoided = 0;
  let disposablesAvoided = 0;
  let liquidMlAvoided = 0;
  let sticksAvoided = 0;
  let liquidIsPartial = false;

  for (const stats of productStats) {
    dailySpend += stats.dailySpend;
    moneySaved += stats.moneySaved;
    cigarettesAvoided += stats.cigarettesAvoided ?? 0;
    if (stats.type === 'prefilledPods') {
      podsAvoided += stats.podsAvoided ?? 0;
    }
    disposablesAvoided += stats.devicesAvoided ?? 0;
    liquidMlAvoided += stats.liquidMlAvoided ?? 0;
    sticksAvoided += stats.sticksAvoided ?? 0;
    if (stats.tarGrams !== undefined) {
      tarGrams = (tarGrams ?? 0) + stats.tarGrams;
    }

    if (stats.type === 'prefilledPods' && stats.liquidMlAvoided === undefined) {
      liquidIsPartial = true;
    }
    if (stats.type === 'disposables' && stats.liquidMlAvoided === undefined) {
      liquidIsPartial = true;
    }
  }

  return {
    time,
    dailySpend,
    moneySaved,
    cigarettesAvoided,
    tarGrams,
    podsAvoided,
    disposablesAvoided,
    liquidMlAvoided,
    liquidIsPartial,
    sticksAvoided,
    productStats,
  };
}

export function getProjectedSavings(
  dailySpend: number,
  days: number,
): number {
  if (!Number.isFinite(dailySpend) || dailySpend <= 0) {
    return 0;
  }
  return dailySpend * Math.max(0, days);
}
