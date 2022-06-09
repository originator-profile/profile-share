import { Params, generatePath } from "react-router-dom";

export function route(path: string) {
  return {
    path,
    build: (params: Params) => generatePath(path, params),
  };
}

function urlParamsRoute(path: string) {
  const baseRoute = route(path);
  return {
    ...baseRoute,
    build(params: Params) {
      const encodedParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [
          key,
          encodeURIComponent(String(value)),
        ])
      );
      return baseRoute.build(encodedParams);
    },
  };
}

export const routes = {
  profiles: urlParamsRoute("/"),
  holder: urlParamsRoute("/:issuer/:subject"),
  certifier: urlParamsRoute("/:issuer/:subject/certifier"),
  technicalInformation: urlParamsRoute(
    "/:issuer/:subject/technical-information"
  ),
  website: urlParamsRoute("/:issuer/:subject/website"),
  nestedHolder: urlParamsRoute(
    "/:nestedIssuer/:nestedSubject/:issuer/:subject/holder"
  ),
  nestedCertifier: urlParamsRoute(
    "/:nestedIssuer/:nestedSubject/:issuer/:subject/certifier"
  ),
  nestedTechnicalInformation: urlParamsRoute(
    "/:nestedIssuer/:nestedSubject/:issuer/:subject/technical-information"
  ),
} as const;
