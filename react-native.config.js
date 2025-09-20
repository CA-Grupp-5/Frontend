module.exports = {
  project: {
    android: {
      sourceDir: './android',
      packageName: 'com.teczer.exponativewindtypescriptboilerplate',
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


