// @ts-check
import { fixupPluginRules } from "@eslint/compat";
import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import canonicalPlugin from "eslint-plugin-canonical";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import reactConfig from "eslint-plugin-react/configs/recommended.js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/", "dist-*/", "playwright-report/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  reactConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-hooks": fixupPluginRules(reactHooks),
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      canonical: fixupPluginRules(canonicalPlugin),
      vitest,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "canonical/filename-match-exported": ["error", { transforms: "kebab" }],
      "react/react-in-jsx-scope": "off",

      // Possible Problems
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      "array-callback-return": "error",
      "no-await-in-loop": "error",
      "no-constructor-return": "error",
      "no-duplicate-imports": "error",
      "no-promise-executor-return": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "no-unused-private-class-members": "error",
      "no-use-before-define": "error",
      "require-atomic-updates": "error",

      // Best Practices
      eqeqeq: "error",
      "no-var": "error",
      "max-depth": ["error", 2],
      complexity: ["error", 10],
    },
  },
  {
    files: ["eslint.config.mjs"],
    rules: {
      "canonical/filename-match-exported": "off",
    },
  },
);
