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

// Provide Safe Area defaults to avoid wrapping every test with a provider
jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    ...jest.requireActual('react-native-safe-area-context'),
    SafeAreaProvider: ({ children }) => children,
    useSafeAreaInsets: () => insets,
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets,
    },
  };
});
