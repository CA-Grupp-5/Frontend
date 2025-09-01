import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors from '@/constants/Colors';

// Render a white icon on top of a tinted circular background when focused
function CircleTabIcon({ name, focused, tint, inactive }: { name: React.ComponentProps<typeof FontAwesome>['name']; focused: boolean; tint: string; inactive: string }) {
  if (focused) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', transform: [{ translateY: -10 }] }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: tint,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FontAwesome name={name} size={20} color={'hsl(0, 0%, 100%)'} />
        </View>
        
      </View>
    );
  }
  return <FontAwesome name={name} size={22} color={inactive} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[scheme].tint,
        tabBarInactiveTintColor: Colors[scheme].tabIconDefault,
        tabBarStyle: {
          backgroundColor: Colors[scheme].tabBarBackground,
          borderTopColor: Colors[scheme].tabBarBorder,
        },
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
                    color={Colors[scheme].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          tabBarIcon: ({ focused, color }) => (
            <CircleTabIcon name="home" focused={focused} tint={Colors[scheme].tint} inactive={Colors[scheme].tabIconDefault} />
          ),
          title: 'Home',
        }}
      />
      
      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <CircleTabIcon name="map-o" focused={focused} tint={Colors[scheme].tint} inactive={Colors[scheme].tabIconDefault} />
          ),
          title: 'Map',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <CircleTabIcon name="cog" focused={focused} tint={Colors[scheme].tint} inactive={Colors[scheme].tabIconDefault} />
          ),
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
