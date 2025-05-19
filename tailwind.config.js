/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primární
        'teal': {
          DEFAULT: '#0ABAB5',
          'dark': '#05807C',
          'light': '#8AE0DC',
        },
        // Sekundární
        'indigo': {
          DEFAULT: '#3E5C76',
          'dark': '#293F54',
          'light': '#CDD6E0',
        },
        // Akcentní
        'amber': {
          DEFAULT: '#FFA62B',
        },
        'peach': {
          DEFAULT: '#FFCAB1',
          'light': '#FFE8DF',
        },
        'mint': {
          DEFAULT: '#C5E1A5',
          'dark': '#7CB342',
        },
        // Neutrální
        'gray': {
          'lightest': '#F7F9FA',
          'light': '#E1E5E9',
          'DEFAULT': '#454E57',
          'dark': '#1D242B',
        },
        // Kategorie
        'blue': {
          'energy': '#4FC3F7',
          'light': '#BBDEFB',
        },
        'purple': {
          'lavender': '#B39DDB',
          'light': '#D1C4E9',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
