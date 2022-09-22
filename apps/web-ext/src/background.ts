const windowSize = {
  width: 520,
  height: 640,
} as const;

chrome.action.onClicked.addListener(async function (tab) {
  const url = `${chrome.runtime.getURL("index.html")}#/tab/${tab.id}`;
  await chrome.windows.create({ url, type: "popup", ...windowSize });
});

// https://www.typescriptlang.org/tsconfig#non-module-files
export {};
