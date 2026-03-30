import { Head } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Head", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders charset, viewport, and title with defaults", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home" },
		});

		expect(result).toBe(
			'<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title></head>',
		);
	});

	it("applies titleTemplate", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home", titleTemplate: "%s | My Site" },
		});

		expect(result).toBe(
			'<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home | My Site</title></head>',
		);
	});

	it("always renders charset and viewport components", async () => {
		const result = await container.renderToString(Head, {
			props: { title: "Home" },
		});

		expect(result).toBe(
			'<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title></head>',
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
			'<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="https://example.com" target="_blank"><title>Home</title></head>',
		);
	});

	it("renders humansTxt link when configured", async () => {
		const result = await container.renderToString(Head, {
			props: {
				title: "Home",
				humansTxt: { href: "https://example.com/humans.txt" },
			},
		});

		expect(result).toBe(
			'<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Home</title><link type="text/plain" rel="author" href="https://example.com/humans.txt"></head>',
		);
	});
});
