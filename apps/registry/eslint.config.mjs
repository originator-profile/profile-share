import originatorProfile from "eslint-config-originator-profile";

export default [
  ...originatorProfile,
  {
    files: ["src/seed.ts"],
    rules: {
      "no-await-in-loop": "off",
    },
  },
];
