import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

//#region mocks and helpers
// Mocks

jest.mock('@rnmapbox/maps', () => {
  const Null = () => null;
  const mock = {
    MapView: Null,
    Camera: Null,
    ShapeSource: Null,
    LineLayer: Null,
    MarkerView: Null,
    StyleURL: { Dark: 'mapbox://dark', Street: 'mapbox://street' },
  };
  return { __esModule: true, default: mock, ...mock };
});

jest.mock('@expo/vector-icons/FontAwesome', () => () => null);
jest.mock('nativewind', () => ({ useColorScheme: () => ({ colorScheme: 'light' }) }));

// MMKV > in-memory
const memory: Record<string, string> = {};
jest.mock('react-native-mmkv', () => {
  class MMKV {
    constructor(_opts: any) {}
    getString(name: string) {
      return Object.prototype.hasOwnProperty.call(memory, name) ? memory[name] : undefined;
    }
    set(name: string, value: string) {
      memory[name] = value;
    }
    delete(name: string) {
      delete memory[name];
    }
  }
  return { MMKV };
});

// Disable geocoding side-effects
jest.mock('@/lib/mapbox', () => ({ geocodeAddress: jest.fn(async () => undefined) }));

// Imports under test
import MapView from '@/components/map/MapView';
import { useSettingsStore } from '@/stores/settingsStore';

// Helpers
const LABEL = { dark: 'Dark', light: 'Light', satellite: 'Satellite' } as const;
const a11y = (label: string) => `Map style: ${label}`;

const expectMapStyle = (expected: 'dark' | 'light' | 'satellite') => {
  expect(useSettingsStore.getState().mapStyle).toBe(expected);
};

const pressToggle = (getByLabelText: (l: string) => string, label: string) => {
  fireEvent.press(getByLabelText(a11y(label)));
};

//#endregion

// Tests
describe('MapView map style cycling', () => {
  // Reset store to defaults between tests
  beforeEach(() => {
    useSettingsStore.setState({ mapStyle: 'dark', scannerVibrateOnScan: true } as any);
    for (const k of Object.keys(memory)) delete memory[k];
  });

  it('cycles Dark -> Light -> Satellite -> Dark', () => {
    
    const { getByLabelText } = render(<MapView />);

    expectMapStyle('dark');

    pressToggle(getByLabelText, LABEL.dark);
    expectMapStyle('light');

    pressToggle(getByLabelText, LABEL.light);
    expectMapStyle('satellite');

    pressToggle(getByLabelText, LABEL.satellite);
    expectMapStyle('dark');
  });
});
