# Global Coding Standards

## Git Rules

### MANDATORY: NEVER commit or push unless the user EXPLICITLY uses the words "commit and push the code" ###

### Important Rules
- NEVER commit directly to main - always use dev branch
- If dev branch does not exist, CREATE it first, then push to dev
- Default branch for commits, pushes, and PRs is: dev unless user is working on another branch
- If a PR already exists for the branch, UPDATE the existing PR description instead of creating a new PR
- Use appropriate agents inside `agents/` according to the user prompt, especially `qa` for testing and `architect` for architecture

- **IMPORTANT**: Check PR status BEFORE editing - if merged, find and update the open PR
- Agent is responsible for creating PRs (no `PULL_REQUEST.md` files)

### After every explicit "commit and push the code" request:
0. Run the skill `pr-reviewer/` and make sure that the code passes the review
1. Verify code is correct by running the project's lint, typecheck, and tests if they exist
2. Update `AGENTS.md` only if new architecture is added
3. Commit by categories (`feat`, `fix`, `refactor`, `docs`, `test`, etc.)
4. Push to dev branch
5. Create or update PR from dev to main with description

### After each prompt (REQUIRED)
- Check for repeated/dead code/logic in the modified files

## DRY Principle
- **MANDATORY**: Before writing any function, fixture, page object helper, or utility, check if it already exists in the codebase
- **Search first**: Use `rg`/glob tools to find existing implementations before creating new ones
- **Shared utilities**: If the same logic is needed in multiple modules, extract to a shared module and import it
- **Examples**:
  - Navigation logic repeated across page objects -> extract to one navigation helper or base page
  - Selectors repeated across tests -> keep them in page objects or component objects
  - Test data repeated across specs -> centralize in typed fixtures or test data builders
- **Anti-pattern**: Copy-pasting test flows between specs with only small data changes
- **Refactor first**: If I find myself writing similar code, stop and refactor to share the logic

## Development Conventions

### Imports
- Imports must always be at the top of the file
- Use path aliases or absolute imports when project configuration supports them
- Group: Node.js built-ins -> external packages -> local modules
- Avoid circular imports between fixtures, page objects, and test data

### TypeScript
- Prefer strict TypeScript and explicit types for exported functions, fixtures, page objects, and shared helpers
- Avoid `any`; use precise types, `unknown`, or domain-specific interfaces
- Keep async APIs explicit and always `await` Playwright actions and assertions
- Prefer immutable test data with `as const` or readonly types when appropriate

### Error Handling
- Avoid broad `catch` blocks that hide test failures
- Only catch errors when the recovery path is intentional and the error is reported clearly
- Do not swallow Playwright timeouts; make waits reliable through locators, assertions, and configuration

### Comments
- Do NOT add comments that restate what the code says
- Only explain non-obvious intent, trade-offs, or constraints
- **NEVER add file header comments** explaining what the file is about

## Playwright TypeScript Framework

### Tech Stack
- **TypeScript**
- **Node.js**
- **Playwright Test**
- **GitHub Actions** for CI

### Architecture
- `src/` - reusable test framework code such as page objects, fixtures, helpers, and typed test data
- `tests/` - Playwright specs grouped by user-facing feature or scenario
- `test-results/` - local Playwright outputs and failure artifacts
- `playwright-report/` - HTML report output
- `ai-sessions/` - exported AI session logs
- `agents/` - AI agent definitions
- `skills/` - AI agent skill definitions

### Playwright Quality Standards
- Prefer user-facing locators: `getByRole`, `getByLabel`, `getByText`, and accessible names
- Keep specs behavior-focused; page objects own selectors and low-level interactions
- Use data-driven tests for equivalent flows instead of copy-pasting scenarios
- Avoid fixed sleeps. Use Playwright auto-waiting, `expect` assertions, and explicit waits tied to observable UI state
- Configure screenshot, trace, and report artifacts centrally in `playwright.config.ts`
- Keep CI parallelism intentional and aligned with requirements

### Local Development

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Run tests
npm test

# Run lint/typecheck when available
npm run lint
npm run typecheck
```

### Skills

AI agent skills available in this project:

| Skill | Description |
|-------|-------------|
| `skills/pr-reviewer/` | Code review before push |
