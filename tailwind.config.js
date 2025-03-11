/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          dark: "#3C2A21",
          medium: "#8B5A2B",
          light: "#C8B6A6",
          cream: "#FFFDD0",
          accent: "#A67B5B",
          bg: "#FDF6EC",
        },
      },
    },
  },
  plugins: [],
};
