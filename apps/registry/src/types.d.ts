import { RouteHandlerMethod } from "fastify";
import { Config, Services } from "@webdino/profile-registry-service";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
    services: Services;
  }
}

/** RouteHandlerMethod から RouteGeneric への型の変換 */
type FromHandler<
  Handler,
  Params = unknown
> = Handler extends RouteHandlerMethod<never, never, never, infer RouteGeneric>
  ? Omit<RouteGeneric, "Params"> & { Params: Params }
  : never;
