/**
 * Design Tokens for StorePilot AI
 * Consistent design language for colors, spacing, shadows, and radii.
 */

export const colors = {
  // Brand Primary (Sophisticated Emerald/Teal for commerce & finance)
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  // Accent AI Electric Indigo
  accent: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  // Status Colors for Financial Health & Alerts
  status: {
    profit: '#10b981', // Positive margins, profitable products
    loss: '#ef4444',   // Negative margins, high refund risk
    warning: '#f59e0b',// Stockout danger, high discount erosion
    neutral: '#6b7280',// Informational
    info: '#3b82f6',   // AI Agent findings
  },
  // Dark Mode Glass & Canvas
  dark: {
    bg: '#090d16',
    surface: '#0f172a',
    surfaceElevated: '#1e293b',
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.16)',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
  },
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  glow: '0 0 25px -5px rgba(99, 102, 241, 0.25)',
  glowEmerald: '0 0 25px -5px rgba(16, 185, 129, 0.25)',
} as const;

export const radii = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;
