import { Description } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Description", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders meta description tag with content", async () => {
		const result = await container.renderToString(Description, {
			props: { content: "Learn how to build efficient web applications" },
		});

		expect(result).toBe('<meta name="description" content="Learn how to build efficient web applications">');
	});
});
