import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a3a5c',
          50: '#f0f5fa',
          100: '#dce8f4',
          200: '#b9d1e9',
          300: '#8ab3d7',
          400: '#5b8ec0',
          500: '#3a70a8',
          600: '#2c578d',
          700: '#1a3a5c',
          800: '#162e4a',
          900: '#10243a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
