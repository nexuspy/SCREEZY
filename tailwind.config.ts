import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-space-grotesk)', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                background: '#09090B',
                foreground: '#FAFAFA',
                muted: {
                    DEFAULT: '#27272A',
                    foreground: '#A1A1AA',
                },
                accent: {
                    DEFAULT: '#DFE104',
                    foreground: '#000000',
                },
                border: '#3F3F46',
                // Keep some existing shadcn colors for compatibility
                card: {
                    DEFAULT: '#09090B',
                    foreground: '#FAFAFA',
                },
                primary: {
                    DEFAULT: '#DFE104',
                    foreground: '#000000',
                },
                secondary: {
                    DEFAULT: '#27272A',
                    foreground: '#FAFAFA',
                },
                destructive: {
                    DEFAULT: '#EF4444',
                    foreground: '#FAFAFA',
                },
                ring: '#DFE104',
            },
            borderRadius: {
                lg: "0px",      // Sharp corners for brutalism
                md: "0px",
                sm: "0px",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
