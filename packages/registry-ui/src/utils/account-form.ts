import justFilterObject from "just-filter-object";
import * as Yup from "yup";

export interface IFormInput {
  domainName: string;
  name: string;
  postalCode: string;
  addressRegion: string;
  addressLocality: string;
  streetAddress: string;
  phoneNumber?: string;
  email?: string;
  corporateNumber?: string;
  businessCategory?: string;
  url: string;
  contactTitle?: string;
  contactUrl?: string;
  publishingPrincipleTitle?: string;
  publishingPrincipleUrl?: string;
  privacyPolicyTitle?: string;
  privacyPolicyUrl?: string;
  description?: string;
}

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
const convertToHalfWidth = (value?: string) =>
  value?.normalize("NFKC").replaceAll(/[ー\p{Dash}]/gu, "-");

export const stripEmpty = (data: IFormInput) =>
  justFilterObject(data, (_, value) => value);
/*
 * 半角数字数字7桁の郵便番号をハイフン付きの半角数字郵便番号に変換する。日本の郵便番号のみサポート。
 * @param value - 文字列（半角数字7桁）
 * @returns ハイフン付きの郵便番号
 */
const normalizeJapanPostalCode = (value?: string) =>
  value?.replace(/^(\d{3})(\d{4})$/, "$1-$2");

export const formValidationSchema: Yup.ObjectSchema<IFormInput> = Yup.object({
  domainName: Yup.string()
    .trim()
    .required("このフィールドを入力してください。"),
  name: Yup.string().trim().required("このフィールドを入力してください。"),
  postalCode: Yup.string()
    .trim()
    .transform(convertToHalfWidth)
    .transform(normalizeJapanPostalCode)
    // 日本の郵便番号の形式のみ受け付ける
    .matches(/^\d{3}-?\d{4}$/u, {
      message: "不正な郵便番号です。",
      excludeEmptyString: true,
    })
    .required("このフィールドを入力してください。"),
  addressRegion: Yup.string()
    .oneOf(prefectures, "都道府県を選択してください。")
    .required("このフィールドを入力してください。"),
  addressLocality: Yup.string()
    .trim()
    .required("このフィールドを入力してください。"),
  streetAddress: Yup.string()
    .trim()
    .required("このフィールドを入力してください。"),
  phoneNumber: Yup.string()
    .trim()
    .transform(convertToHalfWidth)
    .matches(/^[-\d]+$/u, {
      message: "不正な電話番号です。",
      excludeEmptyString: true,
    })
    .optional(),
  email: Yup.string().trim().email("不正なメールアドレスです。").optional(),
  // 13桁の数字または空文字列（未記入）
  corporateNumber: Yup.string()
    .trim()
    .transform(convertToHalfWidth)
    .matches(/^\d{13}$/, {
      message: "不正な法人番号です。",
      excludeEmptyString: true,
    })
    .optional(),
  businessCategory: Yup.string().trim().optional(),
  url: Yup.string()
    .trim()
    .url("不正な URL です。")
    .required("このフィールドを入力してください。"),
  contactTitle: Yup.string().optional(),
  contactUrl: Yup.string().trim().url("不正な URL です。").optional(),
  publishingPrincipleTitle: Yup.string().optional(),
  publishingPrincipleUrl: Yup.string()
    .trim()
    .url("不正な URL です。")
    .optional(),
  privacyPolicyTitle: Yup.string().optional(),
  privacyPolicyUrl: Yup.string().trim().url("不正な URL です。").optional(),
  description: Yup.string().optional(),
});
