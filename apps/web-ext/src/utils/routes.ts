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

function urlParamsRoute<Path extends string>(path: Path) {
  const baseRoute = route(path);
  return {
    ...baseRoute,
    build(params: ParseUrlParams<Path>) {
      const encodedParams = Object.fromEntries(
        Object.entries(params).map(([key, value]) => [
          key,
          encodeURIComponent(String(value)),
        ])
      ) as ParseUrlParams<Path>;
      return baseRoute.build(encodedParams);
    },
  };
}

export const routes = {
  profiles: route("/"),
  holder: urlParamsRoute("holder/:issuer/:subject"),
  certifier: route("certifier"),
  tech: route("tech"),
  website: urlParamsRoute("website/:issuer/:subject"),
} as const;
