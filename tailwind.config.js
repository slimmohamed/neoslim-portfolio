/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1E1E1E',
        light: '#F4F4F5',
        green: '#5EA08C',
        beige: '#F5DEB3',
        blue: '#2B6777',
        lime: '#CFEF00',
        gray: '#A3A3A3',
        border: '#3C3C3C'
      },
      fontFamily: {
        crimson: ['Crimson Pro', 'serif'],
        agrandir: ['Agrandir', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        fadeInUp: 'fadeInUp 1s ease-out forwards',
        pulseSlow: 'pulse 4s ease-in-out infinite',
        fadeIn: 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    }
  },
  plugins: [],
}
