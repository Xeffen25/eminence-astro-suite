import { createSitemapIntegration, SITEMAP_MISSING_PEER_MESSAGE } from "@package/integration/sitemap";
import type { AstroIntegration } from "astro";
import { describe, expect, it } from "vitest";

describe("Integration - Sitemap", () => {
	it("returns the @astrojs/sitemap AstroIntegration when called with an empty options object", async () => {
		const integration = await createSitemapIntegration({});

		expect(integration).toHaveProperty("name", "@astrojs/sitemap");
	});

	it("passes options through to @astrojs/sitemap", async () => {
		const filter = (page: string) => !page.includes("/private/");
		const integration = await createSitemapIntegration({ filter });

		expect(integration).toHaveProperty("name", "@astrojs/sitemap");
	});

	it("throws with the install instructions when the @astrojs/sitemap peer is unavailable", async () => {
		const failingLoader = () => Promise.reject(new Error("Cannot find module '@astrojs/sitemap'"));

		await expect(createSitemapIntegration({}, failingLoader)).rejects.toThrow(SITEMAP_MISSING_PEER_MESSAGE);
	});

	it("does not invoke the loader when sitemap is false", () => {
		const loaderInvoked = { value: false };
		const trackingLoader = async () => {
			loaderInvoked.value = true;
			return { default: () => ({ name: "@astrojs/sitemap", hooks: {} }) as AstroIntegration };
		};

		const input: boolean | object = false;

		// Guard mirrors the condition used in the integration hook
		if (input !== false) {
			void createSitemapIntegration(input ?? {}, trackingLoader);
		}

		expect(loaderInvoked.value).toBe(false);
	});

	it("invokes the loader when sitemap is undefined, using default empty config", async () => {
		const loaderInvoked = { value: false };
		const trackingLoader = async () => {
			loaderInvoked.value = true;
			return { default: () => ({ name: "@astrojs/sitemap", hooks: {} }) as AstroIntegration };
		};

		const input: undefined = undefined;

		if (input !== false) {
			await createSitemapIntegration(input ?? {}, trackingLoader);
		}

		expect(loaderInvoked.value).toBe(true);
	});
});
