module.exports = {
  plugins: {
    tailwindcss: {},
    "postcss-prefix-selector": {
      prefix: ":is(#profile-web-extension-root, #headlessui-portal-root)",
      exclude: ["#profile-web-extension-root"],
      includeFiles: ["src/content-script/style.css"],
    },
    autoprefixer: {},
  },
};
