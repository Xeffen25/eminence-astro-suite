import { Archives } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Archives", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders one archives link from a string href", async () => {
		const result = await container.renderToString(Archives, {
			props: { hrefs: ["https://example.com/archive/2025"] },
		});

		expect(result).toBe('<link rel="archives" href="https://example.com/archive/2025">');
	});

	it("renders multiple archives links from mixed href shapes", async () => {
		const result = await container.renderToString(Archives, {
			props: {
				hrefs: [new URL("https://example.com/archive/2024"), "https://example.com/archive/2023"],
			},
		});

		expect(result).toBe(
			'<link rel="archives" href="https://example.com/archive/2024"><link rel="archives" href="https://example.com/archive/2023">',
		);
	});

	it("renders nothing when href list is empty", async () => {
		const result = await container.renderToString(Archives, {
			props: { hrefs: [] },
		});

		expect(result).toBe("");
	});
});
