/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FACC15',
        secondary: '#FB923C',
        dark: '#0F172A',
        accent: '#10B981',
      },
      backgroundImage: {
        'gradient-taxi': 'linear-gradient(90deg, #FACC15 0%, #FB923C 50%, #F97316 100%)',
        'gradient-radial': 'radial-gradient(circle at top, #FACC15 0%, #0B0B0B 55%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}