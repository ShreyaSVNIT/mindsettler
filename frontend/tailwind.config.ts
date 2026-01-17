import type { Config } from "tailwindcss";
// Container queries plugin removed to avoid missing dependency in this environment

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

      boxShadow: {
        'brand-pink': '0 12px 40px rgba(227, 115, 131, 0.12)',
        'brand-pink-lg': '0 20px 50px rgba(227, 115, 131, 0.18)'
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
