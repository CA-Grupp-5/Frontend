import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/constants/Colors';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].tabBarBackground,
          borderTopColor: Colors[colorScheme ?? 'light'].tabBarBorder,
        },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          title: 'Home',
        }}
      />
      
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="map-o" color={color} />,
          title: 'Map',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
