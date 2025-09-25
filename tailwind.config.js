// Tailwind CSS Configuration for CDN
tailwind.config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["aqua", "lofi", "business", "dark", "light", "retro", "valentine"],
  },
}