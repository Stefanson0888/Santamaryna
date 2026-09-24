/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F8F5F0',
        'warm-white': '#FDFCFA',
        charcoal: '#1A1814',
        mid: '#6B6560',
        light: '#C8C2B8',
        accent: '#B8976A',
        'accent-light': '#E8D9C0',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        jost: ['Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
