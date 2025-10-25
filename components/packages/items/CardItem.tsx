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

export default React.memo(function CardItem({ item, scheme, onHistory }: Props) {
  const tint = Colors[scheme].tint;
  const text = Colors[scheme].text;
  const muted = Colors[scheme].mutedText;
  const border = Colors[scheme].border;
  const cardBg = Colors[scheme].surface;
  const statusColor = item.status === 'good' ? Palette.success : Palette.destructive;
  const brandStrong = scheme === 'light' ? (Palette.highContrastTint ) : tint;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: border, shadowColor: scheme === 'light' ? '#000' : undefined, shadowOpacity: scheme === 'light' ? 0.04 : 0, shadowRadius: scheme === 'light' ? 8 : 0, shadowOffset: scheme === 'light' ? { width: 0, height: 2 } as any : undefined }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: border }]}>
            <FontAwesome name="cube" size={24} color={brandStrong} />
          </View>
          <View>
            <Text style={[styles.title, { color: text }]}>{item.id}</Text>
            <Text style={[styles.subtitle, { color: muted }]}>
              {item.status === 'good' ? 'Optimal Conditions' : 'Attention Required'}
            </Text>
          </View>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, { backgroundColor: border }]}>
          <View style={styles.metricHeader}>
            <FontAwesome name="thermometer-half" size={18} color={brandStrong} />
            <Text style={[styles.metricLabel, { color: muted }]}>Temperature</Text>
          </View>
          <Text style={[styles.metricBig, { color: text }]}>
            {item.temperature}{'\u00B0'}C
          </Text>
        </View>
        <View style={[styles.metricCard, { backgroundColor: border }]}>
          <View style={styles.metricHeader}>
            <FontAwesome name="tint" size={18} color={brandStrong} />
            <Text style={[styles.metricLabel, { color: muted }]}>Humidity</Text>
          </View>
          <Text style={[styles.metricBig, { color: text }]}>{item.humidity}%</Text>
        </View>
      </View>

      <HistoryButton id={item.id} onPress={onHistory} scheme={scheme} variant="outline" />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  subtitle: {
    fontSize: 12,
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
  },
  metricBig: {
    fontSize: 18,
    fontWeight: '700',
  },
});
