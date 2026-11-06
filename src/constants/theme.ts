export const colors = {
  background: '#0B0D0C',
  backgroundElevated: '#101311',
  surface: '#141816',
  surfaceRaised: '#1A1F1C',
  surfacePressed: '#202621',
  border: '#272D29',
  borderStrong: '#343B36',
  text: '#F2F5F3',
  textSecondary: '#A9B2AC',
  textMuted: '#7C867F',
  accent: '#92D9B5',
  accentStrong: '#6DC79F',
  accentInk: '#07130D',
  accentSoft: '#16261E',
  accentBorder: '#2E4A3C',
  warning: '#E5C180',
  warningSoft: '#2A2418',
  danger: '#EF9292',
  dangerSoft: '#2A1717',
  dangerBorder: '#4A2A2A',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.68)',
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
} as const;

export const radius = {
  xs: 4,
  sm: 5,
  md: 7,
  lg: 8,
  xl: 10,
  full: 999,
} as const;

export const typography = {
  display: {
    fontSize: 64,
    lineHeight: 68,
    fontWeight: '700',
    letterSpacing: -2.5,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  small: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
} as const;

export const shadows = {
  modal: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 18,
  },
} as const;
