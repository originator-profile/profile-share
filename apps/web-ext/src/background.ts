import browser from "webextension-polyfill";

let windowId: number;

browser.browserAction.onClicked.addListener(async function () {
  try {
    await browser.windows.update(windowId, { focused: true });
  } catch {
    const url = browser.runtime.getURL("index.html");
    const window = await browser.windows.create({
      url,
      type: "popup",
      width: 320,
      height: 640,
    });
    windowId = window.id ?? NaN;
  }
});
