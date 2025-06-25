import originatorProfile from "eslint-config-originator-profile";

export default [
  ...originatorProfile,
  {
    files: ["src/**/*.test.js"],
    rules: {
      "vitest/no-import-node-test": "off",
    },
  },
];
