import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useMemo, useState } from 'react';
import { useColorScheme } from 'nativewind';
import Colors, { Palette } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import DriverSheet, { type DriverInfo } from '@/components/DriverSheet';
import PackagesModal from '@/components/PackagesModal';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const scheme = (colorScheme ?? 'light') as 'light' | 'dark';
  const [driverOpen, setDriverOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const { eta, driver: driverInfo, packagesTotal, packageAlerts } = useDeliveryStore();
  const router = useRouter();
  const driver: DriverInfo = useMemo(() => ({
    name: driverInfo.name,
    role: driverInfo.role,
    rating: driverInfo.rating,
    eta: eta || '--',
    progress: driverInfo.progress,
    photo: require('../../assets/images/driver-headshot.png'),
  }), [eta, driverInfo]);

// try gray stone or zinc 200 after feedback round 
  return (
    <View style={[styles.flex1, { backgroundColor: Colors[scheme].background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[scheme].text }]}>Dashboard</Text>
        <Text style={[styles.headerSubtitle, { color: Colors[scheme].mutedText }]}>Overview at a glance</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.flex1} contentContainerStyle={styles.contentScroll}>
        <View style={styles.contentPad}>
          {/* Driver summary */}
          <Text style={[styles.sectionTitle, { color: Colors[scheme].text }]}>Driver</Text>
          <Pressable onPress={() => setDriverOpen(true)} accessibilityRole="button" accessibilityLabel="Open driver sheet" style={[styles.cardRow, { backgroundColor: Colors[scheme].surface, borderColor: Colors[scheme].border }]}>
            <View style={[styles.avatar, { borderColor: Colors[scheme].tint }]}>
              <Image source={driver.photo} style={styles.avatarImage} />
            </View>
            <View style={styles.flex1}>
              <Text style={[styles.cardTitle, { color: Colors[scheme].text }]}>{driver.name}</Text>
              <Text style={[styles.cardSubtitle, { color: Colors[scheme].mutedText }]}>{driver.role}</Text>
              <View style={styles.rowCenter}>
                <FontAwesome name="clock-o" size={14} color={Colors[scheme].tint} />
                <Text style={[styles.etaText, { color: Colors[scheme].text }]}>{driver.eta}</Text>
                <Text style={[styles.cardMeta, { color: Colors[scheme].mutedText }]}>ETA</Text>
              </View>
            </View>
            <FontAwesome name="chevron-right" size={16} color={Colors[scheme].mutedText} />
          </Pressable>

          

          {/* Packages summary */}
          <View style={[styles.divider, { backgroundColor: Colors[scheme].divider }]} />
          <Text style={[styles.sectionTitle, { color: Colors[scheme].text }]}>Packages</Text>
          <Pressable onPress={() => setPackagesOpen(true)} accessibilityRole="button" accessibilityLabel="Open packages" style={[styles.cardRow, { backgroundColor: Colors[scheme].surface, borderColor: Colors[scheme].border }]}>
            <View style={[styles.iconBadge, { backgroundColor: Colors[scheme].tint }]}> 
              <FontAwesome name="cube" size={16} color={Palette.white} />
            </View>
            <View style={styles.flex1}>
              <Text style={[styles.cardTitle, { color: Colors[scheme].text }]}>{packagesTotal} packages</Text>
              <Text style={[styles.cardSubtitle, { color: Palette.destructive }]}>{packageAlerts} alerts</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={Colors[scheme].mutedText} />
          </Pressable>

          {/* Scan */}
          <View style={[styles.divider, { backgroundColor: Colors[scheme].divider }]} />
          <Text style={[styles.sectionTitle, { color: Colors[scheme].text }]}>Scan</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Scan"
            onPress={() => router.push('/(tabs)/scan')}
            style={[styles.cardRow, { backgroundColor: Colors[scheme].surface, borderColor: Colors[scheme].border }]}
          >
            <View style={[styles.iconBadge, { backgroundColor: Colors[scheme].tint }]}>
              <FontAwesome name="qrcode" size={18} color={Palette.white} />
            </View>
            <View style={styles.flex1}>
              <Text style={[styles.cardTitle, { color: Colors[scheme].text }]}>Scan</Text>
              <Text style={[styles.cardSubtitle, { color: Colors[scheme].mutedText }]}>Scan a package</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={Colors[scheme].mutedText} />
          </Pressable>

          {/* Map */}
          <View style={[styles.divider, { backgroundColor: Colors[scheme].divider }]} />
          <Text style={[styles.sectionTitle, { color: Colors[scheme].text }]}>Map</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open Map"
            onPress={() => router.push('/(tabs)/map')}
            style={[styles.cardRow, { backgroundColor: Colors[scheme].surface, borderColor: Colors[scheme].border }]}
          >
            <View style={[styles.iconBadge, { backgroundColor: Colors[scheme].tint }]}>
              <FontAwesome name="map" size={18} color={Palette.white} />
            </View>
            <View style={styles.flex1}>
              <Text style={[styles.cardTitle, { color: Colors[scheme].text }]}>Map</Text>
              <Text style={[styles.cardSubtitle, { color: Colors[scheme].mutedText }]}>View route & ETA</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color={Colors[scheme].mutedText} />
          </Pressable>
        </View>
      </ScrollView>

      {/* Overlays */}
      <DriverSheet visible={driverOpen} onClose={() => setDriverOpen(false)} driver={driver} onOpenPackages={() => { setDriverOpen(false); setPackagesOpen(true); }} />
      <PackagesModal isOpen={packagesOpen} onClose={() => setPackagesOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  headerSubtitle: { fontSize: 12, marginTop: 4 },
  contentScroll: { paddingBottom: 96 },
  contentPad: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
  },
  avatarImage: { width: '100%', height: '100%' },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCenter: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  cardTitle: { fontWeight: '700' },
  cardSubtitle: { fontSize: 12 },
  cardMeta: { marginLeft: 6, fontSize: 12 },
  etaText: { marginLeft: 6, fontWeight: '700' },
  divider: { height: 1, width: '100%', marginVertical: 16 },
});
