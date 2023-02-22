import { afterAll, beforeAll, describe, test, expect } from "vitest";
import { PublisherExtractWebsite } from "../src/commands/publisher/extract-website";
import { PublisherWebsite } from "../src/commands/publisher/website";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const paths = (tmpdir: string) =>
  ({
    extract: path.join(tmpdir, "extract.json"),
    key: path.join(__dirname, "..", "account-key.example.key"),
  } as const);
const glob = "tmp/**/website.json";

const extract = (tmpdir: string) =>
  ({
    url: "http://localhost:8080",
    bodyFormat: "visibleText",
    location: "h1",
    output: path.join(tmpdir, "website.json"),
  } as const);

const accountId = "d613c1d6-5312-41e9-98ad-2b99765955b6";

describe("Publisher workflows", async () => {
  let tmpdir: string;

  beforeAll(async () => {
    tmpdir = await fs.mkdtemp(path.join(__dirname, "tmp"));
    await fs.writeFile(
      paths(tmpdir).extract,
      JSON.stringify([extract(tmpdir)], null, 2)
    );
  });

  afterAll(async () => {
    await fs.rm(tmpdir, { recursive: true });
  });

  test("Website extraction makes website.json", async () => {
    await PublisherExtractWebsite.run([`--input=${paths(tmpdir).extract}`]);
    expect(existsSync(extract(tmpdir).output)).toBe(true);
    const website = await fs
      .readFile(extract(tmpdir).output)
      .then((buffer) => JSON.parse(buffer.toString()));
    expect(website.body).toBe("OP 確認くん");
  });

  test("Website updation to be success", async () => {
    await PublisherWebsite.run([
      `--identity=${paths(tmpdir).key}`,
      `--id=${accountId}`,
      "--operation=update",
      `--glob-input=${glob}`,
    ]);
  });
});
