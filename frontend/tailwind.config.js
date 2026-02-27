/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        aliexpress: {
          red: "#FF9100",       // primary CTA (neon orange)
          darkred: "#E57A00",   // darker orange for hover
          black: "#121212",     // dark background
          white: "#E0E0E0",     // light text
          darkgray: "#1E1E1E",  // cards/sections
          medgray: "#808080",   // secondary text
          lightgray: "#B0B0B0", // subtle text
          bgcolor: "#121212",   // page background
          border: "#2A2A2A",    // borders
          accent: "#FF3860"     // secondary accent (neon pink)
        }
      },
      fontFamily: {
        'sans': ['Segoe UI', 'Roboto', 'sans-serif'],
        'display': ['Poppins', 'sans-serif']
      },
      animation: {
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fadeIn 0.5s ease-in'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        }
      }
    }
  },
  plugins: []
}