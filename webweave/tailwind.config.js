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
        gradient: "linear-gradient(90deg, #00BFFF 0%, #aeeee8 100%)",
      },
      fontFamily: {
        sometype: ["sometype"],
        sourcecode: ["sourcecode"],
        arial: ["arial"],
        verdana: ["verdana"],
        tahoma: ["tahoma"],
        trebuchet: ["trebuchet MS"],
        times: ["Times New Roman"],
        courier: ["Courier New"],
        georgia: ["Georgia"],
        garamond: ["Book Antiqua"],
        comic: ["Comic Sans MS"],
        brush: ["Brush Script MT"],
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
      backgroundPosition: {
        "pos-0": "0% 0%",
        "pos-100": "100% 100%",
      },
    },
    scale: {
      150: "1.5",
      175: "1.75",
    },
  },
  plugins: [],
};
