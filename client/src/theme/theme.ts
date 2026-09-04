export interface AppThemeColors {
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceHover: string;
  surfaceLight: string;
  surfaceBorder: string;
  surfaceBorderFocus: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBorder: string;
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  secondaryBorder: string;
  success: string;
  successLight: string;
  successBorder: string;
  danger: string;
  dangerHover: string;
  dangerLight: string;
  dangerBorder: string;
  warning: string;
  warningLight: string;
  warningBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textDim: string;
  white: string;
}

export interface AppTheme {
  mode: 'light' | 'dark';
  colors: AppThemeColors;
  space: number[];
  fonts: {
    body: string;
    heading: string;
    mono: string;
  };
  fontSizes: number[];
  fontWeights: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeights: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  radii: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    card: string;
  };
  breakpoints: string[];
}

const sharedDesignTokens = {
  space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
  fonts: {
    body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'Fira Code', monospace",
  },
  fontSizes: [11, 13, 14, 15, 16, 18, 20, 24, 28, 32, 40],
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.7,
  },
  radii: {
    none: '0',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
  breakpoints: ['576px', '768px', '992px', '1200px'],
};

export const lightTheme: AppTheme = {
  mode: 'light',
  ...sharedDesignTokens,
  colors: {
    // Bright Daylight Studio Palette with Crimson Accents
    background: '#FAF8F5',
    backgroundAlt: '#F3EFEA',
    surface: '#FFFFFF',
    surfaceHover: '#F7F4F0',
    surfaceLight: '#F3EFEA',
    surfaceBorder: '#E6E0D8',
    surfaceBorderFocus: '#D91C2E',

    // Primary Brand Accent: Crimson Ruby
    primary: '#D91C2E',
    primaryHover: '#B81524',
    primaryLight: 'rgba(217, 28, 46, 0.08)',
    primaryBorder: 'rgba(217, 28, 46, 0.28)',

    // Secondary Brand Accent: Deep Garnet
    secondary: '#B81524',
    secondaryHover: '#9B101E',
    secondaryLight: 'rgba(184, 21, 36, 0.1)',
    secondaryBorder: 'rgba(184, 21, 36, 0.3)',

    success: '#059669',
    successLight: 'rgba(5, 150, 105, 0.1)',
    successBorder: 'rgba(5, 150, 105, 0.25)',

    danger: '#E52B3C',
    dangerHover: '#D91C2E',
    dangerLight: 'rgba(229, 43, 60, 0.1)',
    dangerBorder: 'rgba(229, 43, 60, 0.25)',

    warning: '#D97706',
    warningLight: 'rgba(217, 119, 6, 0.12)',
    warningBorder: 'rgba(217, 119, 6, 0.25)',

    text: '#18181B',
    textSecondary: '#52525B',
    textMuted: '#A1A1AA',
    textDim: '#D4D4D8',
    white: '#FFFFFF',
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 16px rgba(217, 28, 46, 0.08)',
    lg: '0 12px 36px rgba(0, 0, 0, 0.12), 0 0 28px rgba(217, 28, 46, 0.12)',
    card: '0 2px 10px rgba(0, 0, 0, 0.05)',
  },
};

export const darkTheme: AppTheme = {
  mode: 'dark',
  ...sharedDesignTokens,
  colors: {
    // Deep Studio Obsidian Carbon & Glowing Crimson Ruby Red
    background: '#060709',
    backgroundAlt: '#0D0E12',
    surface: '#0E1015',
    surfaceHover: '#161922',
    surfaceLight: '#13161F',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    surfaceBorderFocus: '#D91C2E',

    // Primary Brand Accent: Radiant Crimson Ruby Red
    primary: '#D91C2E',
    primaryHover: '#E52B3C',
    primaryLight: 'rgba(217, 28, 46, 0.15)',
    primaryBorder: 'rgba(217, 28, 46, 0.45)',

    // Secondary Brand Accent: Deep Ruby Garnet
    secondary: '#B81524',
    secondaryHover: '#9B101E',
    secondaryLight: 'rgba(184, 21, 36, 0.22)',
    secondaryBorder: 'rgba(229, 43, 60, 0.45)',

    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.15)',
    successBorder: 'rgba(16, 185, 129, 0.3)',

    danger: '#E52B3C',
    dangerHover: '#D91C2E',
    dangerLight: 'rgba(229, 43, 60, 0.15)',
    dangerBorder: 'rgba(229, 43, 60, 0.35)',

    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    warningBorder: 'rgba(245, 158, 11, 0.3)',

    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.65)',
    textMuted: 'rgba(255, 255, 255, 0.4)',
    textDim: 'rgba(255, 255, 255, 0.2)',
    white: '#FFFFFF',
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.6)',
    md: '0 4px 20px rgba(0, 0, 0, 0.7), 0 0 16px rgba(217, 28, 46, 0.2)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.9), 0 0 32px rgba(217, 28, 46, 0.3)',
    card: '0 4px 14px rgba(0, 0, 0, 0.6)',
  },
};

export const theme = darkTheme;
