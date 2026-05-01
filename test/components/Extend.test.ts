import { Extend } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import clientHeadConfig from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

const DEFAULT_HEAD_TAGS_CONFIG = { ...clientHeadConfig };

const resetClientHeadConfig = () => {
  Object.assign(clientHeadConfig, DEFAULT_HEAD_TAGS_CONFIG);
};

describe("Component Extend", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    resetClientHeadConfig();
    container = await experimental_AstroContainer.create();
  });

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

  it("uses integration defaults when extend prop is omitted", async () => {
    Object.assign(clientHeadConfig, {
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

  it("prefers props over integration defaults", async () => {
    Object.assign(clientHeadConfig, {
      extend: {
        meta: [{ property: "custom:source", content: "integration" }],
      },
    });

    const result = await container.renderToString(Extend, {
      props: {
        meta: [{ property: "custom:source", content: "props" }],
      },
    });

    expect(result).toBe('<meta property="custom:source" content="props">');
  });
});
