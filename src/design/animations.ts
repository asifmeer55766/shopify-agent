/**
 * Micro-animations and transition configurations
 */

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '350ms cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const keyframes = {
  pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  shimmer: 'shimmer 2s infinite linear',
  bounceSubtle: 'bounceSubtle 1.5s infinite ease-in-out',
} as const;
