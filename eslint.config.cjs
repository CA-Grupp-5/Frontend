// Flat ESLint config for TS + React Native, minimal/noisy rules off
const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  // Ignore common build/output dirs
  { ignores: ['node_modules/', 'dist/', 'build/', '.expo/', '.expo-shared/', 'android/', 'ios/', 'web-build/', 'scripts/start-expo.cjs'] },

  // Base JS recommended rules
  js.configs.recommended,

  // App source (TS/JS/React)
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, React: 'readonly', require: 'readonly', process: 'readonly' },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    rules: {
      // Keep noise low, focus on real issues
      'no-console': 'off',
      'no-debugger': 'warn',

      // Prefer TS-aware unused vars; allow underscore-ignored
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // React basics
      ...require('eslint-plugin-react/configs/recommended').rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',

      // React Hooks bug-catchers
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Native: disable noisy rules
      'react-native/no-inline-styles': 'off',
      'react-native/no-raw-text': 'off',
    },
    linterOptions: { reportUnusedDisableDirectives: true },
  },

  // Node config files (JS/CJS)
  {
    files: [
      '**/*.config.js',
      '**/*.config.cjs',
      'babel.config.js',
      'metro.config.js',
      'tailwind.config.js',
      'react-native.config.js',
      '.eslintrc.js',
      '.prettierrc.js',
      'scripts/**/*.js',
      'scripts/**/*.cjs'
    ],
    languageOptions: {
      sourceType: 'script',
      globals: { ...globals.node },
    },
    rules: { 'no-undef': 'off' },
  },

  // Node config (TS) e.g., Expo app config
  {
    files: ['app.config.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: { 'no-undef': 'off' },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', 'jest.setup.js', 'jest.setup.ts'],
    languageOptions: {
      parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.jest,
      },
    },
    
    rules: {
      'no-undef': 'off',
    },
  },

  // Turn off stylistic conflicts with Prettier
  prettier,
];
