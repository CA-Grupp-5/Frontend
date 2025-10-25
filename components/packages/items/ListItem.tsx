import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors, { Palette, ThemeName } from '@/constants/Colors';
import HistoryButton from '../HistoryButton';

type Props = {
  item: PackageItem;
  scheme: ThemeName;
  onHistory: (id: string) => void;
  index?: number;
};

type PackageItem = {
  id: string;
  status: 'good' | 'alert';
  temperature: string;
  humidity: string;
};

export default React.memo(function ListItem({ item, scheme, onHistory, index = 0 }: Props) {
  const tint = Colors[scheme].tint;
  const text = Colors[scheme].text;
  const muted = Colors[scheme].mutedText;
  const divider = Colors[scheme].divider;
  const statusColor = item.status === 'good' ? Palette.success : Palette.destructive;
  const rowBg = scheme === 'light'
    ? (index % 2 === 0 ? Palette.gray50 : Colors[scheme].background)
    : (index % 2 === 0 ? Colors[scheme].surface : Colors[scheme].background);

  return (
    <View style={[styles.row, { borderBottomColor: divider, backgroundColor: rowBg }]}>
      <View style={[styles.statusBar, { backgroundColor: statusColor }]} />

      <View style={styles.idBlock}>
        <Text style={[styles.idText, { color: text }]}>{item.id}</Text>
        <Text style={[styles.idSub, { color: muted }]}>{item.status === 'good' ? 'Normal' : 'Alert'}</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <FontAwesome name="thermometer-half" size={16} color={tint} />
          <View>
            <Text style={[styles.metricValue, { color: text }]}>{item.temperature}{'\u00B0'}C</Text>
            <Text style={[styles.metricLabel, { color: muted }]}>Temp</Text>
          </View>
        </View>
        <View style={styles.metricItem}>
          <FontAwesome name="tint" size={16} color={tint} />
          <View>
            <Text style={[styles.metricValue, { color: text }]}>{item.humidity}%</Text>
            <Text style={[styles.metricLabel, { color: muted }]}>Humidity</Text>
          </View>
        </View>
      </View>

      <HistoryButton id={item.id} onPress={onHistory} scheme={scheme} variant="ghost" />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusBar: {
    width: 4,
    height: 48,
    borderRadius: 2,
  },
  idBlock: {
    width: 100,
  },
  idText: {
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  idSub: {
    fontSize: 12,
  },
  metricsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 11,
  },
});
