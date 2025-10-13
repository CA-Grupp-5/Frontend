import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import DriverSheet from '@/components/DriverSheet';
import { PackagesModal } from '@/components/PackagesModal';
import Colors from '@/constants/Colors';
import Constants from 'expo-constants';
import { geocodeAddress, type LngLat } from '@/lib/mapbox';
import { computeBoundsFromRoute, expandBoundsAround } from '@/lib/map-geometry';
import MapStyleToggle from '@/components/MapStyleToggle';

const BOUNDS_PADDING = 48;

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const routeBoundsAppliedRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);
  const { colorScheme } = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const [sheetVisible, setSheetVisible] = useState(false);
  const [packagesVisible, setPackagesVisible] = useState(false);

  // kept simple for now, might expand to a modal if I end up adding more style options
  const STYLE_OPTIONS = useMemo(
    () => [
      { key: 'dark', label: 'Dark', url: Mapbox.StyleURL.Dark },
      { key: 'light', label: 'Light', url: Mapbox.StyleURL.Street },
      { key: 'satellite', label: 'Satellite', url: "mapbox://styles/mapbox/satellite-streets-v12"}

    ],
    []
  );
  const [styleIndex, setStyleIndex] = useState(0);
  const currentStyle = STYLE_OPTIONS[styleIndex];
  
  const driver_position = useMemo<LngLat>(() => [18.0686, 59.3293], []);
  // const INITIAL_DESTINATION: Coordinate = [18.0911, 59.2934];
  const HOME_ADDRESS = 'Sveavagen 168, 113 46 Stockholm, Sweden' as const;
  const [home, setHome] = useState<LngLat | null>(null);

  const [routeGeom, setRouteGeom] = useState<any | null>(null);
  const [eta, setEta] = useState<string>('');

  
  const driver = useMemo(
    () => ({
      name: 'Marcus Johnson',
      role: 'Your delivery driver',
      rating: 4.8,
      eta: eta || '--',
      progress: 75,
      photo: require('../../assets/images/driver-headshot.png'),
    }),
    [eta]
  );

  const defaultBounds = useMemo(() => expandBoundsAround(driver_position, 0.12, 0.08), [driver_position]);

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
    if (!HOME_ADDRESS) return;
    geocodeAddress(HOME_ADDRESS, { country: 'SE', proximity: driver_position, limit: 5 })
      .then((feature) => {
        if (feature?.center) setHome(feature.center as LngLat);
      })
      .catch(() => {});
  }, [driver_position]);

  useEffect(() => {
    if (!mapReady || !home) return;
    routeBoundsAppliedRef.current = false;
  }, [home, mapReady]);

  useEffect(() => {
    const token = (Constants?.expoConfig?.extra as any)?.MAPBOX_ACCESS_TOKEN as string | undefined;
    if (!token || !home) return;

    routeBoundsAppliedRef.current = false;

    const fetchRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${driver_position[0]},${driver_position[1]};${home[0]},${home[1]}?geometries=geojson&overview=full&annotations=duration,distance&steps=false&access_token=${token}`;
        const res = await fetch(url);
        const json = await res.json();
        const first = json?.routes?.[0];
        if (first?.geometry) {
          setRouteGeom(first.geometry);
          const durSec: number = first.duration ?? 0;
          const etaDate = new Date(Date.now() + durSec * 1000);
          const etaStr = etaDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
          setEta(etaStr);
        }
      } catch (e) {
        console.warn('Failed to fetch Mapbox route', e);
      }
    };

    fetchRoute();
  }, [home, driver_position]);

  useEffect(() => {
    if (!mapReady || routeBoundsAppliedRef.current || !routeGeom) return;
    const bounds = computeBoundsFromRoute(routeGeom);
    if (!bounds) return;

    fitBounds(bounds, 400);
    routeBoundsAppliedRef.current = true;
  }, [routeGeom, fitBounds, mapReady]);

  const routeFeature = useMemo(() => (routeGeom ? { type: 'Feature', geometry: routeGeom } : null), [routeGeom]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <Mapbox.MapView
        style={{ flex: 1 }}
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
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineColor: tint,
                lineWidth: 4,
                lineOpacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          </Mapbox.ShapeSource>
        )}

        <Mapbox.MarkerView coordinate={driver_position} anchor={{ x: 0.5, y: 0.5 }}>
          <Pressable
            onPress={() => setSheetVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Open driver details"
            hitSlop={10}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: tint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome name="truck" size={24} color={'hsl(0, 0%, 100%)'} />
            </View>
          </Pressable>
        </Mapbox.MarkerView>

        {home && (
          <Mapbox.MarkerView coordinate={home} anchor={{ x: 0.5, y: 1 }}>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: tint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesome name="home" size={22} color={'hsl(0, 0%, 100%)'} />
              </View>
            </View>
          </Mapbox.MarkerView>
        )}
      </Mapbox.MapView>

      
        <MapStyleToggle
          label={currentStyle.label}
          tint={tint}
          onPress={() => setStyleIndex((prev) => (prev + 1) % STYLE_OPTIONS.length)}
        />

      <DriverSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        driver={driver}
        onOpenPackages={() => {
          setPackagesVisible(true);
        }}
      />
      <PackagesModal isOpen={packagesVisible} onClose={() => setPackagesVisible(false)} />
    </SafeAreaView>
  );
}




