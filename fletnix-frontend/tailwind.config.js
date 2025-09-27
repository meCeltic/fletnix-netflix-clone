/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{html,ts}",
    ],
    theme: {
      extend: {
        colors: {
          'netflix-red': '#E50914',
          'netflix-black': '#000000',
          'netflix-dark': '#141414',
          'netflix-gray': '#333333'
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  }
  