import { Alternate } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component Alternate", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	it("renders language alternate links as strings", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				languages: {
					es: "https://example.com/es",
					fr: "https://example.com/fr",
				},
			},
		});

		expect(result).toBe(
			'<link rel="alternate" hreflang="es" href="https://example.com/es"><link rel="alternate" hreflang="fr" href="https://example.com/fr">',
		);
	});

	it("renders language alternate links with URL objects", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				languages: {
					de: new URL("https://example.com/de"),
				},
			},
		});

		expect(result).toBe('<link rel="alternate" hreflang="de" href="https://example.com/de">');
	});

	it("renders feed type alternate links", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				types: {
					"application/rss+xml": "https://example.com/feed.rss",
					"application/atom+xml": "https://example.com/feed.atom",
				},
			},
		});

		expect(result).toBe(
			'<link rel="alternate" type="application/rss+xml" href="https://example.com/feed.rss"><link rel="alternate" type="application/atom+xml" href="https://example.com/feed.atom">',
		);
	});

	it("renders both language and feed type alternates together", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				languages: {
					es: "https://example.com/es",
				},
				types: {
					"application/rss+xml": "https://example.com/feed.rss",
				},
			},
		});

		expect(result).toContain(
			'<link rel="alternate" hreflang="es" href="https://example.com/es"><link rel="alternate" type="application/rss+xml" href="https://example.com/feed.rss">',
		);
	});

	it("handles mixed string and URL objects for languages", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				languages: {
					es: "https://example.com/es",
					fr: new URL("https://example.com/fr"),
					it: "https://example.com/it",
				},
			},
		});

		expect(result).toBe(
			'<link rel="alternate" hreflang="es" href="https://example.com/es"><link rel="alternate" hreflang="fr" href="https://example.com/fr"><link rel="alternate" hreflang="it" href="https://example.com/it">',
		);
	});

	it("handles mixed string and URL objects for feed types", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				types: {
					"application/rss+xml": "https://example.com/feed.rss",
					"application/atom+xml": new URL("https://example.com/feed.atom"),
				},
			},
		});

		expect(result).toBe(
			'<link rel="alternate" type="application/rss+xml" href="https://example.com/feed.rss"><link rel="alternate" type="application/atom+xml" href="https://example.com/feed.atom">',
		);
	});

	it("renders nothing when no props are provided", async () => {
		const result = await container.renderToString(Alternate, {
			props: {},
		});

		expect(result).toBe("");
	});

	it("renders nothing when both languages and types are undefined", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				languages: undefined,
				types: undefined,
			},
		});

		expect(result).toBe("");
	});

	it("renders only language alternates when types is empty", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				languages: {
					es: "https://example.com/es",
				},
				types: {},
			},
		});

		expect(result).toBe('<link rel="alternate" hreflang="es" href="https://example.com/es">');
	});

	it("renders only feed type alternates when languages is empty", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				languages: {},
				types: {
					"application/rss+xml": "https://example.com/feed.rss",
				},
			},
		});

		expect(result).toBe('<link rel="alternate" type="application/rss+xml" href="https://example.com/feed.rss">');
	});

	it("handles single language entry", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				languages: {
					"x-default": "https://example.com",
				},
			},
		});

		expect(result).toBe('<link rel="alternate" hreflang="x-default" href="https://example.com">');
	});

	it("handles single feed type entry", async () => {
		const result = await container.renderToString(Alternate, {
			props: {
				types: {
					"application/rss+xml": "https://example.com/feed",
				},
			},
		});

		expect(result).toBe('<link rel="alternate" type="application/rss+xml" href="https://example.com/feed">');
	});
});
