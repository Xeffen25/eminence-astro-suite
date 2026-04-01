import { Author } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Author", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders author meta tag with content", async () => {
		const result = await container.renderToString(Author, {
			props: { content: "Jane Doe" },
		});

		expect(result).toBe('<meta name="author" content="Jane Doe">');
	});

	it("renders nothing when content is omitted", async () => {
		const result = await container.renderToString(Author, {
			props: {},
		});

		expect(result).toBe("");
	});
});
