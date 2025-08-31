const tintColor = 'hsl(200, 90%, 55%)'; // Approximate of oklch(0.65 0.15 195)

export type ThemeName = 'light' | 'dark';

const Colors: Record<ThemeName, {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  tabBarBackground: string;
  tabBarBorder: string;
}> = {
  light: {
    text: '#111827',
    background: '#ffffff',
    tint: tintColor,
    tabIconDefault: '#9ca3af',
    tabIconSelected: tintColor,
    tabBarBackground: '#ffffff',
    tabBarBorder: '#e5e7eb',
  },
  dark: {
    text: '#f9fafb',
    background: '#000000',
    tint: tintColor,
    tabIconDefault: '#6b7280',
    tabIconSelected: tintColor,
    tabBarBackground: '#0b1220',
    tabBarBorder: '#0f172a',
  },
};

export default Colors;
