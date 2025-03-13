import { describe, expect, test } from "vitest";
import { documentProvider } from "./publisher";

describe("documentProvider()", () => {
  test("開きタグ省略した非整形式HTMLでブラウザー互換のDOMが得られる", async () => {
    const notWellFormedHtml = `<body>test</p></body>\n`;
    // WHATWG HTML Living Standard [serializing algorithm] より
    // body > p > #text:"" と解釈 (p 要素のコンテンツにテキストノード "" が入る)
    // body>* Chrome v134 => "", Firefox v136 => ""
    // ただし npm:happy-dom@17.4.4 は body>* => null と解釈されるため互換性ない

    const document = await documentProvider({
      type: "TextTargetIntegrity",
      content: notWellFormedHtml,
    });

    expect(document.querySelector("body>*")?.textContent).toBe("");
  });

  test("閉じタグ省略した非整形式HTMLでブラウザー互換のDOMが得られる", async () => {
    const notWellFormedHtml = `<body><p></body>test\n`;
    // WHATWG HTML Living Standard [serializing algorithm] より
    // body > p > #text:"test\n" と解釈 (p 要素のコンテンツにテキストノード "test\n" が入る)
    // body>* Chrome v134 => "test\n", Firefox v136 => "test\n"
    // ただし npm:happy-dom@17.4.4 は body>* => "" と解釈されるため互換性ない

    const document = await documentProvider({
      type: "TextTargetIntegrity",
      content: notWellFormedHtml,
    });

    expect(document.querySelector("body>*")?.textContent).toBe("test\n");
  });
});
