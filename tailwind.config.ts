import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F0E8",
        forest: "#1A3C2B",
        gold: "#D4A853",
        ink: "#0E1A14",
        moss: "#294C39",
        clay: "#8B6F47"
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-jakarta)", "sans-serif"]
      },
      boxShadow: {
        ambient: "0 20px 80px rgba(14, 26, 20, 0.14)",
        glow: "0 0 0 1px rgba(212, 168, 83, 0.35), 0 24px 90px rgba(212, 168, 83, 0.18)"
      },
      backgroundImage: {
        grain:
          "radial-gradient(circle at 20% 20%, rgba(212,168,83,0.18), transparent 30%), radial-gradient(circle at 80% 0%, rgba(26,60,43,0.18), transparent 24%), radial-gradient(circle at 50% 100%, rgba(26,60,43,0.12), transparent 36%)"
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseSlow: "pulseSlow 3.6s ease-in-out infinite",
        marquee: "marquee 28s linear infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
