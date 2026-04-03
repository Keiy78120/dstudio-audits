#!/usr/bin/env node
// Wrapper — actual generator lives in generator/generate.mjs
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __dir = dirname(fileURLToPath(import.meta.url));
execFileSync("node", [join(__dir, "generator", "generate.mjs"), ...process.argv.slice(2)], { stdio: "inherit" });
