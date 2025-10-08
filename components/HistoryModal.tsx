import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Colors, { Palette } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export function HistoryModal({
  visible,
  onClose,
  selectedId,
}: {
  visible: boolean;
  onClose: () => void;
  selectedId: string | null;
}) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';
  const text = Colors[scheme].text;
  const tint = Colors[scheme].tint;

  const success = 'hsl(142, 71%, 45%)';
  const destructive = 'hsl(0, 84%, 60%)';

  const hours = 72;
  const data = React.useMemo(() => {
    if (!visible) return [] as { hour: number; temperature: number; humidity: number }[];
    return Array.from({ length: hours }, (_, i) => {
      const tempBase = 22;
      const temp = Number((tempBase + Math.sin(i / 12) * 3 + ((i % 5) - 2) * 0.5).toFixed(1));
      const humBase = 52;
      const hum = Number((humBase + Math.cos(i / 8) * 8 + ((i % 7) - 3) * 0.7).toFixed(0));
      return { hour: i, temperature: temp, humidity: hum };
    });
  }, [visible]);

  const avgTemp = React.useMemo(
    () => (data.length ? (data.reduce((s, d) => s + d.temperature, 0) / data.length).toFixed(1) : '0.0'),
    [data]
  );
  const avgHum = React.useMemo(
    () => (data.length ? (data.reduce((s, d) => s + d.humidity, 0) / data.length).toFixed(0) : '0'),
    [data]
  );
  const alertCount = React.useMemo(
    () => data.filter((d) => d.temperature > 25 || d.temperature < 19 || d.humidity > 60 || d.humidity < 45).length,
    [data]
  );

  const ChartBars = ({
    series,
    yDomain,
    label,
    height = 160,
  }: {
    series: number[];
    yDomain: [number, number];
    label: string;
    height?: number;
  }) => {
    const [yMin, yMax] = yDomain;
    const norm = (v: number) => Math.max(0, Math.min(1, (v - yMin) / (yMax - yMin)));
    return (
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Text style={{ color: text, fontSize: 16, fontWeight: '800', marginBottom: 8 }}>{label}</Text>
        <View
          style={{
            height,
            borderWidth: 1,
            borderColor: scheme === 'dark' ? Palette.gray700 : Palette.gray300,
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 6,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
            {series.map((v, idx) => (
              <View key={idx} style={{ flex: 1, marginHorizontal: 0.5, height: '100%', justifyContent: 'flex-end' }}>
                <View
                  style={{
                    height: `${Math.round(norm(v) * 100)}%`,
                    backgroundColor: tint,
                    opacity: 0.28,
                    borderTopLeftRadius: 2,
                    borderTopRightRadius: 2,
                  }}
                />
              </View>
            ))}
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
          <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 11 }}>0h</Text>
          <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 11 }}>{series.length - 1}h</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="none"
      hardwareAccelerated
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors[scheme].background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
          }}
        >
          <View>
            <Text style={{ color: text, fontSize: 20, fontWeight: '800' }}>Package History</Text>
            <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontFamily: 'monospace', marginTop: 2 }}>
              {selectedId ?? ''}
            </Text>
          </View>
          <Pressable onPress={onClose} hitSlop={15} accessibilityRole="button" accessibilityLabel="Close history" style={{ padding: 6 }}>
            <FontAwesome name="close" size={24} color={text} />
          </Pressable>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} removeClippedSubviews>
          {/* Stats */}
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
              gap: 16,
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: 'hsla(200, 90%, 55%, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesome name="thermometer-half" color={tint} size={18} />
              </View>
              <View>
                <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>Avg Temp</Text>
                <Text style={{ color: text, fontSize: 16, fontWeight: '800' }}>{avgTemp}{'\u00B0'}C</Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: 'hsla(200, 90%, 55%, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesome name="tint" color={tint} size={18} />
              </View>
              <View>
                <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>Avg Humidity</Text>
                <Text style={{ color: text, fontSize: 16, fontWeight: '800' }}>{avgHum}%</Text>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: 'hsla(0, 84%, 60%, 0.15)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesome name="calendar" color={destructive} size={18} />
              </View>
              <View>
                <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>Alert Hours</Text>
                <Text style={{ color: text, fontSize: 16, fontWeight: '800' }}>{alertCount}/{hours}</Text>
              </View>
            </View>
          </View>

          {/* Temperature chart */}
          <ChartBars series={data.map((d) => d.temperature)} yDomain={[15, 28]} label="Temperature History" />

          {/* Humidity chart */}
          <ChartBars series={data.map((d) => d.humidity)} yDomain={[35, 70]} label="Humidity History" />

          {/* Timeline */}
          <View style={{ padding: 16 }}>
            <Text style={{ color: text, fontSize: 16, fontWeight: '800', marginBottom: 10 }}>Status Timeline</Text>
            <View style={{ flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' }}>
              {Array.from({ length: 72 }).map((_, idx) => {
                const isGood = idx % 9 !== 0;
                return <View key={idx} style={{ flex: 1, backgroundColor: isGood ? success : destructive }} />;
              })}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>3 days ago</Text>
              <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>Now</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default HistoryModal;
