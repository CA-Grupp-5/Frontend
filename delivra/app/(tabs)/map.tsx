import React, { useRef, useCallback } from 'react';
import { View } from 'react-native';
import Mapbox from '@rnmapbox/maps';

export default function MapScreen() {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const initializedRef = useRef(false);

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
    <View style={{ flex: 1 }}>
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
        </Mapbox.MapView>
    </View>
  );
}
