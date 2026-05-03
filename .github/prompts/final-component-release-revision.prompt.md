---
name: Final Component Release Revision
description: Finalize a component for public release by synchronizing component implementation, docs, and tests from attached files.
argument-hint: Attach the component, docs page, and test file. Optionally add release constraints or behavior expectations.
agent: agent
---

Revise the attached component for final public-release quality by synchronizing implementation, documentation, and tests.

Use the files attached to this prompt invocation as the source for what to revise.

## Goal

Produce a release-ready, internally consistent component update where:

- Public behavior is clearly defined in docs.
- Implementation exactly matches documented behavior.
- Tests ALWAYS validate documented examples first in the exact same order as they appear in the docs, then meaningful edge cases.

## Required workflow

Follow this sequence exactly:

1. Audit the current component API and behavior from the .astro file, fixing any ambiguities or inconsistencies with the docs.
2. Audit the docs and detect mismatches, omissions, or unclear prop semantics.
3. Audit tests and detect coverage gaps against docs examples and behavior.

## Documentation requirements

Keep the docs page structure in this exact order:

1. Intro paragraph
2. Props table
3. Examples: Basic, Automatic (if applicable), and Complete (if applicable). Each example must have an Input and Output section with code snippets that exactly match the rendered behavior of the component. Automatic examples are for rendering defaults or integration config fallbacks when no props are provided. Complete examples show the component with all props provided, demonstrating full behavior explicitly.
4. Decisions Made. This section should explain any non-obvious decisions about component behavior, prop precedence, rendering conditions, or other implementation details that are important for users to understand how the component works and why it behaves a certain way. This is also where you can document any trade-offs or limitations in the current implementation that users should be aware of. Don't add unnecessary or obvious information here, but do include anything that helps clarify the component's design and usage.
5. Source code
6. Reference

Docs rules:

- In the Props table, each prop description must be self-contained and explicit.
- Do not depend on implied behavior that is not written in the prop description.
- If a prop accepts multiple data types, include at least one example per accepted type.
- If the component has automatic/fallback behavior, include an explicit Automatic example.
- Output examples must match real rendered output from the component behavior.

## Test requirements

Test ordering and intent must follow this exact structure:

1. Documentation-example tests first.
2. Edge-case tests second.

Documentation-example tests rules:

- Create one test per docs example, in the same order as docs.
- Add a comment before each docs-example test indicating which example it mirrors. But keep the it("") explanation focused on the test's intent.
- Ensure the expected output exactly matches the docs output snippet.

Edge-case tests rules:

- Add only relevant edge cases that prevent realistic bugs.
- Prefer edge cases around:
  - omitted/undefined props,
  - fallback precedence,
  - serialization/normalization behavior,
  - mutually exclusive or ambiguous inputs,
  - no-output conditions when applicable.
- Keep edge-case names explicit about the bug they prevent.

The virtual module "virtual:eminence-astro-suite/head-tags" is available for import in tests and should be named as `config` it shouldn't be named differently.

## Implementation rules

- Preserve existing style and architecture conventions in the repository.
- Ensure fallback precedence and no-output behavior are explicit in code.

When editing files, implement the changes directly and run relevant tests if available.
