import { Head } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import clientHeadConfig from "virtual:eminence-astro-suite/config";
import { beforeEach, describe, expect, it } from "vitest";

const DEFAULT_ICONS_HTML =
	'<link rel="icon" href="/favicon.ico" type="image/x-icon"><link rel="icon" href="/favicon.png" sizes="32x32" type="image/png"><link rel="icon" href="/favicon-48x48.png" sizes="48x48" type="image/png"><link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png"><link rel="icon" href="/icon-192x192.png" sizes="192x192" type="image/png"><link rel="icon" href="/icon.png" sizes="512x512" type="image/png">';

const resetClientHeadConfig = () => {
	Object.assign(clientHeadConfig, {
		charset: undefined,
		viewport: undefined,
		base: undefined,
		colorScheme: undefined,
		titleTemplate: undefined,
		appleWebApp: undefined,
		appLinks: undefined,
		author: undefined,
		creator: undefined,
		facebook: undefined,
		generator: undefined,
		icons: undefined,
		openGraphSiteName: undefined,
		humansTxt: undefined,
		pinterest: undefined,
		publisher: undefined,
		robots: undefined,
		themeColor: undefined,
		verification: undefined,
	});
};

describe("Component Head", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		resetClientHeadConfig();
		container = await experimental_AstroContainer.create();
	});

	it("renders charset, viewport, title, generator, and pinterest defaults", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home" },
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="generator" content="Astro v6.1.1">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});

	it("applies titleTemplate", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home", titleTemplate: "%s | My Site" },
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home | My Site</title><meta name="generator" content="Astro v6.1.1">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});

	it("always renders charset and viewport components", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home" },
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="generator" content="Astro v6.1.1">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});

	it("renders base tag when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				base: { href: "https://example.com", target: "_blank" },
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="https://example.com" target="_blank"><title>Home</title><meta name="generator" content="Astro v6.1.1">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});

	it("renders humansTxt link when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				humansTxt: "https://example.com/humans.txt",
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="generator" content="Astro v6.1.1"><link type="text/plain" rel="author" href="https://example.com/humans.txt">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});

	it("renders manifest link when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				manifest: "https://example.com/manifest.webmanifest",
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="generator" content="Astro v6.1.1">${DEFAULT_ICONS_HTML}<link rel="manifest" href="https://example.com/manifest.webmanifest"><meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});

	it("renders canonical link when configured with href", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				canonical: "https://example.com/home",
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><link rel="canonical" href="https://example.com/home"><meta name="generator" content="Astro v6.1.1">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});

	it("renders appLinks meta tags when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				appLinks: {
					ios: { url: "myapp://open", app_store_id: "123456789" },
					web: { url: "https://example.com/home", should_fallback: false },
				},
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta property="al:ios:url" content="myapp://open"><meta property="al:ios:app_store_id" content="123456789"><meta property="al:web:url" content="https://example.com/home"><meta property="al:web:should_fallback" content="false"><meta name="generator" content="Astro v6.1.1">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});

	it("uses child component config fallbacks", async () => {
		Object.assign(clientHeadConfig, {
			titleTemplate: "%s | Example",
			author: "Jane Doe",
			generator: false,
			pinterest: false,
		});

		const result = await container.renderToString(Head, {
			props: { title: "Home" },
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home | Example</title><meta name="author" content="Jane Doe">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="false"></head>`,
		);
	});

	it("renders nothing for canonical when explicitly disabled", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				canonical: false,
			},
		});

		expect(result).toBe(
			`<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><meta name="generator" content="Astro v6.1.1">${DEFAULT_ICONS_HTML}<meta name="pinterest-rich-pin" content="true"></head>`,
		);
	});
});
