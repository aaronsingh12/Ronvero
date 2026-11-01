/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mist: '#EEF1EC', // primary light background — cool, not cream
        graphite: '#14171A', // ink / dark sections
        ember: '#FF4A2E', // primary accent — CTAs, sale badges
        trace: '#2C3FE0', // secondary accent — links, data, route-line motif
        chalk: '#F5F7F3', // text/icons on dark backgrounds
        char: '#1E211D', // body text on light backgrounds
        sandstone: '#C9C0AC', // warm neutral, used sparingly for variety
        stone: '#8C8778',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(20, 23, 26, 0.06), 0 12px 32px rgba(20, 23, 26, 0.08)',
        lift: '0 8px 24px rgba(20, 23, 26, 0.12), 0 24px 48px rgba(20, 23, 26, 0.1)',
        glow: '0 0 0 1px rgba(255, 74, 46, 0.15), 0 8px 32px rgba(255, 74, 46, 0.18)',
      },
      backdropBlur: {
        xs: '2px',
      },
      letterSpacing: {
        tightest: '-0.04em',
        wideish: '0.02em',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        traceDash: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
