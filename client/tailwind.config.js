/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideBg: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        rotateScale: {
          '0%, 100%': {
            transform: 'rotate(0deg) scale(1)',
          },
          '50%': {
            transform: 'rotate(5deg) scale(1.1)',
          },
        },
        slowSpin:{
          '0%' : {
            transform: 'rotate(0deg)'
          },
          '100%' : {
            transform:'rotate(60deg)'
          }
        }
      },
      animation: {
        slideBg: 'slideBg 6s infinite alternate ease-in-out',
        slowSpin: '100s linear infinite slowSpin',
        rotateScale: 'rotateScale 5s ease-in-out infinite',
      },
      backgroundSize: {
        'auto-100': 'auto 100%',
      },
      
    },
  },
  plugins: [],
}

