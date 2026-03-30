import { Assets } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Assets", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders one assets link from a string href", async () => {
		const result = await container.renderToString(Assets, {
			props: { hrefs: ["https://example.com/assets"] },
		});

		expect(result).toBe('<link rel="assets" href="https://example.com/assets">');
	});

	it("renders multiple assets links from mixed href shapes", async () => {
		const result = await container.renderToString(Assets, {
			props: {
				hrefs: [new URL("https://cdn.example.com/assets"), "https://example.com/assets"],
			},
		});

		expect(result).toBe(
			'<link rel="assets" href="https://cdn.example.com/assets"><link rel="assets" href="https://example.com/assets">',
		);
	});

	it("renders nothing when href list is empty", async () => {
		const result = await container.renderToString(Assets, {
			props: { hrefs: [] },
		});

		expect(result).toBe("");
	});
});
