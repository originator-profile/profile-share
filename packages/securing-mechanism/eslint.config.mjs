import originatorProfile from "eslint-config-originator-profile";

/** @type { import("eslint").Linter.Config[] } */
export default [
  ...originatorProfile,
  {
    files: ["src/jwt/map-vc.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_" },
      ],
    },
  },
];
