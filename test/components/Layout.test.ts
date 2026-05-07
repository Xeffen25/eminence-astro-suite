import { Layout } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

const DEFAULT_HEAD_TAGS_CONFIG = { ...config };

const resetClientHeadConfig = () => {
  Object.assign(config, DEFAULT_HEAD_TAGS_CONFIG);
};

describe("Component Layout", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    resetClientHeadConfig();
    container = await experimental_AstroContainer.create();
  });

  // Docs example: Basic
  it("renders a full document with Head and default body slot content", async () => {
    const result = await container.renderToString(Layout, {
      props: {
        title: "Home",
        description: "Home page",
      },
      slots: {
        default: "<main>Welcome</main>",
      },
    });

    expect(result).toMatch(
      /^<html>\s*<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home<\/title><meta name="description" content="Home page"><meta name="generator" content="Astro v6\.1\.1"><\/head><body(?:\s+data-astro-source-file="[^"]*"\s+data-astro-source-loc="[^"]*")?>\s*<main>Welcome<\/main>\s*<\/body><\/html>$/,
    );
  });

  // Docs example: Automatic
  it("applies integration Head defaults when optional head props are omitted", async () => {
    Object.assign(config, {
      titleTemplate: "%s | My Site",
      colorScheme: "dark",
    });

    const result = await container.renderToString(Layout, {
      props: {
        title: "Home",
        description: "Home page",
      },
      slots: {
        default: "<main>Welcome</main>",
      },
    });

    expect(result).toMatch(
      /^<html>\s*<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home \| My Site<\/title><meta name="color-scheme" content="dark"><meta name="description" content="Home page"><meta name="generator" content="Astro v6\.1\.1"><\/head><body(?:\s+data-astro-source-file="[^"]*"\s+data-astro-source-loc="[^"]*")?>\s*<main>Welcome<\/main>\s*<\/body><\/html>$/,
    );
  });

  // Docs example: Complete
  it("renders named slots with full forwarded Head props", async () => {
    const result = await container.renderToString(Layout, {
      props: {
        title: "Home",
        titleTemplate: "%s | Example",
        description: "Welcome to Example",
        canonical: "https://example.com/",
        themeColor: {
          light: "#ffffff",
          dark: "#111111",
        },
      },
      slots: {
        head: '<meta name="robots" content="index, follow">',
        "body-start": "<div>Banner</div>",
        default: "<main>Welcome</main>",
        "body-end": '<script src="/app.js"></script>',
      },
    });

    expect(result).toMatch(
      /^<html>\s*<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home \| Example<\/title><meta name="robots" content="index, follow"><link rel="canonical" href="https:\/\/example\.com\/"><meta name="description" content="Welcome to Example"><meta name="generator" content="Astro v6\.1\.1"><meta name="theme-color" media="\(prefers-color-scheme: light\)" content="#ffffff"><meta name="theme-color" media="\(prefers-color-scheme: dark\)" content="#111111"><\/head><body(?:\s+data-astro-source-file="[^"]*"\s+data-astro-source-loc="[^"]*")?>\s*<div>Banner<\/div>\s*<main>Welcome<\/main>\s*<script src="\/app\.js"><\/script>\s*<\/body><\/html>$/,
    );
  });
});
