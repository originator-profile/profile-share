import originatorProfile from "eslint-config-originator-profile";

export default [
  ...originatorProfile,
  {
    files: ["**/prisma-client.ts"],
    rules: {
      "canonical/filename-match-exported": "off",
    },
  },
];
