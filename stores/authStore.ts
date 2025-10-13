import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Custom MMKV storage adapter for Zustand
const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

interface AuthState {
  isAuthenticated: boolean;
  rememberMe: boolean;
  login: (email?: string, password?: string, rememberMe?: boolean) => Promise<boolean>;
  loginGuest: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      rememberMe: false,
      // Call API: requires password; email optional based on UI default
      login: async (email?: string, password?: string, rememberMe = false): Promise<boolean> => {
        if (!password || !password.trim()) return false;
        try {
          const { login: apiLogin } = await import('@/lib/api');
          await apiLogin(email ?? '', password);
          set({ isAuthenticated: true, rememberMe });
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      },

      // Guest login always authenticates
      loginGuest: () => {
        set({ isAuthenticated: true, rememberMe: false });
      },
      
      logout: () => {
        set({ 
          isAuthenticated: false, 
          rememberMe: false 
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe 
      }),
    }
  )
);
