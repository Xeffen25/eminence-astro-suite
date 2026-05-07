import { Head } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

const DEFAULT_DESCRIPTION = "Home page";
const DEFAULT_HEAD_TAGS_CONFIG = { ...config };

const normalizeGeneratorVersion = (html: string) =>
  html.replace(/Astro v\d+\.\d+\.\d+/g, "Astro v<version>");

const resetClientHeadConfig = () => {
  Object.assign(config, DEFAULT_HEAD_TAGS_CONFIG);
};

describe("Component Head", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    resetClientHeadConfig();
    container = await experimental_AstroContainer.create();
  });

  // Docs example: Basic
  it("renders required title and description with default head tags", async () => {
    const result = await container.renderToString(Head, {
      props: { title: "Home", description: DEFAULT_DESCRIPTION },
    });

    expect(normalizeGeneratorVersion(result)).toBe(
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="description" content="Home page"><meta name="generator" content="Astro v<version>"></head>',
    );
  });

  // Docs example: Automatic
  it("applies integration defaults when optional props are omitted", async () => {
    Object.assign(config, {
      titleTemplate: "%s | My Site",
      colorScheme: "dark",
    });

    const result = await container.renderToString(Head, {
      props: {
        title: "Home",
        description: DEFAULT_DESCRIPTION,
      },
    });

    expect(normalizeGeneratorVersion(result)).toBe(
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home | My Site</title><meta name="color-scheme" content="dark"><meta name="description" content="Home page"><meta name="generator" content="Astro v<version>"></head>',
    );
  });

  // Docs example: Complete
  it("renders all optional head features when complete props are provided", async () => {
    const result = await container.renderToString(Head, {
      props: {
        title: "Home",
        titleTemplate: "%s | Example",
        description: "Welcome to Example",
        base: {
          href: "https://example.com",
          target: "_blank",
        },
        appleItunesApp: {
          id: "1234567890",
          argument: "https://example.com/app",
        },
        canonical: new URL("https://example.com/"),
        colorScheme: "light dark",
        humansTxt: new URL("https://example.com/humans.txt"),
        icons: {
          "https://example.com/icon.svg": {
            rel: "icon",
            href: "https://example.com/icon.svg",
            type: "image/svg+xml",
          },
        },
        jsonLd:
          '{"@context":"https://schema.org","@type":"WebSite","name":"Example"}',
        languageAlternates: {
          en: "https://example.com/",
          es: new URL("https://example.com/es/"),
        },
        manifest: "https://example.com/manifest.webmanifest",
        openGraph: {
          title: "Home",
          url: "https://example.com/",
          siteName: "Example",
        },
        robots: {
          content: "index, follow",
        },
        themeColor: {
          light: "#ffffff",
          dark: "#111111",
        },
        verification: {
          google: "abc123",
        },
        extend: {
          link: [
            {
              rel: "preconnect",
              href: "https://cdn.example.com",
              prefetch: true,
            },
          ],
          meta: [{ property: "custom:token", content: "abc123" }],
          custom: '<meta name="custom-inline" content="1">',
        },
      },
    });

    expect(normalizeGeneratorVersion(result)).toBe(
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="https://example.com" target="_blank"><title>Home | Example</title><link rel="preconnect" href="https://cdn.example.com" prefetch="true"><meta property="custom:token" content="abc123"><meta name="custom-inline" content="1"><meta name="apple-itunes-app" content="app-id=1234567890, app-argument=https://example.com/app"><link rel="canonical" href="https://example.com/"><meta name="color-scheme" content="light dark"><meta name="description" content="Welcome to Example"><meta name="generator" content="Astro v<version>"><link rel="author" href="https://example.com/humans.txt" type="text/plain"><link rel="icon" href="https://example.com/icon.svg" type="image/svg+xml"><script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"Example"}</script><link rel="alternate" hreflang="en" href="https://example.com/"><link rel="alternate" hreflang="es" href="https://example.com/es/"><link rel="manifest" href="https://example.com/manifest.webmanifest"><meta property="og:type" content="website"><meta property="og:title" content="Home"><meta property="og:url" content="https://example.com/"><meta property="og:site_name" content="Example"><meta name="robots" content="index, follow"><meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111111"><meta name="google-site-verification" content="abc123"></head>',
    );
  });

  it("suppresses optional tags when props explicitly pass false despite integration defaults", async () => {
    Object.assign(config, {
      charset: "utf-16",
      viewport: "width=320",
      base: { href: "https://integration.example", target: "_self" },
      appleItunesApp: { id: "1111111111" },
      colorScheme: "dark",
      generator: true,
      humansTxt: "https://integration.example/humans.txt",
      icons: [
        {
          rel: "icon",
          href: "https://integration.example/icon.svg",
          type: "image/svg+xml",
        },
      ],
      manifest: "https://integration.example/manifest.webmanifest",
      themeColor: { content: "#000000" },
      verification: { google: "integration-token" },
    });

    const result = await container.renderToString(Head, {
      props: {
        title: "Home",
        description: DEFAULT_DESCRIPTION,
        charset: false,
        viewport: false,
        base: false,
        appleItunesApp: false,
        canonical: false,
        colorScheme: false,
        generator: false,
        humansTxt: false,
        icons: false,
        manifest: false,
        themeColor: false,
        verification: false,
      },
    });

    expect(result).toBe(
      '<head><title>Home</title><meta name="description" content="Home page"></head>',
    );
  });

  it("renders themeColor light and dark media tags when object mode is used", async () => {
    const result = await container.renderToString(Head, {
      props: {
        title: "Home",
        description: DEFAULT_DESCRIPTION,
        themeColor: {
          light: "#ffffff",
          dark: "#111111",
        },
      },
    });

    expect(normalizeGeneratorVersion(result)).toBe(
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="description" content="Home page"><meta name="generator" content="Astro v<version>"><meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111111"></head>',
    );
  });

  it("renders slot content before extend tags and prefers extend props over integration defaults", async () => {
    Object.assign(config, {
      extend: {
        meta: [{ property: "custom:source", content: "integration" }],
      },
    });

    const result = await container.renderToString(Head, {
      props: {
        title: "Home",
        description: DEFAULT_DESCRIPTION,
        extend: {
          link: [
            {
              rel: "preconnect",
              href: "https://cdn.example.com",
              prefetch: true,
            },
          ],
          meta: [{ property: "custom:source", content: "props" }],
        },
      },
      slots: {
        default: '<meta name="slot-meta" content="slot">',
      },
    });

    expect(normalizeGeneratorVersion(result)).toBe(
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="slot-meta" content="slot"><link rel="preconnect" href="https://cdn.example.com" prefetch="true"><meta property="custom:source" content="props"><meta name="description" content="Home page"><meta name="generator" content="Astro v<version>"></head>',
    );
  });
});
