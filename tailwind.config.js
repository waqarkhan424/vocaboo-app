/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // 👇 Map Tailwind font utilities to your loaded RN font families
      fontFamily: {

        // nunito: ["NunitoSans-Regular"],
        // "nunito-bold": ["NunitoSans-Bold"],
        // "nunito-italic": ["NunitoSans-Italic"],

       sans: ["NunitoSans-Regular"],        // Use Nunito Sans as the default sans‑serif
      'sans-bold': ["NunitoSans-Bold"],
      'sans-italic': ["NunitoSans-Italic"],

      },
    },
  },
  plugins: [],
};
