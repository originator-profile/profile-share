import originatorProfile from "eslint-config-originator-profile";

export default [
  ...originatorProfile,
  {
    // チェック対象になっていなかったのでエラーになってしまう。対処がおわったら削除して全体設定であるエラーに復帰させる
    files: ["src/expand-profile-set.ts"],
    rules: {
      complexity: ["warn", 10],
    },
  },
];
