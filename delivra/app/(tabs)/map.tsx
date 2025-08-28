import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Mapbox from '@rnmapbox/maps';

export default function MapScreen() {
  return (
    <SafeAreaView className="flex-1">
      <View style={{ flex: 1 }}>
        <Mapbox.MapView 
          style={{ flex: 1 }}
          styleURL={Mapbox.StyleURL.Street}
          attributionEnabled={true}
          logoEnabled={true}
        >
          <Mapbox.Camera 
            zoomLevel={12} 
            centerCoordinate={[18.0686, 59.3293]} // Stockholm
            animationMode="flyTo"
            animationDuration={2000}
          />
        </Mapbox.MapView>
      </View>
    </SafeAreaView>
  );
}
