const config = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

  plugins: [require('flowbite/plugin')],

  darkMode: 'class',

  theme: {
    extend: {
      animation: {
        'pop-open': 'pop-open 0.75s',
      },
      keyframes: {
        'pop-open': {
          '0%': { transform: 'scale(3) ' },
          '40%': { transform: 'scale(0.75) ' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B'
        }
      }
    }
  }
};

module.exports = config;
