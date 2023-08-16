import { afterAll, beforeAll } from "vitest";
import { BrowserContext, chromium, Page } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import util from "node:util";
import { rimraf } from "rimraf";

export let ctx: BrowserContext;

const browserType = chromium;
const sleep = util.promisify(setTimeout);
let userDataDir: string;

beforeAll(async () => {
  userDataDir = await fs.mkdtemp(path.join(os.tmpdir(), "profile-web-ext-"));
  const extensionPath = path.resolve(__dirname, `../dist-${browserType.name()}`);
  ctx = await browserType.launchPersistentContext(userDataDir, {
    // NOTE: see also https://playwright.dev/docs/chrome-extensions#headless-mode
    args: [
      `--headless=new`,
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
  let [backgroundWorker] = ctx.serviceWorkers();
  if (!backgroundWorker) {
    // backgroundWorker がまだない場合、新しい Service Worker が作られるのを待つ。
    backgroundWorker = await ctx.waitForEvent('serviceworker');
    // worker が立ち上がった直後は chrome.tabs API が使えないことがあるので待つ。
    await sleep(500);
  }
  await backgroundWorker.evaluate(async function () {
    // 現在 active なタブの上で拡張機能のアイコンを押して起動する。
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
