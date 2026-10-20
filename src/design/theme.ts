/**
 * Theme configuration and mode definitions
 */

export type ThemeMode = 'dark' | 'light' | 'system';

export const defaultTheme: ThemeMode = 'dark';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  primary: string;
  primaryForeground: string;
  accent: string;
  muted: string;
  mutedForeground: string;
}
