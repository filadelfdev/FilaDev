import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-geist)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Stitch design system
        'matte-black':              '#0A0A0A',
        'primary-container':        '#facc15',
        'on-primary':               '#3c2f00',
        'on-primary-container':     '#6c5700',
        'on-background':            '#ebe2d0',
        'on-surface':               '#ebe2d0',
        'on-surface-variant':       '#d1c6ab',
        'on-secondary-container':   '#b4b5b5',
        'secondary-container':      '#454747',
        'surface-container':        '#231f14',
        'surface-container-high':   '#2e2a1e',
        'surface-container-highest':'#393428',
        'surface-container-low':    '#1f1b11',
        'surface-container-lowest': '#110e05',
        'surface-dim':              '#171309',
        'surface-bright':           '#3e392d',
        'surface-variant':          '#393428',
        'outline':                  '#9a9078',
        'outline-variant':          '#4d4632',
        'surface-tint':             '#eec200',
        'primary-fixed':            '#ffe083',
        'primary-fixed-dim':        '#eec200',
        'inverse-primary':          '#735c00',
        'inverse-surface':          '#ebe2d0',
        'inverse-on-surface':       '#353024',
        'glass-fill-dark':          'rgba(17,17,17,0.65)',
        'glass-fill-light':         'rgba(255,255,255,0.7)',
        'glass-edge':               'rgba(255,255,255,0.12)',
        'surface':                  '#171309',
        'background':               '#171309',
        // Semantic
        'success':  '#10B981',
        'warning':  '#F59E0B',
        'danger':   '#EF4444',
        'error':    '#ffb4ab',
        // Legacy (kept for landing page compatibility)
        profit:          '#00e676',
        'profit-muted':  '#22C55E',
        cost:            '#ff4444',
        'cost-muted':    '#EF4444',
        rev:             '#60A5FA',
        accent:          '#F5C518',
      },
      borderRadius: {
        sm:      '6px',
        DEFAULT: '8px',
        md:      '10px',
        lg:      '12px',
        xl:      '16px',
        '2xl':   '24px',
        full:    '9999px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'fade-in':         'fade-in 0.3s ease-out',
        'slide-in-left':   'slide-in-left 0.25s ease-out',
        'ticker':          'ticker 30s linear infinite',
      },
    },
  },
  plugins: [animate],
};

export default config;
