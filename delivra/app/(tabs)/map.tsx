import React, { useRef, useCallback } from 'react';
import { Pressable } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import DriverSheet from '@/components/DriverSheet';
import Colors, { Palette } from '@/constants/Colors';

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const initializedRef = useRef(false);
  const { colorScheme } = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;
  const [sheetVisible, setSheetVisible] = React.useState(false);
  const driver = {
    name: 'Marcus Johnson',
    role: 'Your delivery driver',
    rating: 4.8,
    eta: '2:45 PM',
    progress: 75,
    photo: require('../../assets/images/driver-headshot.png'),
  } as const;

  const setInitialCamera = useCallback(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    requestAnimationFrame(() => {
      cameraRef.current?.setCamera({
        centerCoordinate: [18.0686, 59.3293],
        zoomLevel: 12,
        animationDuration: 0,
      });
    });
  }, []);

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

          {/* Truck marker with gradient chip; opens the driver sheet on tap */}
          <Mapbox.MarkerView coordinate={[18.0686, 59.3293]} anchor={{ x: 0.5, y: 0.5 }}>
            <Pressable onPress={() => setSheetVisible(true)}>
              {/* <LinearGradient
                colors={['#1590a6', '#3b82f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.35,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                }}
              > */}
<FontAwesome name="truck" size={40} color={Palette.markerTruck} style={{ transform: [{ rotate: '0deg' }] }} />
              {/* </LinearGradient> */}
            </Pressable>
          </Mapbox.MarkerView>

        </Mapbox.MapView>
      <DriverSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} driver={driver} />
    </SafeAreaView>
  );
}
