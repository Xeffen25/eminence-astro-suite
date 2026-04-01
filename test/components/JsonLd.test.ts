import { JsonLd } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component JsonLd", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders a JSON-LD script with the provided string", async () => {
		const result = await container.renderToString(JsonLd, {
			props: {
				jsonLd: '{"@context":"https://schema.org","@type":"WebPage","name":"Home"}',
			},
		});

		expect(result).toBe(
			'<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"Home"}</script>',
		);
	});

	it("escapes unsafe characters in JSON-LD content", async () => {
		const result = await container.renderToString(JsonLd, {
			props: {
				jsonLd: '{"@context":"https://schema.org","@type":"WebPage","name":"<Unsafe & Value>"}',
			},
		});

		expect(result).toBe(
			'<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"\\u003cUnsafe \\u0026 Value\\u003e"}</script>',
		);
	});
});
