import { test as base, type BrowserContext, Page } from "@playwright/test";
import path from "node:path";
import util from "node:util";

const sleep = util.promisify(setTimeout);

export const test = base.extend<{
  context: BrowserContext;
}>({
  context: async ({ browser }, use) => {
    const extensionPath = path.resolve(
      __dirname,
      `../dist-${browser.browserType().name()}`,
    );
    const context = await browser.browserType().launchPersistentContext("", {
      headless: false,
      args: [
        `--headless=new`,
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
    });
    await use(context);
    await context.close();
  },
});

export const expect = test.expect;

export async function popup(ctx: BrowserContext): Promise<Page> {
  let [backgroundWorker] = ctx.serviceWorkers();
  if (!backgroundWorker) {
    // backgroundWorker がまだない場合、新しい Service Worker が作られるのを待つ。
    backgroundWorker = await ctx.waitForEvent("serviceworker");
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
