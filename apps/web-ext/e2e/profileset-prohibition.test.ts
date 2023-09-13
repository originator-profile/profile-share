import { Page } from "@playwright/test";
import { expect, popup, test } from "./fixtures";
import { execSync } from "child_process";

function executeCommand(command: string, directory?: string): void {
  try {
    const options: { cwd?: string } = {};
    if (directory) {
      options.cwd = directory;
    }
    execSync(command, options).toString();
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
  }
}

test.describe.configure({ mode: "serial" });

let ext: Page | undefined;

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-webpage.png` });
  if (ext && !ext.isClosed()) {
    await ext.screenshot({ path: `screenshots/${testInfo.title}-web-ext.png` });
  }
  executeCommand(
    "bin/dev publisher:website -i account-key.example.priv.json --id localhost --input website.example.json -o update",
    "../registry",
  );
});

test("ProfileSet禁止時の確認", async ({ context, page }) => {
  executeCommand("bin/dev key-gen --output evil", "../registry");
  executeCommand(
    "bin/dev publisher:website -i evil.priv.json --id localhost --input website.example.json -o update",
    "../registry",
  );

  await page.goto("http://localhost:8080/");

  ext = await popup(context);

  const warningTexts = [
    " アクセスにはご注意ください",
    "このサイトの発信元が確認できません",
    "本物そっくりの偽サイトにログインしたり個人情報を登録したり支払いをしてしまい被害に合うケースが多発しています。このページではサイトの運営者情報が確認できませんでした。そのため、このサイトが本物かどうかは充分に注意してください。",
  ];

  for (const text of warningTexts) {
    const foundText = await ext.textContent(`:text("${text}")`);
    expect(foundText).toBe(text);
  }
});
