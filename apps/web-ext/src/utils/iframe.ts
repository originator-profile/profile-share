export function initialize(): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
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
    opacity: 1;
    visibility: visible;
    outilne: 0;
    z-index: 2147483647;
  `;
  return iframe;
}

export function activate(iframe: HTMLIFrameElement) {
  if (!document.contains(iframe)) document.body.appendChild(iframe);
  if (!iframe.contentDocument) return;
  if (!iframe.contentDocument.querySelector("link[href$='main.css']")) {
    const link = iframe.contentDocument.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("main.css");
    iframe.contentDocument.head.appendChild(link);
  }
  if (
    !iframe.contentDocument.querySelector(
      "script[src$='content-script/iframe.js']"
    )
  ) {
    const script = iframe.contentDocument.createElement("script");
    script.src = chrome.runtime.getURL("content-script/iframe.js");
    iframe.contentDocument.body.appendChild(script);
  }
}

export function deactivate(iframe: HTMLIFrameElement) {
  iframe.remove();
}
