import {
  type ChangeEvent,
  type MouseEvent,
  useRef,
  useState,
  useEffect,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../../utils/user";
import { useAccount } from "../../../utils/account";
import clsx from "clsx";

export default function Logo() {
  const { user: token, getAccessTokenSilently } = useAuth0();
  const { data: user } = useUser(token?.sub ?? null);
  const { data: account } = useAccount(user?.accountId ?? null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewRef = useRef<HTMLImageElement>(null);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [showErrors, setShowErrors] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  async function preloadLogo() {
    if (!account) {
      return;
    }
    const token = await getAccessTokenSilently();
    const endpoint = `/internal/accounts/${account.id}/logos/`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      return;
    }
    const logoURL = (await response.json())?.url;
    if (logoURL) {
      setPreviewContent(logoURL);
      setShowPreview(true);
    }
  }

  async function onUploadChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files && e.target.files[0];

    if (file) {
      setShowErrors(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) {
          return;
        }
        if (!imagePreviewRef.current) {
          return;
        }
        setPreviewContent(e.target.result?.toString() ?? "");
        setShowPreview(true);
      };
      setSubmitButtonDisabled(false);
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit(e: MouseEvent<HTMLElement>) {
    e.preventDefault();

    setShowErrors(false);
    if (!account) {
      return;
    }

    if (!imageInputRef.current) {
      return;
    }
    const file = imageInputRef.current.files && imageInputRef.current.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (!e.target || !e.target.result) {
          return;
        }
        const token = await getAccessTokenSilently();

        const endpoint = `/internal/accounts/${account.id}/logos/`;
        const response = await fetch(endpoint, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            // DataURLの先頭の"data:\w+/\w+;base64,"を削除するとbase64文字列を取得できるので、そこからbase64urlに変換する
            image: e.target.result
              .toString()
              .replace(/data:\w+\/\w+;base64,/, "")
              .replace(/[+/=]/g, (c) => {
                return (
                  {
                    "+": "-",
                    "/": "_",
                    "=": "",
                  }[c] ?? ""
                );
              }),
          }),
        });
        setSubmitButtonDisabled(true);
        if (!response.ok) {
          const text = await response.text();
          let error =
            "使用できない画像です。画像の形式やサイズを確認して再アップロードしてください。";
          if (/too small image/.test(text)) {
            error =
              "サイズ要件を満たさない画像です。縦横396pxまたはそれ以上の画像をアップロードしてください。";
          }
          setErrorMessage(error);
          setShowErrors(true);
          throw new Error();
        }
      };
      reader.readAsDataURL(file);
    }
  }

  useEffect(() => {
    preloadLogo();
  }, [account]);

  return (
    account && (
      <div className="mb-8">
        <h2 className="mb-8 text-3xl font-bold">ロゴマーク</h2>
        <div>
          <p className="mb-8">
            以下の要件を満たす法人・組織のロゴ画像をご提供ください。
          </p>
          <ul className="list-disc pl-5">
            <li>媒体ロゴではない</li>
            <li>正方形領域にアイコンとして表示して不自然とならない</li>
            <li>余白が適切（各法人・組織のアイソレーション規定を満たす）</li>
            <li>縦横396pxまたはそれ以上</li>
            <li>縮小利用可</li>
            <li>画像形式: PNG/JPEG/WebP</li>
          </ul>
        </div>
        <div className="flex justify-center mt-8">
          <div className="m-4">
            <label>
              <span
                className={clsx(
                  "flex box-content w-[396px] justify-center items-center aspect-square border-gray-500 border rounded-xl hover:bg-gray-100 hover:border-gray-300",
                  {
                    "border-dotted": !showPreview,
                    "bg-red-50 hover:bg-red-100": showPreview,
                  },
                )}
                ref={imagePreviewRef}
              >
                {showPreview ? (
                  <img
                    src={previewContent}
                    className="max-w-full max-h-full rounded-xl no-border object-scale-down"
                    alt="Preview"
                  />
                ) : (
                  <p className="text-2xl text-gray-400">+</p>
                )}
              </span>
              <input
                type="file"
                className="hidden"
                ref={imageInputRef}
                onChange={onUploadChange}
              />
            </label>
            {showErrors && (
              <div className="flex justify-center">
                <p className="text-sm w-[396px] text-[#C2410C]">
                  {errorMessage}
                </p>
              </div>
            )}
            <div className="flex p-10 justify-center">
              <button
                className="jumpu-button px-8 bg-[#00AFB4] border-[#00AFB4] font-bold"
                onClick={onSubmit}
                disabled={submitButtonDisabled}
              >
                ロゴ画像をアップロードする
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
