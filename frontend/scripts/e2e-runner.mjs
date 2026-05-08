import { spawn } from "node:child_process";
import { once } from "node:events";
import { createConnection } from "node:net";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const viteBin = join(root, "node_modules", "vite", "bin", "vite.js");
const playwrightCli = join(root, "node_modules", "@playwright", "test", "cli.js");

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

const server = spawn(process.execPath, [viteBin, "--host", "127.0.0.1", "--port", "5173", "--strictPort"], {
  cwd: root,
  stdio: "inherit",
});

let serverExitCode = null;
server.once("exit", (code) => {
  serverExitCode = code;
});

try {
  await waitForPort(5173, 120_000);
  if (serverExitCode !== null) {
    throw new Error(`Vite exited before tests started with code ${serverExitCode}`);
  }

  const tests = spawn(process.execPath, [playwrightCli, "test"], {
    cwd: root,
    env: process.env,
    stdio: "inherit",
  });

  const [testCode] = await once(tests, "exit");
  await stopProcess(server);
  process.exit(Number(testCode ?? 1));
} catch (error) {
  await stopProcess(server);
  console.error(error);
  process.exit(1);
}

