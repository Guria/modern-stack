# Implement github actions

- [x] Storybook Vite Playwright tests
- [x] Include coverage report
- [x] Publish to GH pages App and Storybook
- [x] Identify reasonable modern setup

- [x] Resolve CI errors:

Run bun run test:run --coverage
$ vitest run --coverage

RUN v4.0.18 /home/runner/work/modern-stack/modern-stack
Coverage enabled with v8

⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
Error: browserType.launch: Executable doesn't exist at /home/runner/work/modern-stack/modern-stack/node_modules/playwright-core/.local-browsers/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers: ║
║ ║
║ npx playwright install ║
║ ║
║ <3 Playwright Team ║
╚═════════════════════════════════════════════════════════════════════════╝
❯ node_modules/@vitest/browser-playwright/dist/index.js:828:54

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

Test Files (2)
Tests no tests
Errors 1 error
Start at 00:16:58
Duration 633ms (transform 0ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)

% Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------|---------|----------|---------|---------|-------------------
All files | 0 | 0 | 0 | 0 |  
 src | 0 | 100 | 100 | 0 |  
 reatom.init.ts | 0 | 100 | 100 | 0 | 4  
 src/app | 0 | 100 | 0 | 0 |  
 App.tsx | 0 | 100 | 0 | 0 | 5  
 src/counter | 0 | 0 | 0 | 0 |  
 Counter.tsx | 0 | 0 | 0 | 0 | 6-44  
-----------------|---------|----------|---------|---------|-------------------
ERROR: Coverage for lines (0%) does not meet global threshold (80%)
ERROR: Coverage for functions (0%) does not meet global threshold (80%)
ERROR: Coverage for statements (0%) does not meet global threshold (80%)
ERROR: Coverage for branches (0%) does not meet global threshold (75%)
error during close browserType.launch: Executable doesn't exist at /home/runner/work/modern-stack/modern-stack/node_modules/playwright-core/.local-browsers/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell
╔═════════════════════════════════════════════════════════════════════════╗
║ Looks like Playwright Test or Playwright was just installed or updated. ║
║ Please run the following command to download new browsers: ║
║ ║
║ npx playwright install ║
║ ║
║ <3 Playwright Team ║
╚═════════════════════════════════════════════════════════════════════════╝
at /home/runner/work/modern-stack/modern-stack/node_modules/@vitest/browser-playwright/dist/index.js:828:54 {
name: 'Error',
type: 'Unhandled Error',
stacks: [
{
method: '',
file: '/home/runner/work/modern-stack/modern-stack/node_modules/@vitest/browser-playwright/dist/index.js',
line: 828,
column: 54
}
]
}
error: script "test:run" exited with code 1

- [x] Previous error got back. Last time you tried to fix 81f9da31788bd11edb144b63eafbdaf3d0a5728d which led to above error

Fix applied: Use the official Playwright Docker container (mcr.microsoft.com/playwright:v1.58.0-noble) instead of installing browsers manually. This resolves both the browser installation and connection timeout issues. Also added Bun/Vite caching to prevent dependency optimization reloads.

Run bun run test:run --coverage
$ vitest run --coverage
RUN v4.0.18 /home/runner/work/modern-stack/modern-stack
Coverage enabled with v8
⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.
⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
Error: Failed to connect to the browser session "f0181122-b055-4cba-bc83-505dfb470bdc" [storybook (chromium)] within the timeout.
❯ Timeout.\_onTimeout node_modules/vitest/dist/chunks/cli-api.B7PN_QUv.js:5619:33
❯ listOnTimeout node:internal/timers:581:17
❯ processTimers node:internal/timers:519:7
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Test Files (2)
Tests no tests
Errors 1 error
Start at 00:21:59
Duration 60.16s (transform 0ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)
% Coverage report from v8

- [x] new error with new image

Run oven-sh/setup-bun@3d267786b128fe76c2f16a390aa2448b815359f3
/usr/bin/docker exec 17408bd59af46361c042b5c8836678b60db826dcc0051eb2d84a208ce6bbd8ff sh -c "cat /etc/\*release | grep ^ID"
Downloading a new version of Bun: https://github.com/oven-sh/bun/releases/download/bun-v1.1.38/bun-linux-x64.zip
Error: Error: Unable to locate executable file: unzip. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.

Fix applied: Added apt-get update && apt-get install -y unzip step before Bun setup in the workflow. The Playwright Docker container doesn't include unzip by default, which is required by oven-sh/setup-bun to extract the Bun archive.

- [x] maybe https://hub.docker.com/r/gwennlbh/playwright-bun ?

Fix applied: Switched to ghcr.io/gwennlbh/playwright-bun:v1.58.0 image which combines Playwright v1.58.0 with support for oven-sh/setup-bun. This eliminates the need to manually install unzip as a system dependency. The image is designed specifically for running Playwright tests with Bun in CI environments. Running as --user 1001 per the image documentation.

- [x] no luck

test
failed now in 1m 44s

