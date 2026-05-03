import type { IntegrationInput } from "@package/integration";
import {
  extractHeadTagsConfig,
  serializedVirtualConfigModule,
} from "@package/integration/virtual-config";
import { describe, expect, it } from "vitest";

const DEFAULT_HEAD_TAGS_OPTIONS = {
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",
  titleTemplate: "%s",
  generator: true,
  icons: [],
  manifest: false,
  humansTxt: false,
};

const parseSerializedModuleConfig = (moduleSource: string) => {
  const prefix = "export default ";
  const json = moduleSource.slice(prefix.length, -1);
  return JSON.parse(json);
};

describe("Integration - Virtual Config", () => {
  it("extracts appleItunesApp defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        appleItunesApp: {
          id: "123456789",
          argument: "myapp://open",
        },
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      appleItunesApp: {
        id: "123456789",
        argument: "myapp://open",
      },
    });
  });

  it("extracts verification defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        verification: {
          google: "google-token",
          yandex: "yandex-token",
          others: [{ name: "msvalidate.01", content: "bing-token" }],
        },
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      verification: {
        google: "google-token",
        yandex: "yandex-token",
        others: [{ name: "msvalidate.01", content: "bing-token" }],
      },
    });
  });

  it("extracts themeColor defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        themeColor: {
          light: "#ffffff",
          dark: "#111111",
        },
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      themeColor: {
        light: "#ffffff",
        dark: "#111111",
      },
    });
  });

  it("extracts colorScheme defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        colorScheme: "light dark",
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      colorScheme: "light dark",
    });
  });

  it("extracts robots defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        robots: {
          noindex: true,
          "max-snippet": 50,
        },
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      robots: {
        noindex: true,
        "max-snippet": 50,
      },
    });
  });

  it("extracts robots content defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        robots: {
          content: "noindex, nofollow",
        },
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      robots: {
        content: "noindex, nofollow",
      },
    });
  });

  it("extracts generator defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        generator: true,
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      generator: true,
    });
  });

  it("extracts generator false into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        generator: false,
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      generator: false,
    });
  });

  it("extracts default values when no options are provided", () => {
    const result = extractHeadTagsConfig({});
    expect(result).toMatchObject(DEFAULT_HEAD_TAGS_OPTIONS);
  });

  it("extracts extend defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        extend: {
          link: [
            {
              rel: "preconnect",
              href: "https://cdn.example.com",
              prefetch: true,
            },
          ],
          meta: [{ property: "custom:source", content: "integration" }],
          custom: ['<meta name="custom" content="1">'],
        },
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      extend: {
        link: [
          {
            rel: "preconnect",
            href: "https://cdn.example.com",
            prefetch: true,
          },
        ],
        meta: [{ property: "custom:source", content: "integration" }],
        custom: ['<meta name="custom" content="1">'],
      },
    });
  });

  it("keeps manifest and humansTxt false branches while resolving icons to an array", () => {
    const options: IntegrationInput = {
      icons: false,
      headTags: {
        manifest: false,
        humansTxt: false,
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      icons: [],
      manifest: false,
      humansTxt: false,
    });
  });

  it("resolves build-time icon tags into the virtual config", () => {
    const options: IntegrationInput = {
      icons: {
        source: "/assets/logo.svg",
        "favicon.ico": { sizes: [16, 32, 48], tag: { rel: "icon" } },
        "apple-touch-icon.png": { size: 180, tag: { rel: "apple-touch-icon" } },
        "icon-192x192.png": { size: false, tag: { rel: "icon" } },
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result.icons).toEqual([
      {
        rel: "icon",
        href: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ]);
  });

  it("merges headTags.icons over generated icon tags using href as the key", () => {
    const options: IntegrationInput = {
      icons: {
        source: "/assets/logo.svg",
        "favicon.ico": { sizes: [16, 32, 48], tag: { rel: "icon" } },
        "apple-touch-icon.png": { size: 180, tag: { rel: "apple-touch-icon" } },
      },
      headTags: {
        icons: [
          {
            rel: "icon",
            href: "/favicon.ico",
            sizes: "32x32",
            type: "image/png",
          },
          {
            rel: "mask-icon",
            href: "/safari-pinned-tab.svg",
            type: "image/svg+xml",
          },
        ],
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result.icons).toEqual([
      {
        rel: "icon",
        href: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32", type: "image/png" },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        rel: "mask-icon",
        href: "/safari-pinned-tab.svg",
        type: "image/svg+xml",
      },
    ]);
  });

  it("serializes appleItunesApp defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        appleItunesApp: {
          id: "123456789",
          argument: "myapp://open",
        },
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      appleItunesApp: {
        id: "123456789",
        argument: "myapp://open",
      },
    });
  });

  it("serializes colorScheme defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        colorScheme: "dark",
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      colorScheme: "dark",
    });
  });

  it("serializes verification defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        verification: {
          bing: "bing-token",
        },
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      verification: {
        bing: "bing-token",
      },
    });
  });

  it("serializes themeColor defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        themeColor: {
          content: "#ffffff",
        },
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      themeColor: {
        content: "#ffffff",
      },
    });
  });

  it("serializes robots defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        robots: {
          nofollow: true,
          "max-video-preview": -1,
        },
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      robots: {
        nofollow: true,
        "max-video-preview": -1,
      },
    });
  });

  it("serializes robots content defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        robots: {
          content: "noindex, nofollow",
        },
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      robots: {
        content: "noindex, nofollow",
      },
    });
  });

  it("serializes generator defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        generator: false,
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      generator: false,
    });
  });

  it("extracts base defaults into client head config", () => {
    const options: IntegrationInput = {
      headTags: {
        base: {
          href: "https://example.com",
          target: "_blank",
        },
      },
    };

    const result = extractHeadTagsConfig(options);

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      base: {
        href: "https://example.com",
        target: "_blank",
      },
    });
  });

  it("serializes base defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        base: {
          href: "https://example.com",
        },
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      base: {
        href: "https://example.com",
      },
    });
  });

  it("serializes extend defaults in virtual config module", () => {
    const options: IntegrationInput = {
      headTags: {
        extend: {
          link: [{ rel: "dns-prefetch", href: "https://assets.example.com" }],
          meta: [{ property: "custom:token", content: "abc123" }],
          custom: '<script data-test="x"></script>',
        },
      },
    };

    const result = parseSerializedModuleConfig(
      serializedVirtualConfigModule(options),
    );

    expect(result).toMatchObject({
      ...DEFAULT_HEAD_TAGS_OPTIONS,
      extend: {
        link: [{ rel: "dns-prefetch", href: "https://assets.example.com" }],
        meta: [{ property: "custom:token", content: "abc123" }],
        custom: '<script data-test="x"></script>',
      },
    });
  });
});
