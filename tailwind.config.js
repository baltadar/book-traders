/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#10b981",
        accent: "#f59e0b",
        dark: "#1f2937",
        light: "#f3f4f6",
      },
    },
  },
  plugins: [],
}