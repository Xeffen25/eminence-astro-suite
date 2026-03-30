import { Charset } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Charset", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders default utf-8 charset", async () => {
		const result = await container.renderToString(Charset, {
			props: {},
		});

		expect(result).toBe('<meta charset="utf-8">');
	});

	it("renders custom charset value", async () => {
		const result = await container.renderToString(Charset, {
			props: { charset: "iso-8859-1" },
		});

		expect(result).toBe('<meta charset="iso-8859-1">');
	});
});
