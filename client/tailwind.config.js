/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'jira-blue': '#0052CC',
        'jira-blue-dark': '#0747A6',
        'jira-dark': '#091E42',
        'jira-navy-card': '#172B4D',
        'jira-orange': '#FFAB00',
        'jira-orange-hover': '#FF991F',
        'jira-light-blue': '#DEEBFF',
        'jira-light-gray': '#F4F5F7',
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Primary indigo
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        }
      }
    }
  },
  plugins: []
};
