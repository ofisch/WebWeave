/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50",
        primarylight: "#96ADC5",
        secondary: "#CCCCCC",
        action: "#00BFFF",
      },
      fontFamily: {
        sometype: ["sometype"],
        sourcecode: ["sourcecode"],
      },
    },
  },
  plugins: [],
};
