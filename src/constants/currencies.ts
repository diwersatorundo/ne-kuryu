import { CurrencyCode } from '../types/profile';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  shortLabel: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'RUB', symbol: '₽', label: 'Российский рубль', shortLabel: 'Рубль' },
  { code: 'USD', symbol: '$', label: 'Доллар США', shortLabel: 'Доллар' },
  { code: 'EUR', symbol: '€', label: 'Евро', shortLabel: 'Евро' },
  { code: 'KZT', symbol: '₸', label: 'Казахстанский тенге', shortLabel: 'Тенге' },
  { code: 'BYN', symbol: 'Br', label: 'Белорусский рубль', shortLabel: 'Бел. рубль' },
  { code: 'UAH', symbol: '₴', label: 'Украинская гривна', shortLabel: 'Гривна' },
  { code: 'GEL', symbol: '₾', label: 'Грузинский лари', shortLabel: 'Лари' },
  { code: 'AMD', symbol: '֏', label: 'Армянский драм', shortLabel: 'Драм' },
];

export const CURRENCY_CODES = CURRENCIES.map((currency) => currency.code);

export function getCurrency(code: CurrencyCode): CurrencyInfo {
  return CURRENCIES.find((currency) => currency.code === code) ?? CURRENCIES[0];
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && CURRENCY_CODES.includes(value as CurrencyCode);
}
