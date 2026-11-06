import { CurrencyCode } from '../types/profile';
import { getCurrency } from '../constants/currencies';

const NBSP = '\u00A0';

export function parseNumberInput(value: string): number | undefined {
  const normalized = value.replace(/\s/g, '').replace(',', '.');
  if (normalized === '' || normalized === '.' || normalized === '-') {
    return undefined;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function formatNumber(value: number, maxFractionDigits = 0): string {
  if (!Number.isFinite(value)) {
    return '0';
  }
  const safe = Math.abs(value);
  const digits =
    maxFractionDigits === 0
      ? 0
      : safe >= 1000
        ? Math.min(1, maxFractionDigits)
        : maxFractionDigits;
  const fixed = safe.toFixed(digits);
  const [integerPart, fractionPart] = fixed.split('.');
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const sign = value < 0 ? '−' : '';
  const trimmedFraction = fractionPart?.replace(/0+$/, '') ?? '';
  const fraction = trimmedFraction ? `,${trimmedFraction}` : '';
  return `${sign}${grouped}${fraction}`;
}

export function formatMoney(
  value: number,
  currency: CurrencyCode,
  maxFractionDigits = 2,
): string {
  if (!Number.isFinite(value)) {
    return `0${NBSP}${getCurrency(currency).symbol}`;
  }
  const digits = Math.abs(value) >= 1000 ? 0 : maxFractionDigits;
  return `${formatNumber(value, digits)}${NBSP}${getCurrency(currency).symbol}`;
}

export function formatQuantity(
  value: number,
  unit: string,
  maxFractionDigits = 1,
): string {
  return `${formatNumber(value, maxFractionDigits)}${NBSP}${unit}`;
}

export function formatMl(value: number): string {
  const digits = value >= 100 ? 0 : 1;
  return formatQuantity(value, 'мл', digits);
}

export function formatGrams(value: number): string {
  if (value > 0 && value < 0.01) {
    return '<0,01\u00A0г';
  }
  const digits = value >= 100 ? 0 : value >= 1 ? 1 : 2;
  return formatQuantity(value, 'г', digits);
}

export function pluralRu(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  if (!Number.isInteger(count)) {
    return few;
  }
  const absolute = Math.abs(Math.trunc(count)) % 100;
  const lastDigit = absolute % 10;
  if (absolute > 10 && absolute < 20) {
    return many;
  }
  if (lastDigit === 1) {
    return one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }
  return many;
}

export function formatDayLabel(count: number): string {
  return `${formatNumber(count, 0)} ${pluralRu(count, 'день', 'дня', 'дней')}`;
}

export function formatHourLabel(count: number): string {
  return `${formatNumber(count, 0)} ${pluralRu(count, 'час', 'часа', 'часов')}`;
}

export function formatMinuteLabel(count: number): string {
  return `${formatNumber(count, 0)} ${pluralRu(count, 'минута', 'минуты', 'минут')}`;
}

export function formatUnitLabel(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  return `${formatNumber(count, 0)} ${pluralRu(count, one, few, many)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
