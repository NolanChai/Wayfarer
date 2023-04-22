/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: { 
      'sans': ['Roboto', 'sans-serif']
    },
    extend: {
      colors: {
        'bg_green': 'E9EDC9',
      },
    }
  },
  plugins: [],
}

