/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'myPink' : '#FF9494',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

