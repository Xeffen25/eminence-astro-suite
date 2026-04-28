---
description: "Use when adding or editing integration runtime behavior, virtual config generation, or integration tests in package/integration and test/integration."
name: "Integration Structure"
applyTo: "package/integration.ts, package/integration/**/*.ts, test/integration/**/*.test.ts"
---

# Integration Structure

## Required Integration Workflow

1. Implement integration orchestration in `package/integration.ts`.
2. Move focused logic into `package/integration/*.ts` helpers with small, testable functions.
3. Add or update tests in `test/integration/*.test.ts` for every behavior change.
4. Keep option flow explicit from `IntegrationInput` to `IntegrationRuntimeContext`.

## Virtual Config Rules (`package/integration/virtual-config.ts`)

- Only expose client-safe fields in `ResolvedTagConfig`.
- Treat `extractTagConfig` as a strict allowlist of fields intended for browser consumption.
- Keep `serializedVirtualConfigModule` output as a default export of JSON-serialized config.
- Preserve module IDs unless there is a deliberate breaking change.

## Integration Tests (`test/integration/**/*.test.ts`)

- Test integration helpers directly where behavior is isolated and deterministic.
- Cover option branches explicitly, especially `false`, `undefined`, and enabled cases when applicable.
- Use temporary directories for build output checks and assert logger calls with exact messages.
- Prefer constants (for recommendation text and known paths) in expectations to avoid string drift.

## Minimal Change Boundaries

- Do not edit `package/virtual.d.ts` unless the virtual module contract itself changes.
- Keep `IntegrationInput` and runtime context shape changes intentional and scoped.
- Avoid mixing docs-site behavior into integration runtime logic.
- Extend existing helpers before creating new files when the concern is the same.
