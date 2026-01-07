import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e55d80",
          hover: "#eb81a5",
        },

        "bg-app": "#f3eded",
        "bg-card": "#ffffff",
        "bg-subtle": "#faf9fb",

        "text-body": "#453859",

        "border-muted": "#e8e6eb",
      },

      fontFamily: {
        title: ["var(--font-title)", "serif"],
        body: ["var(--font-ivy)", "serif"],
      },
    },
  },

  plugins: [],
};

export default config;
