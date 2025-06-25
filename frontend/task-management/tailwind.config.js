/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Scans all relevant files
  ],
  darkMode: "class", // Use `.dark` class for toggling dark mode
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        cardForeground: "var(--card-foreground)",
        popover: "var(--popover)",
        popoverForeground: "var(--popover-foreground)",
        primary: "var(--primary)",
        primaryForeground: "var(--primary-foreground)",
        secondary: "var(--secondary)",
        secondaryForeground: "var(--secondary-foreground)",
        muted: "var(--muted)",
        mutedForeground: "var(--muted-foreground)",
        accent: "var(--accent)",
        accentForeground: "var(--accent-foreground)",
        destructive: "var(--destructive)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        sidebar: "var(--sidebar)",
        sidebarForeground: "var(--sidebar-foreground)",
        sidebarPrimary: "var(--sidebar-primary)",
        sidebarPrimaryForeground: "var(--sidebar-primary-foreground)",
        sidebarAccent: "var(--sidebar-accent)",
        sidebarAccentForeground: "var(--sidebar-accent-foreground)",
        sidebarBorder: "var(--sidebar-border)",
        sidebarRing: "var(--sidebar-ring)",
        // Add chart colors if used in Tailwind classes:
        chart1: "var(--chart-1)",
        chart2: "var(--chart-2)",
        chart3: "var(--chart-3)",
        chart4: "var(--chart-4)",
        chart5: "var(--chart-5)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },
      borderRadius: {
        sm: "calc(var(--radius) - 4px)",
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)",
        xl: "calc(var(--radius) + 4px)",
      },

    },
  },
  plugins: [],
};
