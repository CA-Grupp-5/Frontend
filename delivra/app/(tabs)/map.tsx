import React, { useRef, useCallback } from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import Colors from '@/constants/Colors';

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const initializedRef = useRef(false);
  const { colorScheme } = useColorScheme();
  const tint = Colors[colorScheme ?? 'light'].tint;

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

          {/* Truck marker built as a custom RN view */}
          <Mapbox.MarkerView coordinate={[18.0686, 59.3293]} anchor={{ x: 0.5, y: 0.5 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: tint,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOpacity: 0.35,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <FontAwesome name="truck" size={20} color="#ffffff" />
            </View>
          </Mapbox.MarkerView>
        </Mapbox.MapView>
    </SafeAreaView>
  );
}
  
