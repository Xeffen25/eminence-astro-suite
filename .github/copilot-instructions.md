# Project Guidelines

## Test Commands

- Run `pnpm test` when modifying either:
    - files that already have tests, or
    - test files themselves.

## Git Workflow And Contribution Policy

- Branch naming must follow: `issue-number-type/brief-description`.
- Supported `type` values: `feat`, `fix`, `docs`, `refactor`, `deps`, `test`, `chore`.
- Commit messages must follow Conventional Commits: `type(scope): description`.
- Commit `type` must match the branch `type`.
- When preparing pull request information, keep type alignment with branch and commit conventions.

## Architecture Boundaries

- `package/`: publishable package source (components, integration, virtual module types).
- `test/`: Vitest tests for package components and integration behavior.
- `src/`: documentation site content and site configuration.
- `public/`: static assets for the site.
- Treat this as a docs site + package workspace: package changes and docs changes have different impact.

## Import Conventions

- Outside `package/`, prefer TypeScript path aliases for imports:
    - `@/*` for `src/*`
    - `@package/*` for `package/*`
    - `@test/*` for `test/*`
    - `~/*` for `public/*`
- Inside `package/`, imports must be relative paths.
- Rationale for `package/`: there is no build step for path alias rewriting there.

## Agent Behavior Expectations

- Keep changes minimal and scoped to the task.
