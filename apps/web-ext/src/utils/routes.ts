import { DocumentProfile, OriginatorProfile } from "@originator-profile/ui";
import { generatePath } from "react-router-dom";
import { ParseUrlParams } from "typed-url-params";

export function route<Path extends string>(path: Path) {
  return {
    path,
    build(params: ParseUrlParams<Path>) {
      // @ts-expect-error ParserError
      return generatePath(path, params);
    },
  };
}

function urlParamsRoute<Path extends string, T>(
  path: Path,
  getParams: (params: T) => ParseUrlParams<Path>,
) {
  const baseRoute = route(path);
  return {
    ...baseRoute,
    build(params: ParseUrlParams<Path>) {
      const encodedParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [
          key,
          encodeURIComponent(String(value)),
        ]),
      ) as ParseUrlParams<Path>;
      return baseRoute.build(encodedParams);
    },
    getParams,
  };
}

function getOrgParams(op: OriginatorProfile) {
  return { orgIssuer: op.issuer, orgSubject: op.subject };
}

function getPublParams(dp: DocumentProfile) {
  return { issuer: dp.issuer, subject: dp.subject };
}

export const routes = {
  base: route("/tab/:tabId"),
  org: urlParamsRoute("org/:orgIssuer/:orgSubject", getOrgParams),
  publ: urlParamsRoute("publ/:issuer/:subject", getPublParams),
  site: route("site"),
  prohibition: route("prohibition"),
} as const;

export function buildPublUrl(
  tabId: number | string | undefined,
  dp: DocumentProfile | undefined,
) {
  return [
    routes.base.build({ tabId: String(tabId) }),
    dp ? routes.publ.build(routes.publ.getParams(dp)) : routes.site.build({}),
  ].join("/");
}
