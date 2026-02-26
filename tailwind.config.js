export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'bg-purple-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-red-500',
    'bg-yellow-500',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        'background-secondary': 'rgb(var(--color-background-secondary) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        card: 'rgb(var(--color-card) / <alpha-value>)',
        'card-hover': 'rgb(var(--color-card-hover) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          dark: 'rgb(var(--color-primary-dark) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
        },
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        'light-blue': 'rgb(var(--color-light-blue) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        popover: 'rgb(var(--color-popover) / <alpha-value>)',
        'popover-foreground': 'rgb(var(--color-popover-foreground) / <alpha-value>)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'DEFAULT': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
      },
      animation: {
        'float': 'float 12s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-xy': 'gradient-xy 20s ease infinite',
        'fade-in': 'fade-in 1s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'bounce-in': 'bounce-in 1.2s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            filter: 'brightness(1)'
          },
          '25%': { 
            transform: 'translateY(-10px) rotate(1deg)',
            filter: 'brightness(1.05)'
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(0deg)',
            filter: 'brightness(1.1)'
          },
          '75%': { 
            transform: 'translateY(-10px) rotate(-1deg)',
            filter: 'brightness(1.05)'
          }
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)',
            filter: 'brightness(1.1)'
          }
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'gradient-xy': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' }
        },
        'fade-in': {
          'from': { 
            opacity: '0', 
            transform: 'translateY(30px) scale(0.95)',
            filter: 'blur(10px)'
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0px) scale(1)',
            filter: 'blur(0px)'
          }
        },
        'slide-up': {
          'from': { 
            opacity: '0', 
            transform: 'translateY(50px) rotateX(10deg)'
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0px) rotateX(0deg)'
          }
        },
        'bounce-in': {
          '0%': { 
            opacity: '0', 
            transform: 'scale(0.3) rotate(-10deg)'
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.05) rotate(2deg)'
          },
          '70%': { 
            transform: 'scale(0.9) rotate(-1deg)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'scale(1) rotate(0deg)'
          }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' }
        }
      },
      backgroundSize: {
        '200': '200% 100%',
        '400': '400% 400%'
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      }
    },
  },
  plugins: [],
};