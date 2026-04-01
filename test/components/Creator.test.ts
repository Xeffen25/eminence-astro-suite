import { Creator } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Creator", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders single creator meta tag from array content", async () => {
		const result = await container.renderToString(Creator, {
			props: { content: ["Acme University"] },
		});

		expect(result).toBe('<meta name="creator" content="Acme University">');
	});

	it("renders multiple creator meta tags from array content", async () => {
		const result = await container.renderToString(Creator, {
			props: { content: ["Acme University", "Research Lab"] },
		});

		expect(result).toBe(
			'<meta name="creator" content="Acme University"><meta name="creator" content="Research Lab">',
		);
	});

	it("renders nothing when content is omitted", async () => {
		const result = await container.renderToString(Creator, {
			props: {},
		});

		expect(result).toBe("");
	});
});
