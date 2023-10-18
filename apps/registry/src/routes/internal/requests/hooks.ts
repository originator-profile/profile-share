import { FastifyRequest } from "fastify";
import { BadRequestError } from "http-errors-enhanced";

export async function preHandler({ user, server }: FastifyRequest) {
  const userAccount = await server.services.userAccount.read({ id: user.sub });
  if (userAccount instanceof Error) {
    throw new BadRequestError("Invalid request");
  }
}
