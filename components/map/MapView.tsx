import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from 'nativewind';
import Colors, { Palette } from '@/constants/Colors';
import Constants from 'expo-constants';
import { geocodeAddress, type LngLat } from '@/lib/mapbox';
import { computeBoundsFromRoute, expandBoundsAround } from '@/lib/map-geometry';
import MapStyleToggle from '@/components/map/MapStyleToggle';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { useSettingsStore, type MapStyleOption } from '@/stores/settingsStore';

const BOUNDS_PADDING = 48;
const HOME_ADDRESS = 'Sveavagen 168, 113 46 Stockholm, Sweden' as const;
const DRIVER_POSITION: LngLat = [18.0686, 59.3293];

type MapViewProps = {
  onDriverPress?: () => void;
  onEtaChange?: (eta: string) => void;
};

export default function MapView({ onDriverPress, onEtaChange }: MapViewProps) {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const routeBoundsAppliedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const { colorScheme } = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

  const STYLE_OPTIONS = useMemo(
    () => [
      { key: 'dark', label: 'Dark', url: Mapbox.StyleURL.Dark },
      { key: 'light', label: 'Light', url: Mapbox.StyleURL.Street },
      {
        key: 'satellite',
        label: 'Satellite',
        url: 'mapbox://styles/mapbox/satellite-streets-v12',
      },
    ],
    [],
  );
  const mapStyle = useSettingsStore((s) => s.mapStyle);
  const setMapStyle = useSettingsStore((s) => s.setMapStyle);
  const currentStyle = STYLE_OPTIONS.find((option) => option.key === mapStyle) ?? STYLE_OPTIONS[0];

  const [home, setHome] = useState<LngLat | null>(null);
  const [routeGeom, setRouteGeom] = useState<any | null>(null);
  const [eta, setEta] = useState<string>('');
  const setEtaStore = useDeliveryStore((s) => s.setEta);
  useEffect(() => {
    onEtaChange?.(eta);
    setEtaStore(eta);
  }, [eta, onEtaChange, setEtaStore]);

  const defaultBounds = useMemo(() => expandBoundsAround(DRIVER_POSITION, 0.12, 0.08), []);

  const fitBounds = useCallback((bounds: { ne: LngLat; sw: LngLat }, duration: number) => {
    requestAnimationFrame(() => {
      cameraRef.current?.setCamera({
        bounds: {
          ...bounds,
          paddingLeft: BOUNDS_PADDING,
          paddingRight: BOUNDS_PADDING,
          paddingTop: BOUNDS_PADDING,
          paddingBottom: BOUNDS_PADDING,
        },
        animationDuration: duration,
      });
    });
  }, []);

  const handleMapLoaded = useCallback(() => {
    setMapReady(true);
    routeBoundsAppliedRef.current = false;
  }, []);

  useEffect(() => {
    geocodeAddress(HOME_ADDRESS, {
      country: 'SE',
      proximity: DRIVER_POSITION,
      limit: 5,
    })
      .then(feature => {
        if (feature?.center) setHome(feature.center as LngLat);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapReady || !home) return;
    routeBoundsAppliedRef.current = false;
  }, [home, mapReady]);

  useEffect(() => {
    const token = (Constants?.expoConfig?.extra as any)?.MAPBOX_ACCESS_TOKEN as string | undefined;
    if (!token || !home) return;

    routeBoundsAppliedRef.current = false;
// Not a huge deal to have public token here, but could be more secure
    const fetchRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${DRIVER_POSITION[0]},${DRIVER_POSITION[1]};${home[0]},${home[1]}?geometries=geojson&overview=full&annotations=duration,distance&steps=false&access_token=${token}`;
        const res = await fetch(url);
        const json = await res.json();
        const first = json?.routes?.[0];
        if (first?.geometry) {
          setRouteGeom(first.geometry);
          const durSec: number = first.duration ?? 0;
          const etaDate = new Date(Date.now() + durSec * 1000);
          const etaStr = etaDate.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          });
          setEta(etaStr);
        }
      } catch (e) {
        console.warn('Failed to fetch Mapbox route', e);
      }
    };

    fetchRoute();
  }, [home]);

  useEffect(() => {
    if (!mapReady || routeBoundsAppliedRef.current || !routeGeom) return;
    const bounds = computeBoundsFromRoute(routeGeom);
    if (!bounds) return;

    fitBounds(bounds, 400);
    routeBoundsAppliedRef.current = true;
  }, [routeGeom, fitBounds, mapReady]);

  const routeFeature = useMemo(() => (routeGeom ? { type: 'Feature', geometry: routeGeom } : null), [routeGeom]);

  const routeLineStyle = useMemo(
    () => ({
      lineColor: tint,
      lineWidth: 4,
      lineOpacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }),
    [tint],
  );

  const handleDriverPress = useCallback(() => {
    onDriverPress?.();
  }, [onDriverPress]);

  return (
    <>
      <Mapbox.MapView
        style={styles.map}
        styleURL={currentStyle.url}
        attributionEnabled
        logoEnabled
        zoomEnabled
        scrollEnabled
        rotateEnabled
        pitchEnabled
        compassEnabled
        gestureSettings={{
          panEnabled: true,
          pinchPanEnabled: true,
          pinchZoomEnabled: true,
          rotateEnabled: true,
          pitchEnabled: true,
          quickZoomEnabled: true,
          simultaneousRotateAndPinchZoomEnabled: true,
          doubleTapToZoomInEnabled: true,
          doubleTouchToZoomOutEnabled: true,
        }}
        onDidFinishLoadingMap={handleMapLoaded}
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            bounds: {
              ...defaultBounds,
              paddingLeft: BOUNDS_PADDING,
              paddingRight: BOUNDS_PADDING,
              paddingTop: BOUNDS_PADDING,
              paddingBottom: BOUNDS_PADDING,
            },
          }}
        />

        {routeFeature && (
          <Mapbox.ShapeSource id="routeSource" shape={routeFeature as any}>
            <Mapbox.LineLayer id="routeLine" style={routeLineStyle} />
          </Mapbox.ShapeSource>
        )}

        <Mapbox.MarkerView coordinate={DRIVER_POSITION} anchor={{ x: 0.5, y: 0.5 }}>
          <Pressable
            onPress={handleDriverPress}
            accessibilityRole="button"
            accessibilityLabel="Open driver details"
            hitSlop={10}
          >
            <View style={[styles.driverMarker, { backgroundColor: tint }]}>
              <FontAwesome name="truck" size={24} color={Palette.white} />
            </View>
          </Pressable>
        </Mapbox.MarkerView>

        {home && (
          <Mapbox.MarkerView coordinate={home} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.homeMarkerContainer}>
              <View style={[styles.homeMarker, { backgroundColor: tint }]}>
                <FontAwesome name="home" size={22} color={Palette.white} />
              </View>
            </View>
          </Mapbox.MarkerView>
        )}
      </Mapbox.MapView>

      <MapStyleToggle
        label={currentStyle.label}
        tint={tint}
        onPress={() => {
          const currentIndex = STYLE_OPTIONS.findIndex((option) => option.key === mapStyle);
          const next = (currentIndex + 1) % STYLE_OPTIONS.length;
          const nextKey = STYLE_OPTIONS[next].key as MapStyleOption;
          setMapStyle(nextKey);
        }}
      />
    </>
  );
}



const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  driverMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeMarkerContainer: {
    alignItems: 'center',
  },
  homeMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
