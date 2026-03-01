/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aliexpress: {
          red: "#f97316",       // primary accent (orange-500)
          darkred: "#ea580c",   // darker orange for hover (orange-600)
          black: "#09090b",     // dark background (zinc-950)
          white: "#fafafa",     // light text (zinc-50)
          darkgray: "#18181b",  // card backgrounds (zinc-900)
          medgray: "#a1a1aa",   // secondary text (zinc-400)
          lightgray: "#71717a", // subtle text (zinc-500)
          bgcolor: "#09090b",   // page background (zinc-950)
          border: "#27272a",    // borders (zinc-800)
          accent: "#f97316"     // accent same orange
        }
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'display': ['Inter', 'sans-serif']
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'float-up': 'floatUp 0.6s ease-out forwards',
        'ticker': 'ticker 20s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(249, 115, 22, 0.6)' }
        }
      }
    }
  },
  plugins: []
}