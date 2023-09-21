import { FastifyRequest } from "fastify";
import { BadRequestError, NotFoundError } from "http-errors-enhanced";
import Params from "../params";

export async function preHandler({
  user,
  server,
  params,
}: FastifyRequest<{
  Params: Params;
}>) {
  const userAccount = await server.services.userAccount.read({ id: user.sub });
  if (userAccount instanceof Error) {
    throw new BadRequestError("Invalid request");
  }
  if (userAccount.accountId !== params.id) {
    throw new NotFoundError("Account not found");
  }
}
