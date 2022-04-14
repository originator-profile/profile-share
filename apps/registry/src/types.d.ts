import { RouteHandlerMethod } from "fastify";
import { Config, Services } from "@webdino/profile-registry-service";

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
    services: Services;
  }
}

/** RouteHandlerMethod から RouteGenericInterface への型の変換 */
type FromHandler<Handler> = Handler extends RouteHandlerMethod<
  never,
  never,
  never,
  infer RouteGeneric
>
  ? RouteGeneric
  : never;
