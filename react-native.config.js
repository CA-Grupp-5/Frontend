module.exports = {
  project: {
    android: {
      sourceDir: './android',
      packageName: 'com.delivra',
    },
    ios: {
      sourceDir: './ios',
    },
  },
  dependencies: {
    'react-native-gesture-handler': {
      // Keep RNGH disabled; Mapbox gestures do not require it
      platforms: { android: null, ios: null },
    },
  },
};



