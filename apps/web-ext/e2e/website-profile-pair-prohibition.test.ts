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
            "eyJhbGciOiJFUzI1NiIsImtpZCI6ImpKWXM1X0lMZ1VjODE4MEwtcEJQeEJwZ0EzUUM3ZVp1OXdLT2toOW1ZUFUiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3AiOnsiaXRlbSI6W3sidHlwZSI6ImNyZWRlbnRpYWwiLCJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvY3JlZGVudGlhbC1kZXNjcmlwdGlvbi5qc29uIiwibmFtZSI6IuODluODqeODs-ODieOCu-ODvOODleODhuOCo-iqjeiovCIsImltYWdlIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2NyZWRlbnRpYWwtYnJhbmQtc2FmZXR5LWNlcnRpZmllZC5wbmciLCJpc3N1ZWRBdCI6IjIwMjMtMTEtMjRUMTA6MzQ6MDEuOTg0WiIsImV4cGlyZWRBdCI6IjIwMjQtMTEtMjRUMTA6MzQ6MDEuOTg0WiIsImNlcnRpZmllciI6ImxvY2FsaG9zdCIsInZlcmlmaWVyIjoibG9jYWxob3N0In0seyJ0eXBlIjoiY2VydGlmaWVyIiwiZG9tYWluTmFtZSI6ImxvY2FsaG9zdCIsInVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy8iLCJuYW1lIjoiT3JpZ2luYXRvciBQcm9maWxlIOaKgOihk-eglOeptue1hOWQiCIsInBvc3RhbENvZGUiOiIxMDgtMDA3MyIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5riv5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IuS4ieeUsCIsImNvbnRhY3RUaXRsZSI6IuOBiuWVj-OBhOWQiOOCj-OBmyIsImNvbnRhY3RVcmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvamEtSlAvIiwibG9nb3MiOlt7InVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9pbWFnZS9pY29uLnN2ZyIsImlzTWFpbiI6dHJ1ZX1dLCJidXNpbmVzc0NhdGVnb3J5IjpbXX0seyJ0eXBlIjoidmVyaWZpZXIiLCJkb21haW5OYW1lIjoibG9jYWxob3N0IiwidXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnLyIsIm5hbWUiOiJPcmlnaW5hdG9yIFByb2ZpbGUg5oqA6KGT56CU56m257WE5ZCIIiwicG9zdGFsQ29kZSI6IjEwOC0wMDczIiwiYWRkcmVzc0NvdW50cnkiOiJKUCIsImFkZHJlc3NSZWdpb24iOiLmnbHkuqzpg70iLCJhZGRyZXNzTG9jYWxpdHkiOiLmuK_ljLoiLCJzdHJlZXRBZGRyZXNzIjoi5LiJ55SwIiwiY29udGFjdFRpdGxlIjoi44GK5ZWP44GE5ZCI44KP44GbIiwiY29udGFjdFVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC8iLCJsb2dvcyI6W3sidXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2ltYWdlL2ljb24uc3ZnIiwiaXNNYWluIjp0cnVlfV0sImJ1c2luZXNzQ2F0ZWdvcnkiOltdfSx7InR5cGUiOiJob2xkZXIiLCJkb21haW5OYW1lIjoibG9jYWxob3N0IiwidXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnLyIsIm5hbWUiOiJPcmlnaW5hdG9yIFByb2ZpbGUg5oqA6KGT56CU56m257WE5ZCIIiwicG9zdGFsQ29kZSI6IjEwOC0wMDczIiwiYWRkcmVzc0NvdW50cnkiOiJKUCIsImFkZHJlc3NSZWdpb24iOiLmnbHkuqzpg70iLCJhZGRyZXNzTG9jYWxpdHkiOiLmuK_ljLoiLCJzdHJlZXRBZGRyZXNzIjoi5LiJ55SwIiwiY29udGFjdFRpdGxlIjoi44GK5ZWP44GE5ZCI44KP44GbIiwiY29udGFjdFVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC8iLCJsb2dvcyI6W3sidXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2ltYWdlL2ljb24uc3ZnIiwiaXNNYWluIjp0cnVlfV0sImJ1c2luZXNzQ2F0ZWdvcnkiOltdfV0sImp3a3MiOnsia2V5cyI6W3sieCI6InlwQWxVam81TzVzb1VOSGszbWxSeWZ3NnVqeHFqZkRfSE1RdDdYSC1yU2ciLCJ5IjoiMWNtdjlsbVp2TDBYQUVSTnh2clQya1prQzRVd3U1aTFPcjFPLTRpeEp1RSIsImNydiI6IlAtMjU2Iiwia2lkIjoiakpZczVfSUxnVWM4MTgwTC1wQlB4QnBnQTNRQzdlWnU5d0tPa2g5bVlQVSIsImt0eSI6IkVDIn1dfX0sImlzcyI6ImxvY2FsaG9zdCIsInN1YiI6ImxvY2FsaG9zdCIsImlhdCI6MTcwMDgyMjE3NiwiZXhwIjoxNzMyNDQ0NTc2fQ.KEbSeto6KzcMdNne0UutAWnBJnPd2vDrwk1oDDy1uUKmOhDbE_AhN72ydFAYwDTG-7cpRe5u6r6htPoFIfjYNw",
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
