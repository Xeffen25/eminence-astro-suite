import { Generator } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Generator", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  it("renders generator meta tag by default", async () => {
    const result = await container.renderToString(Generator, {
      props: {},
    });

    expect(result).toContain('<meta name="generator" content="');
    expect(result).toContain("Astro");
  });

  it("renders nothing when generate is false", async () => {
    const result = await container.renderToString(Generator, {
      props: { generate: false },
    });

    expect(result).toBe("");
  });
});
