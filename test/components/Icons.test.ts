import { Icons } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import config from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

const resetConfig = () => {
  Object.assign(config, {
    icons: [],
  });
};

describe("Component Icons", () => {
  let container: experimental_AstroContainer;

  beforeEach(async () => {
    resetConfig();
    container = await experimental_AstroContainer.create();
  });

  // Basic
  it("renders build-time icon tags when no prop is provided", async () => {
    Object.assign(config, {
      icons: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    });

    const result = await container.renderToString(Icons, { props: {} });

    expect(result).toBe(
      '<link rel="icon" href="/favicon.ico" type="image/x-icon"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png">',
    );
  });

  // Automatic
  it("renders all default icon tags including auto-copied SVG favicon from SVG source", async () => {
    Object.assign(config, {
      icons: [
        {
          rel: "icon",
          href: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
        },
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        {
          rel: "icon",
          href: "/favicon.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
        {
          rel: "icon",
          href: "/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          rel: "icon",
          href: "/icon.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    });

    const result = await container.renderToString(Icons, { props: {} });

    expect(result).toBe(
      '<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml">' +
        '<link rel="icon" href="/favicon.ico" type="image/x-icon">' +
        '<link rel="icon" href="/favicon.png" sizes="32x32" type="image/png">' +
        '<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png">' +
        '<link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png">' +
        '<link rel="icon" href="/icon.png" sizes="512x512" type="image/png">',
    );
  });

  // Complete
  it("disables a config tag via false and appends a new tag with media expansion", async () => {
    Object.assign(config, {
      icons: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        {
          rel: "icon",
          href: "/favicon.svg",
          sizes: "any",
          type: "image/svg+xml",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    });

    const result = await container.renderToString(Icons, {
      props: {
        icons: {
          "/favicon.ico": false,
          "/campaign.png": {
            rel: "icon",
            href: "/campaign.png",
            sizes: "32x32",
            type: "image/png",
            media: "dark",
          },
        },
      },
    });

    expect(result).toBe(
      '<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png"><link rel="icon" href="/campaign.png" sizes="32x32" type="image/png" media="(prefers-color-scheme: dark)">',
    );
  });

  // Edge case: no icons in config or props produces no output
  it("renders nothing when no build-time or runtime icon tags are provided", async () => {
    const result = await container.renderToString(Icons, { props: {} });

    expect(result).toBe("");
  });

  // Edge case: runtime icon with matching href replaces build-time icon
  it("Record entry replaces build-time icon with matching href", async () => {
    Object.assign(config, {
      icons: [
        {
          rel: "icon",
          href: "/favicon.png",
          sizes: "16x16",
          type: "image/png",
        },
      ],
    });

    const result = await container.renderToString(Icons, {
      props: {
        icons: {
          "/favicon.png": {
            rel: "icon",
            href: "/favicon.png",
            sizes: "32x32",
            type: "image/png",
          },
        },
      },
    });

    expect(result).toBe(
      '<link rel="icon" href="/favicon.png" sizes="32x32" type="image/png">',
    );
  });

  // Edge case: duplicate href in build-time config preserves last entry
  it("uses last entry when build-time icons have duplicate href", async () => {
    Object.assign(config, {
      icons: [
        { rel: "icon", href: "/shared.png", sizes: "16x16", type: "image/png" },
        { rel: "icon", href: "/shared.png", sizes: "32x32", type: "image/png" },
      ],
    });

    const result = await container.renderToString(Icons, { props: {} });

    expect(result).toBe(
      '<link rel="icon" href="/shared.png" sizes="32x32" type="image/png">',
    );
  });

  // Edge case: same href across different rel types — last-write wins
  it("Record entry with same href as existing config tag replaces it regardless of rel", async () => {
    const result = await container.renderToString(Icons, {
      props: {
        icons: {
          "/preload-mask.svg": {
            rel: "preload",
            href: "/preload-mask.svg",
            as: "image",
            type: "image/svg+xml",
          },
          "/icon-mask.svg": {
            rel: "icon",
            href: "/icon-mask.svg",
            type: "image/svg+xml",
          },
        },
      },
    });

    expect(result).toBe(
      '<link rel="preload" href="/preload-mask.svg" as="image" type="image/svg+xml"><link rel="icon" href="/icon-mask.svg" type="image/svg+xml">',
    );
  });

  // Edge case: media "light" shorthand expands to prefers-color-scheme: light
  it("expands media light shorthand to prefers-color-scheme: light", async () => {
    Object.assign(config, {
      icons: [
        {
          rel: "icon",
          href: "/icon-light.png",
          type: "image/png",
          media: "light",
        },
      ],
    });

    const result = await container.renderToString(Icons, { props: {} });

    expect(result).toBe(
      '<link rel="icon" href="/icon-light.png" type="image/png" media="(prefers-color-scheme: light)">',
    );
  });

  // Edge case: custom media string is passed through unchanged
  it("passes custom media string through without modification", async () => {
    Object.assign(config, {
      icons: [
        {
          rel: "icon",
          href: "/icon-narrow.png",
          type: "image/png",
          media: "(max-width: 600px)",
        },
      ],
    });

    const result = await container.renderToString(Icons, { props: {} });

    expect(result).toBe(
      '<link rel="icon" href="/icon-narrow.png" type="image/png" media="(max-width: 600px)">',
    );
  });
});
