const path = require("node:path");
const extend = require("just-extend");
const config = require("tailwind-config-originator-profile");

/** @type {import('tailwindcss').Config} */
module.exports = extend(config, {
  content: [
    `${path.dirname(
      require.resolve("@originator-profile/ui"),
    )}/components/*.tsx`,
    "../../packages/registry-ui/index.html",
    "../../packages/registry-ui/{components,pages}/**/*.tsx",
  ],
});
