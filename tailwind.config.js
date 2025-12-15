/** @type {import('tailwindcss').Config} */
module.exports = {
  // 注意：這裡的路徑要包含你的 app 目錄或所有包含元件的目錄
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
            primary: '#4DC6B9', // 您的主要顏色
            secondary: '#E0F7FA', // 您的次要顏色
            // 您可以根據需要添加更多顏色
        },
    },
  },
  plugins: [],
}