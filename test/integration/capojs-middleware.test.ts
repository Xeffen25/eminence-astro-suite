import {
	getCapoWeight,
	isHtmlResponse,
	optimizeHeadResponse,
	reorderHeadInDocument,
} from "@package/integration/capojs-order";
import { describe, expect, it } from "vitest";

describe("Integration - Capojs Middleware", () => {
	it("reorders head tags in capo-style priority order", () => {
		const html = [
			"<!doctype html>",
			"<html>",
			"<head>",
			'<script src="/boot.js"></script>',
			'<meta name="description" content="A page">',
			"<title>Example</title>",
			'<meta charset="utf-8">',
			'<link rel="preload" as="style" href="/styles.css">',
			'<meta name="viewport" content="width=device-width, initial-scale=1">',
			"</head>",
			"<body>Hello</body>",
			"</html>",
		].join("\n");

		const result = reorderHeadInDocument(html);

		expect(result.indexOf('<meta charset="utf-8">')).toBeLessThan(
			result.indexOf('<meta name="viewport" content="width=device-width, initial-scale=1">'),
		);
		expect(result.indexOf('<meta name="viewport" content="width=device-width, initial-scale=1">')).toBeLessThan(
			result.indexOf("<title>Example</title>"),
		);
		expect(result.indexOf("<title>Example</title>")).toBeLessThan(
			result.indexOf('<link rel="preload" as="style" href="/styles.css">'),
		);
		expect(result.indexOf('<link rel="preload" as="style" href="/styles.css">')).toBeLessThan(
			result.indexOf('<meta name="description" content="A page">'),
		);
		expect(result.indexOf('<meta name="description" content="A page">')).toBeLessThan(
			result.indexOf('<script src="/boot.js"></script>'),
		);
	});

	it("keeps JSON-LD in the script group with stable ordering", () => {
		const html = [
			"<html>",
			"<head>",
			'<script type="application/ld+json">{"@context":"https://schema.org"}</script>',
			'<script src="/app.js"></script>',
			"</head>",
			"</html>",
		].join("\n");

		const result = reorderHeadInDocument(html);

		expect(result.indexOf('script type="application/ld+json"')).toBeLessThan(
			result.indexOf('script src="/app.js"'),
		);
	});

	it("does not alter documents without a head", () => {
		const html = "<html><body>No head</body></html>";

		expect(reorderHeadInDocument(html)).toBe(html);
	});

	it("returns non-html responses unchanged", async () => {
		const response = new Response('{"ok":true}', {
			headers: { "content-type": "application/json" },
		});

		const result = await optimizeHeadResponse(response);

		expect(result).toBe(response);
		expect(isHtmlResponse(response)).toBe(false);
	});

	it("rebuilds html responses with transformed content", async () => {
		const response = new Response("<html><head><title>before</title></head><body></body></html>", {
			headers: { "content-type": "text/html; charset=utf-8", "content-length": "999" },
		});

		const result = await optimizeHeadResponse(response, (html) => html.replace("before", "after"));

		expect(result).not.toBe(response);
		expect(await result.text()).toContain("after");
		expect(result.headers.get("content-length")).toBeNull();
		expect(isHtmlResponse(result)).toBe(true);
	});

	it("weights charset and viewport ahead of generic scripts", () => {
		expect(getCapoWeight("meta", { charset: "utf-8" })).toBeLessThan(getCapoWeight("script", {}));
		expect(getCapoWeight("meta", { name: "viewport" })).toBeLessThan(getCapoWeight("script", {}));
	});
});
