import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ProductConfig,
  ProductConfigMap,
  Profile,
} from '../types/profile';
import { getOrderedConfigs, isProductType } from '../constants/products';
import { isCurrencyCode } from '../constants/currencies';
import { parseDateSafe } from '../utils/date';

export const PROFILE_STORAGE_KEY = 'nekuryu.profile.v1';
export const PROFILE_SCHEMA_VERSION = 1;

function cleanNumber(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return undefined;
  }
  return value;
}

function sanitizeProduct(raw: unknown): ProductConfig | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const input = raw as Record<string, unknown>;
  if (!isProductType(input.type)) {
    return null;
  }

  switch (input.type) {
    case 'cigarettes':
      return {
        type: input.type,
        cigarettesPerDay: cleanNumber(input.cigarettesPerDay),
        cigarettesPerPack: cleanNumber(input.cigarettesPerPack),
        pricePerPack: cleanNumber(input.pricePerPack),
        tarMgPerCigarette: cleanNumber(input.tarMgPerCigarette),
      };
    case 'prefilledPods':
      return {
        type: input.type,
        podsPerWeek: cleanNumber(input.podsPerWeek),
        pricePerPod: cleanNumber(input.pricePerPod),
        podVolumeMl: cleanNumber(input.podVolumeMl),
      };
    case 'refillablePods':
      return {
        type: input.type,
        liquidMlPerDay: cleanNumber(input.liquidMlPerDay),
        bottlePrice: cleanNumber(input.bottlePrice),
        bottleVolumeMl: cleanNumber(input.bottleVolumeMl),
        podPrice: cleanNumber(input.podPrice),
        podChangeIntervalDays: cleanNumber(input.podChangeIntervalDays),
      };
    case 'disposables':
      return {
        type: input.type,
        devicesPerWeek: cleanNumber(input.devicesPerWeek),
        pricePerDevice: cleanNumber(input.pricePerDevice),
        liquidMlPerDevice: cleanNumber(input.liquidMlPerDevice),
      };
    case 'refillableVapes':
      return {
        type: input.type,
        liquidMlPerDay: cleanNumber(input.liquidMlPerDay),
        bottlePrice: cleanNumber(input.bottlePrice),
        bottleVolumeMl: cleanNumber(input.bottleVolumeMl),
        consumablesCostPerWeek: cleanNumber(input.consumablesCostPerWeek),
      };
    case 'heatedTobacco':
      return {
        type: input.type,
        sticksPerDay: cleanNumber(input.sticksPerDay),
        sticksPerPack: cleanNumber(input.sticksPerPack),
        pricePerPack: cleanNumber(input.pricePerPack),
      };
  }
}

export function sanitizeProfile(raw: unknown): Profile | null {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const input = raw as Record<string, unknown>;
  if (input.schemaVersion !== PROFILE_SCHEMA_VERSION) {
    return null;
  }
  if (input.onboardingCompleted !== true) {
    return null;
  }

  const quitAt = parseDateSafe(input.quitAt);
  if (!quitAt) {
    return null;
  }

  const name = typeof input.name === 'string' ? input.name.trim().slice(0, 60) : '';
  const currency = isCurrencyCode(input.currency) ? input.currency : 'RUB';

  const map: ProductConfigMap = {};
  if (Array.isArray(input.products)) {
    for (const rawProduct of input.products) {
      const product = sanitizeProduct(rawProduct);
      if (product && !map[product.type]) {
        map[product.type] = product;
      }
    }
  }

  const products = getOrderedConfigs(map);
  if (products.length === 0) {
    return null;
  }

  const nowIso = new Date().toISOString();
  const createdAt = parseDateSafe(input.createdAt);
  const updatedAt = parseDateSafe(input.updatedAt);

  return {
    schemaVersion: PROFILE_SCHEMA_VERSION,
    name,
    quitAt: quitAt.toISOString(),
    currency,
    products,
    onboardingCompleted: true,
    createdAt: createdAt ? createdAt.toISOString() : nowIso,
    updatedAt: updatedAt ? updatedAt.toISOString() : nowIso,
  };
}

export async function loadProfile(): Promise<Profile | null> {
  try {
    const serialized = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
    if (!serialized) {
      return null;
    }
    return sanitizeProfile(JSON.parse(serialized));
  } catch {
    return null;
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
}

export function productMapFromList(
  products: ProductConfig[],
): ProductConfigMap {
  const map: ProductConfigMap = {};
  for (const product of products) {
    map[product.type] = product;
  }
  return map;
}
