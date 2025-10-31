import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Colors, { Palette, ThemeName } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HistoryModal from './HistoryModal';
import type { ApiPackage } from '@/lib/api';
import { usePackagesStore } from '@/stores/packagesStore';
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
import SearchBar from './packages/SearchBar';
import FilterBar, { type StatusFilter } from './packages/FilterBar';

function mapApiToItem(p: ApiPackage): PackageItem {
  const temp = typeof p.current_temperature === 'number' ? p.current_temperature : null;
  const hum = typeof p.current_humidity === 'number' ? p.current_humidity : null;

  const tempOk = typeof temp === 'number'
    ? temp >= p.expected_temperature_min && temp <= p.expected_temperature_max
    : false; // fail-safe when missing
  const humOk = typeof hum === 'number'
    ? hum >= p.expected_humidity_min && hum <= p.expected_humidity_max
    : false; // fail-safe when missing

  const status: PackageItem['status'] = tempOk && humOk ? 'good' : 'alert';

  return {
    id: `PKG-${p.id}`,
    status,
    temperature: temp !== null ? temp.toFixed(1) : '--',
    humidity: hum !== null ? String(Math.round(hum)) : '--',
  };
}

export default function PackagesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { colorScheme } = useColorScheme();
  const scheme = (colorScheme ?? 'light') as ThemeName;
  const text = Colors[scheme].text;

  const [mode, setMode] = useState<ViewMode>('grid');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const pkgRaw = usePackagesStore((s) => s.packages);
  const loading = usePackagesStore((s) => s.loading);
  const error = usePackagesStore((s) => s.error);
  const fetchNow = usePackagesStore((s) => s.fetchNow);

  // Refresh when modal opens for freshest view
  useEffect(() => {
    if (isOpen) fetchNow();
  }, [isOpen, fetchNow]);

  const items = useMemo<PackageItem[]>(() => pkgRaw.map(mapApiToItem), [pkgRaw]);
  const visibleItems = useMemo<PackageItem[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const matchSearch = q.length === 0 || it.id.toLowerCase().includes(q);
      const matchFilter =
        statusFilter === 'all' ? true : statusFilter === 'alert' ? it.status === 'alert' : it.status === 'good';
      return matchSearch && matchFilter;
    });
  }, [items, searchQuery, statusFilter]);

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
                <Text style={{ color: Colors[scheme].mutedText }}>{items.length} packages in transit</Text>
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
            {/* Filter + Search */}
            <FilterBar filter={statusFilter} onChange={setStatusFilter} scheme={scheme} />
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} scheme={scheme} />

            {/* Error state */}
            {!!error && (
              <View style={{ paddingHorizontal: 16, paddingVertical: 10 }}>
                <View style={{ borderWidth: 1, borderColor: Palette.destructive, backgroundColor: scheme === 'dark' ? 'hsla(0, 84%, 60%, 0.1)' : 'hsla(0, 84%, 60%, 0.08)', borderRadius: 8, padding: 10, gap: 6 }}>
                  <Text style={{ color: Colors[scheme].text, fontWeight: '700' }}>Failed to load packages</Text>
                  <Text style={{ color: Colors[scheme].mutedText, fontSize: 12 }}>{String(error)}</Text>
                  <Pressable onPress={fetchNow} accessibilityLabel="Retry loading packages" style={{ alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: Colors[scheme].tint, borderRadius: 8 }}>
                    <Text style={{ color: Colors[scheme].text, fontWeight: '600' }}>Retry</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Content */}
            {mode === 'grid' && (
              <FlatList
                data={visibleItems}
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
                data={visibleItems}
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
                data={visibleItems}
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

            {loading && items.length === 0 && (
              <View style={{ padding: 16 }}>
                <Text style={{ color: Colors[scheme].mutedText }}>Loading packages…</Text>
              </View>
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

