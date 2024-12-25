import { expect, popup, test as base } from "./fixtures";
import { SiteProfile } from "@originator-profile/model";

const test = base.extend({
  page: async ({ page }, use) => {
    /* Verify失敗するSiteProfile */
    const sp: SiteProfile = {
      originators: [
        {
          core: " eyJhbGciOiJFUzI1NiIsImtpZCI6ImpKWXM1X0lMZ1VjODE4MEwtcEJQeEJwZ0EzUUM3ZVp1OXdLT2toOW1ZUFUiLCJ0eXAiOiJ2Yytqd3QiLCJjdHkiOiJ2YyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvbnMvY3JlZGVudGlhbHMvdjEiXSwidHlwZSI6WyJWZXJpZmlhYmxlQ3JlZGVudGlhbCIsIkNvcmVQcm9maWxlIl0sImlzc3VlciI6ImRuczpsb2NhbGhvc3QiLCJjcmVkZW50aWFsU3ViamVjdCI6eyJpZCI6ImRuczpsb2NhbGhvc3QiLCJ0eXBlIjoiQ29yZSIsImp3a3MiOnsia2V5cyI6W3sia3R5IjoiRUMiLCJraWQiOiJqSllzNV9JTGdVYzgxODBMLXBCUHhCcGdBM1FDN2VadTl3S09raDltWVBVIiwieCI6InlwQWxVam81TzVzb1VOSGszbWxSeWZ3NnVqeHFqZkRfSE1RdDdYSC1yU2ciLCJ5IjoiMWNtdjlsbVp2TDBYQUVSTnh2clQya1prQzRVd3U1aTFPcjFPLTRpeEp1RSIsImNydiI6IlAtMjU2In1dfX0sImlzcyI6ImRuczpsb2NhbGhvc3QiLCJzdWIiOiJkbnM6bG9jYWxob3N0IiwiaWF0IjoxNzMyNDI4MDAwLCJleHAiOjE3NjM5NjQwMDB9.KRXpun0HYErCDkbzuEMkXO8edtMM_8Znlm6fzElEKWg79ShDrvRKGQNkr41cpl7ycLzFIbKk7epRTlStlqePWA",
        },
      ],
      credential:
        " eyJhbGciOiJFUzI1NiIsImtpZCI6ImpKWXM1X0lMZ1VjODE4MEwtcEJQeEJwZ0EzUUM3ZVp1OXdLT2toOW1ZUFUiLCJ0eXAiOiJ2Yytqd3QiLCJjdHkiOiJ2YyJ9.eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvbnMvY3JlZGVudGlhbHMvdjIiLCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvbnMvY3JlZGVudGlhbHMvdjEiLCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvbnMvY2lwL3YxIix7IkBsYW5ndWFnZSI6ImphIn1dLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiV2Vic2l0ZVByb2ZpbGUiXSwiaXNzdWVyIjoiZG5zOmxvY2FsaG9zdCIsImNyZWRlbnRpYWxTdWJqZWN0Ijp7ImlkIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwLyIsInVybCI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcHAvZGVidWdnZXIiLCJ0eXBlIjoiV2ViU2l0ZSIsIm5hbWUiOiI8V2Vi44K144Kk44OI44Gu44K_44Kk44OI44OrPiIsImRlc2NyaXB0aW9uIjoiPFdlYuOCteOCpOODiOOBruiqrOaYjj4ifSwiaXNzIjoiZG5zOmxvY2FsaG9zdCIsInN1YiI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC8iLCJpYXQiOjE3MzI0MjY5OTMsImV4cCI6MTc2Mzk2Mjk5M30.GBJpecwn1wmSwcp7bqf6PwvTFp6MN8wLmz7UdlkTkFSK-EJDqGeHQfrwMJbLuL6aHXsHmwVXdq8TsVwKCp8zYg",
    };
    await page.route(
      "http://localhost:8080/.well-known/sp.json",
      async (route) =>
        route.fulfill({
          body: JSON.stringify(sp),
          contentType: "application/json",
        }),
    );
    await use(page);
  },
});

test("Site Profile の検証に失敗した場合", async ({ context, page }) => {
  await page.goto("http://localhost:8080/app/debugger/");
  const ext = await popup(context);
  await expect(ext?.getByTestId("p-elm-prohibition-message")).toBeVisible();
});
