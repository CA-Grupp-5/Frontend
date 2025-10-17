import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

// Dedicated MMKV instance for settings 
const storage = new MMKV({ id: 'settings' });

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

export type MapStyleOption = 'light' | 'dark' | 'satellite';

interface SettingsState {
  // Map
  mapStyle: MapStyleOption;
  setMapStyle: (style: MapStyleOption) => void;

  // Scanner
  scannerVibrateOnScan: boolean;
  setScannerVibrateOnScan: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      mapStyle: 'dark',
      setMapStyle: (style) => set({ mapStyle: style }),

      scannerVibrateOnScan: true,
      setScannerVibrateOnScan: (enabled) => set({ scannerVibrateOnScan: enabled }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        mapStyle: state.mapStyle,
        scannerVibrateOnScan: state.scannerVibrateOnScan,
      }),
    }
  )
);
