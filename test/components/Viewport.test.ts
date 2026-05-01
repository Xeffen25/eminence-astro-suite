import { Viewport } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Viewport", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
  });

  it("renders default viewport", async () => {
    const result = await container.renderToString(Viewport, {
      props: {},
    });

    expect(result).toBe(
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
    );
  });

  it("renders custom viewport content", async () => {
    const result = await container.renderToString(Viewport, {
      props: { content: "width=1024" },
    });

    expect(result).toBe('<meta name="viewport" content="width=1024">');
  });
});
