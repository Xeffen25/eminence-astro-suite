import { AppleItunesApp } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component AppleItunesApp", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.appleItunesApp = undefined;
  });

  // Basic
  it("renders the meta tag with app-id only", async () => {
    const result = await container.renderToString(AppleItunesApp, {
      props: { id: "123456789" },
    });

    expect(result).toBe(
      '<meta name="apple-itunes-app" content="app-id=123456789">',
    );
  });

  // Automatic
  it("renders the meta tag using id and argument from integration config", async () => {
    config.appleItunesApp = {
      id: "123456789",
      argument: "myapp://open",
    };

    const result = await container.renderToString(AppleItunesApp, {
      props: {},
    });

    expect(result).toBe(
      '<meta name="apple-itunes-app" content="app-id=123456789, app-argument=myapp://open">',
    );
  });

  // Complete
  it("renders the meta tag with both app-id and app-argument props", async () => {
    const result = await container.renderToString(AppleItunesApp, {
      props: { id: "123456789", argument: "myapp://open" },
    });

    expect(result).toBe(
      '<meta name="apple-itunes-app" content="app-id=123456789, app-argument=myapp://open">',
    );
  });

  // Direct content
  it("renders the meta tag verbatim from a raw content string", async () => {
    const result = await container.renderToString(AppleItunesApp, {
      props: { content: "app-id=123456789, app-argument=myapp://open" },
    });

    expect(result).toBe(
      '<meta name="apple-itunes-app" content="app-id=123456789, app-argument=myapp://open">',
    );
  });
});
