export const prefectures = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

/*
 * 文字列中の全角数字、半角ハイフンに似ている文字、を半角に変換する。
 * @param value - 文字列
 * @returns 変換後の文字列
 */
const convertToHalfWidth = (value: string) =>
  value.normalize("NFKC").replaceAll(/[ー\p{Dash}]/gu, "-");

/*
 * 数字7桁の郵便番号をハイフン付きの半角数字郵便番号に変換する。日本の郵便番号のみサポート。
 * @param value - 文字列（数字7桁）
 * @returns ハイフン付きの半角数字郵便番号
 */
export const normalizeJapanPostalCode = (value: string) =>
  convertToHalfWidth(value).replace(/^(\d{3})(\d{4})$/, "$1-$2");

/*
 * 電話番号を半角に変換する。
 * @param value - 文字列（電話番号）
 * @returns 半角の電話番号
 */
export const normalizePhoneNumber = (value: string) =>
  convertToHalfWidth(value);

/*
 * 文字列が URL として有効かどうかを検証する。react-hook-form のバリデーションルールとして使用することを想定。
 * @param value - バリデーション対象の値
 * @returns エラーメッセージ。バリデーションを通過した場合は true を返す。
 */
export const validateUrlString = (value: string | undefined) => {
  if (!value) {
    return true;
  }
  try {
    new URL(value);
    return true;
  } catch (_) {
    return "URL を入力してください。";
  }
};
