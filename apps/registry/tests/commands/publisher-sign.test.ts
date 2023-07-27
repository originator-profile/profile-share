import { test, expect, describe } from "vitest";
import { stdout } from "stdout-stderr";
import { PublisherSign } from "../../src/commands/publisher/sign";
import { decodeJwt } from "jose";
import path from "node:path";

describe("publisher:sign", () => {
  const basePath = path.join(__dirname, "publisher-sign-test-data");
  const domainName = "example.com";

  test("JSONからSDPを生成1", async () => {
    await PublisherSign.run([
      `-i=${path.join(basePath, "key.priv.json")}`,
      `--id=${domainName}`,
      `--input=${path.join(basePath, "website.json")}`,
    ]);
    expect(decodeJwt(stdout.output)).toHaveProperty("iss", domainName);
  });

  test("JSONからSDPを生成2", async () => {
    await PublisherSign.run([
      `-i=${path.join(basePath, "key.priv.json")}`,
      `--id=${domainName}`,
      `--input=${path.join(basePath, "website-minimal.json")}`,
    ]);
    expect(decodeJwt(stdout.output)).toHaveProperty("iss", domainName);
  });

  test("JSONからSDPを生成3", async () => {
    await PublisherSign.run([
      `-i=${path.join(basePath, "key.priv.json")}`,
      `--id=${domainName}`,
      `--input=${path.join(basePath, "website-full.json")}`,
    ]);
    expect(decodeJwt(stdout.output)).toHaveProperty("iss", domainName);
  });
});
