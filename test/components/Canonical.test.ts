import { Canonical } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Canonical", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  it("renders provided href string as-is", async () => {
    const result = await container.renderToString(Canonical, {
      props: { href: "https://example.com/docs/page" },
    });

    expect(result).toBe(
      '<link rel="canonical" href="https://example.com/docs/page">',
    );
  });

  it("renders provided href URL instance", async () => {
    const result = await container.renderToString(Canonical, {
      props: { href: new URL("https://cdn.example.com/docs/page") },
    });

    expect(result).toBe(
      '<link rel="canonical" href="https://cdn.example.com/docs/page">',
    );
  });

  it("renders nothing when href is false", async () => {
    const result = await container.renderToString(Canonical, {
      props: { href: false },
    });

    expect(result).toBe("");
  });

  it("renders nothing when canonical URL is omitted and can't be derived", async () => {
    const result = await container.renderToString(Canonical, {
      props: {},
    });

    expect(result).toBe("");
  });
});
