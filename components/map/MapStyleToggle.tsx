import React from 'react';
import { Pressable, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'nativewind';
import Colors, { Palette } from '@/constants/Colors';

interface Props {
  label: string;
  tint: string;
  onPress: () => void;
}

export default function MapStyleToggle({ label, tint, onPress }: Props) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme ?? 'light';
  const isDark = theme === 'dark';
  const iconColor = isDark ? tint : ('hsl(220, 18%, 22%)' as any);

  return (
    <View style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 10 }} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Map style: ${label}`}
        hitSlop={10}
        // intentionally kept as inline style, no noticeable performance drop
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 22,
          backgroundColor: isDark ? Palette.darkCardBg : Palette.lightCardBg,
          borderWidth: 1,
          borderColor: Colors[theme].tabBarBorder,
          gap: 8,
          shadowColor: Palette.black,
          shadowOpacity: 0.15,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        }}
      >
        <FontAwesome name="map" size={16} color={iconColor} />
        <Text style={{ color: Colors[theme].text, fontWeight: '600' }}>{label}</Text>
      </Pressable>
    </View>
  );
}
