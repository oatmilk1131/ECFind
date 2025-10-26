/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

      colors: {
        'custom-orange': '#ffb300',
        'custom-blue' : '#98c9e7ff',
      },
    },
  },
  plugins: [],
};