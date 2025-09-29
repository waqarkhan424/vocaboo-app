/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // 👇 Map Tailwind font utilities to your loaded RN font families
      // Extend the default font family so that the "sans" stack and
      // its bold/italic variants use the custom Nunito Sans fonts.
      // We also keep the existing `nunito*` keys for components that
      // explicitly reference those names.  When you define `sans` here
      // it controls what the `font-sans` class expands to, which we
      // will apply globally via the base layer in global.css.
      fontFamily: {
        // Default sans-serif font for the entire project
        sans: ["NunitoSans-Regular"],
        "sans-bold": ["NunitoSans-Bold"],
        "sans-italic": ["NunitoSans-Italic"],
        // Preserve the explicit Nunito aliases for manual use
        nunito: ["NunitoSans-Regular"],
        "nunito-bold": ["NunitoSans-Bold"],
        "nunito-italic": ["NunitoSans-Italic"],
      },
    },
  },
  plugins: [],
};
