import type { RawTarget } from "@originator-profile/model";
import { JSDOM } from "jsdom";

export async function documentProvider({
  type,
  content = "",
}: RawTarget): Promise<Document> {
  let url: string | undefined;
  let html: string = "";

  if (URL.canParse(content)) {
    url = content;
  } else {
    html = content;
  }

  if (type !== "ExternalResourceTargetIntegrity" && url) {
    html = await fetch(url).then((res) => res.text());
  }

  const dom = new JSDOM(html, {
    url,
  });

  return dom.window.document;
}
