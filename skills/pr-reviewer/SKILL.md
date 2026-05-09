---
name: pr-reviewer
description: Reviews staged/changed code before pushing to GitHub, catching common patterns and mistakes.
---

# PR Reviewer -- Instructions

> **Prerequisites**: Read `AGENTS.md` in the repository root for the coding conventions to review against.

When the user invokes this skill, review the current git changes and flag issues based on the categories below and the rules in `AGENTS.md`.

## Agent Behavior Rules

- **NEVER** commit, push, merge, rebase, or perform any write git operations
- **NEVER** run `git commit`, `git push`, `git checkout`, `git reset`, or any destructive command
- The agent **may only** run read-only git commands: `git diff`, `git status`, `git log`, `git show`
- Do not modify any files unless the user explicitly asks for a fix
- Do not open PRs or interact with GitHub
- Present findings as a categorized review -- the user decides what to act on
- When suggesting a fix, show the code change but do not apply it unless asked

## How to Run

Inspect the current changes using:

```bash
git diff
git diff --staged
git diff HEAD
git diff main...HEAD
```

Review each changed file against the categories below. Report findings grouped by file, with the category tag and a brief explanation.

## Review Categories

### Meaningless Comments

Comments should only explain non-obvious intent, trade-offs, or constraints. Do not add comments that merely restate what the code already says.

Bad:

```typescript
// Click the login button
await loginButton.click();

// Returns the root URL
export function getRootUrl(): string {
  return process.env.BASE_URL ?? 'https://the-internet.herokuapp.com';
}
```

Good:

```typescript
// Dynamic loading can be slow in CI; assert the visible result instead of sleeping.
await expect(page.getByText('Hello World!')).toBeVisible();
```

Flag if: comments narrate what the function name or code line already communicates.

### Error Handling

Broad `catch` blocks can hide real failures and create false-positive tests. Error handling should be specific about what failures are expected and why it is safe to continue.

Flag if: a broad `catch` swallows an error without failing the test or reporting useful context.

### Async and Await Correctness

Playwright actions and assertions are promise-based and must be awaited.

Flag if: Playwright actions, `expect` assertions, setup/teardown promises, or helper calls are missing `await`.

### Flaky Waits

Avoid fixed sleeps in tests. Prefer Playwright locators, auto-waiting, and assertions tied to observable UI state.

Flag if: `waitForTimeout`, arbitrary timers, or polling loops are used where a locator/assertion would be more reliable.

### Locator Quality

Prefer user-facing locators before CSS/XPath.

Flag if: brittle selectors are used when accessible locators such as `getByRole`, `getByLabel`, or `getByText` would be clear and stable.

### Resource Cleanup

Functions that create files, browser contexts, API clients, or other resources must clean them up.

Flag if: resources are opened but not properly closed, or temp files are created but never cleaned up.

### Date/Time Handling

Use a consistent date/time strategy. Avoid ambiguous local timezone assumptions in code that affects CI or test determinism.

Flag if: tests depend on local time without making timezone or clock behavior explicit.

### Dead Code and Unused Symbols

**Unused functions/classes**: Flag new or modified helpers, page object methods, or fixtures that are never called from visible code and have no plausible entrypoint.

**Unused variables**: Flag assignments whose values are never read.

**Unused imports**: Flag imports that are clearly unused after the edit.

### Typos and Naming

Check for English typos in variable names, function names, test titles, string literals, and configuration keys.

Flag if: obvious typos exist in identifiers or strings.

### Logging Quality

Flag if: sensitive data such as passwords, tokens, cookies, or secrets are logged; log levels are misused; or log messages provide no useful context.

### Test Quality

Flag if: tests assert implementation details instead of behavior, tests have no assertions, test names do not describe behavior, or setup is duplicated instead of using fixtures/helpers.

### TypeScript Quality

Flag if:
- Exported functions or fixtures lack clear types
- `any` is used without a narrow justification
- Type assertions hide real uncertainty
- Shared test data is untyped or easy to mutate accidentally

## Output Format

Present the review as a list grouped by file:

```
## path/to/file.ts

- **[Category]**: <description of the issue>
  <optional code snippet or suggested fix>
```

If no issues are found, say so. Do not invent problems.
