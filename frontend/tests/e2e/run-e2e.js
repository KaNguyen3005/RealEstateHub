const http = require("http");
const { spawn, spawnSync } = require("child_process");

const { createMockApiServer } = require("./mock-api-server");

const mockApiPort = Number(process.env.E2E_MOCK_API_PORT || 5010);
const frontendPort = Number(process.env.E2E_FRONTEND_PORT || 3000);
const mockApiUrl = `http://127.0.0.1:${mockApiPort}`;
const frontendUrl = `http://127.0.0.1:${frontendPort}`;
const playwrightArgs = process.argv.slice(2);

let nextProcess;

function killProcessTree(processId) {
  if (!processId) {
    return;
  }

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(processId), "/t", "/f"], {
      stdio: "ignore",
    });
    return;
  }

  try {
    process.kill(-processId, "SIGTERM");
  } catch {
    try {
      process.kill(processId, "SIGTERM");
    } catch {
      // Process is already stopped.
    }
  }
}

function waitForUrl(url, timeoutMs = 120000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const request = http.get(url, (response) => {
        response.resume();
        resolve();
      });

      request.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for ${url}`));
          return;
        }

        setTimeout(check, 500);
      });

      request.setTimeout(2000, () => {
        request.destroy();
      });
    };

    check();
  });
}

function startNext() {
  const command = process.platform === "win32" ? "cmd.exe" : "npm";
  const args =
    process.platform === "win32"
      ? ["/d", "/s", "/c", `npm run dev -- --hostname 127.0.0.1 --port ${frontendPort}`]
      : ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(frontendPort)];

  nextProcess = spawn(command, args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_PUBLIC_API_URL: `${mockApiUrl}/api`,
      NEXT_PUBLIC_SOCKET_URL: mockApiUrl,
      BACKEND_API_URL: mockApiUrl,
    },
    detached: process.platform !== "win32",
    stdio: "inherit",
  });
}

function runPlaywright() {
  const command = process.platform === "win32" ? "cmd.exe" : "npx";
  const args =
    process.platform === "win32"
      ? ["/d", "/s", "/c", ["npx", "playwright", "test", ...playwrightArgs].join(" ")]
      : ["playwright", "test", ...playwrightArgs];

  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      resolve(code || 0);
    });
  });
}

async function main() {
  const mockApi = createMockApiServer(mockApiPort);

  try {
    await mockApi.start();
    console.log(`E2E mock API running at ${mockApiUrl}`);
    startNext();
    await waitForUrl(frontendUrl);

    const exitCode = await runPlaywright();
    killProcessTree(nextProcess?.pid);
    await mockApi.stop();
    process.exit(exitCode);
  } catch (error) {
    console.error(error);
    killProcessTree(nextProcess?.pid);
    await mockApi.stop().catch(() => {});
    process.exit(1);
  }
}

main();
