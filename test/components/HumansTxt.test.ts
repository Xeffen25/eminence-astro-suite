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

		expect(result).toBe('<link rel="author" href="https://cdn.example.com/custom-humans.txt" type="text/plain">');
	});

	it("renders provided href URL instance", async () => {
		const result = await container.renderToString(HumansTxt, {
			props: { href: new URL("https://example.com/humans.txt") },
		});

		expect(result).toBe('<link rel="author" href="https://example.com/humans.txt" type="text/plain">');
	});

	it("renders nothing when href and Astro.site are unavailable", async () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const result = await container.renderToString(HumansTxt, {
			props: {},
		});

		expect(result).toBe("");
		expect(errorSpy).toHaveBeenCalledWith(
			"[Eminence Astro Suite] Component HumansTxt did not resolve a href so it didn't render. Provide an `href` prop or set `Astro.site` so it can be resolved.",
		);

		errorSpy.mockRestore();
	});
});
