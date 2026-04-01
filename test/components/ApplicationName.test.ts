import { ApplicationName } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component ApplicationName", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders single application-name tag from string content", async () => {
		const result = await container.renderToString(ApplicationName, {
			props: { content: "Eminence" },
		});

		expect(result).toBe('<meta name="application-name" content="Eminence">');
	});

	it("renders ordered language-specific application-name tags", async () => {
		const result = await container.renderToString(ApplicationName, {
			props: {
				content: [
					{ name: "Eminence", lang: "en" },
					{ name: "Eminencia", lang: "es" },
				],
			},
		});

		expect(result).toBe(
			'<meta name="application-name" content="Eminence" lang="en"><meta name="application-name" content="Eminencia" lang="es">',
		);
	});

	it("renders nothing when content is omitted", async () => {
		const result = await container.renderToString(ApplicationName, {
			props: {},
		});

		expect(result).toBe("");
	});
});
