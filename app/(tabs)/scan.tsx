import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useColorScheme } from 'nativewind';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors, { Palette } from '@/constants/Colors';
import ScanResultSheet, { type ScanResultPayload } from '@/components/ScanResultSheet';

type ParsedPayload = Omit<ScanResultPayload, 'raw'> & { raw: string };

const parseScannedPayload = (raw: string): ParsedPayload => {
  if (!raw) return { raw };
  try {
    const candidate = JSON.parse(raw);
    if (candidate && typeof candidate === 'object') {
      const normalized = candidate as Record<string, unknown>;
      return {
        packageId: String(normalized.packageId ?? normalized.id ?? ''),
        recipient: typeof normalized.recipient === 'string' ? normalized.recipient : typeof normalized.customer === 'string' ? normalized.customer : undefined,
        address: typeof normalized.address === 'string' ? normalized.address : typeof normalized.destination === 'string' ? normalized.destination : undefined,
        notes: typeof normalized.notes === 'string' ? normalized.notes : undefined,
        raw,
      };
    }
  } catch {
    // Ignore parsing errors; fall back to raw string mode.
  }
  return { raw };
};

export default function ScanScreen() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? 'light';
  const [permission, requestPermission] = useCameraPermissions();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [result, setResult] = useState<ScanResultPayload | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!permission) {
      requestPermission().catch(() => {});
    }
  }, [permission, requestPermission]);

  useFocusEffect(
    useCallback(() => {
      setSheetVisible(false);
      setResult(null);
      lastScannedRef.current = null;
      return () => {
        setSheetVisible(false);
        lastScannedRef.current = null;
      };
    }, [])
  );

  const handleBarcodeScanned = useCallback(
    (scan: BarcodeScanningResult) => {
      if (!scan?.data || sheetVisible) return;
      if (scan.data === lastScannedRef.current) return;
      lastScannedRef.current = scan.data;
      const parsed = parseScannedPayload(scan.data);
      setResult(parsed);
      setSheetVisible(true);
    },
    [sheetVisible]
  );

  const handleCloseSheet = useCallback(() => {
    setSheetVisible(false);
    setTimeout(() => {
      setResult(null);
      lastScannedRef.current = null;
    }, 220);
  }, []);

  const handleMarkDelivered = useCallback((payload: ScanResultPayload | null) => {
    setSheetVisible(false);
    setTimeout(() => {
      setResult(null);
      lastScannedRef.current = null;
    }, 220);
    const packageLabel = payload?.packageId ? `Package ${payload.packageId}` : 'Package';
    Alert.alert('Delivered', `${packageLabel} marked as delivered.`);
  }, []);

  const scanningActive = useMemo(() => Boolean(permission?.granted && !sheetVisible), [permission?.granted, sheetVisible]);

  if (!permission) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[scheme].background }]}>
        <Text style={{ color: Colors[scheme].text, fontSize: 16 }}>Preparing camera…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centered, { backgroundColor: Colors[scheme].background, paddingHorizontal: 24 }]}>
        <FontAwesome name="camera" size={48} color={Colors[scheme].tint} style={{ marginBottom: 16 }} />
        <Text style={{ color: Colors[scheme].text, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
          Camera access needed
        </Text>
        <Text style={{ color: scheme === 'dark' ? Palette.gray400 : Palette.gray600, textAlign: 'center', marginBottom: 18 }}>
          Allow camera permissions to scan package QR codes.
        </Text>
        <Pressable
          onPress={() => requestPermission()}
          style={{
            backgroundColor: Colors[scheme].tint,
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 999,
          }}
        >
          <Text style={{ color: Palette.white, fontWeight: '600' }}>Grant permission</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanningActive ? handleBarcodeScanned : undefined}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        <View style={[styles.header, { marginTop: 24 }]}>
          <Text style={{ color: Palette.white, fontSize: 24, fontWeight: '800' }}>Scan package QR</Text>
          <Text style={{ color: Palette.gray300, fontSize: 14, marginTop: 6 }}>
            Align the code inside the frame to capture delivery details.
          </Text>
        </View>

        <View style={styles.frameContainer} pointerEvents="none">
          <View style={styles.frame} />
        </View>

        <View style={styles.footer}>
          <View style={styles.tip}>
            <FontAwesome name="lightbulb-o" size={16} color={Palette.white} />
            <Text style={{ color: Palette.white, fontSize: 13, marginLeft: 8 }}>
              Need to rescan? Close the card after reviewing details.
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScanResultSheet visible={sheetVisible} payload={result} onClose={handleCloseSheet} onMarkDelivered={handleMarkDelivered} />
    </View>
  );
}

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
    alignItems: 'flex-start',
  },
  frameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: '70%',
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Palette.white,
    backgroundColor: 'rgba(0,0,0,0.1)',
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
});
