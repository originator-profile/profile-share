import { useState } from "react";
import { usePublicKeys, Jwk } from "../../../components/publicKeys";
import { Table, TableRow } from "@originator-profile/ui";
import { Menu } from "@headlessui/react";
import { Icon } from "@iconify/react";

export default function PublicKey() {
  const [fileError, setFileError] = useState<unknown | null>(null);
  const publicKeys = usePublicKeys();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyField: HTMLInputElement = event.currentTarget.key;
    const file = keyField.files?.[0];
    if (!file) return;
    const jwk = await file
      .text()
      .then(JSON.parse)
      .catch((error) => ({ error }));
    if ("error" in jwk) {
      setFileError(jwk.error);
      return;
    }
    await publicKeys.register.trigger({ jwk });
    setFileError(null);
    keyField.value = "";
  };
  const handleClickJwk = (jwk: Jwk) => () =>
    publicKeys.destroy.trigger({ kid: jwk.kid });

  return (
    <section className="max-w-screen-sm">
      <h2 className="text-3xl font-bold mb-8">公開鍵</h2>
      <p className="text-sm mb-8">
        御社で生成したデータの署名/検証に用いる
        <a
          className="text-blue-600 underline"
          target="_blank"
          rel="noreferrer"
          href="https://docs.originator-profile.org/registry/operation/key-pair-generation/"
        >
          鍵ペアを生成
          <Icon className="inline" icon="mdi:external-link" />
        </a>
        し、公開鍵（検証鍵）をご提出ください。
      </p>
      <h3 className="text-xl font-bold flex items-center gap-4 mb-2">
        <span>登録済み</span>
        {publicKeys.data && (
          <span className="jumpu-badge text-xs bg-gray-50 border border-gray-300">
            {publicKeys.data.keys.length}
          </span>
        )}
      </h3>
      <ul className="space-y-2 mb-4">
        {publicKeys.data?.keys.map((jwk) => (
          <li
            key={jwk.kid}
            className="jumpu-card py-3 px-5 relative overflow-visible"
          >
            <Table>
              {Object.entries(jwk).map(([key, value]) => (
                <TableRow key={key} header={key} data={String(value)} />
              ))}
            </Table>
            <Menu>
              <Menu.Button className="jumpu-icon-button absolute top-3 right-4">
                <Icon icon="mdi:dots-horizontal" className="w-4 h-4" />
                <span role="tooltip">操作</span>
              </Menu.Button>
              <Menu.Items className="absolute top-9 right-4 flex flex-col w-32 *:w-full *:px-3 *:py-2 *:text-center shadow-lg divide-y divide-gray-200">
                <Menu.Item
                  as="button"
                  className="text-sm text-danger hover:bg-danger-extralight"
                  onClick={handleClickJwk(jwk)}
                >
                  削除
                </Menu.Item>
              </Menu.Items>
            </Menu>
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
        <div className="space-y-2 mb-4">
          {publicKeys.register.error && (
            <div className="jumpu-card bg-danger-light px-4 py-3">
              <p className="mb-2">
                公開鍵の登録に失敗しました。いずれかの原因が考えられます。
              </p>
              <ul className="pl-6 list-disc">
                <li>ネットワーク通信の問題</li>
                <li>公開鍵の形式が無効</li>
                <li>公開鍵が既に登録済み</li>
                <li>プライベート鍵を登録しようとしている</li>
              </ul>
            </div>
          )}
          {publicKeys.destroy.error && (
            <p className="jumpu-card bg-danger-light px-4 py-3">
              公開鍵の削除に失敗しました。ネットワーク通信に問題がある可能性があります。再度お試しください。
            </p>
          )}
          {fileError && (
            <p className="jumpu-card bg-danger-light px-4 py-3">
              無効な形式の公開鍵です。JSON Web
              Key形式のJSONファイルを指定してください。
            </p>
          )}
        </div>
        <input
          className="jumpu-button font-bold cursor-pointer mt-8"
          type="submit"
          value="公開鍵のアップロード"
        />
      </form>
    </section>
  );
}
