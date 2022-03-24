module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // false, class, media
  theme: {
    fontFamily: {
      poppins: ['poppins', 'sans-serif'],
      roboto: ['roboto', 'sans-serif'],
    },
    extend: {
      colors: {
        'primary-light': '#2E86DE',
        'secondary-light': '#54A0FF',
        'primary-dark': '#212832',
        'secondary-dark': '#363A40',

        'sky-550': '#078FF3',
        'zinc-750': '#363A40',
      },
      fontSize: {
        '2.5xl': '1.7rem',
      },
      gridTemplateColumns: {
        userList: 'repeat(auto-fit, minmax(260px, 1fr))',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      screens: {
        tablet: '640px',
        // => @media (min-width: 640px) { ... }

        laptop: '1024px',
        // => @media (min-width: 1024px) { ... }

        desktop: '1280px',
        // => @media (min-width: 1280px) { ... }
      },
      minWidth: {
        '400px': '400px',
      },
    },
  },
  plugins: [require('daisyui')],

  daisyui: {
    themes: ['light'],
  },
};
