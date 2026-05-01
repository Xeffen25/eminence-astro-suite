import { Head } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import clientHeadConfig from "virtual:eminence-astro-suite/head-tags";
import { beforeEach, describe, expect, it } from "vitest";

const DEFAULT_ICONS_HTML = "";

const DEFAULT_DESCRIPTION = "Home page";
const DEFAULT_HEAD_TAGS_CONFIG = { ...clientHeadConfig };

const resetClientHeadConfig = () => {
	Object.assign(clientHeadConfig, DEFAULT_HEAD_TAGS_CONFIG);
};

describe("Component Head", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		resetClientHeadConfig();
		container = await experimental_AstroContainer.create();
	});

	it("renders charset, viewport, title, and generator defaults", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home", description: DEFAULT_DESCRIPTION },
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("applies titleTemplate", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home", titleTemplate: "%s | My Site", description: DEFAULT_DESCRIPTION },
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home | My Site</title><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("always renders charset and viewport components", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home", description: DEFAULT_DESCRIPTION },
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("renders base tag when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				base: { href: "https://example.com", target: "_blank" },
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="https://example.com" target="_blank"><title>Home</title><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("renders humansTxt link when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				humansTxt: "https://example.com/humans.txt",
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1"><link rel="author" href="https://example.com/humans.txt" type="text/plain">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("renders manifest link when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				manifest: "https://example.com/manifest.webmanifest",
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}<link rel="manifest" href="https://example.com/manifest.webmanifest"></head>`,
		);
	});

	it("renders canonical link when configured with href", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				canonical: "https://example.com/home",
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><link rel="canonical" href="https://example.com/home"><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("renders appLinks meta tags when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				appLinks: {
					ios: { url: "myapp://open", app_store_id: "123456789" },
					web: { url: "https://example.com/home", should_fallback: false },
				},
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta property="al:ios:url" content="myapp://open"><meta property="al:ios:app_store_id" content="123456789"><meta property="al:web:url" content="https://example.com/home"><meta property="al:web:should_fallback" content="false"><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("renders appLinks from integration defaults when Head appLinks prop is omitted", async () => {
		Object.assign(clientHeadConfig, {
			appLinks: {
				ios: { url: "myapp://open", app_store_id: "123456789" },
				web: { url: "https://example.com/home", should_fallback: false },
			},
		});

		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta property="al:ios:url" content="myapp://open"><meta property="al:ios:app_store_id" content="123456789"><meta property="al:web:url" content="https://example.com/home"><meta property="al:web:should_fallback" content="false"><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("uses child component config fallbacks", async () => {
		Object.assign(clientHeadConfig, {
			titleTemplate: "%s | Example",
			generator: false,
		});

		const result = await container.renderToString(Head, {
			props: { title: "Home", description: DEFAULT_DESCRIPTION },
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home | Example</title><meta name="description" content="Home page">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("renders nothing for canonical when explicitly disabled", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				canonical: false,
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("renders extend link and meta tags from props after slot", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				extend: {
					link: [{ rel: "preconnect", href: "https://cdn.example.com", prefetch: true }],
					meta: [{ property: "custom:token", content: "abc123" }],
				},
			},
			slots: {
				default: '<meta name="slot-meta" content="slot">',
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="slot-meta" content="slot"><link rel="preconnect" href="https://cdn.example.com" prefetch="true"><meta property="custom:token" content="abc123"><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("renders extend custom HTML string and string arrays", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				extend: {
					custom: [
						'<meta name="custom-a" content="1">',
						'<script type="application/json">{"key":"value"}</script>',
					],
				},
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="custom-a" content="1"><script type="application/json">{"key":"value"}</script><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("uses integration extend defaults when extend prop is omitted", async () => {
		Object.assign(clientHeadConfig, {
			extend: {
				link: [{ rel: "dns-prefetch", href: "https://assets.example.com" }],
				meta: [{ property: "custom:source", content: "integration" }],
				custom: '<meta name="custom-inline" content="from-config">',
			},
		});

		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><link rel="dns-prefetch" href="https://assets.example.com"><meta property="custom:source" content="integration"><meta name="custom-inline" content="from-config"><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});

	it("prefers extend props over integration defaults", async () => {
		Object.assign(clientHeadConfig, {
			extend: {
				meta: [{ property: "custom:source", content: "integration" }],
			},
		});

		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				description: DEFAULT_DESCRIPTION,
				extend: {
					meta: [{ property: "custom:source", content: "props" }],
				},
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta property="custom:source" content="props"><meta name="description" content="Home page"><meta name="generator" content="Astro v6.2.1">${DEFAULT_ICONS_HTML}</head>`,
		);
	});
});
