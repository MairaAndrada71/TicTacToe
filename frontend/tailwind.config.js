/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#f3f8ff',
        accent: '#fff1f6',
        board: '#fafbff',
        softBlue: '#a7c7e7',
        softPink: '#f9d5e5'
      }
    }
  },
  plugins: []
}
