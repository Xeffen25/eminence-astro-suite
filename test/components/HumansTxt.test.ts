import { HumansTxt } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component HumansTxt", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  // Basic usage
  it("renders a humans.txt link tag with an explicit href string", async () => {
    const result = await container.renderToString(HumansTxt, {
      props: { href: "https://example.com/humans.txt" },
    });

    expect(result).toBe(
      '<link rel="author" href="https://example.com/humans.txt" type="text/plain">',
    );
  });

  // Complete usage
  it("renders a humans.txt link tag with a URL instance href", async () => {
    const result = await container.renderToString(HumansTxt, {
      props: { href: new URL("https://example.com/humans.txt") },
    });

    expect(result).toBe(
      '<link rel="author" href="https://example.com/humans.txt" type="text/plain">',
    );
  });

  // Edge cases

  it("renders nothing when href is explicitly false", async () => {
    const result = await container.renderToString(HumansTxt, {
      props: { href: false },
    });

    expect(result).toBe("");
  });

  it("renders nothing when no prop and Astro.site is unavailable", async () => {
    const result = await container.renderToString(HumansTxt, {
      props: {},
    });

    expect(result).toBe("");
  });
});
