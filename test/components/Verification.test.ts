import { Verification } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Verification", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.verification = undefined;
  });

  // Basic
  it("renders google verification meta tag", async () => {
    const result = await container.renderToString(Verification, {
      props: { google: "abc123" },
    });

    expect(result).toBe(
      '<meta name="google-site-verification" content="abc123">',
    );
  });

  // Auto
  it("renders verification tags from integration config when no props are provided", async () => {
    config.verification = { google: "abc123" };

    const result = await container.renderToString(Verification, {
      props: {},
    });

    expect(result).toBe(
      '<meta name="google-site-verification" content="abc123">',
    );
  });

  // Complete
  it("renders all verification tags including others array", async () => {
    const result = await container.renderToString(Verification, {
      props: {
        google: "google-token",
        yandex: "yandex-token",
        bing: "bing-token",
        others: [{ name: "p:domain_verify", content: "pinterest-token" }],
      },
    });

    expect(result).toBe(
      '<meta name="google-site-verification" content="google-token"><meta name="yandex-verification" content="yandex-token"><meta name="msvalidate.01" content="bing-token"><meta name="p:domain_verify" content="pinterest-token">',
    );
  });

  // Edge cases

  it("renders nothing when no props are provided and config has no verification value", async () => {
    const result = await container.renderToString(Verification, {
      props: {},
    });

    expect(result).toBe("");
  });

  it("does not fall back to config when props are explicitly provided", async () => {
    config.verification = { google: "config-token" };

    const result = await container.renderToString(Verification, {
      props: { bing: "bing-token" },
    });

    expect(result).toBe('<meta name="msvalidate.01" content="bing-token">');
  });

  it("renders only others entries when built-in props are omitted", async () => {
    const result = await container.renderToString(Verification, {
      props: {
        others: [{ name: "naver-site-verification", content: "naver-token" }],
      },
    });

    expect(result).toBe(
      '<meta name="naver-site-verification" content="naver-token">',
    );
  });
});
