import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import Colors, { Palette } from '@/constants/Colors';
import { formatPackageId } from '@/lib/utils';
import { useColorScheme } from 'nativewind';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export type ScanResultPayload = {
  packageId?: string;
  senderName?: string;
  raw: string;
};

type Props = {
  visible: boolean;
  payload: ScanResultPayload | null;
  onClose: () => void;
  onMarkDelivered: (payload: ScanResultPayload | null) => void;
};

export default function ScanResultSheet({ visible, payload, onClose, onMarkDelivered }: Props) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';
  const [display, setDisplay] = useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      setDisplay(true);
      Animated.timing(translateY, { toValue: 0, duration: 240, useNativeDriver: true }).start();
    } else {
      Animated.timing(translateY, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }).start(({ finished }) => {
        if (finished) setDisplay(false);
      });
    }
  }, [visible, translateY]);

  const text = Colors[scheme].text;
  const tint = Colors[scheme].tint;
  const muted = Colors[scheme].mutedText;

  if (!display || !payload) return null;
  const displayId = formatPackageId(payload.packageId);

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: Palette.backdropOverlay }} />

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
            paddingTop: 12,
            paddingBottom: 24,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            gap: 16,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: Colors[scheme].divider }} />
          </View>

          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: tint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesome name="qrcode" size={22} color={Palette.white} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: text, fontSize: 20, fontWeight: '800' }}>
                  {displayId ?? 'Package detected'}
                </Text>
                {payload.senderName ? (
                  <Text style={{ color: muted, fontSize: 14 }}>
                    Sender: {payload.senderName}
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={{ gap: 12 }}>
              <Pressable
                onPress={() => onMarkDelivered(payload)}
                accessibilityRole="button"
                accessibilityLabel="Mark package as delivered"
                hitSlop={10}
                style={{
                  backgroundColor: tint,
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <FontAwesome name="check-circle" size={18} color={'hsl(210, 20%, 12%)'} />
                <Text style={{ color: 'hsl(210, 20%, 12%)', fontWeight: '700', fontSize: 16 }}>
                  Mark as delivered
                </Text>
              </Pressable>

              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close scan result"
                hitSlop={10}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: text, fontWeight: '600' }}>Scan again</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
