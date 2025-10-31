import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, TouchableOpacity, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';

import ToggleTheme from '@/components/ToggleTheme';
import Colors, { Palette } from '@/constants/Colors';
import { useSettingsStore } from '@/stores/settingsStore';

export default function TabTwoScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const logout = useAuthStore(state => state.logout);
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const mapStyle = useSettingsStore((s) => s.mapStyle);
  const setMapStyle = useSettingsStore((s) => s.setMapStyle);
  const scannerVibrateOnScan = useSettingsStore((s) => s.scannerVibrateOnScan);
  const setScannerVibrateOnScan = useSettingsStore((s) => s.setScannerVibrateOnScan);

  return (
    // try gray or stone or zinc 200 
    <SafeAreaView className="flex-1 pt-2 items-center justify-start bg-gray-200 dark:bg-black">
      <Text className="text-xl font-bold text-dark dark:text-white">Settings</Text>
      {/* THEME SETTINGS */}
      <View className="flex w-full items-center justify-center my-8" style={{ gap: 2 }}>
        <Text className="w-5/6 text-lg text-start text-dark dark:text-neutral-200 mb-4">Appearance</Text>
        <ToggleTheme colorScheme={colorScheme || 'dark'} setColorScheme={setColorScheme} theme="light" />
        <ToggleTheme colorScheme={colorScheme || 'dark'} setColorScheme={setColorScheme} theme="dark" />
      </View>

      {/* MAP SETTINGS */}
      <View className="flex w-full items-center justify-center my-8" style={{ gap: 2 }}>
        <Text className="w-5/6 text-lg text-start text-dark dark:text-neutral-200 mb-4">Map</Text>
        <RadioRow
          label="Light"
          selected={mapStyle === 'light'}
          onPress={() => setMapStyle('light')}
          isFirst
          theme={theme}
        />
        <RadioRow label="Dark" selected={mapStyle === 'dark'} onPress={() => setMapStyle('dark')} theme={theme} />
        <RadioRow
          label="Satellite"
          selected={mapStyle === 'satellite'}
          onPress={() => setMapStyle('satellite')}
          isLast
          theme={theme}
        />
      </View>

      {/* SCANNER SETTINGS */}
      <View className="flex w-full items-center justify-center my-8" style={{ gap: 2 }}>
        <Text className="w-5/6 text-lg text-start text-dark dark:text-neutral-200 mb-4">Scanner</Text>
        <SwitchRow
          label="Vibrate on scan"
          value={scannerVibrateOnScan}
          onValueChange={setScannerVibrateOnScan}
          isFirst
          isLast
          theme={theme}
          
        />
      </View>

      {/* Basic red logout button for testing */}
      <TouchableOpacity
        className="mt-6 bg-red-600 px-8 py-3 flex-row items-center justify-center rounded-xl"
        onPress={() => logout()}
        accessibilityLabel="Logout"
      >
        <FontAwesome name="sign-out" size={18} color="#fff" style={{ marginRight: 8 }} />
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>

      <StatusBar style={'auto'} />
    </SafeAreaView>
  );
}

function RadioRow({
  label,
  selected,
  onPress,
  isFirst,
  isLast,
  theme,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  theme: 'light' | 'dark';
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        alignItems: 'center',
        backgroundColor: Colors[theme].surface,
        flexDirection: 'row',
        height: 56,
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        width: '83.33%',
        borderTopLeftRadius: isFirst ? 20 : 0,
        borderTopRightRadius: isFirst ? 20 : 0,
        borderBottomLeftRadius: isLast ? 20 : 0,
        borderBottomRightRadius: isLast ? 20 : 0,
      }}
    >
      <Text style={{ fontSize: 18, color: Colors[theme].text }}>{label}</Text>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 24,
          width: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: selected ? Palette.tint : Colors[theme].border,
          backgroundColor: 'transparent',
        }}
      >
        {selected ? <View style={{ height: 10, width: 10, borderRadius: 6, backgroundColor: Palette.tint }} /> : null}
      </View>
    </Pressable>
  );
}

function SwitchRow({
  label,
  value,
  onValueChange,
  isFirst,
  isLast,
  theme,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isFirst?: boolean;
  isLast?: boolean;
  theme: 'light' | 'dark';
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: Colors[theme].surface,
        flexDirection: 'row',
        height: 56,
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        width: '83.33%',
        borderTopLeftRadius: isFirst ? 20 : 0,
        borderTopRightRadius: isFirst ? 20 : 0,
        borderBottomLeftRadius: isLast ? 20 : 0,
        borderBottomRightRadius: isLast ? 20 : 0,
      }}
    >
      <Text style={{ fontSize: 18, color: Colors[theme].text }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors[theme].border, true: Colors[theme].tint }}
        thumbColor= {Palette.white}
      />
    </View>
  );
}
