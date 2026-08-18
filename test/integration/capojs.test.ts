import createIntegration from "@package/index";
import { reorderHead, reorderHtmlResponse } from "@package/integration/capojs";
import { describe, expect, it, vi } from "vitest";

describe("Integration - Capo.js", () => {
  it("orders head elements by the Capo.js priority groups", () => {
    const html = `<!doctype html><html><head>
<meta name="description" content="Example">
<link rel="prefetch" href="/later.js">
<script src="/deferred.js" defer></script>
<link rel="preload" href="/font.woff2" as="font">
<link rel="stylesheet" href="/style.css">
<script src="/blocking.js"></script>
<style>@import "/imported.css";</style>
<script src="/async.js" async></script>
<link rel="preconnect" href="https://example.com">
<title>Example</title>
<base href="/">
<meta name="viewport" content="width=device-width">
<meta charset="utf-8">
</head><body></body></html>`;

    const result = reorderHead(html);
    const positions = [
      '<base href="/">',
      '<meta name="viewport" content="width=device-width">',
      '<meta charset="utf-8">',
      "<title>Example</title>",
      '<link rel="preconnect" href="https://example.com">',
      '<script src="/async.js" async></script>',
      '<style>@import "/imported.css";</style>',
      '<script src="/blocking.js"></script>',
      '<link rel="stylesheet" href="/style.css">',
      '<link rel="preload" href="/font.woff2" as="font">',
      '<script src="/deferred.js" defer></script>',
      '<link rel="prefetch" href="/later.js">',
      '<meta name="description" content="Example">',
    ].map((markup) => result.indexOf(markup));

    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("uses stable ordering and preserves comments with their following element", () => {
    const html = `<html><head data-example="true">
<!-- viewport -->
<META NAME='viewport' CONTENT='width=device-width'>
<!-- charset -->
<meta charset=UTF-8>
<script type="application/ld+json">{"name":"Example"}</script>
<script type="speculationrules">{}</script>
<style media="print">body { color: black }</style>
</head><body>unchanged</body></html>`;

    const result = reorderHead(html);

    expect(result.indexOf("<!-- viewport -->")).toBeLessThan(
      result.indexOf("<!-- charset -->"),
    );
    expect(result.indexOf("<!-- charset -->")).toBeLessThan(
      result.indexOf('<script type="speculationrules">'),
    );
    expect(result.indexOf('<script type="speculationrules">')).toBeLessThan(
      result.indexOf('<script type="application/ld+json">'),
    );
    expect(result).toContain('<head data-example="true">');
    expect(result.endsWith("<body>unchanged</body></html>")).toBe(true);
  });

  it("does not mistake closing-head text inside a script for the head boundary", () => {
    const html = `<html><head><script>const text = "</head>";</script><meta charset="utf-8"><title>Title</title></head><body></body></html>`;

    expect(reorderHead(html)).toBe(
      `<html><head><meta charset="utf-8"><title>Title</title><script>const text = "</head>";</script></head><body></body></html>`,
    );
  });

  it("leaves documents without a complete head unchanged", () => {
    expect(reorderHead("<html><body>Example</body></html>")).toBe(
      "<html><body>Example</body></html>",
    );
    expect(reorderHead("<html><head><title>Example</title>")).toBe(
      "<html><head><title>Example</title>",
    );
  });

  it("rewrites UTF-8 HTML responses and removes stale entity headers", async () => {
    const response = new Response(
      '<html><head><script src="/app.js"></script><meta charset="utf-8"></head></html>',
      {
        headers: {
          "content-type": "text/html; charset=UTF8",
          "content-length": "100",
          etag: '"old"',
          "x-example": "preserved",
        },
        status: 201,
        statusText: "Created",
      },
    );

    const result = await reorderHtmlResponse(
      new Request("https://example.com/"),
      response,
    );

    expect(await result.text()).toContain(
      '<head><meta charset="utf-8"><script src="/app.js"></script></head>',
    );
    expect(result.status).toBe(201);
    expect(result.statusText).toBe("Created");
    expect(result.headers.get("x-example")).toBe("preserved");
    expect(result.headers.has("content-length")).toBe(false);
    expect(result.headers.has("etag")).toBe(false);
  });

  it.each([
    ["non-HTML", new Request("https://example.com/"), "application/json", null],
    [
      "HEAD",
      new Request("https://example.com/", { method: "HEAD" }),
      "text/html",
      null,
    ],
    ["encoded", new Request("https://example.com/"), "text/html", "br"],
    [
      "non-UTF-8",
      new Request("https://example.com/"),
      "text/html; charset=iso-8859-1",
      null,
    ],
  ])("skips %s responses", async (_name, request, contentType, encoding) => {
    const headers = new Headers({ "content-type": contentType });
    if (encoding) headers.set("content-encoding", encoding);
    const response = new Response(
      '<html><head><script></script><meta charset="utf-8"></head></html>',
      { headers },
    );

    expect(await reorderHtmlResponse(request, response)).toBe(response);
  });

  it("registers pre middleware only for capojs: typescript", async () => {
    const enabledMiddleware = vi.fn();
    const disabledMiddleware = vi.fn();
    const updateConfig = vi.fn();
    const logger = { error: vi.fn(), info: vi.fn(), warn: vi.fn() };

    const enabledHook = createIntegration({
      capojs: "typescript",
      sitemap: false,
    }).hooks["astro:config:setup"];
    const disabledHook = createIntegration({
      capojs: false,
      sitemap: false,
    }).hooks["astro:config:setup"];

    await enabledHook?.({
      addMiddleware: enabledMiddleware,
      logger,
      updateConfig,
    } as never);
    await disabledHook?.({
      addMiddleware: disabledMiddleware,
      logger,
      updateConfig,
    } as never);

    expect(enabledMiddleware).toHaveBeenCalledOnce();
    expect(enabledMiddleware).toHaveBeenCalledWith({
      entrypoint: expect.objectContaining({
        pathname: expect.stringMatching(/capojs-middleware\.ts$/),
      }),
      order: "pre",
    });
    expect(disabledMiddleware).not.toHaveBeenCalled();
  });
});
