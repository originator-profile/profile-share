import { expect, popup, test } from "./fixtures";
import { Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

let ext: Page | undefined;

type Response = {
  status: number;
  contentType: string;
  body: string;
};

const responseMap: Record<string, Response> = {
  // 不正なサイトプロファイルを返す
  "/.well-known/pp.json": {
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      "@context": "https://originator-profile.org/context.jsonld",
      website: {
        op: {
          iss: "oprdev.originator-profile.org",
          sub: "localhost",
          profile:
            "eyJhbGciOiJFUzI1NiIsImtpZCI6ImpKWXM1X0lMZ1VjODE4MEwtcEJQeEJwZ0EzUUM3ZVp1OXdLT2toOW1ZUFUiLCJ0eXAiOiJ2YytzZC1qd3QifQ.eyJ2Y3QiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3Jnbml6YXRpb24iLCJ2Y3QjaW50ZWdyaXR5Ijoic2hhMjU2IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyIsImlzcyNpbnRlZ3JpdHkiOiJzaGEyNTYiLCJzdWIiOiJsb2NhbGhvc3QiLCJsb2NhbGUiOiJqYS1KUCIsImlzc3VlciI6eyJjb3VudHJ5IjoiSlAiLCJkb21haW5fbmFtZSI6ImxvY2FsaG9zdCIsInVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy8iLCJuYW1lIjoiT3JpZ2luYXRvciBQcm9maWxlIOaKgOihk-eglOeptue1hOWQiCAo6ZaL55m655SoKSIsImxvZ28iOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvaW1hZ2UvaWNvbi5zdmciLCJjb3Jwb3JhdGVfbnVtYmVyIjoiODAxMDAwNTAzNTkzMyIsInBvc3RhbF9jb2RlIjoiMTAwLTgwNTUiLCJyZWdpb24iOiLmnbHkuqzpg70iLCJsb2NhbGl0eSI6IuWNg-S7o-eUsOWMuiIsInN0cmVldF9hZGRyZXNzIjoi5aSn5omL55S6MS03LTEiLCJjb250YWN0X3RpdGxlIjoi44GK5ZWP44GE5ZCI44KP44GbIiwiY29udGFjdF91cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvamEtSlAvaW5xdWlyeS8iLCJwcml2YWN5X3BvbGljeV90aXRsZSI6IuODl-ODqeOCpOODkOOCt-ODvOODneODquOCt-ODvCIsInByaXZhY3lfcG9saWN5X3VybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC9wcml2YWN5LyJ9LCJob2xkZXIiOnsiY291bnRyeSI6IkpQIiwiZG9tYWluX25hbWUiOiJsb2NhbGhvc3QiLCJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvIiwibmFtZSI6Ik9yaWdpbmF0b3IgUHJvZmlsZSDmioDooZPnoJTnqbbntYTlkIggKOmWi-eZuueUqCkiLCJsb2dvIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2ltYWdlL2ljb24uc3ZnIiwiY29ycG9yYXRlX251bWJlciI6IjgwMTAwMDUwMzU5MzMiLCJwb3N0YWxfY29kZSI6IjEwMC04MDU1IiwicmVnaW9uIjoi5p2x5Lqs6YO9IiwibG9jYWxpdHkiOiLljYPku6PnlLDljLoiLCJzdHJlZXRfYWRkcmVzcyI6IuWkp-aJi-eUujEtNy0xIiwiY29udGFjdF90aXRsZSI6IuOBiuWVj-OBhOWQiOOCj-OBmyIsImNvbnRhY3RfdXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQL2lucXVpcnkvIiwicHJpdmFjeV9wb2xpY3lfdGl0bGUiOiLjg5fjg6njgqTjg5Djgrfjg7zjg53jg6rjgrfjg7wiLCJwcml2YWN5X3BvbGljeV91cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvamEtSlAvcHJpdmFjeS8ifSwiandrcyI6eyJrZXlzIjpbeyJ4IjoieXBBbFVqbzVPNXNvVU5IazNtbFJ5Znc2dWp4cWpmRF9ITVF0N1hILXJTZyIsInkiOiIxY212OWxtWnZMMFhBRVJOeHZyVDJrWmtDNFV3dTVpMU9yMU8tNGl4SnVFIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJqSllzNV9JTGdVYzgxODBMLXBCUHhCcGdBM1FDN2VadTl3S09raDltWVBVIiwia3R5IjoiRUMifV19LCJpYXQiOjE3MjA2OTAzMzIsImV4cCI6MjAzNjIyMzEzMn0.ZSGhm97G8qiUjuO3B0RT3M6mRvu9Xqf51rJIB8Zfoqo1TQULOhTpbmr-t_glIG61alzRnCRob__XDIsB1ZPVpA~",
        },
        dp: {
          sub: "localhost",
          profile:
            "eyJhbGciOiJFUzI1NiIsImtpZCI6InJsMDhxUWtnbHJsSG1BbXhRQnh0SFdxZ2RWZnBuMnpnMWs4N0pOWjZBd1kiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjgwODAiLCJ0aXRsZSI6IldlYnNpdGUgUHJvZmlsZSBQYWlyIHRpdGxlIiwiaW1hZ2UiOiJodHRwczovL3NpdGUuZXhhbXBsZS5jb20vc3RhdGljL2ltYWdlLnBuZyIsImRlc2NyaXB0aW9uIjoi44GT44Gu44K144Kk44OI44Gu6Kqs5piO44Gn44GZ44CCIn1dLCJhbGxvd2VkT3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAiXX0sImlzcyI6ImxvY2FsaG9zdCIsInN1YiI6ImxvY2FsaG9zdCIsImlhdCI6MTcwODMwNzI1OSwiZXhwIjoxNzM5OTI5NjU5fQ.lKODMtiecvsmWKQWXPAnvlvRpsYhLYmp-d5AoMln-o4GV9ARdaTqdtJUdzOnC17lTv08mVh657Igl3qw9ZxxdQ",
        },
      },
    }),
  },
};

test.beforeEach(async ({ page }) => {
  await page.route("**/.well-known/pp.json", (route) => {
    // 補足するリクエストが特定されているので直接取得
    const response = responseMap["/.well-known/pp.json"];

    if (response) {
      return route.fulfill(response);
    } else {
      return route.continue();
    }
  });
});

test.afterEach(async ({ page }, testInfo) => {
  await page.screenshot({ path: `screenshots/${testInfo.title}-webpage.png` });
  await ext?.screenshot({ path: `screenshots/${testInfo.title}-web-ext.png` });
});

test("サイトプロファイル検証失敗時に閲覧禁止の確認", async ({
  context,
  page,
}) => {
  try {
    await page.goto("http://localhost:8080/examples/many-dps.html");
  } catch (err) {
    console.error(
      `Error navigating to http://localhost:8080/examples/many-dps.html`,
    );
  }
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
