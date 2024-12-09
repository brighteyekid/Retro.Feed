/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // More balanced 80s color palette
        neon: {
          purple: "#B24BF3", // Rich purple
          pink: "#FF2D95", // Hot pink
          blue: "#4DEEEA", // Cyan blue
          green: "#39FF14", // Electric green
          yellow: "#FFE700", // Bright yellow
          orange: "#FF8E2B", // Sunset orange
          red: "#FF1F1F", // Bright red
        },
        retro: {
          black: "#0a0a0a",
          dark: "#1a1a2e",
          light: "#2a2a3a",
          gray: "#c4c4c4",
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "cursive"],
        arcade: ['"VT323"', "monospace"],
      },
      animation: {
        "pixel-glitch": "pixel-glitch 0.5s step-end infinite",
        scanline: "scanline 8s linear infinite",
        blink: "blink 1s step-end infinite",
        crt: "crt 0.15s infinite",
        "text-glow": "text-glow 1.5s ease-in-out infinite alternate",
      },
      keyframes: {
        "pixel-glitch": {
          "0%": { transform: "translate(2px, 2px)" },
          "25%": { transform: "translate(-2px, -2px)" },
          "50%": { transform: "translate(0, 0)" },
          "75%": { transform: "translate(1px, -1px)" },
        },
        blink: {
          "50%": { opacity: 0 },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        crt: {
          "0%": {
            transform: "scale(1.0, 1.0)",
            opacity: "0.7",
          },
          "50%": {
            transform: "scale(1.0, 1.01)",
            opacity: "0.8",
          },
          "100%": {
            transform: "scale(1.0, 1.0)",
            opacity: "0.7",
          },
        },
        "text-glow": {
          "0%": {
            textShadow: "0 0 4px #4DEEEA, 0 0 11px #4DEEEA, 0 0 19px #4DEEEA",
          },
          "100%": {
            textShadow: "0 0 4px #B24BF3, 0 0 11px #B24BF3, 0 0 19px #B24BF3",
          },
        },
      },
    },
  },
  plugins: [],
};
