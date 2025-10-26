import { useColorScheme } from 'nativewind';
import Colors, { Palette } from '@/constants/Colors';

type ThemeScheme = 'light' | 'dark';

export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  const scheme = (colorScheme ?? 'light') as ThemeScheme;

  return {
    scheme,
    colors: Colors[scheme],
    palette: Palette,
  };
}

export type ThemeColors = ReturnType<typeof useThemeColors>;
