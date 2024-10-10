import originatorProfile from "eslint-config-originator-profile";
import globals from "globals";

export default [
  ...originatorProfile,
  {
    files: ["postcss.config.cjs", "tailwind.config.cjs", "esbuild.*.cjs"],
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
    files: ["esbuild.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
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
    files: ["e2e/**/*.test.ts"],
    rules: {
      "require-atomic-updates": "off",
    },
  },
  {
    files: ["manifest.mjs"],
    rules: {
      "canonical/filename-match-exported": "off",
    },
  },
  {
    // チェック対象になっていなかったのでエラーになってしまう。対処がおわったら削除して全体設定であるエラーに復帰させる
    files: ["src/utils/use-profile-set.ts", "src/components/DpMarker.tsx"],
    rules: {
      complexity: ["warn", 10],
    },
  },
];
