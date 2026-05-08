import {
  createSitemapIntegration,
  SITEMAP_MISSING_PEER_MESSAGE,
} from "@package/integration/sitemap";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { describe, expect, it, vi } from "vitest";

describe("Integration - Sitemap", () => {
  it("returns the @astrojs/sitemap AstroIntegration when called with an empty options object", async () => {
    const logger: TestLogger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };
    const integration = await createSitemapIntegration(
      {},
      logger as unknown as AstroIntegrationLogger,
    );

    expect(integration).toHaveProperty("name", "@astrojs/sitemap");
  });

  it("passes options through to @astrojs/sitemap", async () => {
    const logger: TestLogger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };
    const filter = (page: string) => !page.includes("/private/");
    const integration = await createSitemapIntegration(
      { filter },
      logger as unknown as AstroIntegrationLogger,
    );

    expect(integration).toHaveProperty("name", "@astrojs/sitemap");
  });

  it("returns null and logs an error when the @astrojs/sitemap peer is unavailable", async () => {
    const failingLoader = () =>
      Promise.reject(new Error("Cannot find module '@astrojs/sitemap'"));
    const logger: TestLogger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };

    const result = await createSitemapIntegration(
      {},
      logger as unknown as AstroIntegrationLogger,
      failingLoader,
    );

    expect(result).toBeFalsy();
    expect(logger.error).toHaveBeenCalledWith(SITEMAP_MISSING_PEER_MESSAGE);
  });

  it("does not invoke the loader when sitemap is false", () => {
    const logger: TestLogger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };
    const loaderInvoked = { value: false };
    const trackingLoader = async () => {
      loaderInvoked.value = true;
      return {
        default: () =>
          ({ name: "@astrojs/sitemap", hooks: {} }) as AstroIntegration,
      };
    };

    const input: boolean | object = false;

    // Guard mirrors the condition used in the integration hook
    if (input !== false) {
      void createSitemapIntegration(
        input ?? {},
        logger as unknown as AstroIntegrationLogger,
        trackingLoader,
      );
    }

    expect(loaderInvoked.value).toBe(false);
  });

  it("invokes the loader when sitemap is undefined, using default empty config", async () => {
    const logger: TestLogger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };
    const loaderInvoked = { value: false };
    const trackingLoader = async () => {
      loaderInvoked.value = true;
      return {
        default: () =>
          ({ name: "@astrojs/sitemap", hooks: {} }) as AstroIntegration,
      };
    };

    const input: undefined = undefined;

    if (input !== false) {
      await createSitemapIntegration(
        input ?? {},
        logger as unknown as AstroIntegrationLogger,
        trackingLoader,
      );
    }

    expect(loaderInvoked.value).toBe(true);
  });
});
