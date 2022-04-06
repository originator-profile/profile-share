/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  plugins: ["tsc"],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    "tsc/config": ["error", { configFile: "tsconfig.json" }],
    "react/react-in-jsx-scope": "off",
  },
};
