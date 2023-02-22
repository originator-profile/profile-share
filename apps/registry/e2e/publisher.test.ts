import { afterAll, beforeAll, describe, test, expect } from "vitest";
import { PublisherExtractWebsite } from "../src/commands/publisher/extract-website";
import { PublisherWebsite } from "../src/commands/publisher/website";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const tmpdir = path.join(__dirname, "tmp");
const paths = {
  extract: path.join(tmpdir, "extract.json"),
  key: path.join(__dirname, "..", "account-key.example.key"),
} as const;
const glob = "tmp/**/website.json";

const extract = {
  url: "http://localhost:8080",
  bodyFormat: "visibleText",
  location: "h1",
  output: path.join(tmpdir, "website.json"),
} as const;

const accountId = "d613c1d6-5312-41e9-98ad-2b99765955b6";

describe("Publisher workflows", async () => {
  beforeAll(async () => {
    await fs.mkdir(tmpdir);
    await fs.writeFile(paths.extract, JSON.stringify([extract], null, 2));
  });

  afterAll(async () => {
    await fs.rm(tmpdir, { recursive: true });
  });

  test("Website extraction makes website.json", async () => {
    await PublisherExtractWebsite.run([`--input=${paths.extract}`]);
    expect(existsSync(extract.output)).toBe(true);
    const website = await fs
      .readFile(extract.output)
      .then((buffer) => JSON.parse(buffer.toString()));
    expect(website.body).toBe("OP 確認くん");
  });

  test("Website updation to be success", async () => {
    await PublisherWebsite.run([
      `--identity=${paths.key}`,
      `--id=${accountId}`,
      "--operation=update",
      `--glob-input=${glob}`,
    ]);
  });
});
