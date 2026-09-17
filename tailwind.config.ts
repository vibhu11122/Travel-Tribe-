import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Brand tokens */
        navy: {
          DEFAULT: '#1B3A42',
          dark: '#112730',
          50: '#EBF2F4',
          100: '#C4D9DE',
          200: '#9DC0C9',
          300: '#76A7B4',
          400: '#4F8E9F',
          500: '#1B3A42',
          600: '#163038',
          700: '#11262D',
          800: '#0C1C22',
          900: '#071317',
        },
        cream: {
          DEFAULT: '#FDFBF7',
          dark: '#F4EFE6',
          muted: '#E8E0D0',
        },
        orange: {
          DEFAULT: '#E36F2C',
          light: '#F08040',
          50: '#FEF4EC',
          100: '#FDE0C8',
          200: '#FBCBA4',
          300: '#F9B680',
          400: '#F7A15C',
          500: '#E36F2C',
          600: '#C45B1F',
          700: '#A44812',
          800: '#843605',
          900: '#642300',
        },
        gold: {
          DEFAULT: '#F2A340',
          light: '#F7BE6A',
        },
        skyblue: {
          DEFAULT: '#4ABDE8',
          light: '#7DD4F5',
        },
        forest: {
          DEFAULT: '#2D7A5A',
          light: '#3DA374',
        },
        /* shadcn compatibility */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        headline: ['Outfit', 'var(--font-outfit)', 'sans-serif'],
        body: ['Nunito', 'var(--font-nunito)', 'sans-serif'],
        sans: ['Nunito', 'var(--font-nunito)', 'sans-serif'],
      },
      borderRadius: {
        'sm': '10px',
        'md': '18px',
        'lg': '28px',
        'pill': '100px',
        DEFAULT: '10px',
      },
      boxShadow: {
        'card': '0 8px 32px rgba(27,58,66,0.10)',
        'card-hover': '0 16px 48px rgba(27,58,66,0.18)',
        'heavy': '0 16px 48px rgba(27,58,66,0.24)',
        'orange': '0 4px 20px rgba(227,111,44,0.35)',
        'orange-lg': '0 8px 32px rgba(227,111,44,0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'float': 'float 3s ease-in-out infinite',
        'counter': 'counter 2s ease forwards',
        'shimmer': 'shimmer 1.4s infinite linear',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'hero-gradient': 'linear-gradient(to top, rgba(10,24,28,0.92) 0%, rgba(10,24,28,0.4) 50%, transparent 100%)',
        'card-gradient': 'linear-gradient(to top, rgba(10,24,28,0.85) 0%, transparent 60%)',
        'orange-gradient': 'linear-gradient(135deg, #E36F2C, #F08040)',
        'navy-gradient': 'linear-gradient(135deg, #1B3A42, #112730)',
      },
    },
  },
  plugins: [animate],
}

export default config
