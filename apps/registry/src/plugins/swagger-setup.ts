import swagger, { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { Config } from "@originator-profile/registry-service";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import pkg from "../package.json";
import { Options } from "../server";

function OpenApi(
  config: Pick<Config, "AUTH0_DOMAIN">,
  hideInternalDocs: boolean = false,
): FastifyDynamicSwaggerOptions["openapi"] {
  const tagsInternalOnly = [
    {
      name: "accounts",
      description: "アカウント",
      "x-displayName": "アカウント",
    },
    {
      name: "certification-systems",
      description: "認証制度",
      "x-displayName": "認証制度",
    },
    {
      name: "user-accounts",
      description: "ユーザーアカウント",
      "x-displayName": "ユーザーアカウント",
    },
    {
      name: "credentials",
      description: "Profile Annotation",
      "x-displayName": "Profile Annotation",
    },
    {
      name: "requests",
      description: "申請",
      "x-displayName": "申請",
    },
    {
      name: "logos",
      description: "組織ロゴ",
      "x-displayName": "組織ロゴ",
    },
    {
      name: "internal",
      description: "内部用 API",
      "x-displayName": "内部用 API",
    },
  ];
  return {
    info: {
      title: pkg.description,
      version: pkg.version,
      description: "Profile Registry API Documentation.",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "openIdConnect",
          openIdConnectUrl: `https://${config.AUTH0_DOMAIN}/.well-known/openid-configuration`,
        },
        basicAuth: {
          type: "http",
          scheme: "basic",
        },
      },
    },
    tags: [
      {
        name: "ca",
        description: "Content Attestation",
        "x-displayName": "Content Attestation",
      },
      {
        name: "op",
        description: "Originator Profile",
        "x-displayName": "Originator Profile",
      },
      {
        name: "sp",
        description: "Site Profile",
        "x-displayName": "Site Profile",
      },
      {
        name: "wmp",
        description: "Web Media Profile",
        "x-displayName": "Web Media Profile",
      },
      {
        name: "keys",
        description: "Public Key",
        "x-displayName": "Public Key",
      },
      ...(hideInternalDocs ? [] : tagsInternalOnly),
    ],
  };
}

const callback: FastifyPluginAsync<Options> = async (app, options) => {
  if (options.isDev) {
    await app.register(swagger, {
      openapi: OpenApi(app.config, options.hideInternalDocs),
      hiddenTag: options.hideInternalDocs ? "internal" : undefined,
    });
    await app.register(swaggerUi, {
      initOAuth: {
        clientId: app.config.AUTH0_CLIENT_ID,
        additionalQueryStringParams: {
          audience: app.config.APP_URL,
        },
        scopes: "openid profile email",
        usePkceWithAuthorizationCodeGrant: true,
      },
      transformStaticCSP: (header) =>
        header
          .split(";")
          .filter(
            // TrustedTypePolicyが存在せず、DOM要素が表示されないので回避
            (dir) => !/^(?:trusted-types|require-trusted-types-for) /.test(dir),
          )
          .map(
            // data: schemeを使用したリソースが表示されないので回避
            (dir) => (/^img-src /.test(dir) ? `${dir} data:` : dir),
          )
          .join(";"),
    });
  }
};

/** Swagger / Swagger UI の設定 */
export const swaggerSetup = fp(callback);
