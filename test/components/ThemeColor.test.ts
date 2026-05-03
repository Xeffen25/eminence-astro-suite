import { ThemeColor } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component ThemeColor", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    container = await experimental_AstroContainer.create();
    config.themeColor = undefined;
  });

  // Basic
  it("renders a single theme-color tag when content prop is provided", async () => {
    const result = await container.renderToString(ThemeColor, {
      props: { content: "#ffffff" },
    });

    expect(result).toBe('<meta name="theme-color" content="#ffffff">');
  });

  // Automatic
  it("renders theme-color tag from integration config when no props are provided", async () => {
    config.themeColor = { content: "#ffffff" };

    const result = await container.renderToString(ThemeColor, {
      props: {},
    });

    expect(result).toBe('<meta name="theme-color" content="#ffffff">');
  });

  // Complete
  it("renders light and dark theme-color tags with media queries when both props are provided", async () => {
    const result = await container.renderToString(ThemeColor, {
      props: { light: "#ffffff", dark: "#111111" },
    });

    expect(result).toBe(
      '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111111">',
    );
  });

  // Edge cases
  it("renders nothing when no props and no integration config are provided", async () => {
    const result = await container.renderToString(ThemeColor, {
      props: {},
    });

    expect(result).toBe("");
  });

  it("renders light and dark tags from integration config light/dark pair", async () => {
    config.themeColor = { light: "#ffffff", dark: "#111111" };

    const result = await container.renderToString(ThemeColor, {
      props: {},
    });

    expect(result).toBe(
      '<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111111">',
    );
  });

  it("does not fall back to integration config when any prop is explicitly provided", async () => {
    config.themeColor = { content: "#000000" };

    const result = await container.renderToString(ThemeColor, {
      props: { content: "#ffffff" },
    });

    expect(result).toBe('<meta name="theme-color" content="#ffffff">');
  });
});
