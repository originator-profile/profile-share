import browser from "webextension-polyfill";
import storage from "./utils/storage";

browser.browserAction.onClicked.addListener(async function (tab) {
  if (tab.id !== undefined) storage.setItem("tabId", tab.id);
  const url = browser.runtime.getURL("index.html");
  const popup = window.open(
    "about:blank",
    "_blank",
    "popup,width=520,height=640"
  );
  if (!popup) return;
  // NOTE: e2e テスト時ウィンドウ生成後移動しないと期待するページが開かれない
  popup.location.href = url;
});
