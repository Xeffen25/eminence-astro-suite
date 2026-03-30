import { Verification } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Verification", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders provider verification tags", async () => {
		const result = await container.renderToString(Verification, {
			props: {
				google: "google-token",
				yandex: "yandex-token",
				yahoo: "yahoo-token",
			},
		});

		expect(result).toBe(
			'<meta name="google-site-verification" content="google-token"><meta name="yandex-verification" content="yandex-token"><meta name="y_key" content="yahoo-token">',
		);
	});

	it("renders custom provider tags from others", async () => {
		const result = await container.renderToString(Verification, {
			props: {
				others: [
					{ name: "msvalidate.01", content: "bing-token" },
					{ name: "p:domain_verify", content: "pinterest-token" },
				],
			},
		});

		expect(result).toBe(
			'<meta name="msvalidate.01" content="bing-token"><meta name="p:domain_verify" content="pinterest-token">',
		);
	});

	it("renders nothing when no verification props are provided", async () => {
		const result = await container.renderToString(Verification, {
			props: {},
		});

		expect(result).toBe("");
	});
});
