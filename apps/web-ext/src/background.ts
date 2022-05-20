import browser from "webextension-polyfill";
import storage from "./utils/storage";

let windowId: number;

browser.browserAction.onClicked.addListener(async function (tab) {
  try {
    await browser.windows.update(windowId, { focused: true });
    return;
  } catch {
    // nop
  }
  if (tab.id !== undefined) storage.setItem("tabId", tab.id);
  const url = browser.runtime.getURL("index.html");
  const window = await browser.windows.create({
    url,
    type: "popup",
    width: 320,
    height: 640,
  });
  windowId = window.id ?? NaN;
});
