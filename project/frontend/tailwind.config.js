/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0B0F19',
        'dark-card': '#111827',
        'dark-card-2': '#1F2937',
        'dark-border': '#374151',
        'primary': '#3B82F6',
        'primary-hover': '#2563EB',
        'success': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
      },
    },
  },
  plugins: [],
}
