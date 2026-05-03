import { Base } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Base", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.base = undefined;
  });

  // Basic
  it("renders the Basic example", async () => {
    const result = await container.renderToString(Base, {
      props: { href: "https://example.com" },
    });

    expect(result).toBe('<base href="https://example.com">');
  });

  // Automatic
  it("renders the Automatic example", async () => {
    config.base = { href: "https://example.com" };

    const result = await container.renderToString(Base, {
      props: {},
    });

    expect(result).toBe('<base href="https://example.com">');
  });

  // Complete
  it("renders the Complete example", async () => {
    const result = await container.renderToString(Base, {
      props: { href: "https://example.com", target: "_blank" },
    });

    expect(result).toBe('<base href="https://example.com" target="_blank">');
  });
});
