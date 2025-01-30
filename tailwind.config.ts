import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D3557", // Dark Blue
        secondary: "#457B9D", // Steel Blue
        tertiary: "#A8DADC", // Light Cyan
        quaternary: "#F1FAEE", // Off-White
        accent: "#E63946", // Red

        // // Dark Mode Overrides
        // "primary-dark": "#1D3557",
        // "secondary-dark": "#457B9D",
        // "tertiary-dark": "#A8DADC",
        // "quaternary-dark": "#2A9D8F", // Darker Green
        // "accent-dark": "#F1FAEE",
      },
    },
  },
  plugins: [],
} satisfies Config;
