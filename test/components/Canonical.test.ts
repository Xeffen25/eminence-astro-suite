import { Canonical } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Canonical", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  // Basic
  it("renders a canonical link tag with an explicit href string", async () => {
    const result = await container.renderToString(Canonical, {
      props: { href: "https://example.com/docs/page" },
    });

    expect(result).toBe(
      '<link rel="canonical" href="https://example.com/docs/page">',
    );
  });

  // URL object
  it("renders a canonical link tag when href is a URL object", async () => {
    const result = await container.renderToString(Canonical, {
      props: { href: new URL("https://cdn.example.com/docs/page") },
    });

    expect(result).toBe(
      '<link rel="canonical" href="https://cdn.example.com/docs/page">',
    );
  });

  // Automatic
  it("renders nothing when no href is provided and Astro.site is not configured", async () => {
    // container has no Astro.site -> renders nothing
    const result = await container.renderToString(Canonical, {
      props: {},
    });

    expect(result).toBe("");
  });
});
