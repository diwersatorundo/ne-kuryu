export type CurrencyCode =
  | 'RUB'
  | 'USD'
  | 'EUR'
  | 'KZT'
  | 'BYN'
  | 'UAH'
  | 'GEL'
  | 'AMD';

export type ProductType =
  | 'cigarettes'
  | 'prefilledPods'
  | 'refillablePods'
  | 'disposables'
  | 'refillableVapes'
  | 'heatedTobacco';

export interface CigarettesConfig {
  type: 'cigarettes';
  cigarettesPerDay?: number;
  cigarettesPerPack?: number;
  pricePerPack?: number;
  tarMgPerCigarette?: number;
}

export interface PrefilledPodsConfig {
  type: 'prefilledPods';
  podsPerWeek?: number;
  pricePerPod?: number;
  podVolumeMl?: number;
}

export interface RefillablePodsConfig {
  type: 'refillablePods';
  liquidMlPerDay?: number;
  bottlePrice?: number;
  bottleVolumeMl?: number;
  podPrice?: number;
  podChangeIntervalDays?: number;
}

export interface DisposablesConfig {
  type: 'disposables';
  devicesPerWeek?: number;
  pricePerDevice?: number;
  liquidMlPerDevice?: number;
}

export interface RefillableVapesConfig {
  type: 'refillableVapes';
  liquidMlPerDay?: number;
  bottlePrice?: number;
  bottleVolumeMl?: number;
  consumablesCostPerWeek?: number;
}

export interface HeatedTobaccoConfig {
  type: 'heatedTobacco';
  sticksPerDay?: number;
  sticksPerPack?: number;
  pricePerPack?: number;
}

export type ProductConfig =
  | CigarettesConfig
  | PrefilledPodsConfig
  | RefillablePodsConfig
  | DisposablesConfig
  | RefillableVapesConfig
  | HeatedTobaccoConfig;

export type ProductConfigMap = Partial<Record<ProductType, ProductConfig>>;

export interface Profile {
  schemaVersion: 1;
  name: string;
  quitAt: string;
  currency: CurrencyCode;
  products: ProductConfig[];
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileDraft {
  name: string;
  quitAt: Date;
  currency: CurrencyCode;
  products: ProductConfigMap;
}
