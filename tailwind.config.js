module.exports = {
  purge: {
    enabled: true,
    content: ['./views/*'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#da22ff',
        secondary: '#9733ee',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
