/** @type {import('tailwindcss').Config} */
const formKitTailwind = require('@formkit/themes/tailwindcss');
const tailwindForms = require('@tailwindcss/forms');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: '',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,mjs}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF640F'
      },
      fontFamily: {
        sans: ['GT Walsheim Pro', ...defaultTheme.fontFamily.sans],
        display: ['Druk Wide', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  plugins: [ formKitTailwind, tailwindForms ]
}
