import { Publisher } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Publisher", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders publisher meta tag with content", async () => {
		const result = await container.renderToString(Publisher, {
			props: { content: "Acme Publishing" },
		});

		expect(result).toBe('<meta name="publisher" content="Acme Publishing">');
	});

	it("renders nothing when content is omitted", async () => {
		const result = await container.renderToString(Publisher, {
			props: {},
		});

		expect(result).toBe("");
	});
});
