import 'dotenv/config';

const enableDevClient = process.env.EXPO_DEV_CLIENT === 'true';

const expoPlugins = ['expo-router', 'expo-font', 'expo-web-browser', 'expo-secure-store', 'expo-asset'];

if (enableDevClient) {
  expoPlugins.push('expo-dev-client');
}

export default {
  expo: {
    name: 'expo-nativewind-typescript-boilerplate',
    slug: 'expo-nativewind-typescript-boilerplate',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: false,
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.teczer.expo-nativewind-typescript-boilerplate',
    },
    android: {
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.teczer.exponativewindtypescriptboilerplate',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: expoPlugins,
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    extra: {
      // Consumed in app/_layout.tsx via Constants.expoConfig?.extra
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN ?? '',
    },
  },
};



