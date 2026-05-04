import { JsonLd } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component JsonLd", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  // Basic
  it("renders a JSON-LD script with the provided string", async () => {
    const result = await container.renderToString(JsonLd, {
      props: {
        jsonLd:
          '{"@context":"https://schema.org","@type":"WebPage","name":"Home"}',
      },
    });

    expect(result).toBe(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Home"}</script>',
    );
  });

  // Complete
  it("renders a JSON-LD script from a plain object prop", async () => {
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Example Site",
      url: "https://example.com",
    };

    const result = await container.renderToString(JsonLd, {
      props: { jsonLd: websiteSchema },
    });

    expect(result).toBe(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Example Site","url":"https://example.com"}</script>',
    );
  });

  // Edge cases

  it("escapes HTML-sensitive characters after object serialization", async () => {
    const result = await container.renderToString(JsonLd, {
      props: {
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "<Unsafe & Value>",
        },
      },
    });

    expect(result).toBe(
      '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"\\u003cUnsafe \\u0026 Value\\u003e"}</script>',
    );
  });
});
