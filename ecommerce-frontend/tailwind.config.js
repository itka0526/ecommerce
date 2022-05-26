module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            screens: {
                "max-2xl": { max: "1535px" },
                // => @media (max-width: 1535px) { ... }

                "max-xl": { max: "1279px" },
                // => @media (max-width: 1279px) { ... }

                "max-lg": { max: "1023px" },
                // => @media (max-width: 1023px) { ... }

                "max-md": { max: "767px" },
                // => @media (max-width: 767px) { ... }

                "max-sm": { max: "639px" },
                // => @media (max-width: 639px) { ... }
            },
            backgroundSize: {
                "pre-underline": "0% 2px",
                underline: "100% 2px",
            },
            animation: {
                blinking: "blinking 1.1s linear infinite;",
            },
            keyframes: {
                blinking: {
                    "0%, 50%, 60%, 100%": {
                        opacity: "0",
                    },

                    "80%": {
                        opacity: "1",
                    },
                },
            },
        },
    },
    plugins: [],
};
