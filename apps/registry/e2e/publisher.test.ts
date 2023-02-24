import { afterAll, beforeAll, describe, test, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { PublisherExtractWebsite } from "../src/commands/publisher/extract-website";
import { PublisherWebsite } from "../src/commands/publisher/website";

const accountId = "d613c1d6-5312-41e9-98ad-2b99765955b6";
const keyPath = path.join(__dirname, "..", "account-key.example.pem");

describe("Publisher workflows", async () => {
  let tmpdir: string;
  let extractJsonPath: string;
  let websiteJsonPath: string;

  beforeAll(async () => {
    tmpdir = await fs.mkdtemp(`${path.join(__dirname, "tmp")}${path.sep}`);
    extractJsonPath = path.join(tmpdir, "extract.json");
    websiteJsonPath = path.join(tmpdir, "website.json");
    await fs.writeFile(
      extractJsonPath,
      JSON.stringify([
        {
          url: "http://localhost:8080",
          bodyFormat: "visibleText",
          location: "h1",
          output: websiteJsonPath,
        },
      ])
    );
  });

  afterAll(async () => {
    await fs.rm(tmpdir, { recursive: true });
  });

  test("Website extraction makes website.json", async () => {
    await PublisherExtractWebsite.run([`--input=${extractJsonPath}`]);
    const website = await fs
      .readFile(websiteJsonPath)
      .then((buffer) => JSON.parse(buffer.toString()));
    expect(website.body).toBe("OP 確認くん");
  });

  test("Update from website.json should succeed", async () => {
    await PublisherWebsite.run([
      `--identity=${keyPath}`,
      `--id=${accountId}`,
      "--operation=update",
      `--glob-input=${websiteJsonPath}`,
    ]);
  });
});
