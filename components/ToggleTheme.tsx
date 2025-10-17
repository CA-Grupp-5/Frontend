/* global ColorSchemeSystem:false */
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View, StyleSheet } from 'react-native';

import Colors, { Palette } from '@/constants/Colors';
import { capitalizeFirstLetter } from '@/lib/utils';

interface Props {
  theme: 'light' | 'dark';
  colorScheme: ColorSchemeSystem;
  setColorScheme: (colorSchemeSystem: ColorSchemeSystem) => void;
}

export default function ToggleTheme({ colorScheme, setColorScheme, theme }: Props) {
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const selected = colorScheme === theme;
  const styles = getStyles(scheme, theme, selected);

  return (
    <Pressable
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={`Set theme to ${theme}`}
      accessibilityState={{ selected }}
      hitSlop={10}
      onPress={async () => {
        setColorScheme(theme as 'light' | 'dark' | 'system');
      }}
    >
      <View style={styles.leftWrap}>
        <MaterialIcons name={theme === 'dark' ? 'dark-mode' : 'light-mode'} size={20} color={Colors[scheme].text} />
        <Text style={styles.label}>{capitalizeFirstLetter(theme)}</Text>
      </View>
      <View style={styles.checkbox}>
        {selected && <View style={styles.checkboxDot} />}
      </View>
    </Pressable>
  );
}

function getStyles(
  scheme: 'light' | 'dark',
  theme: 'light' | 'dark',
  selected: boolean,
) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: Colors[scheme].surface,
      flexDirection: 'row',
      height: 56, // h-14
      justifyContent: 'space-between',
      paddingHorizontal: 32, // px-8
      width: '83.33%', // w-5/6
      ...(theme === 'light'
        ? { borderTopLeftRadius: 20, borderTopRightRadius: 20 }
        : { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }),
    },
    leftWrap: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      fontSize: 18,
      color: Colors[scheme].text,
      marginLeft: 15, 
    },
    checkbox: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: selected ? Palette.tint : Colors[scheme].border,
      backgroundColor: 'transparent',
    },
    checkboxDot: {
      height: 10,
      width: 10,
      borderRadius: 6,
      backgroundColor: Palette.tint,
    },
  });
}
