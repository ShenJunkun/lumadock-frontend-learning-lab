import { spawn } from "node:child_process";
import { once } from "node:events";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const tscBin = join(root, "node_modules", "typescript", "bin", "tsc");
const viteBin = join(root, "node_modules", "vite", "bin", "vite.js");

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
