import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import DriverSheet from '@/components/DriverSheet';
import { PackagesModal } from '@/components/PackagesModal';
import Colors from '@/constants/Colors';
import Constants from 'expo-constants';
import { geocodeAddress } from '@/lib/mapbox';

const BOUNDS_PADDING = 48;

type Coordinate = [number, number];

const computeBoundsBetween = (start: Coordinate, end: Coordinate) => {
  const longitudes = [start[0], end[0]];
  const latitudes = [start[1], end[1]];

  return {
    ne: [Math.max(...longitudes), Math.max(...latitudes)] as Coordinate,
    sw: [Math.min(...longitudes), Math.min(...latitudes)] as Coordinate,
  };
};

const computeBoundsFromRoute = (routeGeom: any) => {
  const coords = (routeGeom?.coordinates ?? []) as Coordinate[];
  if (!Array.isArray(coords) || coords.length < 2) return null;

  const longitudes = coords.map(([lon]) => lon);
  const latitudes = coords.map(([, lat]) => lat);

  return {
    ne: [Math.max(...longitudes), Math.max(...latitudes)] as Coordinate,
    sw: [Math.min(...longitudes), Math.min(...latitudes)] as Coordinate,
  };
};

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const routeBoundsAppliedRef = useRef(false);
  const [mapReady, setMapReady] = React.useState(false);
  const { colorScheme } = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const [packagesVisible, setPackagesVisible] = React.useState(false);

  const ORIGIN: Coordinate = [18.0686, 59.3293];
  // const INITIAL_DESTINATION: Coordinate = [18.0911, 59.2934];
  const HOME_ADDRESS = 'Sveavagen 168, 113 46 Stockholm, Sweden' as const;
  const [home, setHome] = React.useState<Coordinate | null>(null);

  const [routeGeom, setRouteGeom] = React.useState<any | null>(null);
  const [eta, setEta] = React.useState<string>('');

  const driver = React.useMemo(
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

  const defaultBounds = useMemo(() => computeBoundsBetween(ORIGIN, ORIGIN), []);

  const fitBounds = useCallback((bounds: { ne: Coordinate; sw: Coordinate }, duration: number) => {
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

  const fitEndpoints = useCallback(
    (duration = 0) => {
      if (!home) return;
      fitBounds(computeBoundsBetween(ORIGIN, home), duration);
    },
    [home, fitBounds]
  );

  const handleMapLoaded = useCallback(() => {
    setMapReady(true);
    routeBoundsAppliedRef.current = false;
    fitEndpoints(0);
  }, [fitEndpoints]);

  useEffect(() => {
    if (!HOME_ADDRESS) return;
    geocodeAddress(HOME_ADDRESS, { country: 'SE', proximity: ORIGIN, limit: 5 })
      .then((feature) => {
        if (feature?.center) setHome(feature.center as Coordinate);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapReady || !home) return;
    fitEndpoints(0);
    routeBoundsAppliedRef.current = false;
  }, [home, mapReady, fitEndpoints]);

  useEffect(() => {
    const token = (Constants?.expoConfig?.extra as any)?.MAPBOX_ACCESS_TOKEN as string | undefined;
    if (!token || !home) return;

    routeBoundsAppliedRef.current = false;

    const fetchRoute = async () => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${ORIGIN[0]},${ORIGIN[1]};${home[0]},${home[1]}?geometries=geojson&overview=full&annotations=duration,distance&steps=false&access_token=${token}`;
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
  }, [home]);

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
        styleURL={Mapbox.StyleURL.Dark}
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

        <Mapbox.MarkerView coordinate={ORIGIN} anchor={{ x: 0.5, y: 0.5 }}>
          <Pressable onPress={() => setSheetVisible(true)}>
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




