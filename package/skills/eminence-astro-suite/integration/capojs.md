# `capojs` — head-ordering middleware

Opt-in middleware that reorders direct `<head>` children using the Capo.js priority groups.

## Usage

```ts
eminence({ capojs: "typescript" });
```

```ts
// Both forms leave the middleware disabled.
eminence();
eminence({ capojs: false });
```

## Type and default

```ts
capojs?: "typescript" | false;
```

The default is disabled (`undefined`). The string value is intentionally implementation-specific so a future Rust/Wasm implementation can be added without changing the TypeScript selection.

## Ordering behavior

The TypeScript implementation applies Capo.js's stable priority groups. Critical metadata and `<base>` come first, followed by title, connection setup, async scripts, import styles, synchronous scripts and styles, preload hints, deferred scripts, speculative hints, and everything else. Elements in the same group retain their original relative order.

The middleware is registered with `order: "pre"`, allowing its response-side transformation to see the HTML returned by downstream application middleware.

## SSG, SSR, and cost

- Prerendered routes are reordered while Astro builds their HTML.
- Server-rendered routes are reordered on every matching request.
- The TypeScript implementation buffers the complete HTML response before sorting it.
- Only uncompressed UTF-8 `text/html` responses are handled. `HEAD`, non-HTML, encoded, and explicitly non-UTF-8 responses are skipped.
- Stale entity headers such as `Content-Length`, `Content-MD5`, `Digest`, and `ETag` are removed from transformed responses.

For SSR, benchmark real pages on the target adapter before enabling this feature. Manually authoring the desired order is faster when every final head element is controlled by the application; middleware is valuable when multiple render stages inject tags.
