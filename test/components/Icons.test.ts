import { Icons } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import clientHeadConfig from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

const resetClientHeadConfig = () => {
	Object.assign(clientHeadConfig, {
		icons: [],
	});
};

describe("Component Icons", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		resetClientHeadConfig();
		container = await experimental_AstroContainer.create();
	});

	it("renders nothing when no build-time or runtime icon tags are provided", async () => {
		const result = await container.renderToString(Icons, { props: {} });

		expect(result).toBe("");
	});

	it("renders build-time resolved icon tags from the virtual module", async () => {
		Object.assign(clientHeadConfig, {
			icons: [
				{ rel: "icon", href: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
				{ rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
			],
		});

		const result = await container.renderToString(Icons, { props: {} });

		expect(result).toBe(
			'<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png">',
		);
	});

	it("merges runtime icons over build-time defaults by href and preserves extra attributes", async () => {
		Object.assign(clientHeadConfig, {
			icons: [
				{ rel: "icon", href: "/shared.png", sizes: "16x16", type: "image/png" },
				{ rel: "icon", href: "/build-time.ico", type: "image/x-icon" },
			],
		});

		const result = await container.renderToString(Icons, {
			props: {
				icons: [
					{ rel: "icon", href: "/shared.png", sizes: "32x32", type: "image/png", media: "dark" },
					{ rel: "preload", href: "/runtime-mask.svg", as: "image", type: "image/svg+xml" },
					{ rel: "icon", href: "/runtime-mask.svg", type: "image/svg+xml" },
				],
			},
		});

		expect(result).toBe(
			'<link rel="icon" href="/shared.png" sizes="32x32" type="image/png" media="(prefers-color-scheme: dark)"><link rel="icon" href="/build-time.ico" type="image/x-icon"><link rel="icon" href="/runtime-mask.svg" type="image/svg+xml">',
		);
	});

	it("uses the last build-time icon for duplicate href entries", async () => {
		Object.assign(clientHeadConfig, {
			icons: [
				{ rel: "icon", href: "/shared.png", sizes: "16x16", type: "image/png" },
				{ rel: "icon", href: "/shared.png", sizes: "32x32", type: "image/png" },
			],
		});

		const result = await container.renderToString(Icons, { props: {} });

		expect(result).toBe('<link rel="icon" href="/shared.png" sizes="32x32" type="image/png">');
	});
});
