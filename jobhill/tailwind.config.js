/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'poppins': ['Poppins', 'sans-serif'],
          'inter': ['Inter', 'sans-serif'],
        },
        screens: {
          // móviles
          'xs': '320px',       // iPhone SE
          'xm': '375px',       // iPhone 6/7/8, X
          'sm': '414px',       // iPhone Plus, XR
          // tablets
          'md': '768px',       // iPad mini, Galaxy Tab
          'lg': '1024px',      // iPad horizontal, laptop chico
          'xl': '1280px',      // laptop estándar
          '2xl': '1536px',     // monitor grande
          '3xl': '1920px',     // Full HD
          '4xl': '2560px',     // 2K
          '5xl': '3840px',     // 4K
        },
        placeholderColor: {
          'dataFilter': '#0353A4'
        }
      },
    },
    plugins: [],
  }