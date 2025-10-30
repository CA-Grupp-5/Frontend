import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View, Vibration } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult, type CameraMountError } from 'expo-camera';
import { useColorScheme } from 'nativewind';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors, { Palette } from '@/constants/Colors';
import ScanResultSheet, { type ScanResultPayload } from '@/components/ScanResultSheet';
import { parseScannedPayload } from '@/lib/scan';
import { formatPackageId } from '@/lib/utils';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAlert } from '@/hooks/useAlert';
import { fetchPackageById, updatePackage } from '@/lib/api';
import { usePackagesStore } from '@/stores/packagesStore';


export default function ScanScreen() {
  const { alert } = useAlert();
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'dark';
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const vibrateOnScan = useSettingsStore((s) => s.scannerVibrateOnScan);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [result, setResult] = useState<ScanResultPayload | null>(null);
  const lastScannedRef = useRef<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [mountError, setMountError] = useState<string | null>(null);
  const [torchEnabled, setTorchEnabled] = useState<boolean>(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');

  useEffect(() => {
    if (!permission) {
      requestPermission().catch(() => {});
    }
  }, [permission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      setMountError(null);
      setSheetVisible(false);
      setResult(null);
      lastScannedRef.current = null;
      return () => {};
    }, []),
  );

  // Ensure the result sheet never remains open when leaving the tab(prev edge case blocker)
  useEffect(() => {
    if (!isFocused && sheetVisible) {
      setSheetVisible(false);
      setResult(null);
      lastScannedRef.current = null;
    }
  }, [isFocused, sheetVisible]);

  const handleBarcodeScanned = useCallback(
    (scan: BarcodeScanningResult) => {
      if (!scan?.data || sheetVisible) return;
      if (scan.data === lastScannedRef.current) return;
      lastScannedRef.current = scan.data;
      const parsed = parseScannedPayload(scan.data);
      if (vibrateOnScan) {
        Vibration.vibrate(50);
      }
      setResult(parsed);
      setSheetVisible(true);
    },
    [sheetVisible, vibrateOnScan],
  );

  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
    setTimeout(() => {
      setResult(null);
      lastScannedRef.current = null;
    }, 220);
  }, []);

  const handleMarkDelivered = useCallback(async (payload: ScanResultPayload | null) => {
    setSheetVisible(false);
    setTimeout(() => {
      setResult(null);
      lastScannedRef.current = null;
    }, 220);

    try {
      const raw = payload?.packageId ? String(payload.packageId) : '';
      const id = raw.replace(/^PKG-/i, '');
      if (!id) throw new Error('Missing package id');

      const pkg = await fetchPackageById(id);
      const updated = await updatePackage({ ...pkg, status: 'delivered' });

      const formattedId = formatPackageId(String(updated.id));
      const packageLabel = formattedId ? `Package ${formattedId}` : 'Package';
      alert('Delivered', `${packageLabel} marked as delivered.`);
      try { usePackagesStore.getState().fetchNow(); } catch { /* ignore refresh errors */ }
    } catch {
      const formattedId = formatPackageId(payload?.packageId);
      const packageLabel = formattedId ? `Package ${formattedId}` : 'Package';
      alert('Failed', `Could not mark ${packageLabel} as delivered.`);
    }
  }, [alert]);

  const scanningActive = useMemo(
    () => Boolean(permission?.granted && !sheetVisible && cameraReady && !mountError && isFocused),
    [permission?.granted, sheetVisible, cameraReady, mountError, isFocused],
  );

  const cameraActive = useMemo(
    () => Boolean(isFocused && permission?.granted && !mountError),
    [isFocused, permission?.granted, mountError],
  );


  if (!permission) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[scheme].background }]}>
        <Text style={{ color: Colors[scheme].text, fontSize: 16 }}>Preparing camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[scheme].background, paddingHorizontal: 24 }]}>
        <FontAwesome name="camera" size={48} color={Colors[scheme].tint} style={{ marginBottom: 16 }} />
        <Text
          style={{ color: Colors[scheme].text, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}
        >
          Camera access needed
        </Text>
        <Text
          style={{
            color: Colors[scheme].mutedText,
            textAlign: 'center',
            marginBottom: 18,
          }}
        >
          Allow camera permissions to scan package QR codes.
        </Text>
        <Pressable
          onPress={() => {
            requestPermission();
          }}
          style={{
            backgroundColor: Colors[scheme].tint,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: 'hsl(210, 20%, 12%)', fontWeight: '600' }}>Grant permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        enableTorch={facing === 'front' ? false : torchEnabled}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        active={cameraActive}
        onBarcodeScanned={scanningActive ? handleBarcodeScanned : undefined}
        onCameraReady={() => {
          setCameraReady(true);
          setMountError(null);
        }}
        onMountError={(error: CameraMountError) => {
          setMountError(error?.message ?? 'Unable to start camera');
          setCameraReady(false);
        }}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.header, { marginTop: 24 }]}>
          <Text style={{ color: Palette.white, fontSize: 24, fontWeight: '800' }}>Scan package QR</Text>
         
        </View>

        <View style={[styles.controls, { top: insets.top + 16 }]} pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={torchEnabled ? 'Turn torch off' : 'Turn torch on'}
            onPress={() => setTorchEnabled((prev) => !prev)}
            disabled={facing === 'front'}
            style={[
              styles.toggles,
              {
                backgroundColor:
                  facing === 'front'
                    ? 'rgba(0,0,0,0.35)'
                    : torchEnabled
                      ? 'hsl(200, 90%, 46%)'
                      : 'rgba(0,0,0,0.35)',
                opacity: facing === 'front' ? 0.6 : 1,
              },
            ]}
          >
            <FontAwesome name="bolt" size={20} color={Palette.white} />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Flip camera"
            onPress={() => setFacing((prev) => (prev === 'back' ? 'front' : 'back'))}
            style={[styles.toggles, { backgroundColor: 'rgba(0,0,0,0.35)', marginLeft: 12 }]}
          >
            <FontAwesome name="refresh" size={20} color={Palette.white} />
          </Pressable>
        </View>

        <View style={styles.frameContainer} pointerEvents="none">
          <View style={styles.frame}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.tip}>
            <FontAwesome name="lightbulb-o" size={16} color={Palette.white} />
            <Text style={{ color: Palette.white, fontSize: 13, marginLeft: 8 }}>
              Align the code inside the frame until details appear.
            </Text>
          </View>
        </View>
      </SafeAreaView>

      {!cameraReady && !mountError ? (
        <View style={styles.loadingCover} pointerEvents="none">
          <ActivityIndicator size="large" color={Palette.white} />
          <Text style={{ color: Palette.white, marginTop: 12, fontWeight: '600' }}>Initializing camera...</Text>
        </View>
      ) : null}

      {mountError ? (
        <View style={styles.loadingCover}>
          <FontAwesome name="exclamation-triangle" size={28} color={Palette.white} />
          <Text style={{ color: Palette.white, marginTop: 12, textAlign: 'center', fontSize: 16, fontWeight: '700' }}>
            Camera unavailable
          </Text>
          <Text style={{ color: Palette.gray300, marginTop: 6, textAlign: 'center' }}>{mountError}</Text>
        </View>
      ) : null}

      <ScanResultSheet
        visible={sheetVisible}
        payload={result}
        onClose={handleCloseSheet}
        onMarkDelivered={handleMarkDelivered}
      />
    </View>
  );
}

// Dimensions for the QR code frame
const FRAME_RADIUS = 24;
const CORNER_LENGTH = 30;
const CORNER_RADIUS = 16;
const CORNER_STROKE = 4;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.black,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignSelf:'flex-start'
  },
  controls: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
  },
  toggles: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: '70%',
    maxWidth: 320,
    aspectRatio: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: FRAME_RADIUS,
  },
  
  corner: {
    position: 'absolute',
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
    borderColor: Palette.white,
    borderRadius: 0,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_STROKE,
    borderLeftWidth: CORNER_STROKE,
    borderTopLeftRadius: CORNER_RADIUS,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_STROKE,
    borderRightWidth: CORNER_STROKE,
    borderTopRightRadius: CORNER_RADIUS,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_STROKE,
    borderLeftWidth: CORNER_STROKE,
    borderBottomLeftRadius: CORNER_RADIUS,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_STROKE,
    borderRightWidth: CORNER_STROKE,
    borderBottomRightRadius: CORNER_RADIUS,
  },
  footer: {
    alignItems: 'center',
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  loadingCover: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 24,
  },
});
