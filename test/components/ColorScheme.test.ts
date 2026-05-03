import { ColorScheme } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component ColorScheme", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.colorScheme = undefined;
  });

  // Basic
  it("renders color-scheme meta tag with explicit content", async () => {
    const result = await container.renderToString(ColorScheme, {
      props: { content: "light dark" },
    });

    expect(result).toBe('<meta name="color-scheme" content="light dark">');
  });

  // Automatic
  it("renders color-scheme meta tag from integration config", async () => {
    config.colorScheme = "light dark";

    const result = await container.renderToString(ColorScheme, {
      props: {},
    });

    expect(result).toBe('<meta name="color-scheme" content="light dark">');
  });

  // Complete
  it("renders color-scheme meta tag with only light", async () => {
    const result = await container.renderToString(ColorScheme, {
      props: { content: "only light" },
    });

    expect(result).toBe('<meta name="color-scheme" content="only light">');
  });
});
