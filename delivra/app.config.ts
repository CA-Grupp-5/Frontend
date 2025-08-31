import 'dotenv/config';

export default {
  expo: {
    name: 'expo-nativewind-typescript-boilerplate',
    slug: 'expo-nativewind-typescript-boilerplate',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
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
    plugins: ['expo-router', 'expo-font', 'expo-web-browser', 'expo-dev-client'],
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

