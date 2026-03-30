import { HumansTxt } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Component HumansTxt", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders provided href string as-is", async () => {
		const result = await container.renderToString(HumansTxt, {
			props: { href: "https://cdn.example.com/custom-humans.txt" },
		});

		expect(result).toBe('<link type="text/plain" rel="author" href="https://cdn.example.com/custom-humans.txt">');
	});

	it("renders provided href URL instance", async () => {
		const result = await container.renderToString(HumansTxt, {
			props: { href: new URL("https://example.com/humans.txt") },
		});

		expect(result).toBe('<link type="text/plain" rel="author" href="https://example.com/humans.txt">');
	});

	it("renders nothing and logs an error when href and Astro.site are unavailable", async () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const result = await container.renderToString(HumansTxt, {
			props: {},
		});

		expect(result).toBe("");
		expect(errorSpy).toHaveBeenCalledWith(
			"[HumansTxt] Unable to resolve href. Provide `href` or configure `site` in astro.config.*.",
		);

		errorSpy.mockRestore();
	});
});
