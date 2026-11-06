import { ProductType } from '../types/profile';

export const PRODUCT_ORDER: ProductType[] = [
  'cigarettes',
  'prefilledPods',
  'refillablePods',
  'disposables',
  'refillableVapes',
  'heatedTobacco',
];

export function isProductType(value: unknown): value is ProductType {
  return typeof value === 'string' && PRODUCT_ORDER.includes(value as ProductType);
}
