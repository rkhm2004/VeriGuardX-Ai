/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Holographic Rainbow Neon Palette
        background: "#0a0a0a", // Deep rich black
        foreground: "#ffffff",
        border: "#00f3ff", // Neon Cyan
        input: "#1a1a1a", // Dark input background
        ring: "#00f3ff",

        // Agent-specific Neon Colors
        primary: {
          DEFAULT: "#00f3ff", // Scan Agent - Cyan
          foreground: "#0a0a0a",
        },
        secondary: {
          DEFAULT: "#64748b",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ff003c", // Risk Agent - Red
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#1a1a1a",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#00f3ff",
          foreground: "#0a0a0a",
        },
        popover: {
          DEFAULT: "#1a1a1a",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#1a1a1a",
          foreground: "#ffffff",
        },

        // Rainbow Agent Colors
        agent: {
          scan: "#00f3ff", // Cyan
          identity: "#2E86AB", // Blue
          provenance: "#bf00ff", // Purple
          anomaly: "#ffea00", // Yellow/Amber
          risk: "#ff003c", // Red
          council: "#ff00ff", // Magenta
        },
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Holographic Rainbow Glow Effects
      boxShadow: {
        'cyber-glow': '0 0 30px rgba(0, 243, 255, 0.15)',
        'cyber-glow-active': '0 0 50px rgba(0, 243, 255, 0.3)',
        'cyber-border': 'inset 0 0 0 1px rgba(0, 243, 255, 0.3)',

        // Agent-specific glows
        'glow-scan': '0 0 30px rgba(0, 243, 255, 0.2)',
        'glow-scan-active': '0 0 50px rgba(0, 243, 255, 0.4)',
        'glow-identity': '0 0 30px rgba(46, 134, 171, 0.2)',
        'glow-identity-active': '0 0 50px rgba(46, 134, 171, 0.4)',
        'glow-provenance': '0 0 30px rgba(191, 0, 255, 0.2)',
        'glow-provenance-active': '0 0 50px rgba(191, 0, 255, 0.4)',
        'glow-anomaly': '0 0 30px rgba(255, 234, 0, 0.2)',
        'glow-anomaly-active': '0 0 50px rgba(255, 234, 0, 0.4)',
        'glow-risk': '0 0 30px rgba(255, 0, 60, 0.2)',
        'glow-risk-active': '0 0 50px rgba(255, 0, 60, 0.4)',
        'glow-council': '0 0 30px rgba(255, 0, 255, 0.2)',
        'glow-council-active': '0 0 50px rgba(255, 0, 255, 0.4)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "scan-line": "scan-line 3s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
module.exports = config
