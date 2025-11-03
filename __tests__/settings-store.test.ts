import { useSettingsStore } from '@/stores/settingsStore';

jest.mock('react-native-mmkv', () => {
  class MMKV {
    constructor(_opts: any) {}
    getString(_name: string) {
      return undefined;
    }
    set(_name: string, _value: string) {}
    delete(_name: string) {}
  }
  return { MMKV };
});

describe('useSettingsStore actions', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      mapStyle: 'dark',
      scannerVibrateOnScan: true,
    });
  });

  it('updates the stored map style', () => {
    useSettingsStore.getState().setMapStyle('light');
    expect(useSettingsStore.getState().mapStyle).toBe('light');
  });

  it('toggles the scanner vibration flag', () => {
    useSettingsStore.getState().setScannerVibrateOnScan(false);
    expect(useSettingsStore.getState().scannerVibrateOnScan).toBe(false);
  });
});

