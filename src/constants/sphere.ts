/**
 * Все параметры «сферы дыма» собраны здесь, чтобы размер и скорость
 * затухания можно было менять в одном месте.
 *
 * growth(elapsedDays) = e^(-days / decayDays)
 * diameter(elapsedDays) = minDiameter + (maxDiameter - minDiameter) * growth
 *
 * В начале сфера максимальная, со временем плавно уменьшается и никогда
 * не становится меньше minDiameter.
 */
export const SPHERE_CONFIG = {
  maxDiameterRatio: 0.88,
  maxDiameterCap: 380,
  minDiameter: 88,
  decayDays: 60,
  baseDiameter: 300,
} as const;

export function getSphereGrowth(
  elapsedDays: number,
  isFuture = false,
): number {
  if (isFuture) {
    return 1;
  }
  const days = Math.max(0, elapsedDays);
  return Math.exp(-days / SPHERE_CONFIG.decayDays);
}

export function getSphereDiameter(
  elapsedDays: number,
  viewportWidth: number,
  isFuture = false,
): number {
  const maxDiameter = Math.min(
    viewportWidth * SPHERE_CONFIG.maxDiameterRatio,
    SPHERE_CONFIG.maxDiameterCap,
  );
  const minDiameter = Math.min(SPHERE_CONFIG.minDiameter, maxDiameter);
  const growth = getSphereGrowth(elapsedDays, isFuture);
  return minDiameter + (maxDiameter - minDiameter) * growth;
}

export function getSphereScale(
  elapsedDays: number,
  viewportWidth: number,
  isFuture = false,
): number {
  return (
    getSphereDiameter(elapsedDays, viewportWidth, isFuture) /
    SPHERE_CONFIG.baseDiameter
  );
}
