import { Layout } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Layout", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders Head and all four slots in the expected regions", async () => {
		const result = await container.renderToString(Layout, {
			props: {
				head: { title: "Home" },
			},
			slots: {
				head: '<meta name="description" content="Welcome">',
				"body-start": '<div id="start">Top</div>',
				default: "<main>Main Content</main>",
				"body-end": '<script src="/app.js"></script>',
			},
		});

		expect(result).toContain("<html>");
		expect(result).toContain("<head>");
		expect(result).toContain('<meta name="description" content="Welcome">');

		const startIndex = result.indexOf('<div id="start">Top</div>');
		const mainIndex = result.indexOf("<main>Main Content</main>");
		const endIndex = result.indexOf('<script src="/app.js"></script>');

		expect(startIndex).toBeGreaterThan(-1);
		expect(mainIndex).toBeGreaterThan(startIndex);
		expect(endIndex).toBeGreaterThan(mainIndex);
		expect(result).toContain("</html>");
	});
});
