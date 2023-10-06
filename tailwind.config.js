/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        'background-100': 'rgb(var(--color-background-100) / <alpha-value>)',
        'background-200': 'rgb(var(--color-background-200) / <alpha-value>)',
        'background-300': 'rgb(var(--color-background-300) / <alpha-value>)',
      },
      keyframes: {
        ripple: {
          '0%': { opacity: '0' },
          '25%': { opacity: '0.25' },
          '100%': {
            width: '200%',
            'padding-bottom': '200%',
            opacity: '0',
          },
        },
        'indeterminate-short-ltr': {
          '0%': { left: '-100%', right: '100%' },
          '60%': { left: '107%', right: '-8%' },
          to: { left: '107%', right: '-8%' },
        },
      },
      animation: {
        ripple: 'ripple 300ms ease-in',
        'spin-fast': 'spin 1s linear infinite',
        spin: 'spin 3s linear infinite',
        'spin-slow': 'spin 5s linear infinite',
        'indeterminate-short-ltr': 'indeterminate-short-ltr 2s ease-out infinite',
      },
      fontSize: {
        '2xs': '.625rem',
      },
    },
  },
  safelist: [
    {
      pattern:
        /(bg|outline|text)-(black|white|primary|surface|background|background-100|background-200|background-300)/,
    },
    {
      pattern:
        /(bg|outline|text)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchia|pink|rose)-(50|100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  plugins: [],
};
