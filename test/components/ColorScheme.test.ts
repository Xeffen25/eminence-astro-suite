import { ColorScheme } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component ColorScheme", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  it("renders color-scheme meta tag with light dark", async () => {
    const result = await container.renderToString(ColorScheme, {
      props: { content: "light dark" },
    });

    expect(result).toBe('<meta name="color-scheme" content="light dark">');
  });

  it("renders color-scheme meta tag with dark", async () => {
    const result = await container.renderToString(ColorScheme, {
      props: { content: "dark" },
    });

    expect(result).toBe('<meta name="color-scheme" content="dark">');
  });
});
