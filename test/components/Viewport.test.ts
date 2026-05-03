import { Viewport } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Viewport", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.viewport = "width=device-width, initial-scale=1";
  });

  // Basic
  it("renders explicit viewport content", async () => {
    const result = await container.renderToString(Viewport, {
      props: { content: "width=device-width, initial-scale=1" },
    });

    expect(result).toBe(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
    );
  });

  // Automatic
  it("renders viewport from integration config when no prop is provided", async () => {
    const result = await container.renderToString(Viewport, {
      props: {},
    });

    expect(result).toBe(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
    );
  });

  // Complete
  it("renders explicit viewport content with extended options", async () => {
    const result = await container.renderToString(Viewport, {
      props: {
        content: "width=device-width, initial-scale=1, maximum-scale=5",
      },
    });

    expect(result).toBe(
      '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">',
    );
  });

  // Edge cases

  it("uses a custom integration config viewport when content prop is omitted", async () => {
    config.viewport = "width=1024";

    const result = await container.renderToString(Viewport, {
      props: {},
    });

    expect(result).toBe('<meta name="viewport" content="width=1024">');
  });

  it("content prop overrides integration config viewport value", async () => {
    config.viewport = "width=1024";

    const result = await container.renderToString(Viewport, {
      props: { content: "width=device-width, initial-scale=1" },
    });

    expect(result).toBe(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
    );
  });
});
