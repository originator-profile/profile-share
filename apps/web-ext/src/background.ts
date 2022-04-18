import browser from "webextension-polyfill";

browser.browserAction.onClicked.addListener(() => {
  const url = browser.runtime.getURL("index.html");
  browser.windows.create({ url, type: "popup" });
});
