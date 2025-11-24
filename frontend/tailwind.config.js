export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx,jsx,js}"],
    theme: {
      extend: {
        colors: {
          brand: {
            DEFAULT: "#6366F1",  // primary indigo
            light: "#818CF8",
            dark: "#4F46E5",
          },
          surface: {
            light: "#F7F8FA",
            dark: "#0F172A",
          },
          card: {
            light: "#FFFFFF",
            dark: "#1E293B"
          }
        },
        borderRadius: {
          xl2: "1.25rem"
        },
        boxShadow: {
          card: "0 4px 14px rgba(0,0,0,0.08)",
          soft: "0 2px 8px rgba(0,0,0,0.05)",
        },
        backgroundImage: {
          "brand-gradient": "linear-gradient(135deg, #6366F1, #00E5FF)",
        },
      },
    },
    plugins: [],
  };
  