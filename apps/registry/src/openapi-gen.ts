import { mock } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";
import { create } from "./server";

create({ isDev: true, prisma: mock<PrismaClient>() });
