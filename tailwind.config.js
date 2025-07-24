/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'mali': ['Mali', 'cursive'],
      },
      colors: {
        'brand': {
          'blue': '#4153C8',
          'red': '#E42D1C', 
          'yellow': '#FFEC0F',
          'green': '#36AD42',
          'pink': '#FD7BCC',
          'dark': '#073B4C',
        }
      }
    },
  },
  plugins: [],
};