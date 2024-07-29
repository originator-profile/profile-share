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
    const webassertions = {
      "originator": "SD-JWT VC 形式の Originator Profile",
      "certificates": ["SD-JWT VC の配列"],
      "assertions": ["SD-JWT VC 形式のWeb Assertionの配列"],
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

describe("異なるエンドポイントに <script> 要素が2つ以上存在するとき", () => {
  test("有効な Web Assertion Set が得られる", async () => {
    server.use(
      http.get("https://example.com/1/was.json", () =>
        HttpResponse.json({
          "originator": "SD-JWT VC 形式の Originator Profile",
          "certificates": ["SD-JWT VC の配列"],
          "assertions": ["SD-JWT VC 形式のWeb Assertionの配列"],
        }),
      ),
      http.get("https://example.com/2/was.json", () =>
        HttpResponse.json({
          "originator": "SD-JWT VC 形式の Originator Profile",
          "certificates": ["SD-JWT VC の配列"],
          "assertions": ["SD-JWT VC 形式のWeb Assertionの配列"],
        }),
      ),
    );

    const window = new Window();
    const profileEndpoints = [
      "https://example.com/1/was.json",
      "https://example.com/2/was.json",
    ];
    window.document.body.innerHTML = profileEndpoints
      .map(
        (endpoint) => `
<script
  src="${endpoint}"
  type="application/was+json"
></script>
  `,
      )
      .join("");
    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).not.toBeInstanceOf(ProfilesFetchFailed);
    expect(result).toMatchSnapshot();
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
    "originator": "SD-JWT VC 形式の Originator Profile",
    "certificates": ["SD-JWT VC の配列"],
    "assertions": ["SD-JWT VC 形式のWeb Assertionの配列"],
  };

  beforeEach(() => {
    server.use(
      http.get("https://example.com/1/was.json", () =>
        HttpResponse.json({
          "originator": "SD-JWT VC 形式の Originator Profile",
          "certificates": ["SD-JWT VC の配列"],
          "assertions": [
            "SD-JWT VC 形式のWeb Assertionの配列",
            "SD-JWT VC 形式のWeb Assertionの配列"
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
