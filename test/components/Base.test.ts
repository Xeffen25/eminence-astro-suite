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
  it("renders a base tag with href only", async () => {
    const result = await container.renderToString(Base, {
      props: { href: "https://example.com" },
    });

    expect(result).toBe('<base href="https://example.com">');
  });

  // Automatic
  it("renders a base tag using href from integration config", async () => {
    config.base = { href: "https://example.com" };

    const result = await container.renderToString(Base, {
      props: {},
    });

    expect(result).toBe('<base href="https://example.com">');
  });

  // Complete
  it("renders a base tag with both href and target", async () => {
    const result = await container.renderToString(Base, {
      props: { href: "https://example.com", target: "_blank" },
    });

    expect(result).toBe('<base href="https://example.com" target="_blank">');
  });
});
