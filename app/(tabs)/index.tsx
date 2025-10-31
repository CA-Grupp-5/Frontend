import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useMemo, useState } from 'react';
import DashboardCard from '@/components/DashboardCard';
import DriverSheet, { type DriverInfo } from '@/components/DriverSheet';
import PackagesModal from '@/components/PackagesModal';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { usePackagesStore, isTempInRange, isHumInRange } from '@/stores/packagesStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function HomeScreen() {
  const { colors, palette } = useThemeColors();
  const [driverOpen, setDriverOpen] = useState(false);
  const [packagesOpen, setPackagesOpen] = useState(false);
  const { eta, driver: driverInfo } = useDeliveryStore();
  const pkgs = usePackagesStore((s) => s.packages);
  const lastUpdated = usePackagesStore((s) => s.lastUpdated);
  const fetchNow = usePackagesStore((s) => s.fetchNow);
  const packagesTotal = pkgs.length;
  const packageAlerts = useMemo(() => pkgs.reduce((acc, p) => acc + ((isTempInRange(p) && isHumInRange(p)) ? 0 : 1), 0), [pkgs]);
  const lastSyncedText = useMemo(() => {
    if (!lastUpdated) return '--';
    const delta = Date.now() - lastUpdated;
    const secs = Math.floor(delta / 1000);
    if (secs < 60) return `${secs}s ago`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
  }, [lastUpdated]);
  const router = useRouter();
  const driver: DriverInfo = useMemo(
    () => ({
      name: driverInfo.name,
      role: driverInfo.role,
      rating: driverInfo.rating,
      eta: eta || '--',
      progress: driverInfo.progress,
      photo: require('../../assets/images/driver-headshot.png'),
    }),
    [eta, driverInfo],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedText }]}>Overview at a glance</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.screen} contentContainerStyle={styles.contentScroll}>
        <View style={styles.contentPad}>
          {/* Driver summary */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Driver</Text>
          <DashboardCard
            onPress={() => setDriverOpen(true)}
            accessibilityLabel="Open driver sheet"
            avatar={{ source: driver.photo, borderColor: colors.tint }}
            title={driver.name}
            subtitle={driver.role}
            meta={{
              iconName: 'clock-o',
              iconColor: colors.tint,
              text: driver.eta,
              textColor: colors.text,
              label: 'ETA',
              labelColor: colors.mutedText,
            }}
          />

          {/* Packages summary */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Packages</Text>
          <DashboardCard
            onPress={() => setPackagesOpen(true)}
            accessibilityLabel="Open packages"
            icon={{ name: 'cube', color: palette.white, size: 16, backgroundColor: colors.tint }}
            title={`${packagesTotal} packages`}
            subtitle={`${packageAlerts} alerts`}
            subtitleColor={palette.destructive}
            meta={{
              iconName: 'clock-o',
              iconColor: colors.mutedText,
              text: lastSyncedText,
              textColor: colors.text,
              label: 'Last synced',
              labelColor: colors.mutedText,
            }}
            extra={(
              <Pressable
                onPress={fetchNow}
                hitSlop={10}
                accessibilityLabel="Refresh packages"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <FontAwesome name="refresh" size={16} color={colors.text} />
              </Pressable>
            )}
          />

          {/* Scan */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Scan</Text>
          <DashboardCard
            onPress={() => router.push('/(tabs)/scan')}
            accessibilityLabel="Open Scan"
            icon={{ name: 'qrcode', color: palette.white, backgroundColor: colors.tint }}
            title="Scan"
            subtitle="Scan a package"
          />

          {/* Map */}
          <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Map</Text>
          <DashboardCard
            onPress={() => router.push('/(tabs)/map')}
            accessibilityLabel="Open Map"
            icon={{ name: 'map', color: palette.white, backgroundColor: colors.tint }}
            title="Map"
            subtitle="View route & ETA"
          />
        </View>
      </ScrollView>

      {/* Overlays */}
      <DriverSheet
        visible={driverOpen}
        onClose={() => setDriverOpen(false)}
        driver={driver}
        onOpenPackages={() => {
          setDriverOpen(false);
          setPackagesOpen(true);
        }}
      />
      <PackagesModal isOpen={packagesOpen} onClose={() => setPackagesOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '800'},
  headerSubtitle: { fontSize: 12, marginTop: 4 },
  contentScroll: { paddingBottom: 96 },
  contentPad: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  divider: { height: 1, width: '100%', marginVertical: 16 },
});
