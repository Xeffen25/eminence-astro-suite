import { Manifest } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Component Manifest", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders provided href string as-is", async () => {
		const result = await container.renderToString(Manifest, {
			props: { href: "https://example.com/manifest.webmanifest" },
		});

		expect(result).toBe('<link rel="manifest" href="https://example.com/manifest.webmanifest">');
	});

	it("renders provided href URL instance", async () => {
		const result = await container.renderToString(Manifest, {
			props: { href: new URL("https://cdn.example.com/manifest.webmanifest") },
		});

		expect(result).toBe('<link rel="manifest" href="https://cdn.example.com/manifest.webmanifest">');
	});

	it("renders nothing and logs an error when href and Astro.site are unavailable", async () => {
		const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		const result = await container.renderToString(Manifest, {
			props: {},
		});

		expect(result).toBe("");
		expect(errorSpy).toHaveBeenCalledWith(
			"[Manifest] Unable to resolve href. Provide `href` or configure `site` in astro.config.*.",
		);

		errorSpy.mockRestore();
	});
});
