import { LanguageAlternates } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component LanguageAlternates", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  it("renders language alternate links as strings", async () => {
    const result = await container.renderToString(LanguageAlternates, {
      props: {
        languages: {
          es: "https://example.com/es",
          fr: "https://example.com/fr",
        },
      },
    });

    expect(result).toBe(
      '<link rel="alternate" hreflang="es" href="https://example.com/es"><link rel="alternate" hreflang="fr" href="https://example.com/fr">',
    );
  });

  it("renders language alternate links with URL objects", async () => {
    const result = await container.renderToString(LanguageAlternates, {
      props: {
        languages: {
          de: new URL("https://example.com/de"),
        },
      },
    });

    expect(result).toBe(
      '<link rel="alternate" hreflang="de" href="https://example.com/de">',
    );
  });

  it("handles mixed string and URL objects for languages", async () => {
    const result = await container.renderToString(LanguageAlternates, {
      props: {
        languages: {
          es: "https://example.com/es",
          fr: new URL("https://example.com/fr"),
          it: "https://example.com/it",
        },
      },
    });

    expect(result).toBe(
      '<link rel="alternate" hreflang="es" href="https://example.com/es"><link rel="alternate" hreflang="fr" href="https://example.com/fr"><link rel="alternate" hreflang="it" href="https://example.com/it">',
    );
  });

  it("renders nothing when languages is empty", async () => {
    const result = await container.renderToString(LanguageAlternates, {
      props: {
        languages: {},
      },
    });

    expect(result).toBe("");
  });

  it("handles single language entry", async () => {
    const result = await container.renderToString(LanguageAlternates, {
      props: {
        languages: {
          "x-default": "https://example.com",
        },
      },
    });

    expect(result).toBe(
      '<link rel="alternate" hreflang="x-default" href="https://example.com">',
    );
  });
});
