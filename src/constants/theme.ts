export const colors = {
  background: '#030404',
  backgroundDeep: '#000000',
  backgroundElevated: '#0B0D0C',
  surface: 'rgba(255, 255, 255, 0.055)',
  surfaceRaised: 'rgba(255, 255, 255, 0.09)',
  surfacePressed: 'rgba(255, 255, 255, 0.13)',
  surfaceSolid: '#121513',
  surfaceSolidRaised: '#191D1B',
  text: '#F4F7F5',
  textSecondary: '#B8C0BB',
  textMuted: '#A4ACA7',
  accent: '#8AF0C4',
  accentStrong: '#5EE0AC',
  accentInk: '#04120C',
  accentSoft: 'rgba(138, 240, 196, 0.12)',
  accentGlow: 'rgba(138, 240, 196, 0.24)',
  violet: '#AAA3C7',
  violetSoft: 'rgba(170, 163, 199, 0.12)',
  violetGlow: 'rgba(170, 163, 199, 0.2)',
  warning: '#FFC978',
  warningSoft: 'rgba(255, 201, 120, 0.12)',
  danger: '#FF9A9A',
  dangerSoft: 'rgba(255, 130, 130, 0.12)',
  border: 'rgba(255, 255, 255, 0.09)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',
  accentBorder: 'rgba(138, 240, 196, 0.24)',
  dangerBorder: 'rgba(255, 154, 154, 0.26)',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.78)',
} as const;

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  full: 999,
} as const;

export const typography = {
  hero: {
    fontSize: 88,
    lineHeight: 92,
    fontWeight: '700',
    letterSpacing: -4.4,
  },
  display: {
    fontSize: 64,
    lineHeight: 70,
    fontWeight: '700',
    letterSpacing: -2.8,
  },
  h1: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.9,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  h3: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '500',
  },
  small: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '400',
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
} as const;

export const gradients = {
  screen: ['#111512', '#060807', '#020303'] as const,
  glass: [
    'rgba(255, 255, 255, 0.075)',
    'rgba(255, 255, 255, 0.025)',
  ] as const,
  glassRaised: [
    'rgba(255, 255, 255, 0.11)',
    'rgba(255, 255, 255, 0.04)',
  ] as const,
  accent: ['#9BF7D0', '#5EDFC0'] as const,
  accentDeep: [
    'rgba(138, 240, 196, 0.13)',
    'rgba(138, 240, 196, 0.035)',
  ] as const,
  money: ['#FFE0AE', '#F2B878'] as const,
  violet: [
    'rgba(170, 163, 199, 0.13)',
    'rgba(170, 163, 199, 0.035)',
  ] as const,
  danger: [
    'rgba(255, 150, 150, 0.13)',
    'rgba(255, 150, 150, 0.035)',
  ] as const,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 3,
  },
  floating: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.32,
    shadowRadius: 24,
    elevation: 10,
  },
  glow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  modal: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 24,
  },
} as const;
