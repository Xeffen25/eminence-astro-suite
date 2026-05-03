import { Extend } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

const DEFAULT_HEAD_TAGS_CONFIG = { ...config };

const resetConfig = () => {
  Object.assign(config, DEFAULT_HEAD_TAGS_CONFIG);
};

describe("Component Extend", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    resetConfig();
    container = await experimental_AstroContainer.create();
  });

  // Basic example
  it("renders custom link and meta tags from props", async () => {
    const result = await container.renderToString(Extend, {
      props: {
        link: [
          {
            rel: "preconnect",
            href: "https://cdn.example.com",
            prefetch: true,
          },
        ],
        meta: [{ property: "custom:token", content: "abc123" }],
      },
    });

    expect(result).toBe(
      '<link rel="preconnect" href="https://cdn.example.com" prefetch="true"><meta property="custom:token" content="abc123">',
    );
  });

  // Custom fragments example
  it("renders custom HTML fragments from props", async () => {
    const result = await container.renderToString(Extend, {
      props: {
        custom: [
          '<meta name="custom-a" content="1">',
          '<script type="application/json">{"key":"value"}</script>',
        ],
      },
    });

    expect(result).toBe(
      '<meta name="custom-a" content="1"><script type="application/json">{"key":"value"}</script>',
    );
  });

  // Automatic example
  it("uses integration defaults when extend prop is omitted", async () => {
    Object.assign(config, {
      extend: {
        link: [{ rel: "dns-prefetch", href: "https://assets.example.com" }],
        meta: [{ property: "custom:source", content: "integration" }],
        custom: '<meta name="custom-inline" content="from-config">',
      },
    });

    const result = await container.renderToString(Extend, { props: {} });

    expect(result).toBe(
      '<link rel="dns-prefetch" href="https://assets.example.com"><meta property="custom:source" content="integration"><meta name="custom-inline" content="from-config">',
    );
  });

  // Complete example
  it("renders link, meta, and custom together", async () => {
    const result = await container.renderToString(Extend, {
      props: {
        link: [{ rel: "preconnect", href: "https://cdn.example.com" }],
        meta: [{ property: "custom:token", content: "abc123" }],
        custom: '<meta name="custom-inline" content="value">',
      },
    });

    expect(result).toBe(
      '<link rel="preconnect" href="https://cdn.example.com"><meta property="custom:token" content="abc123"><meta name="custom-inline" content="value">',
    );
  });

  it("ignores all integration config when any prop is provided", async () => {
    Object.assign(config, {
      extend: {
        link: [{ rel: "dns-prefetch", href: "https://assets.example.com" }],
        meta: [{ property: "custom:source", content: "integration" }],
        custom: '<meta name="custom-inline" content="from-config">',
      },
    });

    const result = await container.renderToString(Extend, {
      props: {
        meta: [{ property: "custom:source", content: "props" }],
      },
    });

    // Only the provided meta prop renders; link and custom from config are suppressed
    expect(result).toBe('<meta property="custom:source" content="props">');
  });
});
