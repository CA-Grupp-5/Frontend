// module.exports = {
//   env: {
//     browser: true,
//     es2021: true,
//     'react-native/react-native': true,
//   },
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react/recommended',
//     'plugin:react-hooks/recommended',
//     'plugin:react-native/recommended',
//     'prettier',
//   ],
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaFeatures: { jsx: true },
//     ecmaVersion: 'latest',
//     sourceType: 'module',
//     // No `project` set to avoid type-aware overhead/noise
//   },
//   plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-native'],
//   rules: {
//     // Keep noise low, focus on real issues
//     'no-console': 'off',
//     'no-debugger': 'warn',

//     // Prefer TS-aware unused vars; allow underscore-ignored
//     'no-unused-vars': 'off',
//     '@typescript-eslint/no-unused-vars': [
//       'warn',
//       { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
//     ],

//     // Common React/React Native relaxations
//     'react/prop-types': 'off',
//     'react/react-in-jsx-scope': 'off',
//   },
//   settings: {
//     react: { version: 'detect' },
//   },
//   ignorePatterns: [
//     'node_modules/', 'dist/', 'build/', '.expo/', '.expo-shared/',
//   ],
// };
