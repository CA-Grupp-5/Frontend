import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

// Dedicated MMKV instance for delivery-related state
const storage = new MMKV({ id: 'delivery' });
const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

type DeliveryDriver = {
  name: string;
  role: string;
  rating: number;
  progress: number; // 0-100
};

interface DeliveryState {
  eta: string; 
  driver: DeliveryDriver;
  packagesTotal: number;
  packageAlerts: number;

  setEta: (eta: string) => void;
  setDriver: (driver: DeliveryDriver) => void;
  setPackages: (total: number, alerts: number) => void;
}

export const useDeliveryStore = create<DeliveryState>()(
  persist(
    (set) => ({
      eta: '--',
      driver: {
        name: 'Marcus Johnson',
        role: 'Your delivery driver',
        rating: 4.8,
        progress: 75,
      },
      packagesTotal: 50,
      packageAlerts: 17,

      setEta: (eta) => set({ eta: eta && eta.trim() ? eta : '--' }),
      setDriver: (driver) => set({ driver }),
      setPackages: (total, alerts) => set({ packagesTotal: total, packageAlerts: alerts }),
    }),
    {
      name: 'delivery-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ eta: s.eta, driver: s.driver, packagesTotal: s.packagesTotal, packageAlerts: s.packageAlerts }),
    }
  )
);

