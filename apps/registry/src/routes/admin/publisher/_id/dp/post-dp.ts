import { FastifyRequest, FastifySchema } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { DecodeResult } from "@originator-profile/verify";
import { ErrorResponse } from "../../../../../error";
import Params from "./params";
import document from "./post-dp.doc.md?raw";

const Body = {
  type: "object",
  properties: {
    jwt: {
      title: "Signed Document Profile (SDP)",
      description:
        "登録したい Signed Document Profile (SDP) を与えてください。",
      type: "string",
    },
  },
  additionalProperties: false,
  required: ["jwt"],
  examples: [
    {
      jwt: "eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjAwZjQ3MGViLWVhZmQtNGEzOC04NTRjLWZiYjY5NjhhMTU5ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tL2FydGljbGVzL2hlbGxvLXdvcmxkLyIsInRpdGxlIjoi44Oh44OH44Kj44KiICjoqabpqJPnlKgpIn0seyJ0eXBlIjoidGV4dCIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vYXJ0aWNsZXMvaGVsbG8td29ybGQvIiwibG9jYXRpb24iOiIud3AtYmxvY2stcG9zdC1jb250ZW50IiwicHJvb2YiOnsiandzIjoiZXlKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklrUTFSRFZRTTFWeVZqRldYelpWWDNFNWVVdDJYMnBhWDNFNFUyaEpkbko0ZVRkRk1sRjVUMlpYV1VVaUxDSmlOalFpT21aaGJITmxMQ0pqY21sMElqcGJJbUkyTkNKZGZRLi5vc1d3SkVPLVRZNDhZQldRMEhRYVE0cGZOWm9UZEtWZ3U1YlBfbVVFbW1GNHowMGxhelZkcjFlTF93dUxBTXo3ZjItd084UVp2OGtXUElUcTVDLW80ZyJ9fV19fQ.ZXRG71IWfgt7MNoqt_sXSLOl7wkqqHsDXJL85UlUd-w0GxXOrFHziv11KXwBp5Wd8zoCZ5euGpn0t4zPxyPKSQ",
    },
  ],
} as const;

type Body = FromSchema<typeof Body>;

export const schema: FastifySchema = {
  operationId: "registerSignedDocumentProfile",
  tags: ["SDP"],
  summary: "SDP の登録・更新",
  params: Params,
  body: Body,
  description: document,
  security: [{ basicAuth: [] }],
  response: {
    200: {
      title: "ウェブページ",
      description: "ウェブページの情報",
      examples: [
        {
          id: "00f470eb-eafd-4a38-854c-fbb6968a159e",
          url: "https://media.example.com/articles/hello-world/",
          accountId: "8fe1b860-558c-5107-a9af-21c376a6a27c",
          title: null,
          image: null,
          description: null,
          author: null,
          editor: null,
          datePublished: null,
          dateModified: null,
          location: ".wp-block-post-content",
          bodyFormatValue: "visibleText",
          proofJws:
            "eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..osWwJEO-TY48YBWQ0HQaQ4pfNZoTdKVgu5bP_mUEmmF4z00lazVdr1eL_wuLAMz7f2-wO8QZv8kWPITq5C-o4g",
          categories: [],
        },
      ],
      type: "object",
      additionalProperties: true,
    },
    400: {
      ...ErrorResponse,
      description: "リクエストが不正です",
      "x-examples": {
        general: {
          summary: "invalid request",
          description: "一般的なエラー",
          value: {
            statusCode: 400,
            error: "Bad Request",
            message: "invalid request",
          },
        },
        invalidJwt: {
          summary: "invalid jwt",
          description: "jwt パラメータが dp クレーム を含んでいない",
          value: {
            statusCode: 400,
            error: "Bad Request",
            message: "invalid jwt",
          },
        },
        noProof: {
          summary: "dp doesn't contain item with proof",
          description:
            "dp クレームの item プロパティ の中にコンテンツへの署名を含む要素がない",
          value: {
            statusCode: 400,
            error: "Bad Request",
            message: "dp doesn't contain item with proof",
          },
        },
      },
    },
  },
};

export async function postDp({
  server,
  params,
  body,
}: FastifyRequest<{
  Params: Params;
  Body: Body;
}>) {
  const { id: accountId } = params;
  const { jwt } = body;

  // SDP を更新・登録
  await server.services.publisher.registerDp(accountId, jwt);

  const decoded: DecodeResult = server.services.validator.decodeToken(jwt);

  return await server.services.website.read({
    id: decoded.payload.sub,
  });
}

export default Object.assign(postDp, { schema });
