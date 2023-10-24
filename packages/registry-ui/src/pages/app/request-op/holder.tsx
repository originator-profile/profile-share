import { type FormEvent } from "react";
import FormRow from "../../../components/FormRow";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../../utils/user";
import { useAccount } from "../../../utils/account";
import UrlAndTitleInput from "../../../components/UrlAndTitleInput";

export default function Holder() {
  const { user: token, getAccessTokenSilently } = useAuth0();
  const { data: user } = useUser(token?.sub ?? null);
  const { data: account } = useAccount(user?.accountId ?? null);
  const prefectures = [
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

  // TODO: フォームをちゃんと実装して
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    // TODO: 必須項目が入力されていない場合、「保存」はできるが「申請開始」はできないようにして
    // TODO: 審査コメントを各入力欄の下に表示して
    e.preventDefault();

    if (!account) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    const newAccountData: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      newAccountData[key] = value;
    }

    const token = await getAccessTokenSilently();

    const endpoint = `http://localhost:8080/internal/accounts/${account.id}/`;
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAccountData),
    });
    if (!response.ok) {
      // TODO: 失敗したことをユーザーに知らせて
      // なぜ失敗したのかを知らせる必要がある
      // internal error の場合はよい
      // ユーザーの入力が不正だったときにちゃんと知らせたほうがよい
      // フォームの validation を実装したほうがいいのか
      // 変換 - 全角・半角、ハイフンの有無、国際電話番号許可
      // 説明は html を受け付けるのか？
      throw new Error();
    }

    // TODO: 成功レスポンスの場合、結果をフォームに反映して
    // const result = await response.json();
  }

  // TODO: 見た目をデザイン通りに実装して
  // タブのデザインを修正（選択されていないタブにも枠を表示する。下線の長さを横いっぱいに伸ばす）
  // 修正が必要なタブには「要修正」と表示する
  // 「保存する」ボタンのデザインを修正（色、他あれば）
  // 「郵便番号」、「電話番号」、「都道府県」の <input> の幅を縮める
  return (
    account && (
      <form className="max-w-2xl mb-8" onSubmit={onSubmit}>
        <div className="flex mb-6 flex-row md:items-center">
          <h2 className="text-3xl font-bold">組織情報</h2>
          <input
            className="jumpu-outlined-button text-base text-[#00AFB4] font-bold border-[#00AFB4] ml-auto"
            type="submit"
            value="保存する"
          />
        </div>
        <p className="text-sm mb-6">
          Originator Profile 情報を登録頂くフォームです。
          <br />
          サイト運営者・コンテンツ提供者などの組織情報を法人毎に登録してください。注:
          法人単位での登録です。
          <br />
          グループ会社一括やサイト・サービス単位ではありません。
        </p>
        <FormRow
          className="mb-7"
          label="組織代表ドメイン名"
          required
          // TODO helpText を本物に差し替えて
          // helpText="あいうえお"
        >
          <input
            className="jumpu-input flex-1 h-12"
            name="domainName"
            required
            defaultValue={account?.domainName}
            placeholder="media.example.com"
          />
        </FormRow>
        <FormRow
          className="mb-7"
          label="所有者 / 法人・組織名"
          required
          helpText="法人・組織の正式名称(省略無し)を記載してください"
        >
          <input
            className="jumpu-input flex-1 h-12"
            name="name"
            defaultValue={account?.name}
            placeholder="⚪○△新聞社"
          />
        </FormRow>
        <FormRow className="mb-7" label="郵便番号" required>
          <input
            className="jumpu-input flex-1 h-12"
            name="postalCode"
            defaultValue={account?.postalCode}
            placeholder="100-0001"
          />
        </FormRow>
        <FormRow className="mb-7" label="都道府県" required>
          <select
            className="jumpu-select flex-1 h-12"
            name="addressRegion"
            defaultValue={account?.addressRegion}
            placeholder="東京都"
          >
            {prefectures.map((prefecture) => (
              <option key={prefecture} value={prefecture}>
                {prefecture}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow className="mb-7" label="市区町村" required>
          <input
            className="jumpu-input flex-1 h-12"
            name="addressLocality"
            defaultValue={account?.addressLocality}
            placeholder="千代田区"
          />
        </FormRow>
        <FormRow
          className="mb-7"
          label="町名・番地・ビル名・部屋番号など"
          required
        >
          <input
            className="jumpu-input flex-1 h-12"
            name="streetAddress"
            defaultValue={account?.streetAddress}
            placeholder="大手町3丁目1-1 ○△ビル 1F"
          />
        </FormRow>
        <FormRow className="mb-7" label="電話番号">
          <input
            className="jumpu-input flex-1 h-12"
            name="phoneNumber"
            type="tel"
            defaultValue={account?.phoneNumber}
            placeholder="03-1111-1111"
          />
        </FormRow>
        <FormRow
          className="mb-7"
          label="メールアドレス"
          // TODO helpText を本物に差し替えて
          helpText="あいうえお"
        >
          <input
            className="jumpu-input flex-1 h-12"
            name="email"
            type="email"
            defaultValue={account?.email}
            placeholder="contact@marusankaku.co.jp"
          />
        </FormRow>
        <FormRow
          className="mb-7"
          label="法人番号"
          // TODO helpText を本物に差し替えて
          helpText="あいうえお"
        >
          <input
            className="jumpu-input flex-1 h-12"
            name="corporateNumber"
            type="number"
            defaultValue={account?.corporateNumber}
            placeholder="68724562888454"
          />
        </FormRow>
        <FormRow
          className="mb-7"
          label="事業種目"
          // TODO helpText を本物に差し替えて
          helpText="あいうえお"
        >
          <input
            className="jumpu-input flex-1 h-12"
            name="businessCategory"
            defaultValue={account?.businessCategory}
            placeholder=""
          />
        </FormRow>
        <FormRow
          className="mb-7"
          label="WebサイトURL"
          required
          // TODO helpText を本物に差し替えて
          helpText="あいうえお"
        >
          <input
            className="jumpu-input flex-1 h-12"
            name="url"
            type="url"
            defaultValue={account?.url}
            placeholder="https://www.marusankaku.co.jp/"
          />
        </FormRow>

        {/* TODO: helpText が必要な項目に付け足して */}
        <UrlAndTitleInput
          label="お問い合わせ情報"
          titleLabel="お問い合わせページの名称"
          urlLabel="リンク"
          titlePlaceholder="○△へのお問い合わせ"
          urlPlaceholder="https://www.marusankaku.co.jp/contact/"
          urlDefaultValue={account?.contactUrl}
          titleDefaultValue={account?.contactTitle}
          namePrefix="contact"
        />
        <UrlAndTitleInput
          label="編集ガイドライン"
          titleLabel="ページの名称"
          urlLabel="リンク"
          titlePlaceholder="○△ガイドライン"
          urlPlaceholder="https://www.marusankaku.co.jp/guidelines/"
          titleDefaultValue={account?.publishingPrincipleTitle}
          urlDefaultValue={account?.publishingPrincipleUrl}
          namePrefix="publishingPrinciple"
        />
        <UrlAndTitleInput
          label="プライバシーボリシー"
          titleLabel="ページの名称"
          urlLabel="リンク"
          titlePlaceholder="○△プライバシーセンター"
          urlPlaceholder="https://www.marusankaku.co.jp/privacy/"
          titleDefaultValue={account?.privacyPolicyTitle}
          urlDefaultValue={account?.privacyPolicyUrl}
          namePrefix="privacyPolicy"
        />

        <FormRow className="mb-7" label="説明">
          <textarea
            className="jumpu-input flex-1"
            name="description"
            defaultValue={account?.description}
            placeholder="追加の説明情報（任意）"
          />
        </FormRow>
      </form>
    )
  );
}
