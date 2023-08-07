export function initialize(): HTMLIFrameElement {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = `<!doctype html>
  <html>
    <head>
      <link rel='stylesheet' href='${chrome.runtime.getURL("main.css")}'>
    </head>
    <body>
      <script src='${chrome.runtime.getURL(
        "content-script/iframe.js",
      )}'></script>
    </body>
  </html>`;
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
}

export function deactivate(iframe: HTMLIFrameElement) {
  iframe.remove();
}
