import { AppleItunesApp } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import headTagsConfig from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component AppleItunesApp", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    headTagsConfig.appleItunesApp = undefined;
  });

  // Basic
  it("renders the Basic example", async () => {
    const result = await container.renderToString(AppleItunesApp, {
      props: { id: "123456789" },
    });

    expect(result).toBe(
      '<meta name="apple-itunes-app" content="app-id=123456789">',
    );
  });

  // Automatic
  it("renders the Automatic example", async () => {
    headTagsConfig.appleItunesApp = {
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
  it("renders the Complete example", async () => {
    const result = await container.renderToString(AppleItunesApp, {
      props: { id: "123456789", argument: "myapp://open" },
    });

    expect(result).toBe(
      '<meta name="apple-itunes-app" content="app-id=123456789, app-argument=myapp://open">',
    );
  });

  // Direct content
  it("renders the Direct content example", async () => {
    const result = await container.renderToString(AppleItunesApp, {
      props: { content: "app-id=123456789, app-argument=myapp://open" },
    });

    expect(result).toBe(
      '<meta name="apple-itunes-app" content="app-id=123456789, app-argument=myapp://open">',
    );
  });
});
