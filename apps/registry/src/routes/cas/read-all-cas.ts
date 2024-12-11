import { ContentAttestationSet } from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export const method = "GET";
export const url = "";

const querystring = {
  type: "object",
  properties: {
    id: {
      title: "CA IDs",
      description: `\
CA ID を指定します。CA ID は UUIDv4 URN です。

CA ID の仕様:

- <https://docs.originator-profile.org/rfc/ca/#credentialsubjectid>

以下のいずれかの形式で指定可能です。

### 複数クエリーパラメーターでの指定

個別に \`id=...&id=...&id=...\` 形式で CA ID を指定します。

具体例:

\`\`\`
GET /cas?id=urn:uuid:e93d88da-0937-4b63-af79-dc93090235c0&id=urn:uuid:f6bafc60-a702-4827-b80b-d1118aa579ad
\`\`\`

### JSON 配列形式での指定

CA ID (文字列) を含む JSON 配列形式としてエンコードし、\`id\` クエリーパラメーターに指定します。

具体例:

\`\`\`
GET /cas?id=[%22urn:uuid:e93d88da-0937-4b63-af79-dc93090235c0%22,%22urn:uuid:f6bafc60-a702-4827-b80b-d1118aa579ad%22]
\`\`\`

### レスポンスに関する注意

レスポンスは全て main プロパティが true の Content Attestation として扱われます。
`,
      type: "array",
      items: {
        type: "string",
      },
    },
  },
} as const satisfies JSONSchema;

type Querystring = FromSchema<typeof querystring>;

export const schema = {
  operationId: "readAllCas",
  tags: ["ca"],
  querystring,
  response: {
    200: {
      ...ContentAttestationSet,
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  req: FastifyRequest<{ Querystring: Querystring }>,
): Promise<ContentAttestationSet> {
  const cas = await req.server.services.caRepository.getCas(
    req.query?.id ?? [],
  );
  return cas;
}
