import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import { Pressable,View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import DriverSheet from '@/components/DriverSheet';
import Colors, { Palette } from '@/constants/Colors';
import Constants from 'expo-constants';
import { geocodeAddress } from '@/lib/mapbox';

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const initializedRef = useRef(false);
  const { colorScheme } = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const [sheetVisible, setSheetVisible] = React.useState(false);

  // Origin (truck) coordinate (lon, lat)
  const ORIGIN: [number, number] = [18.0686, 59.3293];
  // Destination: default on-land point in Stockholm (Tele2 Arena vicinity)
  // You can override this by setting HOME_ADDRESS below.
  const [home, setHome] = React.useState<[number, number]>([18.0911, 59.2934]);
  // Set this to any address you want (e.g., 'Arenaslingan 14, Johanneshov, Stockholm').
  // Leave as empty string to use the default coordinates above.
  const HOME_ADDRESS = 'Sveavägen 168, 113 46 Stockholm, Sweden' as const;

  // Navigation state
  const [routeGeom, setRouteGeom] = React.useState<any | null>(null); // GeoJSON LineString
  const [eta, setEta] = React.useState<string>('');

  const driver = React.useMemo(() => ({
    name: 'Marcus Johnson',
    role: 'Your delivery driver',
    rating: 4.8,
    eta: eta || '—',
    progress: 75,
    photo: require('../../assets/images/driver-headshot.png'),
  }), [eta]);

  const setInitialCamera = useCallback(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    requestAnimationFrame(() => {
      cameraRef.current?.setCamera({
        centerCoordinate: ORIGIN,
        zoomLevel: 12,
        animationDuration: 0,
      });
    });
  }, []);

  // Optionally geocode manual HOME address
  useEffect(() => {
    if (!HOME_ADDRESS) return;
    geocodeAddress(HOME_ADDRESS, { country: 'SE', proximity: ORIGIN, limit: 5 })
      .then((feature) => {
        if (feature?.center) setHome(feature.center);
      })
      .catch(() => {});
  }, []);

  // Fetch a live route and ETA using Mapbox Directions API
  useEffect(() => {
    const token = (Constants?.expoConfig?.extra as any)?.MAPBOX_ACCESS_TOKEN as string | undefined;
    if (!token || !home) return;

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

  const routeFeature = useMemo(() => (routeGeom ? { type: 'Feature', geometry: routeGeom } : null), [routeGeom]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <Mapbox.MapView
          style={{ flex: 1 }}
          styleURL={Mapbox.StyleURL.Dark}
          attributionEnabled={true}
          logoEnabled={true}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
          pitchEnabled={true}
          compassEnabled={true}
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
          onDidFinishLoadingMap={setInitialCamera}
        >
          <Mapbox.Camera ref={cameraRef} />

          {/* Render route line if present */}
          {/* play around a bit with line color, width and opacity for a pro look */}
          {routeFeature && (
            <Mapbox.ShapeSource id="routeSource" shape={routeFeature as any}>
              <Mapbox.LineLayer
                id="routeLine"
                style={{
                  lineColor: tint,
                  lineWidth: 4,
                  lineOpacity: 0.9,
                  lineCap: 'round',
                  lineJoin: 'round'
                  
                }}
              />
            </Mapbox.ShapeSource>
          )}

          {/* Truck marker */}
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

          {/* Home marker (destination) */}
          {/* could add tip indicator and elevate */}
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

        </Mapbox.MapView>
      <DriverSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} driver={driver} />
    </SafeAreaView>
  );
}
