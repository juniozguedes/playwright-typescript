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

| Variable   | Default                               | Description            |
|------------|---------------------------------------|------------------------|
| `BASE_URL` | `https://the-internet.herokuapp.com`  | Target application URL |

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
    BasePage          Abstract base with DRY navigate() helper and URL logging
    LoginPage         Login page interactions and locators
    DynamicLoadingPage  Dynamic loading page interactions
    CheckboxesPage    Checkboxes page interactions

tests/
  login/              Login flow specs (data-driven, 3 scenarios)
  dynamic-loading/    Dynamic loading spec
  checkboxes/         Checkboxes form interaction spec

skills/
  pr-reviewer/        Code review before push

ai-sessions/
  ai-logs.md          Exported AI conversation logs

.github/
  workflows/          GitHub Actions CI pipeline

playwright.config.ts  Central config: timeouts, reporters, artifacts, baseURL
```

## Export AI session logs

After any Cursor chat session, append it to `ai-sessions/ai-logs.md`:

```bash
node scripts/export-ai-logs.js \
  ~/.cursor/projects/Users-wellington-Documents-projects-pessoal-playwright-typescript/agent-transcripts/<uuid>/<uuid>.jsonl \
  "Short Session Title"
```

The file is created on first run. Subsequent runs append — previous sessions are never overwritten.

### Failure Artifacts

Playwright automatically captures on any failing test:

- **Screenshot** — saved to `test-results/`
- **Video** — retained for failing tests
- **Trace** — recorded on first retry, viewable with `npx playwright show-trace`

## Design decisions

The suite was approached from a QA engineering perspective, treating each scenario as a behaviour specification rather than a scripting exercise. The tooling choices were deliberate and straightforward: Playwright with TypeScript is a natural fit for this kind of browser automation — strong typing keeps page objects and test data contracts explicit, Playwright's auto-waiting removes the need for arbitrary sleeps, and the built-in assertion library covers all required assertions without extra dependencies.

The architecture follows the Page Object Model to keep specs readable and selectors maintainable in one place. A shared `BasePage` centralises navigation and logging so no page object duplicates that logic. Test data for parameterised scenarios lives in typed data files rather than inline in specs, making it easy to extend without touching test logic. Failure artifacts (screenshot, video, trace) are configured centrally in `playwright.config.ts` rather than per-test, so every spec gets them for free.

There were no significant trade-offs to weigh — the problem scope and tools align well, and the challenge requirements map cleanly onto Playwright's feature set.

## AI usage

AI tooling was used throughout the project via [Cursor](https://cursor.sh) with Claude Sonnet 4.6.

The workflow was agent-driven from the start. An architecture agent (defined in `agents/architect.md`) was used to plan the initial project structure, and a QA agent (`agents/qa.md`) was used to review test scenarios for coverage and correctness. Both agents were written beforehand as part of a personal AI configuration setup and were adapted for this TypeScript/Playwright context.

The `AGENTS.md` file at the root played a central role: it gives the AI a clear development path, enforces coding conventions, prevents hallucination by grounding decisions in explicit rules, and reduces token usage by keeping instructions concise and co-located with the codebase.

A custom `pr-reviewer` skill (`skills/pr-reviewer/SKILL.md`) was used before each logical change to catch issues like missing `await`, flaky waits, unused imports, and TypeScript quality gaps — acting as an automated code review step.

After the initial scaffolding was in place, subsequent scenarios were straightforward to add by following the established patterns. AI accelerated the repetitive parts (boilerplate, config wiring, CI setup) while the test design decisions remained deliberate.
