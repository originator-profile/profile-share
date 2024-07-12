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
import { fetchProfileSet } from "./fetch-profile-set";
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

describe("単純なlinkから取得", () => {
  const profileEndpoint = "https://example.com/ps.json";

  test("有効なエンドポイント指定時 Profile Set が得られる", async () => {
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
    const profiles = {
      "@context": "https://originator-profile.org/context.jsonld",
      main: ["example.com"],
      profile: [jwt],
    };

    server.use(http.get(profileEndpoint, () => HttpResponse.json(profiles)));

    const window = new Window();
    window.document.body.innerHTML = `
<script
  src="${profileEndpoint}"
  type="application/was+json"
></script>`;
    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).toEqual([profiles]);
  });

  test("無効なエンドポイント指定時 Profile Set の取得に失敗", async () => {
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

  test("取得先に Profile Set が存在しないとき Profile Set の取得に失敗", async () => {
    server.use(
      http.get(
        "https://example.com/ps.json",
        () => new HttpResponse(null, { status: 404 }),
      ),
    );

    const window = new Window();
    window.document.body.innerHTML = `
<script
  src="${profileEndpoint}"
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

describe("<link> 要素が2つ以上存在するとき", () => {
  test("有効な Profile Set が得られる", async () => {
    server.use(
      http.get("https://example.com/1/ps.json", () =>
        HttpResponse.json({
          "@context": "https://originator-profile.org/context.jsonld",
          profiles:
            "{Signed Document Profile または Signed Originator Profile}",
        }),
      ),
      http.get("https://example.com/2/ps.json", () =>
        HttpResponse.json({
          "@context": "https://originator-profile.org/context.jsonld",
          profiles:
            "{別の Signed Document Profile または Signed Originator Profile}",
        }),
      ),
    );

    const window = new Window();
    const profileEndpoints = [
      "https://example.com/1/ps.json",
      "https://example.com/2/ps.json",
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
  const result = await fetchWebAssertionSet(window.document as unknown as Document);
  expect(result).toBeInstanceOf(Array);
  expect(result).toHaveLength(0);
});

describe("<script>要素から Profile Set を取得する", () => {
  const profileSet = {
    "@context": "https://originator-profile.org/context.jsonld",
    main: ["https://example.org"],
    profile: ["{Signed Document Profile または Signed Originator Profile}"],
  };

  beforeEach(() => {
    server.use(
      http.get("https://example.com/1/ps.json", () =>
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

  test("<script> から profile set を取得できる", async () => {
    const window = new Window();
    window.document.body.innerHTML = `
<script type="application/was+json">${JSON.stringify(profileSet)}</script>
`;

    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).not.toBeInstanceOf(ProfilesFetchFailed);
    expect(result).toMatchSnapshot();
  });

  test("<script> が2つ以上存在する", async () => {
    const window = new Window();
    window.document.body.innerHTML = `
<script type="application/was+json">${JSON.stringify(profileSet)}</script>
<script type="application/was+json">${JSON.stringify(profileSet)}</script>
`;

    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).not.toBeInstanceOf(ProfilesFetchFailed);
    expect(result).toMatchSnapshot();
  });

  test("<script> と <link> から profile set を取得できる", async () => {
    const window = new Window();
    const profileEndpoint = "https://example.com/1/ps.json";
    window.document.body.innerHTML = `
<script type="application/was+json">${JSON.stringify(profileSet)}</script>
<script src="${profileEndpoint}" type="application/was+json"></script>
`;

    const result = await fetchWebAssertionSet(
      window.document as unknown as Document,
    );
    expect(result).not.toBeInstanceOf(ProfilesFetchFailed);
    expect(result).toMatchSnapshot();
  });
});
