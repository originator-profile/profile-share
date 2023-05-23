import { afterAll, beforeAll, describe, test, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { PublisherExtractWebsite } from "../src/commands/publisher/extract-website";
import { PublisherWebsite } from "../src/commands/publisher/website";

const accountId = "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc";
const keyPath = path.join(__dirname, "..", "account-key.example.pem");

describe("Publisher workflows", async () => {
  let tmpdir: string;
  let extractJsonPath: string;
  let websiteJsonPath: string;

  describe("extract.jsonによる操作を行う場合", async () => {
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

    test("Should succeed in creating from website.json", async () => {
      await PublisherWebsite.run([
        `--identity=${keyPath}`,
        `--id=${accountId}`,
        "--operation=create",
        `--glob-input=${websiteJsonPath}`,
      ]);
    });
  });

  describe("globパターンに一致しない場合", async () => {
    beforeAll(async () => {
      tmpdir = await fs.mkdtemp(`${path.join(__dirname, "tmp")}${path.sep}`);
    });

    afterAll(async () => {
      await fs.rm(tmpdir, { recursive: true });
    });

    test("publisher:website操作に失敗する", async () => {
      await expect(
        PublisherWebsite.run([
          `--identity=${keyPath}`,
          `--id=${accountId}`,
          "--operation=update",
          `--glob-input=${tmpdir}/**/website.json`,
        ])
      ).rejects.toBeInstanceOf(Error);
    });
  });
});
