import browser from "webextension-polyfill";

export function activate(document: Document) {
  const iframe =
    (document.getElementById(
      "profile-extension-iframe"
    ) as HTMLIFrameElement) ?? document.createElement("iframe");
  iframe.id = "profile-extension-iframe";
  iframe.style.border = "none";
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "100vw";
  iframe.style.height = "100vh";
  document.body.appendChild(iframe);
  if (!iframe.contentDocument) return;
  const link = iframe.contentDocument.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL("content-script.css");
  iframe.contentDocument.head.appendChild(link);
  const script = iframe.contentDocument.createElement("script");
  script.src = browser.runtime.getURL("content-script/iframe.js");
  iframe.contentDocument.body.appendChild(script);
}

export function deactivate(document: Document) {
  const iframe = document.getElementById("profile-extension-iframe");
  if (!iframe) return;
  iframe.remove();
}
