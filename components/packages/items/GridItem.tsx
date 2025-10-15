import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors, { Palette, ThemeName } from '@/constants/Colors';
import HistoryButton from '../HistoryButton';

type Props = {
  item: PackageItem;
  scheme: ThemeName;
  onHistory: (id: string) => void;
};

type PackageItem = {
  id: string;
  status: 'good' | 'alert';
  temperature: string;
  humidity: string;
};

export default React.memo(function GridItem({ item, scheme, onHistory }: Props) {
  const tint = Colors[scheme].tint;
  const text = Colors[scheme].text;
  const muted = Colors[scheme].mutedText;
  const border = Colors[scheme].border;
  const cardBg = Colors[scheme].surface;
  const statusColor = item.status === 'good' ? Palette.success : Palette.destructive;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.idText, { color: muted }]}>{item.id}</Text>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      <View style={styles.metricsBlock}>
        <View style={styles.metricRow}>
          <FontAwesome name="thermometer-half" size={16} color={tint} />
          <Text style={[styles.metricValue, { color: text }]}>
            {item.temperature}{'\u00B0'}C
          </Text>
        </View>
        <View style={styles.metricRow}>
          <FontAwesome name="tint" size={16} color={tint} />
          <Text style={[styles.metricValue, { color: text }]}>
            {item.humidity}%
          </Text>
        </View>
      </View>

      <HistoryButton id={item.id} onPress={onHistory} scheme={scheme} variant="outline" />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    gap: 10,
    flex: 1,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  idText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  metricsBlock: {
    gap: 8,
    marginBottom: 4,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metricValue: {
    fontWeight: '600',
  },
});
