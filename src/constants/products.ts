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
    accent: '#F5C47C',
    accentSoft: 'rgba(245, 196, 124, 0.14)',
  },
  prefilledPods: {
    type: 'prefilledPods',
    title: 'POD-картриджи',
    shortTitle: 'POD-картриджи',
    description: 'Предзаправленные картриджи',
    icon: Package,
    accent: '#7CD8F0',
    accentSoft: 'rgba(124, 216, 240, 0.14)',
  },
  refillablePods: {
    type: 'refillablePods',
    title: 'POD-системы',
    shortTitle: 'POD-системы',
    description: 'Перезаправляемые POD-системы',
    icon: Droplets,
    accent: '#A9A0FF',
    accentSoft: 'rgba(169, 160, 255, 0.14)',
  },
  disposables: {
    type: 'disposables',
    title: 'Одноразовые электронки',
    shortTitle: 'Одноразки',
    description: 'Готовые одноразовые устройства',
    icon: Zap,
    accent: '#FF9E9E',
    accentSoft: 'rgba(255, 158, 158, 0.14)',
  },
  refillableVapes: {
    type: 'refillableVapes',
    title: 'Электронки и вейпы',
    shortTitle: 'Вейпы',
    description: 'Перезаправляемые устройства',
    icon: Wind,
    accent: '#8AF0C4',
    accentSoft: 'rgba(138, 240, 196, 0.14)',
  },
  heatedTobacco: {
    type: 'heatedTobacco',
    title: 'Нагревание табака',
    shortTitle: 'Нагревание табака',
    description: 'Системы нагревания табака',
    icon: Flame,
    accent: '#F0B58A',
    accentSoft: 'rgba(240, 181, 138, 0.14)',
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
