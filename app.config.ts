import 'dotenv/config';

const enableDevClient = process.env.EXPO_DEV_CLIENT === 'true';

const expoPlugins = ['expo-router', 'expo-font', 'expo-web-browser', 'expo-secure-store', 'expo-asset'];

if (enableDevClient) {
  expoPlugins.push('expo-dev-client');
}

export default {
  expo: {
    name: 'delivra',
    slug: 'delivra',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'delivra',
    userInterfaceStyle: 'automatic',
    newArchEnabled: false,
    splash: {
      image: './assets/images/delivra-splash.png',
      resizeMode: 'contain',
      backgroundColor: '#081023',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.delivra',
    },
    android: {
      edgeToEdgeEnabled: true,
      adaptiveIcon: {
        foregroundImage: './assets/images/delivra-adaptive.png',
        backgroundColor: '#081023',
      },
      package: 'com.delivra',
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




