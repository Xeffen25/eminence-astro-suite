import { Generator } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Generator", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.generator = true;
  });

  // Basic
  it("renders generator meta tag when generate is enabled", async () => {
    const result = await container.renderToString(Generator, {
      props: { generate: true },
    });

    expect(result).toContain('<meta name="generator" content="Astro v');
  });

  // Automatic
  it("renders generator meta tag from integration config default", async () => {
    const result = await container.renderToString(Generator, {
      props: {},
    });

    expect(result).toContain('<meta name="generator" content="Astro v');
  });

  it("renders nothing when generate is explicitly false", async () => {
    const result = await container.renderToString(Generator, {
      props: { generate: false },
    });

    expect(result).toBe("");
  });

  it("renders nothing when integration config disables generator and no prop is provided", async () => {
    config.generator = false;

    const result = await container.renderToString(Generator, {
      props: {},
    });

    expect(result).toBe("");
  });

  it("prop true overrides integration config when config is false", async () => {
    config.generator = false;

    const result = await container.renderToString(Generator, {
      props: { generate: true },
    });

    expect(result).toContain('<meta name="generator" content="Astro v');
  });
});
