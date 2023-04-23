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
        'brown_red': '#b72c2c',
        'paper_yellow': '#FEFAE0',
        'paper_brown': '#d4a373',
        'paper_green': '#e9edc9',
      },
    }
  },
  plugins: [],
}

