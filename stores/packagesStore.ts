import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';
import { fetchPackages, type ApiPackage } from '@/lib/api';

// Dedicated MMKV instance for packages state
const storage = new MMKV({ id: 'packages' });
const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

export type PackagesState = {
  packages: ApiPackage[];
  lastUpdated: number | null;
  loading: boolean;
  error: string | null;

  // actions
  fetchNow: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
};

let pollTimer: ReturnType<typeof setInterval> | null = null;

export const usePackagesStore = create<PackagesState>()(
  persist(
    (set, get) => ({
      packages: [],
      lastUpdated: null,
      loading: false,
      error: null,

      fetchNow: async () => {
        if (get().loading) return;
        set({ loading: true, error: null });
        try {
          const data = await fetchPackages();
          set({ packages: data, lastUpdated: Date.now(), loading: false, error: null });
        } catch (e: any) {
          const msg = typeof e?.message === 'string' ? e.message : 'Failed to fetch packages';
          set({ loading: false, error: msg });
        }
      },

      startPolling: () => {
        if (pollTimer) return; 
        // kick an immediate fetch and then poll every 5 minutes
        get().fetchNow();
        pollTimer = setInterval(() => {
          get().fetchNow();
        }, 5 * 60 * 1000);
      },

      stopPolling: () => {
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
      },
    }),
    {
      name: 'packages-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ packages: s.packages, lastUpdated: s.lastUpdated }),
    }
  )
);

// Utilities
export const isTempInRange = (p: ApiPackage): boolean => {
  const t = typeof p.current_temperature === 'number' ? p.current_temperature : NaN;
  return Number.isFinite(t) && t >= p.expected_temperature_min && t <= p.expected_temperature_max;
};

export const isHumInRange = (p: ApiPackage): boolean => {
  const h = typeof p.current_humidity === 'number' ? p.current_humidity : NaN;
  return Number.isFinite(h) && h >= p.expected_humidity_min && h <= p.expected_humidity_max;
};

