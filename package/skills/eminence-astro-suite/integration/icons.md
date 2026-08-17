# `icons` — Public icon discovery

Detects a small best-practice icon set in Astro's configured `publicDir` and exposes matching `<link>` tags through [`Icons`](../components/icons.md). Eminence never creates, resizes, copies, or modifies icon files.

Discovery is enabled by default. Use `icons: false` to disable both discovery and the `favicon.ico` recommendation.

## Recognized files

| Public file            | Emitted tag                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `favicon.svg`          | `<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">`                      |
| `favicon.png`          | `<link rel="icon" href="/favicon.png" sizes="32x32" type="image/png">`                        |
| `apple-touch-icon.png` | `<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png">` |
| `favicon.ico`          | No tag. Its presence only satisfies the fallback-icon recommendation.                         |

Only these exact root-level filenames are discovered. Eminence assumes the PNG files have the documented dimensions; it does not decode or validate image contents.

Browsers know the conventional `/favicon.ico` location without a `<link>` tag. When that file is absent, Eminence recommends adding it but deliberately does not emit a tag for it.

## Usage

Place any supported files in `public/`:

```text
public/
├── favicon.ico
├── favicon.svg
├── favicon.png
└── apple-touch-icon.png
```

No icon configuration is required:

```ts
eminence();
```

To make the behavior explicit or disable it:

```ts
eminence({ icons: true });
eminence({ icons: false });
```

`headTags.icons` merges over detected tags by `href`. Per-render overrides passed to `<Icons icons={...} />` merge last and may replace, add, or remove entries.

Icon discovery is independent from `manifest.icons`. Installable application icons should be authored explicitly in the manifest at their required sizes.
