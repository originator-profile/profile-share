import browser from "webextension-polyfill";

const windowSize = {
  width: 520,
  height: 640,
} as const;

browser.browserAction.onClicked.addListener(async function (tab) {
  const url = `${browser.runtime.getURL("index.html")}#/tab/${tab.id}`;
  await browser.windows.create({ url, type: "popup", ...windowSize });
});
