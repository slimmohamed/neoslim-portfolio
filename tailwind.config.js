module.exports = {
  theme: {
    extend: {
      fontFamily: {
        crimson: ['Crimson Pro', 'serif'],
        agrandir: ['Agrandir', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
};