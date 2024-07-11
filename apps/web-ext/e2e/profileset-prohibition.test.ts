import { promises as fs } from "node:fs";
import path from "node:path";
import { Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";
import { execSync } from "node:child_process";

function executeCommand(command: string, directory?: string): void {
  try {
    execSync(command, { cwd: directory });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
  }
}

test.describe.configure({ mode: "serial" });

let ext: Page | undefined;
let tempDir: string;

test.beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(__dirname, "temp-"));
});

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-webpage.png` });
  if (ext && !ext.isClosed()) {
    await ext.screenshot({ path: `screenshots/${testInfo.title}-web-ext.png` });
  }
  if (testInfo.title === "DPの検証失敗時は閲覧を禁止する") {
    executeCommand(
      "bin/dev publisher:website -i account-key.example.priv.json --id localhost --input website.example.json -o update",
      "../registry",
    );
  }
  if (testInfo.title === "OPの検証失敗時は閲覧を禁止する") {
    executeCommand(
      "bin/dev cert:issue -i account-key.example.priv.json --issuer localhost --holder localhost",
      "../registry",
    );
  }
  await fs.rm(tempDir, { recursive: true });
});

test("DPの検証失敗時は閲覧を禁止する", async ({ context, page }) => {
  executeCommand(
    "bin/dev key-gen --output " + path.join(tempDir, "evil"),
    "../registry",
  );
  executeCommand(
    `bin/dev publisher:website -i ${path.join(
      tempDir,
      "evil.priv.json",
    )} --id localhost --input website.example.json -o update`,
    "../registry",
  );

  await page.goto("http://localhost:8080/app/debugger");

  ext = await popup(context);

  await expect(ext.getByText(" アクセスにはご注意ください")).toHaveCount(1);
  await expect(ext.getByText("このサイトの発信元が確認できません")).toHaveCount(
    1,
  );
  await expect(
    ext.getByText(
      "本物そっくりの偽サイトにログインしたり個人情報を登録したり支払いをしてしまい被害に合うケースが多発しています。このページではサイトの運営者情報が確認できませんでした。そのため、このサイトが本物かどうかは充分に注意してください。",
    ),
  ).toHaveCount(1);
});

test("OPの検証失敗時は閲覧を禁止する", async ({ context, page }) => {
  executeCommand(
    "bin/dev key-gen --output " + path.join(tempDir, "evil"),
    "../registry",
  );
  executeCommand(
    `bin/dev cert:issue -i ${path.join(
      tempDir,
      "evil.priv.json",
    )} --issuer localhost --holder localhost`,
    "../registry",
  );

  await page.goto("http://localhost:8080/app/debugger");

  ext = await popup(context);

  await expect(ext.getByText(" アクセスにはご注意ください")).toHaveCount(1);
  await expect(ext.getByText("このサイトの発信元が確認できません")).toHaveCount(
    1,
  );
  await expect(
    ext.getByText(
      "本物そっくりの偽サイトにログインしたり個人情報を登録したり支払いをしてしまい被害に合うケースが多発しています。このページではサイトの運営者情報が確認できませんでした。そのため、このサイトが本物かどうかは充分に注意してください。",
    ),
  ).toHaveCount(1);
});
