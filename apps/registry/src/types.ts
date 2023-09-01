import { RouteHandlerMethod } from "fastify";
import { Config, Services } from "@originator-profile/registry-service";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
    services: Services;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace fastifyJwt {
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
}

/** RouteHandlerMethod から RouteGeneric への型の変換 */
export type FromHandler<
  Handler,
  Params = unknown,
> = Handler extends RouteHandlerMethod<never, never, never, infer RouteGeneric>
  ? Omit<RouteGeneric, "Params"> & { Params: Params }
  : never;
