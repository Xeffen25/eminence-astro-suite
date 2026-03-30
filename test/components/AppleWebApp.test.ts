import { AppleWebApp } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component AppleWebApp", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders nothing when no props are provided", async () => {
		const result = await container.renderToString(AppleWebApp, {
			props: {},
		});

		expect(result).toBe("");
	});

	it("renders itunes, title, startup image, and status bar tags", async () => {
		const result = await container.renderToString(AppleWebApp, {
			props: {
				itunes: {
					appId: "123456789",
					appArgument: "myapp://open",
				},
				title: "My App",
				statusBarStyle: "black-translucent",
				startupImage: [
					"/startup/default.png",
					{ url: "/startup/portrait.png", media: "(orientation: portrait)" },
				],
			},
		});

		expect(result).toBe(
			'<meta name="apple-itunes-app" content="app-id=123456789, app-argument=myapp://open"><meta name="apple-mobile-web-app-title" content="My App"><link href="/startup/default.png" rel="apple-touch-startup-image"><link href="/startup/portrait.png" media="(orientation: portrait)" rel="apple-touch-startup-image"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
		);
	});

	it("renders startup image URLs from URL instances", async () => {
		const result = await container.renderToString(AppleWebApp, {
			props: {
				startupImage: [
					new URL("https://cdn.example.com/default.png"),
					{ url: new URL("https://cdn.example.com/landscape.png"), media: "(orientation: landscape)" },
				],
			},
		});

		expect(result).toBe(
			'<link href="https://cdn.example.com/default.png" rel="apple-touch-startup-image"><link href="https://cdn.example.com/landscape.png" media="(orientation: landscape)" rel="apple-touch-startup-image">',
		);
	});
});
