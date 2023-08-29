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
  plugins: ["tsc", "filenames"],
  settings: {
    react: { version: "detect" },
  },
  ignorePatterns: ["dist", "dist-*", "playwright-report"],
  rules: {
    "tsc/config": ["error", { configFile: "tsconfig.json" }],
    "filenames/match-exported": ["error", "kebab"],
    "react/react-in-jsx-scope": "off",

    // Possible Problems
    /** https://typescript-eslint.io/rules/no-explicit-any */
    "@typescript-eslint/no-explicit-any": "error",
    /** https://typescript-eslint.io/rules/no-non-null-assertion */
    "@typescript-eslint/no-non-null-assertion": "error",
    /** https://typescript-eslint.io/rules/no-unused-vars */
    "@typescript-eslint/no-unused-vars": "error",
    /** https://eslint.org/docs/rules/array-callback-return */
    "array-callback-return": "error",
    /** https://eslint.org/docs/rules/no-await-in-loop */
    "no-await-in-loop": "error",
    /** https://eslint.org/docs/rules/no-constructor-return */
    "no-constructor-return": "error",
    /** https://eslint.org/docs/rules/no-duplicate-imports */
    "no-duplicate-imports": "error",
    /** https://eslint.org/docs/rules/no-promise-executor-return */
    "no-promise-executor-return": "error",
    /** https://eslint.org/docs/rules/no-self-compare */
    "no-self-compare": "error",
    /** https://eslint.org/docs/rules/no-template-curly-in-string */
    "no-template-curly-in-string": "error",
    /** https://eslint.org/docs/rules/no-unmodified-loop-condition */
    "no-unmodified-loop-condition": "error",
    /** https://eslint.org/docs/rules/no-unreachable-loop */
    "no-unreachable-loop": "error",
    /** https://eslint.org/docs/rules/no-unused-private-class-members */
    "no-unused-private-class-members": "error",
    /** https://eslint.org/docs/rules/no-use-before-define */
    "no-use-before-define": "error",
    /** https://eslint.org/docs/rules/require-atomic-updates */
    "require-atomic-updates": "error",

    // Best Practices
    /** https://eslint.org/docs/rules/eqeqeq */
    eqeqeq: "error",
    /** https://eslint.org/docs/rules/no-var */
    "no-var": "error",
    /** https://eslint.org/docs/rules/max-depth */
    "max-depth": ["error", 2],
    /** https://eslint.org/docs/rules/complexity */
    complexity: ["error", 10],
  },
};
