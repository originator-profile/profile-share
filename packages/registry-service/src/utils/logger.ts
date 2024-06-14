import pino from "pino";

export let logger: ReturnType<typeof pino>;

export const initLogger = (quiet?: boolean) => {
  logger = pino({
    level: quiet ? "silent" : "info",
  });
};
