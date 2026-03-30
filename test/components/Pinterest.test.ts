import { Pinterest } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Pinterest", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders true by default", async () => {
		const result = await container.renderToString(Pinterest, {
			props: {},
		});

		expect(result).toBe('<meta name="pinterest-rich-pin" content="true">');
	});

	it("renders false when richPin is false", async () => {
		const result = await container.renderToString(Pinterest, {
			props: { richPin: false },
		});

		expect(result).toBe('<meta name="pinterest-rich-pin" content="false">');
	});
});
