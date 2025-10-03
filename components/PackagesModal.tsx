import React from 'react';
import { FlatList, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Colors, { Palette } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HistoryModal from './HistoryModal';

type ViewMode = 'grid' | 'card' | 'list';

type PackageItem = {
  id: string;
  status: 'good' | 'alert';
  temperature: string;
  humidity: string;
};

const SAMPLE_PACKAGES: PackageItem[] = Array.from({ length: 50 }, (_, i) => {
  const id = `PKG-${String(i + 1).padStart(4, '0')}`;
  const status: PackageItem['status'] = (i % 3) !== 0 ? 'good' : 'alert';
  const temperature = (18 + ((i * 7) % 8) + 0.3).toFixed(1);
  const humidity = (45 + ((i * 11) % 20)).toFixed(0);
  return { id, status, temperature, humidity };
});

export function PackagesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';
  const text = Colors[scheme].text;
  const tint = Colors[scheme].tint;

  const [mode, setMode] = React.useState<ViewMode>('grid');
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const openHistory = (id: string) => {
    setSelectedId(id);
    setHistoryOpen(true);
  };

  const success = 'hsl(142, 71%, 45%)';
  const destructive = 'hsl(0, 84%, 60%)';

  type HistoryButtonProps = { id: string; variant?: 'outline' | 'ghost' };

  const HistoryButton = ({ id, variant = 'outline' }: HistoryButtonProps) => (
    <Pressable
      onPress={() => openHistory(id)}
      style={
        variant === 'outline'
          ? {
              borderWidth: 1,
              borderColor: tint,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 10,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }
          : { paddingVertical: 6, paddingHorizontal: 8, borderRadius: 10, flexDirection: 'row', alignItems: 'center', marginLeft: 16 }
      }
    >
      <FontAwesome name="history" size={14} color={tint} />
      <Text style={{ color: tint, fontWeight: '600', marginLeft: 6 }}>
        {variant === 'outline' ? 'View History' : 'History'}
      </Text>
    </Pressable>
  );

  const GridItem = ({ item }: { item: PackageItem }) => (
    <View
      style={{
        backgroundColor: scheme === 'dark' ? Palette.darkCardBg : Palette.lightCardBg,
        borderRadius: 16,
        padding: 12,
        gap: 10,
        flex: 1,
        borderWidth: 1,
        borderColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
      }}
    >
      {/* Status + ID */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12, fontFamily: 'monospace' }}>{item.id}</Text>
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.status === 'good' ? success : destructive }} />
      </View>

      {/* Metrics */}
      <View style={{ gap: 8, marginBottom: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="thermometer-half" size={16} color={tint} />
          <Text style={{ color: text, fontWeight: '600' }}>{item.temperature}°C</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="tint" size={16} color={tint} />
          <Text style={{ color: text, fontWeight: '600' }}>{item.humidity}%</Text>
        </View>
      </View>

      <HistoryButton id={item.id} variant="outline" />
    </View>
  );

  const CardItem = ({ item }: { item: PackageItem }) => (
    <View
      style={{
        backgroundColor: scheme === 'dark' ? Palette.darkCardBg : Palette.lightCardBg,
        borderRadius: 20,
        padding: 16,
        gap: 12,
        borderWidth: 2,
        borderColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200, alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome name="cube" size={24} color={tint} />
          </View>
          <View>
            <Text style={{ color: text, fontSize: 16, fontWeight: '800', fontFamily: 'monospace' }}>{item.id}</Text>
            <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>
              {item.status === 'good' ? 'Optimal Conditions' : 'Attention Required'}
            </Text>
          </View>
        </View>
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: item.status === 'good' ? success : destructive }} />
      </View>

      {/* Metrics grid */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200, borderRadius: 12, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <FontAwesome name="thermometer-half" size={18} color={tint} />
            <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>Temperature</Text>
          </View>
          <Text style={{ color: text, fontSize: 22, fontWeight: '800' }}>{item.temperature}°C</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200, borderRadius: 12, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <FontAwesome name="tint" size={18} color={tint} />
            <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>Humidity</Text>
          </View>
          <Text style={{ color: text, fontSize: 22, fontWeight: '800' }}>{item.humidity}%</Text>
        </View>
      </View>

      <HistoryButton id={item.id} variant="outline" />
    </View>
  );

  const ListItem = ({ item }: { item: PackageItem }) => (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Status bar */}
      <View style={{ width: 4, height: 48, borderRadius: 2, backgroundColor: item.status === 'good' ? success : destructive }} />

      {/* ID */}
      <View style={{ width: 100 }}>
        <Text style={{ color: text, fontWeight: '800', fontFamily: 'monospace' }}>{item.id}</Text>
        <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>
          {item.status === 'good' ? 'Normal' : 'Alert'}
        </Text>
      </View>

      {/* Metrics */}
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="thermometer-half" size={16} color={tint} />
          <View>
            <Text style={{ color: text, fontWeight: '700' }}>{item.temperature}°C</Text>
            <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 11 }}>Temp</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="tint" size={16} color={tint} />
          <View>
            <Text style={{ color: text, fontWeight: '700' }}>{item.humidity}%</Text>
            <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, fontSize: 11 }}>Humidity</Text>
          </View>
        </View>
      </View>

      <HistoryButton id={item.id} variant="ghost" />
    </View>
  );

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: Colors[scheme].background }}>
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
                <Text style={{ color: text, fontSize: 22, fontWeight: '800' }}>Packages</Text>
                <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600 }}>{SAMPLE_PACKAGES.length} packages in transit</Text>
              </View>
              <Pressable onPress={onClose} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome name="close" size={24} color={text} />
              </Pressable>
            </View>

            {/* View Mode Selector */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
              }}
            >
              <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, marginRight: 6 }}>View:</Text>
              {(
                [
                  ['grid', 'th'],
                  ['card', 'clone'],
                  ['list', 'list'],
                ] as [ViewMode, React.ComponentProps<typeof FontAwesome>['name']][]
              ).map(([m, icon]) => {
                const active = mode === m;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setMode(m)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 999,
                      borderWidth: active ? 0 : 1,
                      borderColor: scheme === 'dark' ? Palette.gray700 : Palette.gray300,
                      backgroundColor: active ? tint : 'transparent',
                    }}
                  >
                    <FontAwesome name={icon as any} size={14} color={active ? Palette.white : text} />
                    <Text style={{ color: active ? Palette.white : text, fontWeight: '600', textTransform: 'capitalize' }}>{m}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Content */}
            {mode === 'grid' && (
              <FlatList
                data={SAMPLE_PACKAGES}
                key={'grid'}
                numColumns={2}
                contentContainerStyle={{ padding: 12, gap: 12 }}
                columnWrapperStyle={{ gap: 12 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <GridItem item={item} />}
              />
            )}

            {mode === 'card' && (
              <FlatList
                data={SAMPLE_PACKAGES}
                key={'card'}
                contentContainerStyle={{ padding: 12, gap: 12 }}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CardItem item={item} />}
              />
            )}

            {mode === 'list' && (
              <FlatList
                data={SAMPLE_PACKAGES}
                key={'list'}
                contentContainerStyle={{ paddingHorizontal: 6 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ListItem item={item} />}
              />
            )}
          </View>
        </SafeAreaView>
      </View>

      {/* History Modal */}
      <HistoryModal visible={historyOpen} onClose={() => setHistoryOpen(false)} selectedId={selectedId} />
    </Modal>
  );
}

export default PackagesModal;
