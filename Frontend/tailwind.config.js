/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#0A0A0F',        // Deep dark background
                    card: '#1A1A24',      // Dark slate for cards
                    border: '#2A2A3E',    // Subtle border
                    text: '#FFFFFF',      // Pure white text
                    secondary: '#A0A0B8', // Muted text
                },
                primary: '#0066FF',       // Electric Blue
                'primary-dark': '#0052CC',
                'primary-light': '#3385FF',
                accent: '#00F0FF',        // Neon Cyan
                'accent-dark': '#00C9D9',
                'accent-light': '#33F3FF',
                success: '#00FF88',       // Vibrant Green
                warning: '#FF6B00',       // Bold Orange
                error: '#FF0066',         // Hot Pink
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #0066FF 0%, #00F0FF 100%)',
                'gradient-dark': 'linear-gradient(135deg, #0A0A0F 0%, #1A1A24 100%)',
                'gradient-card': 'linear-gradient(135deg, #1A1A24 0%, #2A2A3E 100%)',
                'gradient-glow': 'radial-gradient(circle at 50% 0%, rgba(0, 102, 255, 0.15), transparent 70%)',
            },
            boxShadow: {
                'glow-primary': '0 0 20px rgba(0, 102, 255, 0.5), 0 0 40px rgba(0, 102, 255, 0.2)',
                'glow-accent': '0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2)',
                'glow-success': '0 0 20px rgba(0, 255, 136, 0.5)',
                'glow-error': '0 0 20px rgba(255, 0, 102, 0.5)',
                'card-elevated': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1)',
            },
            animation: {
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.02)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
}
