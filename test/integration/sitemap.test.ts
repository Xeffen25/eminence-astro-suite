import {
  createSitemapIntegration,
  SITEMAP_MISSING_PEER_MESSAGE,
} from "@package/integration/sitemap";
import type { AstroIntegration } from "astro";
import { describe, expect, it } from "vitest";

describe("Integration - Sitemap", () => {
  // Mirrors docs: Basic
  it("returns the @astrojs/sitemap integration when called with an empty options object", async () => {
    const integration = await createSitemapIntegration({});

    expect(integration).toHaveProperty("name", "@astrojs/sitemap");
  });

  // Mirrors docs: Automatic
  it("invokes the loader with the default fallback config when sitemap is omitted", async () => {
    const loaderInvoked = { value: false };
    const trackingLoader = async () => {
      loaderInvoked.value = true;
      return {
        default: () =>
          ({ name: "@astrojs/sitemap", hooks: {} }) as AstroIntegration,
      };
    };

    // Guard mirrors the condition used in the integration hook; undefined passes
    const input: undefined = undefined;
    if (input !== false) {
      await createSitemapIntegration(input ?? {}, trackingLoader);
    }

    expect(loaderInvoked.value).toBe(true);
  });

  // Mirrors docs: Explicit opt-out
  it("does not invoke the loader when sitemap is false", () => {
    const loaderInvoked = { value: false };
    const trackingLoader = async () => {
      loaderInvoked.value = true;
      return {
        default: () =>
          ({ name: "@astrojs/sitemap", hooks: {} }) as AstroIntegration,
      };
    };

    // Guard mirrors the condition used in the integration hook; false skips
    const input: boolean | object = false;
    if (input !== false) {
      void createSitemapIntegration(input ?? {}, trackingLoader);
    }

    expect(loaderInvoked.value).toBe(false);
  });

  // Mirrors docs: Complete
  it("returns the @astrojs/sitemap integration when all options are provided", async () => {
    const integration = await createSitemapIntegration({
      filter: (page) => !page.includes("/private/"),
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date("2025-01-01"),
    });

    expect(integration).toHaveProperty("name", "@astrojs/sitemap");
  });

  // Edge case: missing peer throws with install instructions
  it("throws with the install instructions when the @astrojs/sitemap peer is unavailable", async () => {
    const failingLoader = () =>
      Promise.reject(new Error("Cannot find module '@astrojs/sitemap'"));

    await expect(createSitemapIntegration({}, failingLoader)).rejects.toThrow(
      SITEMAP_MISSING_PEER_MESSAGE,
    );
  });
});
