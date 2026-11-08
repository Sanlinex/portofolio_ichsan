import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F2EFE9", // Warm editorial off-white
        foreground: "#0E0E0E", // Deep editorial ink black
        muted: "#6B6760", // Editorial muted grey-brown
        hairline: "rgba(14, 14, 14, 0.14)", // 1px subtle editorial dividers
        "hairline-dark": "rgba(242, 239, 233, 0.18)", // 1px light divider on dark section
        surface: "#EAE6DE", // Slightly darker paper surface
        "surface-dark": "#161616", // Inverse dark surface
        accent: {
          DEFAULT: "#FF4D1C", // Editorial Orange-Red accent
          hover: "#E03F12",
          subtle: "rgba(255, 77, 28, 0.12)",
        },
        inverse: {
          DEFAULT: "#0E0E0E",
          foreground: "#F2EFE9",
          muted: "#9E9B94",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Instrument Serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter Tight", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        editorial: "-0.04em",
        tightest: "-0.06em",
        widest: "0.18em",
      },
      animation: {
        "pulse-subtle": "pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
