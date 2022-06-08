type Path = string;
type Param = {
  name: string;
  path: string;
};
type PathOrParam = Path | Param;
type Route = {
  toPath: (params: { [key: string]: string }) => string;
  path: string;
};

const isParam = (pathOrParam: PathOrParam): pathOrParam is Param =>
  typeof pathOrParam === "object";

export const param = (param: string): Param =>
  ({
    name: param,
    path: ":" + param,
  } as const);

export const route = (...pathOrParams: PathOrParam[]): Route => {
  return {
    toPath: (params) =>
      "/" +
      pathOrParams
        .map((pathOrParam) => {
          if (isParam(pathOrParam)) {
            const param = params[pathOrParam.name];
            if (!param) throw new Error(`Param ${pathOrParam.name} not found`);
            return param;
          }
          return pathOrParam;
        })
        .join("/"),
    path:
      "/" +
      pathOrParams
        .map((pathOrParam) =>
          isParam(pathOrParam) ? pathOrParam.path : pathOrParam
        )
        .join("/"),
  } as const;
};

export const routes = {
  profiles: route("profiles"),
  holder: route(param("issuer"), param("subject"), "holder"),
  certifier: route(param("issuer"), param("subject"), "certifier"),
  technicalInformation: route(
    param("issuer"),
    param("subject"),
    "technical-information"
  ),
  website: route(param("issuer"), param("subject"), "website"),
  nestedHolder: route(
    param("dpIssuer"),
    param("dpSubject"),
    param("opIssuer"),
    param("opSubject"),
    "holder"
  ),
  nestedCertifier: route(
    param("dpIssuer"),
    param("dpSubject"),
    param("opIssuer"),
    param("opSubject"),
    "certifier"
  ),
  nestedTechnicalInformation: route(
    param("dpIssuer"),
    param("dpSubject"),
    "technical-information"
  ),
} as const;
