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

// https://www.typescriptlang.org/tsconfig#non-module-files
export {};
