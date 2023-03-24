module.exports = {
  content: ['./views/*', './index.js', './social.json'],
  theme: {
    extend: {
      colors: {
        primary: '#da22ff',
        secondary: '#9733ee',
      },
      screens: {
        xs: '440px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
