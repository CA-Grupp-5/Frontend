// const tintColor = 'hsl(200, 90%, 55%)'; //old lighter version
const tintColor = 'hsl(200, 90%, 50%)';
// const tintColor = '#169ED4'; 
// const tintColor = 'hsl(197, 90%, 46%)'; 
// const tintColor = 'hsl(197, 82%, 43%)'; 

export type ThemeName = 'light' | 'dark';

// Centralized palette (HSL) to avoid scattered literals in components
export const Palette = {
  // Base
  white: 'hsl(0, 0%, 100%)',
  black: 'hsl(0, 0%, 0%)',

  // App-specific tint
  tint: tintColor,

  // Grays used throughout components (HSL equivalents of existing hex values)
  gray50: 'hsl(210, 20%, 98%)',   // #f9fafb
  gray900: 'hsl(221, 39%, 11%)', // #111827
  gray700: 'hsl(217, 19%, 27%)', // #374151
  gray600: 'hsl(215, 14%, 34%)', // #4b5563
  gray500: 'hsl(220, 9%, 46%)',  // #6b7280
  gray400: 'hsl(218, 11%, 65%)', // #9ca3af
  gray300: 'hsl(216, 12%, 84%)', // #d1d5db
  gray200: 'hsl(220, 13%, 91%)', // #e5e7eb

  // Card backgrounds used in DriverSheet
  darkCardBg: 'hsl(219, 30%, 15%)', // #1b2332
  lightCardBg: 'hsl(220, 15%, 96%)', // #f3f4f6

  // Accents
  amber500: 'hsl(38, 92%, 50%)', // #f59e0b

  // Status (used across multiple components)
  success: 'hsl(142, 71%, 45%)',
  destructive: 'hsl(0, 84%, 60%)',

  // Overlay
  backdropOverlay: 'hsla(0, 0%, 0%, 0.5)', // rgba(0,0,0,0.5)

  // Neutral
  neutral800: 'hsl(0, 0%, 20%)', // #333333

  // Navigation surfaces (dark)
  darkTabBg: 'hsl(221, 49%, 8%)',     // #0b1220
  darkTabBorder: 'hsl(222, 47%, 11%)', // #0f172a
} as const;

interface ThemeColors  {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
  tabBarBackground: string;
  tabBarBorder: string;
  // Common semantics used in multiple places
  mutedText: string; // subdued text (labels, hints)
  border: string;    // card borders
  divider: string;   // list row separators
  surface: string;   // card surfaces
  inputBackground: string; // inputs and similar fields
}
// Mapping of theme names to colors to avoid calculating colors in the individual components
const Colors: Record<ThemeName, ThemeColors>= {
  light: {
    text: Palette.gray900,
    background: Palette.white,
    tint: tintColor,
    tabIconDefault: Palette.gray400,
    tabIconSelected: tintColor,
    tabBarBackground: Palette.white,
    tabBarBorder: Palette.gray200,
    mutedText: Palette.gray600,
    border: Palette.gray200,
    divider: Palette.gray200,
    surface: Palette.lightCardBg,
    inputBackground: Palette.gray200,
  },
  dark: {
    text: Palette.gray50,
    background: Palette.black,
    tint: tintColor,
    tabIconDefault: Palette.gray500,
    tabIconSelected: tintColor,
    tabBarBackground: Palette.darkTabBg,
    tabBarBorder: Palette.darkTabBorder,
    mutedText: Palette.gray400,
    border: Palette.gray700,
    divider: Palette.gray700,
    surface: Palette.darkCardBg,
    inputBackground: Palette.gray600,
  },
};

export default Colors;
