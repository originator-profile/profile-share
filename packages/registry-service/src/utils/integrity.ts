import { createHash } from "node:crypto";

function getSHA256(buf: Buffer): string {
  const hash = createHash("sha256");
  hash.update(buf);
  return hash.digest("base64");
}

export async function calcIntegrity(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error Status: ${response.status} for ${url}`);
  }

  const buf = await response.arrayBuffer();
  const hash = `sha256-${getSHA256(Buffer.from(buf))}`;
  return hash;
}
