import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  // Default to 'development' for local runs if NODE_ENV is not set
  const nodeEnv = process.env.NODE_ENV || 'development';

  let androidPackage: string;
  let iosBundleIdentifier: string;

  // Set the package/bundle identifiers based on the build environment
  if (nodeEnv === 'development') {
    androidPackage = 'com.delivra.dev';
    iosBundleIdentifier = 'com.delivra.dev';
  } else {
    // Fallback for production or other environments
    androidPackage = 'com.delivra.production';
    iosBundleIdentifier = 'com.delivra.production';
  }

  console.log(`Using NODE_ENV='${nodeEnv}'`);
  console.log(` - Android Application ID: ${androidPackage}`);
  console.log(` - iOS Bundle Identifier: ${iosBundleIdentifier}`);

  return {
    ...config,
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
      ...config.ios,
      bundleIdentifier: iosBundleIdentifier,
    },
    android: {
      ...config.android,
      package: androidPackage,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-web-browser',
      'expo-dev-client',
      ['@rnmapbox/maps', { RNMapboxMapsDownloadToken: process.env.MAPBOX_DOWNLOADS_TOKEN }],
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    extra: {
      ...config.extra,
      // Consumed in app/_layout.tsx via Constants.expoConfig?.extra
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN ?? '',
    },
  };
};
