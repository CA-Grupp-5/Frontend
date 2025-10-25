import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, Text, View, Linking, type ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors, { Palette } from '@/constants/Colors';
import { useColorScheme } from 'nativewind';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export interface DriverInfo {
  name: string;
  rating: number;
  role: string;
  photo: ImageSourcePropType;
  eta: string;
  progress: number; // 0-100
};

export default function DriverSheet({ visible, onClose, driver, onOpenPackages }: { visible: boolean; onClose: () => void; driver: DriverInfo; onOpenPackages?: () => void }) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'dark';
  const [open, setOpen] = useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setOpen(true);
      Animated.timing(translateY, { toValue: 0, duration: 240, useNativeDriver: true }).start();
    } else {
      Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setOpen(false);
      });
    }
  }, [visible, translateY]);

const cardBg = useMemo(() => Colors[scheme].surface, [scheme]);
  const text = Colors[scheme].text;
  const tint = Colors[scheme].tint;

  if (!open) return null;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
      {/* Backdrop */}
<Pressable onPress={onClose} style={{ flex: 1, backgroundColor: Palette.backdropOverlay }} />

      {/* Sheet */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY }],
        }}
      >
        <SafeAreaView
          edges={['bottom']}
          style={{
            backgroundColor: Colors[scheme].tabBarBackground,
            paddingHorizontal: 16,
            paddingTop: 8,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: scheme === 'light' ? 1 : 0,
            borderColor: Colors[scheme].tabBarBorder,
            shadowColor: scheme === 'light' ? '#000' : undefined,
            shadowOpacity: scheme === 'light' ? 0.06 : 0,
            shadowRadius: scheme === 'light' ? 12 : 0,
            shadowOffset: scheme === 'light' ? { width: 0, height: -2 } as any : undefined,
          }}
        >
          {/* Grabber */}
          <View style={{ alignItems: 'center', paddingBottom: 8 }}>
            <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: Colors[scheme].divider }} />
          </View>

          {/* Driver header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, overflow: 'hidden', borderWidth: 2, borderColor: tint }}>
              <Image source={driver.photo} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: text, fontSize: 18, fontWeight: '700' }}>{driver.name}</Text>
              <Text style={{ color: Colors[scheme].mutedText }}>{driver.role}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
<FontAwesome key={i} name="star" size={12} color={i < Math.floor(driver.rating) ? Palette.amber500 : Palette.gray600} style={{ marginRight: 2 }} />
                ))}
                <Text style={{ marginLeft: 6, color: Colors[scheme].mutedText, fontSize: 12 }}>{driver.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{
              flex: 1,
              backgroundColor: cardBg,
              borderRadius: 16,
              padding: 16,
              borderWidth: scheme === 'light' ? 1 : 0,
              borderColor: Colors[scheme].border,
              shadowColor: scheme === 'light' ? '#000' : undefined,
              shadowOpacity: scheme === 'light' ? 0.04 : 0,
              shadowRadius: scheme === 'light' ? 6 : 0,
              shadowOffset: scheme === 'light' ? { width: 0, height: 2 } as any : undefined,
            }}>
              <View style={{ alignItems: 'center', gap: 8 }}>
                <FontAwesome name="clock-o" size={20} color={tint} />
                <Text style={{ color: Colors[scheme].text, fontSize: 22, fontWeight: '800' }}>{driver.eta}</Text>
                <Text style={{ color: Colors[scheme].mutedText, fontSize: 12 }}>ETA</Text>
              </View>
            </View>
            <View style={{
              flex: 1,
              backgroundColor: cardBg,
              borderRadius: 16,
              padding: 16,
              borderWidth: scheme === 'light' ? 1 : 0,
              borderColor: Colors[scheme].border,
              shadowColor: scheme === 'light' ? '#000' : undefined,
              shadowOpacity: scheme === 'light' ? 0.04 : 0,
              shadowRadius: scheme === 'light' ? 6 : 0,
              shadowOffset: scheme === 'light' ? { width: 0, height: 2 } as any : undefined,
            }}>
              <View style={{ alignItems: 'center', gap: 8 }}>
                <FontAwesome name="paper-plane" size={20} color={tint} />
                <Text style={{ color: Colors[scheme].text, fontSize: 22, fontWeight: '800' }}>{driver.progress}%</Text>
                <Text style={{ color: Colors[scheme].mutedText, fontSize: 12 }}>Complete</Text>
              </View>
            </View>
          </View>

          {/* Call button: outline (dark) vs filled (light) */}
          <Pressable
            onPress={() => {
              Linking.openURL('tel:+15555550123');//remember to change this to real phone number when we have it
            }}
            accessibilityRole="button"
            accessibilityLabel="Call driver"
            hitSlop={10}
            style={{
              borderWidth: scheme === 'light' ? 0 : 1,
              borderColor: tint,
              backgroundColor: scheme === 'light' ? Palette.highContrastTint : undefined,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 8,
              shadowColor: scheme === 'light' ? '#000' : undefined,
              shadowOpacity: scheme === 'light' ? 0.08 : 0,
              shadowRadius: scheme === 'light' ? 8 : 0,
              shadowOffset: scheme === 'light' ? { width: 0, height: 2 } as any : undefined,
            }}
          >
            <FontAwesome name="phone" size={20} color={scheme === 'light' ? Palette.white : tint} style = {{ marginLeft: -34 }} />
            <Text style={{ color: scheme === 'light' ? Palette.white : Colors[scheme].text, fontWeight: '600' }}>Call</Text>
          </Pressable>
          {/* Packages link */}
          <Pressable
            onPress={() => {
              onClose();
              onOpenPackages?.();
            }}
            accessibilityRole="button"
            accessibilityLabel="Open packages"
            hitSlop={10}
            style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 16, flexDirection: 'row', gap: 8 }}
          >
            <FontAwesome name="cube" size={20} color={tint} />
            <Text style={{ color: Colors[scheme].text, fontWeight: '600' }}>Packages</Text>
          </Pressable>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close driver sheet" hitSlop={10} style={{ alignItems: 'center', paddingVertical: 16 }}>
            <Text style={{ color: Colors[scheme].text, fontWeight: '600' }}>Close</Text>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
