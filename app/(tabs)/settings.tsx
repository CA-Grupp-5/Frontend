import { useColorScheme } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';

import ToggleTheme from '@/components/ToggleTheme';

export default function TabTwoScreen() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const logout = useAuthStore((state) => state.logout);

  return (
    <SafeAreaView className="flex-1 pt-2 items-center justify-start bg-white dark:bg-black">
      <Text className="text-xl font-bold text-dark dark:text-white">Settings</Text>
      {/* THEME SETTINGS */}
      <View className="flex w-full items-center justify-center my-10" style={{ gap: 2 }}>
        <Text className="w-5/6 text-lg text-start text-dark dark:text-neutral-200 mb-4">Theme Settings</Text>
        <ToggleTheme colorScheme={colorScheme || 'dark'} setColorScheme={setColorScheme} theme="light" />
        <ToggleTheme colorScheme={colorScheme || 'dark'} setColorScheme={setColorScheme} theme="dark" />
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

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </SafeAreaView>
  );
}
