import { LanguageAlternates } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component LanguageAlternates", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  // Basic
  it("renders alternate links from string language URLs", async () => {
    const result = await container.renderToString(LanguageAlternates, {
      props: {
        languages: {
          es: "https://example.com/es",
          "x-default": "https://example.com",
        },
      },
    });

    expect(result).toBe(
      '<link rel="alternate" hreflang="es" href="https://example.com/es"><link rel="alternate" hreflang="x-default" href="https://example.com">',
    );
  });

  // Complete
  it("renders alternate links for mixed string and URL values in object order", async () => {
    const result = await container.renderToString(LanguageAlternates, {
      props: {
        languages: {
          es: "https://example.com/es",
          "en-US": new URL("https://example.com/en-us"),
          "x-default": "https://example.com",
        },
      },
    });

    expect(result).toBe(
      '<link rel="alternate" hreflang="es" href="https://example.com/es"><link rel="alternate" hreflang="en-US" href="https://example.com/en-us"><link rel="alternate" hreflang="x-default" href="https://example.com">',
    );
  });
});
