import { FastifySchema, FastifyRequest, FastifyReply } from "fastify";
import { FromSchema } from "json-schema-to-ts";
import { ContextDefinition, JsonLdDocument } from "jsonld";
import context from "@originator-profile/model/context.json" assert { type: "json" };
import document from "./get-profile-set.doc.md?raw";

const Query = {
  type: "object",
  properties: {
    url: {
      type: "string",
      format: "uri",
      title: "URL",
      description: `記事の URL を与えてください。記事登録時に指定した URL を RFC 3986 の形式でエンコーディングしてください。
        [シリアライズの結果が等しい](https://url.spec.whatwg.org/#url-equivalence) URL の SDP が Profile Set として取得できます。
        `,
    },
    main: {
      type: "string",
      format: "uuid",
      title: "メインコンテンツの ID (UUID)",
      description:
        "欲しい SDP のうちページのメインコンテンツに対応する SDP の DP ID を指定してください。",
    },
  },
  required: ["url"],
} as const;

type Query = FromSchema<typeof Query>;

const schema: FastifySchema = {
  operationId: "website.getProfileSet",
  tags: ["profiles"],
  summary: "Profile Set の取得",
  description: document,
  querystring: Query,
  produces: ["application/ld+json"],
  response: {
    200: {
      title: "Profile Set",
      description: "Profile Set",
      type: "object",
      additionalProperties: true,
      example: {
        "@context": "https://originator-profile.org/context.jsonld",
        profile: [
          "eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwX1hDazM2dFFrUlpsQnhEckhzMVhldHBUZUZYdDRfVlRSbHlEa0YyQWsiLCJ0eXAiOiJKV1QifQ.eyJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvb3AiOnsiaXRlbSI6W3sidHlwZSI6ImNlcnRpZmllciIsImRvbWFpbk5hbWUiOiJvcHJleHB0Lm9yaWdpbmF0b3ItcHJvZmlsZS5vcmciLCJ1cmwiOiJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvIiwibmFtZSI6Ik9yaWdpbmF0b3IgUHJvZmlsZSDmioDooZPnoJTnqbbntYTlkIgiLCJwb3N0YWxDb2RlIjoiMTA4LTAwNzMiLCJhZGRyZXNzQ291bnRyeSI6IkpQIiwiYWRkcmVzc1JlZ2lvbiI6IuadseS6rOmDvSIsImFkZHJlc3NMb2NhbGl0eSI6Iua4r-WMuiIsInN0cmVldEFkZHJlc3MiOiLkuInnlLAiLCJjb250YWN0VGl0bGUiOiLjgYrllY_jgYTlkIjjgo_jgZsiLCJjb250YWN0VXJsIjoiaHR0cHM6Ly9vcmlnaW5hdG9yLXByb2ZpbGUub3JnL2phLUpQL2lucXVpcnkvIiwicHJpdmFjeVBvbGljeVRpdGxlIjoi44OX44Op44Kk44OQ44K344O844Od44Oq44K344O8IiwicHJpdmFjeVBvbGljeVVybCI6Imh0dHBzOi8vb3JpZ2luYXRvci1wcm9maWxlLm9yZy9qYS1KUC9wcml2YWN5LyIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119LHsidHlwZSI6ImhvbGRlciIsImRvbWFpbk5hbWUiOiJtZWRpYS5leGFtcGxlLmNvbSIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vIiwibmFtZSI6IuS8muWToSAo6Kmm6aiT55SoKSIsInBvc3RhbENvZGUiOiIxMDAtMDAwMCIsImFkZHJlc3NDb3VudHJ5IjoiSlAiLCJhZGRyZXNzUmVnaW9uIjoi5p2x5Lqs6YO9IiwiYWRkcmVzc0xvY2FsaXR5Ijoi5Y2D5Luj55Sw5Yy6Iiwic3RyZWV0QWRkcmVzcyI6IiIsImxvZ29zIjpbXSwiYnVzaW5lc3NDYXRlZ29yeSI6W119XSwiandrcyI6eyJrZXlzIjpbeyJ4IjoiMk9LbXF1VVBpbWtzaGtKUVdXaWgtLXp1LVUxTmtEc0tJbVdfbzNrYmVPZyIsInkiOiJmOWJnZU1IX3FMUzVMdk95YzNkSG9LWUptVmZ1dEVNOVZyYjJXZUVlbXRNIiwiY3J2IjoiUC0yNTYiLCJraWQiOiJENUQ1UDNVclYxVl82VV9xOXlLdl9qWl9xOFNoSXZyeHk3RTJReU9mV1lFIiwia3R5IjoiRUMifV19fSwiaXNzIjoib3ByZXhwdC5vcmlnaW5hdG9yLXByb2ZpbGUub3JnIiwic3ViIjoibWVkaWEuZXhhbXBsZS5jb20iLCJpYXQiOjE2ODg1MzczMTcsImV4cCI6MTcyMDE1OTcxN30.HmflTdUnbgLKpXbbCtO6eV4nR6Ncttlv_4sCJUsHujeLO2QHS2_Ot6VddzECiOcLX_UotBRVqhvJ_J1OQJNVpw",
          "eyJhbGciOiJFUzI1NiIsImtpZCI6IkQ1RDVQM1VyVjFWXzZVX3E5eUt2X2paX3E4U2hJdnJ4eTdFMlF5T2ZXWUUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJtZWRpYS5leGFtcGxlLmNvbSIsInN1YiI6IjAwZjQ3MGViLWVhZmQtNGEzOC04NTRjLWZiYjY5NjhhMTU5ZSIsImlhdCI6MTY4NzgyNzQ1OCwiZXhwIjoxNzE5NDQ5ODU4LCJodHRwczovL29yaWdpbmF0b3ItcHJvZmlsZS5vcmcvZHAiOnsiaXRlbSI6W3sidHlwZSI6IndlYnNpdGUiLCJ1cmwiOiJodHRwczovL21lZGlhLmV4YW1wbGUuY29tL2FydGljbGVzL2hlbGxvLXdvcmxkLyIsInRpdGxlIjoi44Oh44OH44Kj44KiICjoqabpqJPnlKgpIn0seyJ0eXBlIjoidGV4dCIsInVybCI6Imh0dHBzOi8vbWVkaWEuZXhhbXBsZS5jb20vYXJ0aWNsZXMvaGVsbG8td29ybGQvIiwibG9jYXRpb24iOiIud3AtYmxvY2stcG9zdC1jb250ZW50IiwicHJvb2YiOnsiandzIjoiZXlKaGJHY2lPaUpGVXpJMU5pSXNJbXRwWkNJNklrUTFSRFZRTTFWeVZqRldYelpWWDNFNWVVdDJYMnBhWDNFNFUyaEpkbko0ZVRkRk1sRjVUMlpYV1VVaUxDSmlOalFpT21aaGJITmxMQ0pqY21sMElqcGJJbUkyTkNKZGZRLi5vc1d3SkVPLVRZNDhZQldRMEhRYVE0cGZOWm9UZEtWZ3U1YlBfbVVFbW1GNHowMGxhelZkcjFlTF93dUxBTXo3ZjItd084UVp2OGtXUElUcTVDLW80ZyJ9fV19fQ.ZXRG71IWfgt7MNoqt_sXSLOl7wkqqHsDXJL85UlUd-w0GxXOrFHziv11KXwBp5Wd8zoCZ5euGpn0t4zPxyPKSQ",
        ],
      },
    },
  },
};

async function getProfileSet(
  {
    server,
    query,
  }: FastifyRequest<{
    Querystring: Query;
  }>,
  reply: FastifyReply,
) {
  const contextDefinition: ContextDefinition | undefined =
    server.config.NODE_ENV === "development" ? context["@context"] : undefined;
  const data: JsonLdDocument = await server.services.website.getProfileSet(
    query.url,
    contextDefinition,
    query.main,
  );

  reply.type("application/ld+json");
  return data;
}

export default Object.assign(getProfileSet, { schema });
