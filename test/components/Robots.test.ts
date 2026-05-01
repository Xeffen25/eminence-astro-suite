import { Robots } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Robots", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  it("renders raw robots content when content is provided", async () => {
    const result = await container.renderToString(Robots, {
      props: {
        content: "noindex, nofollow",
      },
    });

    expect(result).toBe('<meta name="robots" content="noindex, nofollow">');
  });

  it("renders bare and valued directives in robots content", async () => {
    const result = await container.renderToString(Robots, {
      props: {
        noindex: true,
        nofollow: true,
        "max-snippet": 50,
        "max-image-preview": "large",
      },
    });

    expect(result).toBe(
      '<meta name="robots" content="noindex, nofollow, max-snippet:50, max-image-preview:large">',
    );
  });

  it("renders nothing when no directives are enabled", async () => {
    const result = await container.renderToString(Robots, {
      props: {},
    });

    expect(result).toBe("");
  });
});
