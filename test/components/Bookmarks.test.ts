import { Bookmarks } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Bookmarks", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders one bookmarks link from a string href", async () => {
		const result = await container.renderToString(Bookmarks, {
			props: { hrefs: ["https://example.com/bookmarks"] },
		});

		expect(result).toBe('<link rel="bookmarks" href="https://example.com/bookmarks">');
	});

	it("renders multiple bookmarks links from mixed href shapes", async () => {
		const result = await container.renderToString(Bookmarks, {
			props: {
				hrefs: [new URL("https://cdn.example.com/bookmarks"), "https://example.com/bookmarks"],
			},
		});

		expect(result).toBe(
			'<link rel="bookmarks" href="https://cdn.example.com/bookmarks"><link rel="bookmarks" href="https://example.com/bookmarks">',
		);
	});

	it("renders nothing when href list is empty", async () => {
		const result = await container.renderToString(Bookmarks, {
			props: { hrefs: [] },
		});

		expect(result).toBe("");
	});
});
