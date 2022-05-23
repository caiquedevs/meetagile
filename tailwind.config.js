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

        'gray-450': '#7C7C7C',
        'sky-550': '#078FF3',
        'zinc-750': '#363A40',
        'teal-350': '#42E5CC',
        'gray-default': '#DDDFE2',
      },
      fontSize: {
        '2.5xl': '1.7rem',
      },
      gridTemplateColumns: {
        userList: 'repeat(auto-fit, minmax(260px, 1fr))',
      },
      lineHeight: {
        initial: 'initial',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scale: {
          '0%': { opacity: 0, transform: 'scale(0.5)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'pulse-intense': {
          '0%, 100%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.3,
          },
        },
      },
      animation: {
        'pulse-intense': 'pulse-intense 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        fadeIn: 'fadeIn 0.5s ease-in-out',
        scale: 'scale 0.2s cubic-bezier(.4,0,.2,1)',
      },

      minWidth: {
        '400px': '400px',
        '245px': '245px',
        '300px': '300px',
      },
      maxWidth: {
        '400px': '400px',
        '245px': '245px',
        '300px': '300px',
      },
    },
  },
};
