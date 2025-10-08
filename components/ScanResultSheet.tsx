import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors, { Palette } from '@/constants/Colors';
import { useColorScheme } from 'nativewind';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export type ScanResultPayload = {
  packageId?: string;
  recipient?: string;
  address?: string;
  notes?: string;
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
  const cardBg = useMemo(() => (scheme === 'dark' ? Palette.darkCardBg : Palette.lightCardBg), [scheme]);
  const muted = scheme === 'dark' ? Palette.gray400 : Palette.gray600;

  if (!display || !payload) return null;

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
            <View style={{ width: 48, height: 4, borderRadius: 2, backgroundColor: scheme === 'dark' ? Palette.gray700 : Palette.gray300 }} />
          </View>

          <View style={{ gap: 12 }}>
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
                  {payload.packageId ?? 'Package detected'}
                </Text>
                {payload.recipient ? (
                  <Text style={{ color: muted, fontSize: 14 }}>
                    Recipient: {payload.recipient}
                  </Text>
                ) : null}
              </View>
            </View>

            {payload.address ? (
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 16,
                  padding: 16,
                  gap: 6,
                  borderWidth: 1,
                  borderColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
                }}
              >
                <Text style={{ color: muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Delivery Address
                </Text>
                <Text style={{ color: text, fontSize: 16, fontWeight: '600' }}>{payload.address}</Text>
              </View>
            ) : null}

            {payload.notes ? (
              <View
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 16,
                  padding: 16,
                  gap: 6,
                  borderWidth: 1,
                  borderColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
                }}
              >
                <Text style={{ color: muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Notes
                </Text>
                <Text style={{ color: text, fontSize: 15 }}>{payload.notes}</Text>
              </View>
            ) : null}

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
                <FontAwesome name="check-circle" size={18} color={Palette.white} />
                <Text style={{ color: Palette.white, fontWeight: '700', fontSize: 16 }}>
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

            <View
              style={{
                borderWidth: 1,
                borderColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ color: muted, fontSize: 12, marginBottom: 4 }}>Raw data</Text>
              <Text style={{ color: text, fontFamily: 'monospace', fontSize: 13 }} numberOfLines={3}>
                {payload.raw}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
