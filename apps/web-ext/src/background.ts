import { BackgroundMessageRequest } from "./types/message";

const windowSize = {
  width: 520,
  height: 640,
} as const;

chrome.action.onClicked.addListener(async function (tab) {
  const url = `${chrome.runtime.getURL("index.html")}#/tab/${tab.id}`;
  await chrome.windows.create({ url, type: "popup", ...windowSize });
});

const handleMessageResponse = async (message: BackgroundMessageRequest) => {
  switch (message.type) {
    case "select-overlay-dp":
      await chrome.runtime.sendMessage(message);
  }
};
chrome.runtime.onMessage.addListener(handleMessageResponse);

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason !== "install") return;

  const granted = await chrome.permissions.contains({
    origins: ["<all_urls>"],
  });

  if (!granted) {
    // 権限が足らない場合は初期設定の説明を開く (Firefoxのみ)
    await chrome.tabs.create({
      url: "https://docs.originator-profile.org/web-ext/experimental-use/#setup-in-firefox",
    });

    // NOTE: "<all_urls>" 権限求められないようなのでコメントアウト
    // const granted = await chrome.permissions.request({
    //   origins: ["<all_urls>"],
    // });
  }
});

// https://www.typescriptlang.org/tsconfig#non-module-files
export {};

if (import.meta.env.PROFILE_REGISTRY_AUTH) {
  chrome.webRequest.onAuthRequired.addListener(
    () => ({
      authCredentials: {
        username: import.meta.env.PROFILE_REGISTRY_AUTH_USERNAME,
        password: import.meta.env.PROFILE_REGISTRY_AUTH_PASSWORD,
      },
    }),
    {
      urls:
        import.meta.env.PROFILE_ISSUER === "localhost"
          ? [
              "http://localhost:8080/*",
              // Firefox のため
              "http://localhost/*",
            ]
          : [`https://${import.meta.env.PROFILE_ISSUER}/*`],
    },
    ["blocking"],
  );
}
