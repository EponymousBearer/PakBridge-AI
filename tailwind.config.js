/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Stitch Design System Colors
        primary: '#b8c3ff',
        'on-primary': '#002387',
        'primary-container': '#2d5bff',
        'on-primary-container': '#efefff',
        'inverse-primary': '#104af0',
        secondary: '#ddfcff',
        'on-secondary': '#00363a',
        'secondary-container': '#00f1fe',
        'on-secondary-container': '#006a70',
        tertiary: '#ffb4aa',
        'on-tertiary': '#690003',
        'tertiary-container': '#d71a18',
        'on-tertiary-container': '#ffece9',
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
        
        // Neutral Surfaces & Boundaries
        background: '#0f131f',
        'on-background': '#dfe2f3',
        surface: '#0f131f',
        'surface-dim': '#0f131f',
        'surface-bright': '#353946',
        'surface-container-lowest': '#0a0e1a',
        'surface-container-low': '#171b28',
        'surface-container': '#1b1f2c',
        'surface-container-high': '#262a37',
        'surface-container-highest': '#313442',
        'on-surface': '#dfe2f3',
        'on-surface-variant': '#c4c5d9',
        'inverse-surface': '#dfe2f3',
        'inverse-on-surface': '#2c303d',
        outline: '#8e90a2',
        'outline-variant': '#434656',

        // Legacy / Compatibility mapping
        'background-light': '#F8F9FA',
        'surface-light': '#FFFFFF',
        'text-primary-light': '#202124',
        'text-secondary-light': '#5F6368',
        'background-dark': '#0f131f', // Mapped to dark background
        'surface-dark': '#1b1f2c', // Mapped to surface-container
        'text-primary-dark': '#dfe2f3',
        'text-secondary-dark': '#c4c5d9',
        
        // Active agents
        agent: {
          retrieval: '#2d5bff',
          detection: '#ffb4aa',
          reasoning: '#00f1fe',
          simplification: '#ddfcff',
          execution: '#b8c3ff'
        }
      },
      spacing: {
        base: '8px',
        gutter: '16px',
        'stack-sm': '4px',
        'stack-md': '12px',
        'stack-lg': '24px',
        'container-margin': '24px',
      },
      borderRadius: {
        'sm': '0.25rem',
        'DEFAULT': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        'full': '9999px',
      }
    },
  },
  plugins: [],
}
