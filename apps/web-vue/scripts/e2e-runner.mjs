import { spawn } from "node:child_process";
import { once } from "node:events";
import { createRequire } from "node:module";
import { createConnection } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const require = createRequire(import.meta.url);
const viteBin = join(
  dirname(require.resolve("vite/package.json")),
  "bin",
  "vite.js",
);
const playwrightCli = require.resolve("@playwright/test/cli");
const playwrightArgs = process.argv.slice(2);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForPort(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const isOpen = await new Promise((resolve) => {
      const socket = createConnection({ host: "127.0.0.1", port });
      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("error", () => {
        socket.destroy();
        resolve(false);
      });
    });

    if (isOpen) {
      return;
    }

    await wait(250);
  }

  throw new Error(`Timed out waiting for port ${port}`);
}

async function stopProcess(processRef) {
  if (processRef.exitCode !== null || processRef.signalCode !== null) {
    return;
  }

  processRef.kill("SIGTERM");
  const forceKill = setTimeout(() => processRef.kill("SIGKILL"), 2_000);
  await once(processRef, "exit").catch(() => undefined);
  clearTimeout(forceKill);
}

const server = spawn(
  process.execPath,
  [viteBin, "--host", "127.0.0.1", "--port", "5174", "--strictPort"],
  {
    cwd: root,
    env: {
      ...process.env,
      VITE_ENABLE_MOCKS: "true",
    },
    stdio: "inherit",
  },
);

let serverExitCode = null;
server.once("exit", (code) => {
  serverExitCode = code;
});

try {
  await waitForPort(5174, 120_000);
  if (serverExitCode !== null) {
    throw new Error(
      `Vite exited before tests started with code ${serverExitCode}`,
    );
  }

  const tests = spawn(
    process.execPath,
    [playwrightCli, "test", ...playwrightArgs],
    {
      cwd: root,
      env: process.env,
      stdio: "inherit",
    },
  );

  const [testCode] = await once(tests, "exit");
  await stopProcess(server);
  process.exit(Number(testCode ?? 1));
} catch (error) {
  await stopProcess(server);
  console.error(error);
  process.exit(1);
}
