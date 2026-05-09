import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const tscBin = require.resolve("typescript/bin/tsc");
const viteBin = join(dirname(require.resolve("vite/package.json")), "bin", "vite.js");

async function run(command, args, env = process.env) {
  const child = spawn(process.execPath, [command, ...args], {
    cwd: root,
    env,
    stdio: "inherit",
  });
  const [code] = await once(child, "exit");
  if (code !== 0) {
    process.exit(Number(code ?? 1));
  }
}

await run(tscBin, ["--noEmit"]);
await run(viteBin, ["build"], {
  ...process.env,
  BUNDLE_ANALYZE: "true",
});
