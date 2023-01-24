import { afterAll, beforeAll } from "vitest";
import { BrowserContext, chromium, Page } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import util from "node:util";
import rimraf from "rimraf";

export let ctx: BrowserContext;

const browserType = chromium;
const sleep = util.promisify(setTimeout);
let userDataDir: string;

beforeAll(async () => {
  userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), "profile-web-ext-"));
  const extensionPath = path.resolve(__dirname, "../dist");
  ctx = await browserType.launchPersistentContext(userDataDir, {
    headless: false,
    // loading chromium extension
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
    ],
  });
});

afterAll(async () => {
  await ctx?.close();
  if (userDataDir) await rimraf(userDataDir);
});

export async function popup(ctx: BrowserContext): Promise<Page> {
  const [backgroundWorker] = ctx.serviceWorkers();
  await backgroundWorker?.evaluate(async function () {
    const [targetTab] = await chrome.tabs.query({ active: true });
    // @ts-expect-error dispatch が未定義だが実際には存在する
    chrome.action.onClicked.dispatch(targetTab);
  });
  // NOTE: wait for popup to be opened
  await sleep(1_000);
  // @ts-expect-error assert that popup is opened
  const page: Page = ctx.pages().at(-1);
  return page;
}
