/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
     animation: {
  pulseSoft: "pulseSoft 2.8s ease-in-out infinite",
},

keyframes: {
  pulseSoft: {
    "0%, 100%": {
      transform: "scale(1)",
      boxShadow: "0 10px 30px rgba(5, 150, 105, 0.25)",
    },

    "50%": {
      transform: "scale(1.03)",
      boxShadow: "0 16px 40px rgba(5, 150, 105, 0.38)",
    },
  },
},

 heroReveal: {
    "0%": {
      opacity: "0",
      transform: "scale(1.06)",
      filter: "blur(8px)",
    },

    "100%": {
      opacity: "1",
      transform: "scale(1)",
      filter: "blur(0px)",
    },
  },

  
    },
},

  plugins: [],
};