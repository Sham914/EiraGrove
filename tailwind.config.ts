import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        grove: {
          gold: "#C9A962",
          cream: "#F5F0E8",
          charcoal: "#1A1A1A",
          mist: "#8B9DAF",
          night: "#0D1117",
          sunset: "#E87B4A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
