/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#0f5238",
        "primary-container": "#2d6a4f",
        "on-primary": "#ffffff",
        "secondary": "#895100",
        "secondary-container": "#fd9d1a",
        "tertiary": "#404a38",
        "background": "#f8f9fa",
        "surface": "#f8f9fa",
        "on-surface": "#191c1d",
        "emerald-900": "#064e3b",
      },
      fontFamily: {
        'headline': ['Lexend', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}