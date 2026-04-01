import { Manifest } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

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

	it("renders nothing when explicitly disabled", async () => {
		const result = await container.renderToString(Manifest, {
			props: { href: false },
		});

		expect(result).toBe("");
	});

	it("renders nothing when href and Astro.site are unavailable", async () => {
		const result = await container.renderToString(Manifest, {
			props: {},
		});

		expect(result).toBe("");
	});
});
