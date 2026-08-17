# `Icons`

Renders icon `<link>` tags detected from Astro's `publicDir`. Runtime overrides can replace, add, or remove individual entries.

## Import

```ts
import { Icons } from "eminence-astro-suite/components";
```

## Props

| Prop    | Type                               | Default | Required | Description                                                                                       |
| ------- | ---------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------- |
| `icons` | `Record<string, IconTag \| false>` | `{}`    | no       | Per-`href` overrides. An `IconTag` replaces or adds; `false` removes the matching detected entry. |

### `IconTag`

| Field   | Type                          | Required | Description                                                                          |
| ------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------ |
| `rel`   | `string`                      | yes      | `<link rel>` value.                                                                  |
| `href`  | `string`                      | —        | Derived from the map key for runtime overrides.                                      |
| `sizes` | `string`                      | no       | For example, `"32x32"` or `"any"`.                                                   |
| `type`  | `string`                      | no       | MIME type.                                                                           |
| `media` | `"light" \| "dark" \| string` | no       | Color-scheme shorthands expand to `prefers-color-scheme`; other values pass through. |

## Detected defaults

`<Icons />` renders tags only for existing `public/favicon.svg`, `public/favicon.png`, and `public/apple-touch-icon.png`. `public/favicon.ico` is intentionally not tagged because browsers discover its conventional path automatically.

## Resolution order

1. Icons detected in `publicDir`.
2. `headTags.icons`, merged by `href`.
3. `<Icons icons={...} />` runtime overrides; `false` removes by `href`.

To suppress all icon tags when composed inside [`Head`](./head.md), pass `icons={false}` to `Head`.
