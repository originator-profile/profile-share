import originatorProfile from "eslint-config-originator-profile";

export default [
  ...originatorProfile,
  {
    files: ["**/*.tsx"],
    rules: {
      "canonical/filename-match-exported": [
        "error",
        { transformers: "pascal" },
      ],
    },
  },
  {
    // TODO: 暫定的な変更。コンポーネント更新時には警告がでないようにしたうえでerrorに戻す
    files: ["src/components/CredentialDetail.tsx"],
    rules: {
      complexity: ["warn", 10],
    },
  },
];
