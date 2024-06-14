import fastify, { FastifyInstance } from "fastify";
import FastifyVite from "@fastify/vite";
import autoload from "@fastify/autoload";
import cors from "@fastify/cors";
import env from "@fastify/env";
import helmet from "@fastify/helmet";
import swagger, { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import httpErrorsEnhanced from "fastify-http-errors-enhanced";
import { Config, Services } from "@originator-profile/registry-service";
import pkg from "./package.json";
import { resolve } from "node:path";

type Options = {
  isDev: boolean;
  routes?: string;
  quiet?: boolean;
  /** テスト用の認証の無効化オプション (**本番環境では厳禁**) */
  dangerouslyDisabledAuth?: boolean;
  hideInternalDocs?: boolean;
};

export type Server = FastifyInstance;

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

export async function create(options: Options): Promise<Server> {
  const app = fastify({
    logger: !options.quiet,
  });

  await app.register(httpErrorsEnhanced, {
    allowUndeclaredResponses: true,
    convertResponsesValidationErrors: false,
    hideUnhandledErrors: !options.isDev,
  });

  await app.register(env, { schema: Config });
  /* options.quietの値を優先する */
  await app.after(() => {
    app.config.LOG_QUIET = options.quiet;
  });

  if (options.isDev && options.dangerouslyDisabledAuth === true) {
    app.decorate("dangerouslyDisabledAuth", true);
  }

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
  await app.register(autoload, {
    dir: options.routes ?? resolve(__dirname, "routes"),
    routeParams: true,
    autoHooks: true,
    cascadeHooks: true,
  });
  app.register(cors);
  const viteHmr =
    app.config.NODE_ENV === "development"
      ? ["http://localhost:24678", "ws://localhost:24678"]
      : [];
  const staticServer =
    app.config.NODE_ENV === "development" ? ["http://localhost:8081"] : [];
  app.register(helmet, {
    hsts: { preload: true },
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "http:", "https:", "data:"],
        "connect-src": ["'self'", "https:", ...viteHmr],
        "frame-src": ["'self'", ...staticServer],
        "frame-ancestors": "'self'",
        "trusted-types": "*",
        "require-trusted-types-for": "'script'",
      },
    },
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
    crossOriginOpenerPolicy: {
      policy: options.isDev
        ? // Swagger UIがwindow.openerを使用しているおり、認証出来ないので回避
          "unsafe-none"
        : "same-origin",
    },
  });

  const REGISTRY_ROOT = resolve(require.main?.path ?? "", "..");

  await app.register(FastifyVite, {
    dev: options.isDev,
    root: REGISTRY_ROOT,
    spa: true,
  });

  app.after(() => {
    app.decorate("services", Services({ config: app.config }));
  });

  return app;
}

export async function start(server: Server, port: number): Promise<string> {
  await server.vite.ready();
  await server.ready();
  const address: string = await server.listen({ port, host: "::" });
  return address;
}
