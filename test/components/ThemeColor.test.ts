import { ThemeColor } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component ThemeColor", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders a single theme-color tag when content is provided", async () => {
		const result = await container.renderToString(ThemeColor, {
			props: { content: "#ffffff" },
		});

		expect(result).toBe('<meta name="theme-color" content="#ffffff">');
	});

	it("renders light and dark theme-color tags when both are provided", async () => {
		const result = await container.renderToString(ThemeColor, {
			props: { light: "#ffffff", dark: "#111111" },
		});

		expect(result).toBe(
			'<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff"><meta name="theme-color" media="(prefers-color-scheme: dark)" content="#111111">',
		);
	});
});
