import { FastifyRequest, FastifySchema } from "fastify";
import Params from "./params";
import document from "./delete.doc.md?raw";

export const schema: FastifySchema = {
  operationId: "deleteSignedDocumentProfile",
  summary: "SDP の削除",
  description: document,
  params: Params,
  security: [{ basicAuth: [] }],
  response: {
    200: {
      title: "ウェブページ",
      description: "削除したウェブページの情報",
      examples: [
        {
          id: "040a260d-b677-4f6f-9fb8-f1d4c990825c",
          url: "http://localhost:8080/examples/many-dps.html",
          accountId: "cd8f5f9f-e3e8-569f-87ef-f03c6cfc29bc",
          title: "サブコンテンツの例",
          image: null,
          description: null,
          author: "山田太郎",
          editor: "山田花子",
          datePublished: "2023-12-20T19:14:00Z",
          dateModified: "2023-12-20T19:14:00Z",
          location: "#webpage-040a260d-b677-4f6f-9fb8-f1d4c990825c",
          bodyFormatValue: "visibleText",
          proofJws:
            "eyJhbGciOiJFUzI1NiIsImtpZCI6ImpKWXM1X0lMZ1VjODE4MEwtcEJQeEJwZ0EzUUM3ZVp1OXdLT2toOW1ZUFUiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..GcimCaoJobatxOVBpP_rtxn8RGCkqXvV9uz-Ci89uPO8Vrcf3UHOgA7gJW0hRnmyRvNzJQblj-5N3Og3Bmw0Pg",
        },
      ],
      type: "object",
      additionalProperties: true,
    },
  },
};

export async function deleteDp({
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  const { id: accountId, dpId } = params;

  return await server.services.website.delete({
    id: dpId,
    accountId,
  });
}

export default Object.assign(deleteDp, { schema });
