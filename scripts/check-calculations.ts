import assert from 'node:assert/strict';
import { calculateProductStats, calculateStats, getTimeState } from '../src/calculations/calculations';
import { Profile, ProductConfig } from '../src/types/profile';
import { MS_DAY } from '../src/utils/date';
import {
  SPHERE_CONFIG,
  getSphereDiameter,
  getSphereGrowth,
} from '../src/constants/sphere';
import { formatMl, formatMoney, formatNumber, pluralRu } from '../src/utils/format';
import {
  hasErrors,
  validateProductConfig,
  validateProductSelection,
  validateProfileInfo,
} from '../src/onboarding/validation';

const now = new Date('2026-01-15T12:00:00.000Z');
const quitAt = new Date(now.getTime() - 14 * MS_DAY).toISOString();

const products: ProductConfig[] = [
  {
    type: 'cigarettes',
    cigarettesPerDay: 10,
    cigarettesPerPack: 20,
    pricePerPack: 200,
    tarMgPerCigarette: 10,
  },
  {
    type: 'prefilledPods',
    podsPerWeek: 2,
    pricePerPod: 300,
    podVolumeMl: 2,
  },
  {
    type: 'refillablePods',
    liquidMlPerDay: 3,
    bottlePrice: 900,
    bottleVolumeMl: 30,
    podPrice: 300,
    podChangeIntervalDays: 15,
  },
  {
    type: 'disposables',
    devicesPerWeek: 1,
    pricePerDevice: 1000,
    liquidMlPerDevice: 10,
  },
  {
    type: 'refillableVapes',
    liquidMlPerDay: 4,
    bottlePrice: 600,
    bottleVolumeMl: 30,
    consumablesCostPerWeek: 140,
  },
  {
    type: 'heatedTobacco',
    sticksPerDay: 15,
    sticksPerPack: 20,
    pricePerPack: 200,
  },
];

const profile: Profile = {
  schemaVersion: 1,
  name: 'Роман',
  quitAt,
  currency: 'RUB',
  products,
  onboardingCompleted: true,
  createdAt: quitAt,
  updatedAt: quitAt,
};

const stats = calculateStats(profile, now);

assert.equal(stats.time.isFuture, false);
assert.ok(Math.abs(stats.time.elapsedDays - 14) < 1e-9);
assert.ok(Math.abs(stats.dailySpend - 688.5714285714286) < 1e-6);
assert.ok(Math.abs(stats.moneySaved - 9640) < 1e-6);
assert.ok(Math.abs(stats.cigarettesAvoided - 140) < 1e-9);
assert.ok(Math.abs((stats.tarGrams ?? 0) - 1.4) < 1e-9);
assert.ok(Math.abs(stats.podsAvoided - 4) < 1e-9);
assert.ok(Math.abs(stats.disposablesAvoided - 2) < 1e-9);
assert.ok(Math.abs(stats.liquidMlAvoided - 126) < 1e-9);
assert.equal(stats.liquidIsPartial, false);
assert.ok(Math.abs(stats.sticksAvoided - 210) < 1e-9);

const cigaretteStats = calculateProductStats(products[0], 14);
assert.ok(cigaretteStats);
assert.equal(cigaretteStats.moneySaved, 1400);
assert.equal(cigaretteStats.cigarettesAvoided, 140);
assert.equal(cigaretteStats.tarGrams, 1.4);

const noVolumeStats = calculateProductStats(
  { type: 'prefilledPods', podsPerWeek: 2, pricePerPod: 300 },
  14,
);
assert.ok(noVolumeStats);
assert.equal(noVolumeStats.liquidMlAvoided, undefined);

const partialProfile: Profile = {
  ...profile,
  products: [
    { type: 'prefilledPods', podsPerWeek: 2, pricePerPod: 300 },
    { type: 'refillableVapes', liquidMlPerDay: 2, bottlePrice: 300, bottleVolumeMl: 30 },
  ],
};
const partialStats = calculateStats(partialProfile, now);
assert.equal(partialStats.liquidIsPartial, true);
assert.ok(partialStats.liquidMlAvoided > 0);

assert.equal(
  calculateProductStats(
    { type: 'cigarettes', cigarettesPerDay: -1, cigarettesPerPack: 20, pricePerPack: 200 },
    14,
  ),
  null,
);
assert.equal(
  calculateProductStats(
    { type: 'refillableVapes', liquidMlPerDay: 2, bottlePrice: 300, bottleVolumeMl: 0 },
    14,
  ),
  null,
);

const future = getTimeState(new Date(now.getTime() + 2 * MS_DAY).toISOString(), now);
assert.equal(future.isFuture, true);
assert.equal(future.elapsedDays, 0);

const futureProfile: Profile = {
  ...profile,
  quitAt: new Date(now.getTime() + 2 * MS_DAY).toISOString(),
};
const futureStats = calculateStats(futureProfile, now);
assert.equal(futureStats.moneySaved, 0);
assert.equal(futureStats.time.isFuture, true);
assert.ok(futureStats.productStats.every((item) => item.moneySaved === 0));
assert.ok(futureStats.dailySpend > 0);

const invalidDate = getTimeState('not-a-date', now);
assert.equal(invalidDate.elapsedMs, 0);
assert.equal(invalidDate.isFuture, false);

assert.equal(hasErrors(validateProductConfig(products[0])), false);
assert.equal(
  hasErrors(
    validateProductConfig({
      type: 'cigarettes',
      cigarettesPerDay: -2,
      cigarettesPerPack: 20,
      pricePerPack: 200,
    }),
  ),
  true,
);
assert.equal(
  hasErrors(
    validateProductConfig({
      type: 'refillablePods',
      liquidMlPerDay: 2,
      bottlePrice: 300,
      bottleVolumeMl: 30,
      podPrice: 200,
    }),
  ),
  true,
);
assert.equal(hasErrors(validateProductSelection({})), true);
assert.equal(
  hasErrors(validateProfileInfo('Роман', new Date('invalid'))),
  true,
);
assert.equal(hasErrors(validateProfileInfo('Роман', now)), false);

assert.equal(formatNumber(10, 1), '10');
assert.equal(formatNumber(10.04, 1), '10');
assert.equal(formatNumber(1234.56, 2), '1\u00A0234,6');
assert.equal(formatMoney(200, 'RUB', 1), '200\u00A0₽');
assert.equal(formatMoney(200.5, 'RUB', 1), '200,5\u00A0₽');
assert.equal(formatMl(3), '3\u00A0мл');
assert.equal(pluralRu(21, 'сигарета', 'сигареты', 'сигарет'), 'сигарета');
assert.equal(pluralRu(11, 'сигарета', 'сигареты', 'сигарет'), 'сигарет');

assert.ok(Math.abs(getSphereGrowth(0) - 1) < 1e-9);
assert.equal(getSphereGrowth(0, true), 1);
const sphereDay0 = getSphereDiameter(0, 400);
const sphereDay30 = getSphereDiameter(30, 400);
const sphereDay365 = getSphereDiameter(365, 400);
assert.ok(sphereDay0 > sphereDay30);
assert.ok(sphereDay30 > sphereDay365);
assert.ok(sphereDay365 >= SPHERE_CONFIG.minDiameter - 1e-9);
assert.ok(Math.abs(sphereDay0 - Math.min(400 * SPHERE_CONFIG.maxDiameterRatio, SPHERE_CONFIG.maxDiameterCap)) < 1e-9);

console.log('All calculation and validation checks passed.');
