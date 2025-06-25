#!/usr/bin/env -S node --experimental-strip-types --disable-warning=ExperimentalWarning

import { execute } from "@oclif/core";

await execute({ development: true, dir: import.meta.url });
