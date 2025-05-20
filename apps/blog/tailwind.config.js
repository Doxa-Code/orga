/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1216px",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)"],
        work: ["var(--font-work-sans)"],
        serif: ["var(--font-source-serif-pro)"],
      },
      colors: {
        primary: "#2b8ae9",
        section: "#F1F3F6",
        secondary: "#0ed854",
        background: "#F1F4F9",
      },
    },
  },

  plugins: [require("daisyui")],
};
