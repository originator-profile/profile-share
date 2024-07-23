import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";
import {
  describe,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  test,
  expect,
} from "vitest";
import { Window } from "happy-dom";
import { addYears, getUnixTime, fromUnixTime } from "date-fns";
import { generateKey, signOp } from "@originator-profile/sign";
import { Op } from "@originator-profile/model";
import { ProfilesFetchFailed } from "./errors";
import { fetchWebAssertionSet } from "./fetch-web-assertion-set";

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe("単純なscriptから取得", () => {
  const wasEndpoint = "https://example.com/was.json";

  test("有効なエンドポイント指定時 Web Assertion Set が得られる", async () => {
    const iat = getUnixTime(new Date());
    const exp = getUnixTime(addYears(new Date(), 10));
    const op: Op = {
      type: "op",
      issuedAt: fromUnixTime(iat).toISOString(),
      expiredAt: fromUnixTime(exp).toISOString(),
      issuer: "example.org",
      subject: "example.com",
      item: [],
    };
    const { privateKey } = await generateKey();
    const jwt = await signOp(op, privateKey);
    const webassertions = {
      "@context": "https://originator-profile.org/context.jsonld",
      main: ["example.com"],
      profile: [jwt],
    };

    server.use(http.get(wasEndpoint, () => HttpResponse.json(webassertions)));

    const window = new Window();
    window.document.body.innerHTML = `
<script
  src="${wasEndpoint}"
  type="application/was+json"
></script>`;
    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).toEqual([webassertions]);
  });

  test("無効なエンドポイント指定時 Web Assertion Set の取得に失敗", async () => {
    const window = new Window();
    window.document.body.innerHTML = `
<script
  src=""
  type="application/was+json"
></script>`;
    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.message).toBe(
      `プロファイルを取得できませんでした:\nInvalid URL`,
    );
  });

  test("取得先に Web Assertion Set が存在しないとき Web Assertion Set の取得に失敗", async () => {
    server.use(
      http.get(
        "https://example.com/was.json",
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const window = new Window();
    window.document.body.innerHTML = `
<script
  src="${wasEndpoint}"
  type="application/was+json"
></script>`;
    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).toBeInstanceOf(ProfilesFetchFailed);
    // @ts-expect-error result is ProfilesFetchFailed
    expect(result.message).toBe(
      `プロファイルを取得できませんでした:\nHTTP ステータスコード 404`,
    );
  });
});

test("エンドポイントを指定しない時 空の配列が得られる", async () => {
  const window = new Window();
  const result = await fetchWebAssertionSet(
    window.document as unknown as Document,
  );
  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(0);
});

describe("<script> 要素から Web Assertion Set を取得する", () => {
  const webassertionSet = {
    "@context": "https://originator-profile.org/context.jsonld",
    main: ["https://example.org"],
    profile: ["{Signed Document Profile または Signed Originator Profile}"],
  };

  beforeEach(() => {
    server.use(
      http.get("https://example.com/1/was.json", () =>
        HttpResponse.json({
          "@context": "https://originator-profile.org/context.jsonld",
          main: ["https://example.com"],
          profile: [
            "{Signed Document Profile または Signed Originator Profile}",
            "{Signed Document Profile または Signed Originator Profile}",
          ],
        }),
      ),
    );
  });

  test("<script> 要素 から Web Assertion Set を取得できる", async () => {
    const window = new Window();
    window.document.body.innerHTML = `
<script type="application/was+json">${JSON.stringify(webassertionSet)}</script>
`;

    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).not.toBeInstanceOf(ProfilesFetchFailed);
    expect(result).toMatchSnapshot();
  });

  test("<script> 要素 が2つ以上存在する", async () => {
    const window = new Window();
    window.document.body.innerHTML = `
<script type="application/was+json">${JSON.stringify(webassertionSet)}</script>
<script type="application/was+json">${JSON.stringify(webassertionSet)}</script>
`;

    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).not.toBeInstanceOf(ProfilesFetchFailed);
    expect(result).toMatchSnapshot();
  });
});
