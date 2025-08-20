// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A softer color palette
        'primary-blue': '#4a90e2',
        'dark-blue': '#357abd',
        'light-gray': '#f8f9fa',
        'text-gray': '#495057',
      },
      fontFamily: {
        // Use a professional, sans-serif font
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      // You can add custom spacing, shadows, etc.
      boxShadow: {
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};