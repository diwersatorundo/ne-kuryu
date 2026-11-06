export const colors = {
  background: '#000000',
  backgroundDeep: '#000000',
  backgroundElevated: '#000000',
  surface: 'rgba(255, 255, 255, 0.055)',
  surfaceRaised: 'rgba(255, 255, 255, 0.09)',
  surfacePressed: 'rgba(255, 255, 255, 0.13)',
  surfaceSolid: '#12161D',
  surfaceSolidRaised: '#181E27',
  text: '#F4F7FB',
  textSecondary: '#B3BDCA',
  textMuted: '#7C8797',
  accent: '#8AF0C4',
  accentStrong: '#5EE0AC',
  accentInk: '#04120C',
  accentSoft: 'rgba(138, 240, 196, 0.14)',
  accentGlow: 'rgba(138, 240, 196, 0.32)',
  violet: '#9C8CFF',
  violetSoft: 'rgba(156, 140, 255, 0.15)',
  violetGlow: 'rgba(156, 140, 255, 0.28)',
  warning: '#FFC978',
  warningSoft: 'rgba(255, 201, 120, 0.14)',
  danger: '#FF9A9A',
  dangerSoft: 'rgba(255, 130, 130, 0.14)',
  border: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',
  accentBorder: 'rgba(138, 240, 196, 0.28)',
  dangerBorder: 'rgba(255, 154, 154, 0.28)',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(3, 5, 8, 0.74)',
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
  sm: 8,
  md: 10,
  lg: 12,
  xl: 12,
  xxl: 16,
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
  screen: ['#000000', '#000000', '#000000'] as const,
  glass: [
    'rgba(94, 132, 216, 0.16)',
    'rgba(94, 132, 216, 0.05)',
  ] as const,
  glassRaised: [
    'rgba(94, 132, 216, 0.24)',
    'rgba(94, 132, 216, 0.08)',
  ] as const,
  accent: ['#9BF7D0', '#5EDFC0'] as const,
  accentDeep: ['rgba(138, 240, 196, 0.22)', 'rgba(138, 240, 196, 0.05)'] as const,
  money: ['#FFE0AE', '#F2B878'] as const,
  violet: ['rgba(156, 140, 255, 0.22)', 'rgba(156, 140, 255, 0.05)'] as const,
  danger: ['rgba(255, 150, 150, 0.22)', 'rgba(255, 150, 150, 0.05)'] as const,
} as const;

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 5,
  },
  floating: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.42,
    shadowRadius: 30,
    elevation: 14,
  },
  glow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
  modal: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 24,
  },
} as const;
