/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './Navigation.{js,jsx,ts,tsx}',
  ],
  plugins: [],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      animation: {},
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      colors: {
        
        // Palette colors from Colors.ts
        palette: {
          // Base
          white: 'hsl(0, 0%, 100%)',
          black: 'hsl(0, 0%, 0%)',
          
          // App-specific tint
          tint: 'hsl(200, 90%, 55%)',
          
          // Grays
          gray: {
            50: 'hsl(210, 20%, 98%)',
            200: 'hsl(220, 13%, 91%)',
            300: 'hsl(216, 12%, 84%)',
            400: 'hsl(218, 11%, 65%)',
            500: 'hsl(220, 9%, 46%)',
            600: 'hsl(215, 14%, 34%)',
            700: 'hsl(217, 19%, 27%)',
            900: 'hsl(221, 39%, 11%)',
          },
          
          // Card backgrounds
          'dark-card-bg': 'hsl(219, 30%, 15%)',
          'light-card-bg': 'hsl(220, 15%, 96%)',
          
          // Accents
          amber: {
            500: 'hsl(38, 92%, 50%)',
          },
          
          // Map marker
          'marker-truck': 'hsl(189, 78%, 37%)',
          
          // Overlay
          'backdrop-overlay': 'hsla(0, 0%, 0%, 0.5)',
          
          // Neutral
          neutral: {
            800: 'hsl(0, 0%, 20%)',
          },
          
          // Navigation surfaces
          'dark-tab-bg': 'hsl(221, 49%, 8%)',
          'dark-tab-border': 'hsl(222, 47%, 11%)',
        },
      },
      filter: {
        dropShadowDark: 'drop-shadow(0 1px 1px rgb(255 255 255 / 1))',
        dropShadowLight: 'drop-shadow(0 1px 1px rgb(0 0 0 / 1))',
      },
      fontFamily: {
        mono: ['SpaceMono'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
    },
  },
};
