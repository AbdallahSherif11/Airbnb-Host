/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{html,ts}","./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors:{
        main:'var(--main)',
        mainHover:'var(--mainHover)'
      },
      fontFamily:{
        airbnb:['Inter','sans-serif']
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

