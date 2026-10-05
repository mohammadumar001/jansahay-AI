/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f1',
          100: '#feeedc',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        tiranga: {
          orange: '#FF9933',
          green: '#138808',
          blue: '#000080'
        }
      }
    },
  },
  plugins: [],
}
