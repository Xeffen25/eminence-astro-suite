import { Icons } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import clientHeadConfig from "virtual:eminence-astro-suite/config";
import { beforeEach, describe, expect, it } from "vitest";

const resetClientHeadConfig = () => {
	Object.assign(clientHeadConfig, {
		icons: undefined,
	});
};

describe("Component Icons", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		resetClientHeadConfig();
		container = await experimental_AstroContainer.create();
	});

	it("renders default icon links", async () => {
		const result = await container.renderToString(Icons, { props: {} });

		expect(result).toBe(
			'<link rel="icon" href="/favicon.ico" type="image/x-icon"><link rel="icon" href="/favicon.png" sizes="32x32" type="image/png"><link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png"><link rel="icon" href="/icon-192x192.png" sizes="192x192" type="image/png"><link rel="icon" href="/icon.png" sizes="512x512" type="image/png">',
		);
	});

	it("renders svg icon variant when integration source is svg", async () => {
		Object.assign(clientHeadConfig, {
			icons: {
				source: "/logo.svg",
			},
		});

		const result = await container.renderToString(Icons, { props: {} });

		expect(result).toBe(
			'<link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml"><link rel="icon" href="/favicon.ico" type="image/x-icon"><link rel="icon" href="/favicon.png" sizes="32x32" type="image/png"><link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png"><link rel="icon" href="/icon-192x192.png" sizes="192x192" type="image/png"><link rel="icon" href="/icon.png" sizes="512x512" type="image/png">',
		);
	});

	it("renders nothing when all default icons are explicitly disabled", async () => {
		const result = await container.renderToString(Icons, {
			props: {
				svg: false,
				ico: false,
				png32: false,
				png48: false,
				appleTouchIcon: false,
				png192: false,
				png512: false,
			},
		});

		expect(result).toBe("");
	});
});
