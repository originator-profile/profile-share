import { useState } from "react";
import { usePublicKeys, Jwk } from "../../../components/publicKeys";

export default function PublicKey() {
  const [errorMessage, setErrorMessage] = useState<React.ReactNode>(null);
  const publicKeys = usePublicKeys();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      key: { value: ""; files: Exclude<HTMLInputElement["files"], null> };
    };
    const [file] = Array.from(target.key.files);
    if (!file) return;
    const jwk = await file
      .text()
      .then(JSON.parse)
      .catch((error) => ({ error }));
    if ("error" in jwk) {
      return setErrorMessage(
        <p>
          無効な形式の公開鍵です。JSON Web
          Key形式のJSONファイルを指定してください。
        </p>,
      );
    }
    const result =
      (await publicKeys.register({ jwk }).catch((error) => ({ error }))) ?? {};
    if ("error" in result) {
      return setErrorMessage(
        <>
          <p className="mb-2">
            公開鍵の登録に失敗しました。いずれかの原因が考えられます。
          </p>
          <ul className="pl-6 list-disc">
            <li>ネットワークリクエストが正常に完了しなかった</li>
            <li>公開鍵の形式が無効</li>
            <li>公開鍵が既に登録済み</li>
          </ul>
        </>,
      );
    }
    setErrorMessage(null);
    target.key.value = "";
  };
  const handleClickJwk = (jwk: Jwk) => () =>
    publicKeys.destroy({ kid: jwk.kid });

  return (
    <section className="max-w-screen-sm">
      <h2 className="text-3xl font-bold mb-8">公開鍵</h2>
      <p className="text-sm mb-8">
        御社で生成したデータの署名/検証に用いる鍵ペアを生成し、公開鍵(検証鍵)をご提出ください。
      </p>
      {/* TODO: 公開鍵の作成方法を案内して */}
      <ul className="mb-2 list-disc pl-6">
        {publicKeys.data?.keys.map((jwk) => (
          <li key={jwk.kid}>
            {jwk.kid}
            <button
              className="jumpu-outlined-button text-xs text-danger border-danger ml-2"
              onClick={handleClickJwk(jwk)}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="key"
          required
          accept="application/json"
          className="block mb-2"
        />
        {errorMessage && (
          <div className="jumpu-card bg-danger-light px-4 py-3">
            {errorMessage}
          </div>
        )}
        <input
          className="jumpu-button font-bold cursor-pointer mt-8"
          type="submit"
          value="公開鍵のアップロード"
        />
      </form>
    </section>
  );
}
