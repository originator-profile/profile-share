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

export const NAMES = {
  domainName: "組織代表ドメイン名",
  name: "所有者",
  postalCode: "郵便番号",
  addressRegion: "都道府県",
  addressLocality: "市区町村",
  streetAddress: "町名・番地・ビル名・部屋番号など",
  phoneNumber: "電話番号",
  email: "メールアドレス",
  corporateNumber: "法人番号",
  businessCategory: "事業種目",
  url: "WebサイトURL",
  contactTitle: "お問い合わせページの名称",
  contactUrl: "お問い合わせページ URL",
  publishingPrincipleTitle: "編集ガイドラインページの名称",
  publishingPrincipleUrl: "編集ガイドラインページ URL",
  privacyPolicyTitle: "プライバシーポリシーページの名称",
  privacyPolicyUrl: "プライバシーポリシーページ URL",
  description: "説明",
} as const;

export const HELP_TEXT = {
  domainName:
    "OP ID になります。法人組織の ID であり、コンテンツを配信するサイト・サービスや CMS のドメインとは独立です。",
  name: "法人・組織の正式名称 (省略無し) を記入してください。",
  postalCode:
    "法人・組織の所在地の郵便番号を記入してください。半角数字7桁またはハイフン付きの半角数字郵便番号を入力してください。",
  addressRegion: undefined,
  addressLocality: undefined,
  streetAddress: undefined,
  phoneNumber:
    "代表電話番号を記入してください。公開できない場合は省略可能です。",
  email:
    "代表メールアドレスを記入してください。公開できない場合は省略可能です。",
  corporateNumber:
    "国税庁により指定された13桁の法人番号を記入してください。法人番号を明記することで、国の管理・確認を受けた法人として信頼性向上につながる可能性があります。",
  businessCategory:
    "日本標準産業分類のうち、御社の主たる業務として該当するものを記入してください。組織情報への掲載を希望しない場合は省略可能です。",
  url: "法人・組織のメインサイト URL を記入してください。OP 情報表示画面からリンクされます。実証実験を行うサイトやサービスの URL ではなく、法人・組織としてのメインサイトを記載してください。",
  description:
    "法人・組織の情報として上記の他に掲載すべき (読者から見て信頼性の判断に有用な) 追加の説明情報やリンク先があれば、HTML 形式で記載してください。",
  contactTitle: undefined,
  contactUrl: undefined,
  publishingPrincipleTitle: undefined,
  publishingPrincipleUrl: undefined,
  privacyPolicyTitle: undefined,
  privacyPolicyUrl: undefined,
};

export const HELP_TEXT_PAGE_FIELD_SETS = {
  contact:
    "法人・組織の (サイトやサービス毎ではない) 代表お問い合わせ先をリンク付きで表示します。「お問い合わせ」「ご意見・お問い合わせ」「CONTACT US」など、該当ページのタイトルや名称を記載してください。省略も可能ですが原則として記載してください。",
  publishingPrinciple:
    "編集ガイドラインまたはそれを含む情報の掲載先をリンク付きで表示します。「編集ガイドライン」など、該当ページのタイトルや名称を記載してください。",
  privacyPolicy:
    "プライバシーポリシーまたはそれを含むポリシー情報の掲載先をリンク付きで表示します。「プライバシーポリシー」「プライバシーセンター」「個人情報保護方針」など、該当ページのタイトルや名称を記載してください。省略も可能ですが原則として記載してください。",
};
