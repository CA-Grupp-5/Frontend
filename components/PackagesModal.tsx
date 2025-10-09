import React, { useCallback, useMemo } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Colors, { Palette } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HistoryModal from './HistoryModal';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type ViewMode = 'grid' | 'card' | 'list';

type PackageItem = {
  id: string;
  status: 'good' | 'alert';
  temperature: string;
  humidity: string;
};

type ItemColors = {
  text: string;
  tint: string;
  cardBg: string;
  border: string;
  divider: string;
  success: string;
  destructive: string;
};

type HistoryButtonProps = { id: string; tint: string; onPress: (id: string) => void; variant?: 'outline' | 'ghost' };
const HistoryButton = React.memo(function HistoryButton({ id, tint, onPress, variant = 'outline' }: HistoryButtonProps) {
  return (
    <Pressable
      onPress={() => onPress(id)}
      accessibilityRole="button"
      accessibilityLabel={`View history for ${id}`}
      hitSlop={10}
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
});

type PackageRowProps = { item: PackageItem; colors: ItemColors; onHistory: (id: string) => void };

const GridItem = React.memo(function GridItem({ item, colors, onHistory }: PackageRowProps) {
  return (
    <View
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 16,
        padding: 12,
        gap: 10,
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
        <Text style={{ color: colors.text === Palette.gray50 ? Palette.gray400 : Palette.gray600, fontSize: 12, fontFamily: 'monospace' }}>{item.id}</Text>
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.status === 'good' ? colors.success : colors.destructive }} />
      </View>

      <View style={{ gap: 8, marginBottom: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="thermometer-half" size={16} color={colors.tint} />
          <Text style={{ color: colors.text, fontWeight: '600' }}>{item.temperature}{'\u00B0'}C</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="tint" size={16} color={colors.tint} />
          <Text style={{ color: colors.text, fontWeight: '600' }}>{item.humidity}%</Text>
        </View>
      </View>

      <HistoryButton id={item.id} tint={colors.tint} onPress={onHistory} variant="outline" />
    </View>
  );
});

const CardItem = React.memo(function CardItem({ item, colors, onHistory }: PackageRowProps) {
  return (
    <View
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: 20,
        padding: 16,
        gap: 12,
        borderWidth: 2,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome name="cube" size={24} color={colors.tint} />
          </View>
          <View>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '800', fontFamily: 'monospace' }}>{item.id}</Text>
            <Text style={{ color: colors.text === Palette.gray50 ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>
              {item.status === 'good' ? 'Optimal Conditions' : 'Attention Required'}
            </Text>
          </View>
        </View>
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: item.status === 'good' ? colors.success : colors.destructive }} />
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: colors.border, borderRadius: 12, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <FontAwesome name="thermometer-half" size={18} color={colors.tint} />
            <Text style={{ color: colors.text === Palette.gray50 ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>Temperature</Text>
          </View>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{item.temperature}{'\u00B0'}C</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: colors.border, borderRadius: 12, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <FontAwesome name="tint" size={18} color={colors.tint} />
            <Text style={{ color: colors.text === Palette.gray50 ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>Humidity</Text>
          </View>
          <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800' }}>{item.humidity}%</Text>
        </View>
      </View>

      <HistoryButton id={item.id} tint={colors.tint} onPress={onHistory} variant="outline" />
    </View>
  );
});

const ListItem = React.memo(function ListItem({ item, colors, onHistory }: PackageRowProps) {
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View style={{ width: 4, height: 48, borderRadius: 2, backgroundColor: item.status === 'good' ? colors.success : colors.destructive }} />

      <View style={{ width: 100 }}>
        <Text style={{ color: colors.text, fontWeight: '800', fontFamily: 'monospace' }}>{item.id}</Text>
        <Text style={{ color: colors.text === Palette.gray50 ? Palette.gray400 : Palette.gray600, fontSize: 12 }}>
          {item.status === 'good' ? 'Normal' : 'Alert'}
        </Text>
      </View>

      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="thermometer-half" size={16} color={colors.tint} />
          <View>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.temperature}{'\u00B0'}C</Text>
            <Text style={{ color: colors.text === Palette.gray50 ? Palette.gray400 : Palette.gray600, fontSize: 11 }}>Temp</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <FontAwesome name="tint" size={16} color={colors.tint} />
          <View>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.humidity}%</Text>
            <Text style={{ color: colors.text === Palette.gray50 ? Palette.gray400 : Palette.gray600, fontSize: 11 }}>Humidity</Text>
          </View>
        </View>
      </View>

      <HistoryButton id={item.id} tint={colors.tint} onPress={onHistory} variant="ghost" />
    </View>
  );
});

const SAMPLE_PACKAGES: PackageItem[] = Array.from({ length: 50 }, (_, i) => {
  const id = `PKG-${String(i + 1).padStart(4, '0')}`;
  const status: PackageItem['status'] = (i % 3) !== 0 ? 'good' : 'alert';
  const temperature = (18 + ((i * 7) % 8) + 0.3).toFixed(1);
  const humidity = (45 + ((i * 11) % 20)).toFixed(0);
  return { id, status, temperature, humidity };
});

