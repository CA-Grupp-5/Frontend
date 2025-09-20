const nativewind = require('nativewind/babel');

module.exports = function (api) {
  api.cache(true);
  const { plugins: nativewindPlugins } = nativewind(api);
  const filteredNativewindPlugins = nativewindPlugins.filter(
    (plugin) => !(typeof plugin === 'string' && plugin === 'react-native-worklets/plugin')
  );

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: [...filteredNativewindPlugins, 'react-native-reanimated/plugin'],
  };
};
