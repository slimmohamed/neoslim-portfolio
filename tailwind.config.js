/** @type {import('tailwindcss').Config} */
export default {
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
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'pulse-slow': 'pulse 4s ease-in-out infinite'
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
      },
    }
  },
  plugins: [],
}
module.exports = {
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./assets/js/**/*.js"
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
        border: '#3C3C3C'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-in': 'slideInFromLeft 0.6s ease-out forwards'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}