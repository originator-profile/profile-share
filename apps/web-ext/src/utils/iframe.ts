import browser from "webextension-polyfill";

export function activate() {
  const iframe =
    (document.getElementById(
      "profile-extension-iframe"
    ) as HTMLIFrameElement) ?? document.createElement("iframe");
  iframe.id = "profile-extension-iframe";
  iframe.src = "about:blank";
  iframe.style.cssText = `
    background: transparent;
    border-radius: 0;
    border: none;
    box-shadow: none;
    display: block;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    opcity: 1;
    visibility: visible;
    outilne: 0;
    z-index: 2147483647;
  `;
  document.body.appendChild(iframe);
  if (!iframe.contentDocument) return;
  const link = iframe.contentDocument.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL("main.css");
  iframe.contentDocument.head.appendChild(link);
  const script = iframe.contentDocument.createElement("script");
  script.src = browser.runtime.getURL("content-script/iframe.js");
  iframe.contentDocument.body.appendChild(script);
}

export function deactivate() {
  const iframe = document.getElementById("profile-extension-iframe");
  if (!iframe) return;
  iframe.remove();
}
