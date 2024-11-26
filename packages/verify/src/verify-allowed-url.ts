import { AllowedUrl } from "@originator-profile/model";

async function importURLPatternPolyfill() {
  // URLPatternが存在するか確認して、なければimportする
  if (typeof URLPattern === "undefined") {
    await import("urlpattern-polyfill");
  }
}

/**
 * 対象のURLがAllowedUrlの中に含まれているか検証する
 * @param url ウェブページのURL
 * @param allowedUrl 情報の対象となるURL
 * @returns 検証結果: allowedUrlの中にurlが含まれていればtrue, それ以外ならfalse
 */
export async function verifyAllowedUrl(
  url: string,
  allowedUrl: AllowedUrl,
): Promise<boolean> {
  await importURLPatternPolyfill();

  return [allowedUrl].flat().some((value) => {
    // URLPatternのinput空文字を渡すとエラーになるためチェックする
    if (!value) {
      return false;
    }
    const pattern = new URLPattern(value);
    return pattern.test(url);
  });
}
