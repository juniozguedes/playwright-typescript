# playwright-typescript

End-to-end test suite built with [Playwright](https://playwright.dev) and TypeScript.

## Requirements

- Node.js 20+
- npm

## Install

```bash
npm ci
npx playwright install chromium --with-deps
```

## Run

```bash
# All tests (headless)
npm test

# Headed (watch the browser)
npm run test:headed

# Interactive UI mode
npm run test:ui

# Open last HTML report
npm run report
```

## Environment

| Variable   | Default                                | Description               |
|------------|----------------------------------------|---------------------------|
| `BASE_URL` | `https://the-internet.herokuapp.com`  | Target application URL    |

Override for a different environment:

```bash
BASE_URL=https://staging.example.com npm test
```

## Architecture

```
src/
  data/         Typed test data (credentials, expected outcomes)
  fixtures/     Extended Playwright `test` object — injects page objects
  pages/        Page Object Model
    BasePage    Abstract base with DRY navigate() helper and URL logging
    LoginPage   Login page interactions and locators

tests/
  login/        Login flow specs (data-driven, 3 scenarios)

.github/
  workflows/    GitHub Actions CI pipeline

playwright.config.ts   Central config: timeouts, reporters, artifacts, baseURL
```

### Artifacts on failure

Playwright automatically captures on any failing test:

- **Screenshot** — saved to `test-results/`
- **Video** — retained for failing tests
- **Trace** — recorded on first retry, viewable with `npx playwright show-trace`
