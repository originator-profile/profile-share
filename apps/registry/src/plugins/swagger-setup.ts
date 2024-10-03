import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import swagger, { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { Options } from "../server";
import { Config } from "@originator-profile/registry-service";
import pkg from "../package.json";

function OpenApi(
  config: Pick<Config, "AUTH0_DOMAIN">,
  hideInternalDocs: boolean = false,
): FastifyDynamicSwaggerOptions["openapi"] {
  const tagsInternalOnly = [
    {
      name: "user-accounts",
      description: "ユーザーアカウント",
      "x-displayName": "ユーザーアカウント",
    },
    {
      name: "credentials",
      description: "資格情報",
      "x-displayName": "資格情報",
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
        name: "accounts",
        description: "アカウント",
        "x-displayName": "アカウント",
      },

      {
        name: "SDP",
        description: "Signed Document Profile",
        "x-displayName": "Signed Document Profile",
      },
      {
        name: "profiles",
        description: "Profile Sets/Pairs",
        "x-displayName": "Profile Sets/Pairs",
      },
      {
        name: "registry",
        description: "レジストリ",
        "x-displayName": "レジストリ",
      },
      {
        name: "keys",
        description: "公開鍵",
        "x-displayName": "公開鍵",
      },
      {
        name: "certification-systems",
        description: "認証制度",
        "x-displayName": "認証制度",
      },
      {
        name: "SOP",
        description: "Signed Originator Profile",
        "x-displayName": "Signed Originator Profile",
      },
      {
        name: "websites",
        description: "ウェブページ",
        "x-displayName": "ウェブページ",
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
