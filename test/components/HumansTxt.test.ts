import { HumansTxt } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component HumansTxt", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders link tag with correct href from string domain", async () => {
		const result = await container.renderToString(HumansTxt, {
			props: { domain: "https://example.com" },
		});

		expect(result).toBe('<link type="text/plain" rel="author" href="https://example.com/humans.txt">');
	});

	it("renders link tag with correct href from URL instance", async () => {
		const result = await container.renderToString(HumansTxt, {
			props: { domain: new URL("https://example.com") },
		});

		expect(result).toBe('<link type="text/plain" rel="author" href="https://example.com/humans.txt">');
	});

	it("renders nothing when no domain and no Astro.site", async () => {
		const result = await container.renderToString(HumansTxt, {
			props: {},
		});

		expect(result).toBe("");
	});

	it("uses /humans.txt at root regardless of domain sub-path", async () => {
		const result = await container.renderToString(HumansTxt, {
			props: { domain: "https://example.com/blog" },
		});

		expect(result).toBe('<link type="text/plain" rel="author" href="https://example.com/humans.txt">');
	});
});