const MODE_TO_INDEX = Object.freeze<Record<ViewMode, number>>({
  grid: 0,
  card: 1,
  list: 2,
});

const INDEX_TO_MODE: ViewMode[] = ['grid', 'card', 'list'];

export function PackagesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';
  const text = Colors[scheme].text;
  const tint = Colors[scheme].tint;

  const [mode, setMode] = React.useState<ViewMode>('grid');
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [interactiveMode, setInteractiveMode] = React.useState<ViewMode>('grid');

  const success = 'hsl(142, 71%, 45%)';
  const destructive = 'hsl(0, 84%, 60%)';

  const colors = useMemo<ItemColors>(
    () => ({
      text,
      tint,
      cardBg: scheme === 'dark' ? Palette.darkCardBg : Palette.lightCardBg,
      border: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
      divider: scheme === 'dark' ? Palette.gray700 : Palette.gray200,
      success,
      destructive,
    }),
    [scheme, text, tint, success, destructive]
  );

  const onHistory = useCallback((id: string) => {
    setSelectedId(id);
    setHistoryOpen(true);
  }, []);

  const renderGridItem = useCallback(
    ({ item }: { item: PackageItem }) => <GridItem item={item} colors={colors} onHistory={onHistory} />,
    [colors, onHistory]
  );
  const renderCardItem = useCallback(
    ({ item }: { item: PackageItem }) => <CardItem item={item} colors={colors} onHistory={onHistory} />,
    [colors, onHistory]
  );
  const renderListItem = useCallback(
    ({ item }: { item: PackageItem }) => <ListItem item={item} colors={colors} onHistory={onHistory} />,
    [colors, onHistory]
  );

  const modeProgress = useSharedValue(MODE_TO_INDEX[mode]);

  React.useEffect(() => {
    modeProgress.value = withTiming(MODE_TO_INDEX[mode], { duration: 220 });
  }, [mode, modeProgress]);

  const updateInteractiveMode = useCallback((nextMode: ViewMode) => {
    setInteractiveMode((current) => (current === nextMode ? current : nextMode));
  }, []);

  useAnimatedReaction(
    () => modeProgress.value,
    (value) => {
      'worklet';
      const nearestIndex = Math.round(value);
      const difference = Math.abs(value - nearestIndex);
      if (difference < 0.05) {
        const nextMode = INDEX_TO_MODE[nearestIndex];
        if (nextMode) {
          runOnJS(updateInteractiveMode)(nextMode);
        }
      }
    },
    [updateInteractiveMode]
  );

  const gridAnimatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(modeProgress.value - MODE_TO_INDEX.grid);
    return { opacity: 1 - Math.min(distance, 1) };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(modeProgress.value - MODE_TO_INDEX.card);
    return { opacity: 1 - Math.min(distance, 1) };
  });

  const listAnimatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(modeProgress.value - MODE_TO_INDEX.list);
    return { opacity: 1 - Math.min(distance, 1) };
  });

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
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={`Set view to ${m}`}
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
            <View style={{ flex: 1, position: 'relative' }}>
              <Animated.View
                pointerEvents={interactiveMode === 'grid' ? 'auto' : 'none'}
                style={[StyleSheet.absoluteFillObject, gridAnimatedStyle]}
              >
                <FlatList
                  data={SAMPLE_PACKAGES}
                  key={'grid'}
                  numColumns={2}
                  contentContainerStyle={{ padding: 12, gap: 12 }}
                  columnWrapperStyle={{ gap: 12 }}
                  initialNumToRender={12}
                  windowSize={5}
                  removeClippedSubviews
                  keyExtractor={(item) => item.id}
                  renderItem={renderGridItem}
                />
              </Animated.View>

              <Animated.View
                pointerEvents={interactiveMode === 'card' ? 'auto' : 'none'}
                style={[StyleSheet.absoluteFillObject, cardAnimatedStyle]}
              >
                <FlatList
                  data={SAMPLE_PACKAGES}
                  key={'card'}
                  contentContainerStyle={{ padding: 12, gap: 12 }}
                  ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                  initialNumToRender={10}
                  windowSize={5}
                  removeClippedSubviews
                  keyExtractor={(item) => item.id}
                  renderItem={renderCardItem}
                />
              </Animated.View>

              <Animated.View
                pointerEvents={interactiveMode === 'list' ? 'auto' : 'none'}
                style={[StyleSheet.absoluteFillObject, listAnimatedStyle]}
              >
                <FlatList
                  data={SAMPLE_PACKAGES}
                  key={'list'}
                  contentContainerStyle={{ paddingHorizontal: 6 }}
                  initialNumToRender={20}
                  windowSize={7}
                  removeClippedSubviews
                  getItemLayout={(_data, index) => ({ length: 72, offset: 72 * index, index })}
                  keyExtractor={(item) => item.id}
                  renderItem={renderListItem}
                />
              </Animated.View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <HistoryModal visible={historyOpen} onClose={() => setHistoryOpen(false)} selectedId={selectedId} />
    </Modal>
  );
}

export default PackagesModal;
