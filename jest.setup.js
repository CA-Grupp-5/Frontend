import 'react-native-gesture-handler/jestSetup';

// Mock Reanimated (required for Jest)
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

// Optional: Silence Expo warnings
jest.mock('expo-constants', () => ({
  ...jest.requireActual('expo-constants'),
  manifest: { extra: {} },
}));
