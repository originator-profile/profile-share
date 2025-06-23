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
      "@typescript-eslint/no-var-required": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["postcss.config.cjs", "vite.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["src/components/*.tsx"],
    rules: {
      "canonical/filename-match-exported": [
        "error",
        { transformers: "pascal" },
      ],
    },
  },
  {
    files: ["src/pages/**/*.tsx"],
    rules: {
      // pages/ のファイル名は generouted の規則に従うので eslint のルールは無視する
      "canonical/filename-match-exported": "off",
    },
  },
  {
    ignores: ["src/router.ts"],
  },
];
