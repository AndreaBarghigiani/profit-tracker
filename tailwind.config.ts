/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "#606251", // dog-600
        ring: "hsl(var(--ring))",
        background: "hsl(var(--dog-900))",
        foreground: "hsl(var(--dog-200))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        main: {
          DEFAULT: "#ffcd1a",
          50: "#fff9e5",
          100: "#ffeeb3",
          200: "#ffe380",
          300: "#ffd84d",
          400: "#ffcd1a",
          500: "#e6b400",
          600: "#b38c00",
          700: "#806400",
          800: "#4d3c00",
          900: "#1a1400",
        },
        dog: {
          DEFAULT: "#7b7e68",
          50: "#f3f3f1",
          100: "#dcdcd5",
          200: "#c4c5ba",
          300: "#acae9e",
          400: "#959781",
          500: "#7b7e68",
          600: "#606251",
          700: "#44463a",
          750: "#292a23",
          800: "#191915",
          850: "#131310",
          900: "#0e0e0c",
        },
        alert: {
          DEFAULT: "#f32648",
          50: "#fee7eb",
          100: "#fbb7c2",
          200: "#f8869a",
          300: "#f55671",
          400: "#f32648",
          500: "#d90c2f",
          600: "#a90a24",
          700: "#79071a",
          800: "#480410",
          900: "#180105",
        },
        success: {
          DEFAULT: "#3cddb2",
          50: "#e9fbf6",
          100: "#bef4e5",
          200: "#92ecd4",
          300: "#67e4c3",
          400: "#3cddb2",
          500: "#22c398",
          600: "#1b9876",
          700: "#136d55",
          800: "#0b4133",
          900: "#041611",
        },
        info: {
          DEFAULT: "#5581c3",
          50: "#ecf1f8",
          100: "#c6d5eb",
          200: "#a1b9de",
          300: "#7b9dd1",
          400: "#5581c3",
          500: "#3c68aa",
          600: "#2e5184",
          700: "#213a5e",
          800: "#142339",
          900: "#070c13",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        redish: {
          DEFAULT: "hsl(var(--redish))",
          end: "hsl(var(--redish-end))",
          border: "hsl(var(--redish-border))",
        },
        blueish: {
          DEFAULT: "hsl(var(--blueish))",
          end: "hsl(var(--blueish-end))",
          border: "hsl(var(--blueish-border))",
        },
        redpurple: {
          DEFAULT: "hsl(var(--redpurple))",
          end: "hsl(var(--redpurple-end))",
          border: "hsl(var(--redpurple-border))",
        },
      },
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      blur: {
        "5xl": "120px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        dog: "0 0 0 2px #959781",
        "main-custom": "0 0 15px 5px rgba(255, 205, 26, .05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "bg-pulse": {
          "0%, 100%": { opacity: 0.1 },
          "50%": { opacity: 0.08 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "bg-pulse": "bg-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
