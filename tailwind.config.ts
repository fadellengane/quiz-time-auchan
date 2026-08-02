import type { Config } from "tailwindcss";

// Palette inspirée d'Auchan : rouge signature, blanc, gris très clair.
// Le rouge est utilisé avec parcimonie (CTA, accents) sur un fond
// très clair pour un rendu premium proche d'Apple / Stripe / Linear.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        auchan: {
          red: "#E2001A",
          "red-dark": "#B50014",
          "red-light": "#FFE7EA",
        },
        ink: "#14141A",
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F6F6F8",
          muted: "#EFEFF3",
        },
        border: "#E7E7EC",
        ring: "#E2001A",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
        "3xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(20,20,26,0.04), 0 8px 24px rgba(20,20,26,0.06)",
        card: "0 1px 2px rgba(20,20,26,0.04), 0 12px 32px rgba(20,20,26,0.08)",
        glow: "0 0 0 6px rgba(226,0,26,0.08)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
