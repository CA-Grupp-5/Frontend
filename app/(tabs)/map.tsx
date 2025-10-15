import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DriverSheet from '@/components/DriverSheet';
import { PackagesModal } from '@/components/PackagesModal';
import MapView from '@/components/MapView';

export default function MapScreen() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [packagesVisible, setPackagesVisible] = useState(false);
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

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <MapView
        onDriverPress={() => setSheetVisible(true)}
        onEtaChange={setEta}
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




