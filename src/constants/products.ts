import {
  Cigarette,
  Droplets,
  Flame,
  Package,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import {
  ProductConfig,
  ProductConfigMap,
  ProductType,
} from '../types/profile';
import { PRODUCT_ORDER } from './productTypes';

export { PRODUCT_ORDER, isProductType } from './productTypes';

export interface ProductInfo {
  type: ProductType;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  accentSoft: string;
}

export const PRODUCTS: Record<ProductType, ProductInfo> = {
  cigarettes: {
    type: 'cigarettes',
    title: 'Обычные сигареты',
    shortTitle: 'Сигареты',
    description: 'Сигареты в пачках',
    icon: Cigarette,
    accent: '#E3B878',
    accentSoft: '#272116',
  },
  prefilledPods: {
    type: 'prefilledPods',
    title: 'POD-картриджи',
    shortTitle: 'POD-картриджи',
    description: 'Предзаправленные картриджи',
    icon: Package,
    accent: '#8CC9E8',
    accentSoft: '#17242A',
  },
  refillablePods: {
    type: 'refillablePods',
    title: 'POD-системы',
    shortTitle: 'POD-системы',
    description: 'Перезаправляемые POD-системы',
    icon: Droplets,
    accent: '#AAB7F2',
    accentSoft: '#1E2030',
  },
  disposables: {
    type: 'disposables',
    title: 'Одноразовые электронки',
    shortTitle: 'Одноразки',
    description: 'Готовые одноразовые устройства',
    icon: Zap,
    accent: '#EAA4A4',
    accentSoft: '#2B1D1D',
  },
  refillableVapes: {
    type: 'refillableVapes',
    title: 'Электронки и вейпы',
    shortTitle: 'Вейпы',
    description: 'Перезаправляемые устройства',
    icon: Wind,
    accent: '#9DD9A9',
    accentSoft: '#1B261E',
  },
  heatedTobacco: {
    type: 'heatedTobacco',
    title: 'Нагревание табака',
    shortTitle: 'Нагревание табака',
    description: 'Системы нагревания табака',
    icon: Flame,
    accent: '#E9B78E',
    accentSoft: '#2A2119',
  },
};

export function createEmptyProductConfig(type: ProductType): ProductConfig {
  switch (type) {
    case 'cigarettes':
      return { type };
    case 'prefilledPods':
      return { type };
    case 'refillablePods':
      return { type };
    case 'disposables':
      return { type };
    case 'refillableVapes':
      return { type };
    case 'heatedTobacco':
      return { type };
  }
}

export function getOrderedConfigs(map: ProductConfigMap): ProductConfig[] {
  return PRODUCT_ORDER.flatMap((type) => {
    const config = map[type];
    return config ? [config] : [];
  });
}
