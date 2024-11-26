import { OriginatorProfileSet } from "@originator-profile/model";
import type { FastifyRequest, FastifySchema } from "fastify";
import type { FromSchema, JSONSchema } from "json-schema-to-ts";

export const method = "GET";
export const url = "";

const querystring = {
  type: "object",
  properties: {
    id: {
      title: "OP IDs",
      description: `\
OP ID を指定します。

OP ID の仕様:

- [Originator Profile Identifier (OP ID)](https://docs.originator-profile.org/rfc/op-id/)

以下のいずれかの形式で指定可能です。

### 複数クエリーパラメーターでの指定

個別に \`id=...&id=...&id=...\` 形式で OP ID を指定します。

具体例:

\`\`\`
GET /ops?id=dns:example.org&id=dns:example.com
\`\`\`

### JSON 配列形式での指定

OP ID (文字列) を含む JSON 配列形式としてエンコードし、\`id\` クエリーパラメーターに指定します。

具体例:

\`\`\`
GET /ops?id=[%22dns:example.org%22,%22dns:example.com%22]
\`\`\`
`,
      type: "array",
      items: {
        type: "string",
      },
    },
  },
} as const as JSONSchema;

type Querystring = FromSchema<typeof querystring>;

export const schema = {
  operationId: "readAllOps",
  tags: ["op"],
  querystring,
  response: {
    200: {
      ...OriginatorProfileSet,
      description: `TODO: <https://github.com/originator-profile/profile/issues/1608>`,
    },
  },
} as const satisfies FastifySchema;

export async function handler(
  _: FastifyRequest<{ Querystring: Querystring }>,
): Promise<OriginatorProfileSet> {
  return []; // TODO: https://github.com/originator-profile/profile/issues/1608
}
