import { Robots } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Robots", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.robots = undefined;
  });

  // Basic
  it("renders meta robots tag with raw content string", async () => {
    const result = await container.renderToString(Robots, {
      props: { content: "noindex, nofollow" },
    });

    expect(result).toBe('<meta name="robots" content="noindex, nofollow">');
  });

  // Automatic
  it("renders meta robots tag from integration config", async () => {
    config.robots = { noindex: true };

    const result = await container.renderToString(Robots, {
      props: {},
    });

    expect(result).toBe('<meta name="robots" content="noindex">');
  });

  // Complete
  it("renders meta robots tag with multiple directives and valued props", async () => {
    const result = await container.renderToString(Robots, {
      props: {
        noindex: true,
        nofollow: true,
        "max-snippet": 50,
        unavailable_after: "25 Jun 2026 15:00:00 PST",
      },
    });

    expect(result).toBe(
      '<meta name="robots" content="noindex, nofollow, max-snippet:50, unavailable_after:25 Jun 2026 15:00:00 PST">',
    );
  });

  // Edge cases

  it("omits directives set to false from serialized content", async () => {
    const result = await container.renderToString(Robots, {
      props: { noindex: true, nofollow: false },
    });

    expect(result).toBe('<meta name="robots" content="noindex">');
  });

  it("renders nothing when no props are provided and config has no robots value", async () => {
    const result = await container.renderToString(Robots, {
      props: {},
    });

    expect(result).toBe("");
  });
});
