---
description: "Use when adding or editing components in package/components and test/components"
name: "Components Structure"
applyTo: "package/components/**/*.astro, package/components.ts, test/components/**/*.test.ts"
---

# Components Structure

## Required Component Workflow

1. Create the component file at `package/components/ComponentName.astro`.
2. Add the wrapper in `package/components.ts` by importing and exporting the same component name, including matching wrapper documentation.
3. Add a component test at `test/components/ComponentName.test.ts` that renders and validates the component using the wrapper.

## Astro Component Docs (`package/components/**/*.astro`)

- Keep this top-link block:
    - `[ 🌐 Website ]`
    - `[ 📝 Edit Docs ]`
- Use separator line exactly as: `* ---`
- Keep JSDoc order:
    1. `@summary`
    2. `@description`
    3. `@example` entries
    4. `@see` entries at the bottom

### Astro Component Template

```ts
/**
 * [ 🌐 Website ] {@link https://todo.dev/components/<component-kebab-case>}
 * [ 📝 Edit Docs ] {@link https://todo.dev/Xeffen25/eminence-astro-suite/src/content/components/<component-kebab-case>.mdx}
 * ---
 * @summary <short summary>
 * @description
 * <description>
 *
 * @example
 * <ComponentName> <prop>="<value>" />
 * @example
 * <ComponentName> />
 *
 * @see {@link <reference-url-1> <reference-label-1>}
 * @see {@link <reference-url-2> <reference-label-2>}
 */
```

## Wrapper Docs (`package/components.ts`)

- Keep documentation body aligned with the source component docs.
- Do not include the `[ 📝 Edit Docs ]` link in wrappers.
- Keep reference links at the bottom as `@see` entries. First one should be the website link, followed by docummentation links used.

### Wrapper Template

```ts
import _ComponentName from "@package/components/ComponentName.astro";

/**
 * @summary <short summary>
 * @description
 * <description line 1>
 * <description line 2>
 *
 * @example
 * <ComponentName> <prop>="<value>" />
 * @example
 * <ComponentName> />
 * @see {@link https://todo.dev/components/<component-kebab-case> ComponentName Component Documentation}
 * @see {@link <reference-url-1> <reference-label-1>}
 * @see {@link <reference-url-2> <reference-label-2>}
 */
export const ComponentName = _ComponentName;
```

## Component Tests (`test/components/**/*.test.ts`)

- Test the wrapper not the actual Astro component file.
- Use `experimental_AstroContainer` to render the component in isolation.
- Create the container in `beforeEach` with `experimental_AstroContainer.create()`.
- Render with `container.renderToString(ComponentName, { props: { ... } })`.
- Assert the final HTML string or the empty result for no-output cases.
- Cover the component's supported input shapes and at least one fallback or edge case when relevant.

### Test Template

```ts
import { ComponentName } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component ComponentName", () => {
    let container: experimental_AstroContainer;

    beforeEach(async () => {
        container = await experimental_AstroContainer.create();
    });

    it("renders expected output", async () => {
        const result = await container.renderToString(ComponentName, {
            props: { <prop>: <value> },
        });

        expect(result).toBe("<expected-html>");
    });

    it("renders fallback output", async () => {
        const result = await container.renderToString(ComponentName, {
            props: {},
        });

        expect(result).toBe("");
    });
});
```

## URL Rules

- Keep temporary docs domain exactly as `https://todo.dev`.
- Derive slugs from the real component name in kebab-case.
- Website link format:
    - `https://todo.dev/components/<component-kebab-case>`
- Edit Docs link format:
    - `https://todo.dev/Xeffen25/eminence-astro-suite/src/content/components/<component-kebab-case>.mdx`
