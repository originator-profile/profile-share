import originatorProfile from "eslint-config-originator-profile";
import globals from "globals";

export default [
  ...originatorProfile,
  {
    files: ["tailwind.config.cjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["vite.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["src/seed.ts"],
    rules: {
      "no-await-in-loop": "off",
    },
  },
];