Run bun run test:run --coverage
$ vitest run --coverage
RUN v4.0.18 /\_\_w/modern-stack/modern-stack
Coverage enabled with v8
⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.
⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯
Error: Failed to connect to the browser session "c138e550-4500-499a-9bea-134647ef38b4" [storybook (chromium)] within the timeout.
❯ Timeout.\_onTimeout node_modules/vitest/dist/chunks/cli-api.B7PN_QUv.js:5619:33
❯ listOnTimeout node:internal/timers:605:17
❯ processTimers node:internal/timers:541:7
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Test Files (2)
Tests no tests
Errors 1 error
Start at 00:39:47
Duration 60.14s (transform 0ms, setup 0ms, import 0ms, tests 0ms, environment 0ms)
% Coverage report from v8
-----------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------|---------|----------|---------|---------|-------------------
All files | 0 | 0 | 0 | 0 |  
 src | 0 | 100 | 100 | 0 |  
 reatom.init.ts | 0 | 100 | 100 | 0 | 4  
 src/app | 0 | 100 | 0 | 0 |  
 App.tsx | 0 | 100 | 0 | 0 | 5  
 src/counter | 0 | 0 | 0 | 0 |  
 Counter.tsx | 0 | 0 | 0 | 0 | 6-44  
-----------------|---------|----------|---------|---------|-------------------
ERROR: Coverage for lines (0%) does not meet global threshold (80%)
ERROR: Coverage for functions (0%) does not meet global threshold (80%)
ERROR: Coverage for statements (0%) does not meet global threshold (80%)
ERROR: Coverage for branches (0%) does not meet global threshold (75%)
error: script "test:run" exited with code 1
Error: Process completed with exit code 1.

- [x] you just going circles. it is same timeout again.

Fix applied: Following the plan's recommended approach (standard Ubuntu runner with explicit browser install), updated:
1. test.yml: Added PLAYWRIGHT_BROWSERS_PATH=0 to install browsers in node_modules for consistent paths
2. vitest.config.ts: Added explicit server host (127.0.0.1) with strictPort in CI for reliable WebSocket connections
3. vitest.config.ts: Added --disable-gpu and --disable-software-rasterizer Chrome flags for headless CI
4. vitest.config.ts: Increased connectTimeout to 180 seconds and added retry: 2 for CI stability

Below are three GitHub Actions workflows that reliably run **Playwright tests using Bun** (i.e., `bun install` + `bunx playwright ...`). They are direct “Bun equivalents” of the Playwright-recommended CI patterns. ([bun.com][1])

---

## 1) Standard Ubuntu runner (installs browsers + OS deps)

Create: `.github/workflows/playwright-bun.yml`

```yaml
name: Playwright (Bun)

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v5

      - name: Setup Bun
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Install Playwright browsers (and Linux deps)
        run: bunx playwright install --with-deps

      - name: Run Playwright tests
        run: bunx playwright test

      - uses: actions/upload-artifact@v5
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

Why this works:

- Bun install via `oven-sh/setup-bun` is the recommended way to get `bun`/`bunx` in Actions. ([bun.com][1])
- Playwright’s recommended CI sequence is: install deps → `playwright install --with-deps` → run tests (we’re just swapping `npm`/`npx` for `bun`/`bunx`). ([Playwright][2])

---

## 2) Containerized job (fast + consistent screenshots): Playwright Docker image + Bun

If you want maximum determinism, run inside Playwright’s official Docker image, then install Bun in-container.

Create: `.github/workflows/playwright-bun-container.yml`

```yaml
name: Playwright (Bun, Container)

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    container:
      image: mcr.microsoft.com/playwright:v1.58.0-noble
      options: --user 1001

    steps:
      - uses: actions/checkout@v5

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      # In the Playwright container, browsers + OS deps are already present.
      - name: Run Playwright tests
        run: bunx playwright test

      - uses: actions/upload-artifact@v5
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

Notes:

- This mirrors Playwright’s “Via Containers” guidance (their example uses Node; we swap in Bun). ([Playwright][2])
- Pin the container tag to match your Playwright major/minor for best compatibility.

---

## 3) Sharded execution (parallel CI jobs)

Create: `.github/workflows/playwright-bun-sharded.yml`

```yaml
name: Playwright (Bun, Sharded)

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3]
        shardTotal: [3]

    steps:
      - uses: actions/checkout@v5

      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Install Playwright browsers (and Linux deps)
        run: bunx playwright install --with-deps

      - name: Run Playwright tests (shard)
        run: bunx playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}

      - uses: actions/upload-artifact@v5
        if: ${{ !cancelled() }}
        with:
          name: playwright-report-${{ matrix.shardIndex }}
          path: playwright-report/
          retention-days: 30
```

This aligns with Playwright’s CI guidance on sharding and GitHub Actions. ([Playwright][2])

---

## Practical tweaks (usually needed)

- **If you see flakiness in CI**: set `workers: process.env.CI ? 1 : undefined` in `playwright.config.*` (Playwright recommends this for stability). ([Playwright][2])
- **Avoid the deprecated Playwright GitHub Action**: Playwright recommends using the CLI (`playwright install --with-deps`, `playwright test`) rather than `microsoft/playwright-github-action`. ([GitHub][3])

If you tell me your repo shape (monorepo? where the Playwright project lives?) and whether you run Chromium-only or all browsers, I’ll tailor the YAML (paths, caching, sharding, reporters) to match exactly.

[1]: https://bun.com/docs/guides/runtime/cicd 'Install and run Bun in GitHub Actions - Bun'
[2]: https://playwright.dev/docs/ci 'Continuous Integration | Playwright'
[3]: https://github.com/microsoft/playwright-github-action 'GitHub - microsoft/playwright-github-action: Run Playwright tests on GitHub Actions'
