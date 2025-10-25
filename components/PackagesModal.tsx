import React, { useCallback, useState } from 'react';
import { FlatList, Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Colors, { ThemeName } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HistoryModal from './HistoryModal';
type ViewMode = 'grid' | 'card' | 'list';
type PackageItem = {
  id: string;
  status: 'good' | 'alert';
  temperature: string;
  humidity: string;
};
import GridItem from './packages/items/GridItem';
import CardItem from './packages/items/CardItem';
import ListItem from './packages/items/ListItem';
import ViewModeSelector from './packages/ViewModeSelector';

const SAMPLE_PACKAGES: PackageItem[] = Array.from({ length: 50 }, (_, i) => {
  const id = `PKG-${String(i + 1).padStart(4, '0')}`;
  const status: PackageItem['status'] = (i % 3) !== 0 ? 'good' : 'alert';
  const temperature = (18 + ((i * 7) % 8) + 0.3).toFixed(1);
  const humidity = (45 + ((i * 11) % 20)).toFixed(0);
  return { id, status, temperature, humidity };
});

export default function PackagesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { colorScheme } = useColorScheme();
  const scheme = (colorScheme ?? 'light') as ThemeName;
  const text = Colors[scheme].text;

  const [mode, setMode] = useState<ViewMode>('grid');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onHistory = useCallback((id: string) => {
    setSelectedId(id);
    setHistoryOpen(true);
  }, []);

  const renderGridItem = useCallback(
    ({ item }: { item: PackageItem }) => <GridItem item={item} scheme={scheme} onHistory={onHistory} />,
    [scheme, onHistory]
  );
  const renderCardItem = useCallback(
    ({ item }: { item: PackageItem }) => <CardItem item={item} scheme={scheme} onHistory={onHistory} />,
    [scheme, onHistory]
  );
  const renderListItem = useCallback(
    ({ item, index }: { item: PackageItem; index: number }) => (
      <ListItem item={item} scheme={scheme} onHistory={onHistory} index={index} />
    ),
    [scheme, onHistory]
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
                borderBottomColor: Colors[scheme].border,
              }}
            >
              <View>
                <Text style={{ color: text, fontSize: 22, fontWeight: '800' }}>Packages</Text>
                <Text style={{ color: Colors[scheme].mutedText }}>{SAMPLE_PACKAGES.length} packages in transit</Text>
              </View>
              <Pressable
                onPress={onClose}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Close packages"
                style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
              >
                <FontAwesome name="close" size={24} color={text} />
              </Pressable>
            </View>

            {/* View Mode Selector */}
            <ViewModeSelector mode={mode} onChange={setMode} scheme={scheme} />

            {/* Content */}
            {mode === 'grid' && (
              <FlatList
                data={SAMPLE_PACKAGES}
                key={'grid'}
                numColumns={2}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.gridColumn}
                initialNumToRender={12}
                windowSize={5}
                removeClippedSubviews
                keyExtractor={(item) => item.id}
                renderItem={renderGridItem}
              />
            )}

            {mode === 'card' && (
              <FlatList
                data={SAMPLE_PACKAGES}
                key={'card'}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
                initialNumToRender={10}
                windowSize={5}
                removeClippedSubviews
                keyExtractor={(item) => item.id}
                renderItem={renderCardItem}
              />
            )}

            {mode === 'list' && (
              <FlatList
                data={SAMPLE_PACKAGES}
                key={'list'}
                contentContainerStyle={styles.listNarrow}
                initialNumToRender={20}
                windowSize={7}
                removeClippedSubviews
                getItemLayout={(_data, index) => ({ length: 72, offset: 72 * index, index })}
                keyExtractor={(item) => item.id}
                renderItem={renderListItem}
              />
            )}
          </View>
        </SafeAreaView>
      </View>

      <HistoryModal visible={historyOpen} onClose={() => setHistoryOpen(false)} selectedId={selectedId} />
    </Modal>
  );
}

const styles = StyleSheet.create({
  gridContent: {
    padding: 12,
    gap: 12,
  },
  gridColumn: {
    gap: 12,
  },
  listContent: {
    padding: 12,
    gap: 12,
  },
  cardSeparator: {
    height: 12,
  },
  listNarrow: {
    paddingHorizontal: 6,
  },
});

