import { RouteHandlerMethod } from "fastify";
import { Config, Services } from "@originator-profile/registry-service";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
    services: Services;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      iss: string;
      sub: string;
      aud: string[];
      iat: number;
      exp: number;
      azp: string;
      scope: string;
      permissions: string[];
    };
  }
}

/** RouteHandlerMethod から RouteGeneric への型の変換 */
export type FromHandler<
  Handler,
  Params = unknown,
> = Handler extends RouteHandlerMethod<never, never, never, infer RouteGeneric>
  ? Omit<RouteGeneric, "Params"> & { Params: Params }
  : never;
