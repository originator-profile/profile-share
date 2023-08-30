import { type FormEvent } from "react";
import FormRow from "../../components/FormRow";

function loadInitialValues() {
  try {
    return JSON.parse(window.atob(document.location.hash.slice(1)));
  } catch {
    return {
      domainName: "media.example.com",
      name: "A新聞社",
      postalCode: "433-8000",
      addressRegion: "東京都",
      addressLocality: "千代田区",
      streetAddress: "大手町３丁目1-1 Aビル 1F",
      phoneNumber: "090-9999-1111",
      email: "contact@media.example.com",
      corporateNumber: "68724062888454",
      businessCategory: "通信",
      url: "https://www.media.example.com/",
      contactTitle: "Aへのお問い合わせ",
      contactUrl: "https://www.media.example.com/contact/",
      publishingPrincipleTitle: "A新聞社ガイドライン",
      publishingPrincipleUrl: "https://www.media.example.com/guidelines/",
      privacyPolicyTitle: "Aプライバシーセンター",
      privacyPolicyUrl: "https://www.media.example.com/privacy/",
      description: "これは説明文です。",
    };
  }
}

const initialValues = loadInitialValues();

export default function Index() {
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const rawFormData: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      rawFormData[key] = value;
    }

    rawFormData["businessCategory"] = [rawFormData["businessCategory"]];

    console.log(JSON.stringify(rawFormData, null, 2));

    const endpoint =
      "http://localhost:8080/internal/accounts/8fe1b860-558c-5107-a9af-21c376a6a27c/";
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        // Authorization: `Basic Y2Q4ZjVmOWYtZTNlOC01NjlmLTg3ZWYtZjAzYzZjZmMyOWJjOjZ5R0NtR25WYkdaX0JLY2V5UERGaU1IVEo1cHdWUW1XeUJDSjlvbmhWNFk=`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rawFormData),
    });
    if (!response.ok) {
      throw new Error();
    }

    // const result = await response.json();
  }

  return (
    <>
      <header className="bg-black fixed top-0 left-0 w-full h-10">1</header>
      <article className="max-w-3xl px-4 pt-12 pb-8 mx-auto">
        <div className="flex flex-col mb-6">
          <h1 className="text-4xl font-bold">登録</h1>
          <div className="jumpu-boxed-tabs ml-auto">
            <div role="tablist" aria-label="Sample BoxedTabs">
              <button
                role="tab"
                aria-selected={true}
                aria-controls="panel-1"
                id="tab-1"
                tabIndex={0}
              >
                組織情報
              </button>
              <button
                role="tab"
                aria-selected={false}
                aria-controls="panel-2"
                id="tab-2"
                tabIndex={-2}
              >
                認証鍵
              </button>
              <button
                role="tab"
                aria-selected={false}
                aria-controls="panel-3"
                id="tab-3"
                tabIndex={-3}
              >
                ロゴマーク
              </button>
              <button
                role="tab"
                aria-selected={false}
                aria-controls="panel-4"
                id="tab-4"
                tabIndex={-4}
              >
                資格情報
              </button>
            </div>
          </div>
        </div>
        <form className="mb-8" onSubmit={onSubmit}>
          <div className="flex flex-col mb-8 md:flex-row gap-8 md:gap-4 md:items-center">
            <h2 className="text-4xl font-bold">組織情報</h2>
            <input
              className="jumpu-outlined-button ml-auto"
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

          <FormRow className="mb-4" label="組織代表ドメイン名">
            <input
              className="jumpu-input flex-1"
              name="domainName"
              required
              defaultValue={initialValues.domainName}
              placeholder="media.example.com"
            />
          </FormRow>
          <FormRow className="mb-4" label="所有者 / 法人・組織名">
            <input
              className="jumpu-input flex-1"
              name="name"
              defaultValue={initialValues.name}
              placeholder="⚪○△新聞社"
            />
          </FormRow>
          <FormRow className="mb-4" label="郵便番号">
            <input
              className="jumpu-input flex-1"
              name="postalCode"
              defaultValue={initialValues.postalCode}
              placeholder="100-0001"
            />
          </FormRow>
          <FormRow className="mb-4" label="都道府県">
            <input
              className="jumpu-input flex-1"
              name="addressRegion"
              defaultValue={initialValues.addressRegion}
              placeholder="東京都"
            />
          </FormRow>
          <FormRow className="mb-4" label="市区町村">
            <input
              className="jumpu-input flex-1"
              name="addressLocality"
              defaultValue={initialValues.addressLocality}
              placeholder="千代田区"
            />
          </FormRow>
          <FormRow className="mb-4" label="町名・番地・ビル名・部屋番号など">
            <input
              className="jumpu-input flex-1"
              name="streetAddress"
              defaultValue={initialValues.streetAddress}
              placeholder="大手町3丁目1-1 ○△ビル 1F"
            />
          </FormRow>
          <FormRow className="mb-4" label="電話番号">
            <input
              className="jumpu-input flex-1"
              name="phoneNumber"
              type="tel"
              defaultValue={initialValues.phoneNumber}
              placeholder="03-1111-1111"
            />
          </FormRow>
          <FormRow className="mb-4" label="メールアドレス">
            <input
              className="jumpu-input flex-1"
              name="email"
              type="email"
              defaultValue={initialValues.email}
              placeholder="contact@marusankaku.co.jp"
            />
          </FormRow>
          <FormRow className="mb-4" label="法人番号">
            <input
              className="jumpu-input flex-1"
              name="corporateNumber"
              defaultValue={initialValues.corporateNumber}
              placeholder="68724562888454"
            />
          </FormRow>
          <FormRow className="mb-4" label="事業種目">
            <input
              className="jumpu-input flex-1"
              name="businessCategory"
              defaultValue={initialValues.businessCategory}
              placeholder=""
            />
          </FormRow>
          <FormRow className="mb-4" label="WebサイトURL">
            <input
              className="jumpu-input flex-1"
              name="url"
              type="url"
              defaultValue={initialValues.url}
              placeholder="https://www.marusankaku.co.jp/"
            />
          </FormRow>
          <FormRow className="mb-4" label="お問い合わせ情報">
            <input
              className="jumpu-input flex-1"
              name="contactTitle"
              defaultValue={initialValues.contactTitle}
              placeholder="○△へのお問い合わせ"
            />
          </FormRow>
          <FormRow className="mb-4" label="リンク">
            <input
              className="jumpu-input flex-1"
              name="contactUrl"
              type="url"
              defaultValue={initialValues.contactUrl}
              placeholder="https://www.marusankaku.co.jp/contact/"
            />
          </FormRow>

          <FormRow className="mb-4" label="編集ガイドライン">
            <input
              className="jumpu-input flex-1"
              name="publishingPrincipleTitle"
              defaultValue={initialValues.publishingPrincipleTitle}
              placeholder="○△ガイドライン"
            />
          </FormRow>
          <FormRow className="mb-4" label="編集ガイドラインURL">
            <input
              className="jumpu-input flex-1"
              name="publishingPrincipleUrl"
              type="url"
              defaultValue={initialValues.publishingPrincipleUrl}
              placeholder="https://www.marusankaku.co.jp/guidelines/"
            />
          </FormRow>
          <FormRow className="mb-4" label="プライバシーポリシー">
            <input
              className="jumpu-input flex-1"
              name="privacyPolicyTitle"
              defaultValue={initialValues.privacyPolicyTitle}
              placeholder="○△プライバシーセンター"
            />
          </FormRow>
          <FormRow className="mb-4" label="プライバシーポリシーURL">
            <input
              className="jumpu-input flex-1"
              name="privacyPolicyUrl"
              type="url"
              defaultValue={initialValues.privacyPolicyUrl}
              placeholder="https://www.marusankaku.co.jp/privacy/"
            />
          </FormRow>
          <FormRow className="mb-4" label="説明">
            <textarea
              className="jumpu-input flex-1"
              name="description"
              defaultValue={initialValues.description}
              placeholder="追加の説明情報（任意）"
            />
          </FormRow>
        </form>
      </article>
    </>
  );
}
