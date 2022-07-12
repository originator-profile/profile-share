module.exports = {
  plugins: {
    tailwindcss: {},
    "postcss-prefix-selector": {
      prefix: "#profile-web-extension-root",
      exclude: ["#profile-web-extension-root"],
      includeFiles: ["src/content-script/style.css"],
    },
    autoprefixer: {},
  },
};
