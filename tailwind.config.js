module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    // add more if needed
  ],
  safelist: [
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-red-500',
    'text-sky-500',
    'text-teal-500',
    'text-indigo-500',
    'text-orange-500',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
