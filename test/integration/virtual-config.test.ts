import type { IntegrationInput } from "@package/integration";
import { extractHeadTagsConfig, serializedVirtualConfigModule } from "@package/integration/virtual-config";
import { describe, expect, it } from "vitest";

const DEFAULT_HEAD_TAGS_OPTIONS = {
	charset: "utf-8",
	viewport: "width=device-width, initial-scale=1",
	titleTemplate: "%s",
	generator: true,
	icons: {},
	manifest: false,
	humansTxt: false,
};

const parseSerializedModuleConfig = (moduleSource: string) => {
	const prefix = "export default ";
	const json = moduleSource.slice(prefix.length, -1);
	return JSON.parse(json);
};

describe("Integration - Virtual Config", () => {
	it("extracts appleItunesApp defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				appleItunesApp: {
					id: "123456789",
					argument: "myapp://open",
				},
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			appleItunesApp: {
				id: "123456789",
				argument: "myapp://open",
			},
		});
	});

	it("extracts verification defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				verification: {
					google: "google-token",
					yandex: "yandex-token",
					others: [{ name: "msvalidate.01", content: "bing-token" }],
				},
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			verification: {
				google: "google-token",
				yandex: "yandex-token",
				others: [{ name: "msvalidate.01", content: "bing-token" }],
			},
		});
	});

	it("extracts appLinks defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				appLinks: {
					ios: {
						url: "myapp://open",
						app_store_id: "123456789",
					},
					android: {
						package: "com.example.app",
						app_name: "Example App",
					},
					web: {
						url: "https://example.com",
						should_fallback: true,
					},
				},
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			appLinks: {
				ios: {
					url: "myapp://open",
					app_store_id: "123456789",
				},
				android: {
					package: "com.example.app",
					app_name: "Example App",
				},
				web: {
					url: "https://example.com",
					should_fallback: true,
				},
			},
		});
	});

	it("extracts themeColor defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				themeColor: {
					light: "#ffffff",
					dark: "#111111",
				},
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			themeColor: {
				light: "#ffffff",
				dark: "#111111",
			},
		});
	});

	it("extracts colorScheme defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				colorScheme: "light dark",
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			colorScheme: "light dark",
		});
	});

	it("extracts robots defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				robots: {
					noindex: true,
					"max-snippet": 50,
				},
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			robots: {
				noindex: true,
				"max-snippet": 50,
			},
		});
	});

	it("extracts robots content defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				robots: {
					content: "noindex, nofollow",
				},
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			robots: {
				content: "noindex, nofollow",
			},
		});
	});

	it("extracts generator defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				generator: true,
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			generator: true,
		});
	});

	it("extracts generator false into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				generator: false,
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			generator: false,
		});
	});

	it("extracts default values when no options are provided", () => {
		const result = extractHeadTagsConfig({});
		expect(result).toMatchObject(DEFAULT_HEAD_TAGS_OPTIONS);
	});

	it("extracts extend defaults into client head config", () => {
		const options: IntegrationInput = {
			headTags: {
				extend: {
					link: [{ rel: "preconnect", href: "https://cdn.example.com", prefetch: true }],
					meta: [{ property: "custom:source", content: "integration" }],
					custom: ['<meta name="custom" content="1">'],
				},
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			extend: {
				link: [{ rel: "preconnect", href: "https://cdn.example.com", prefetch: true }],
				meta: [{ property: "custom:source", content: "integration" }],
				custom: ['<meta name="custom" content="1">'],
			},
		});
	});

	it("keeps false branches for icons, manifest, and humansTxt", () => {
		const options: IntegrationInput = {
			icons: false,
			headTags: {
				manifest: false,
				humansTxt: false,
			},
		};

		const result = extractHeadTagsConfig(options);

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			icons: false,
			manifest: false,
			humansTxt: false,
		});
	});

	it("serializes appleItunesApp defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				appleItunesApp: {
					id: "123456789",
					argument: "myapp://open",
				},
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			appleItunesApp: {
				id: "123456789",
				argument: "myapp://open",
			},
		});
	});

	it("serializes colorScheme defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				colorScheme: "dark",
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			colorScheme: "dark",
		});
	});

	it("serializes verification defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				verification: {
					bing: "bing-token",
				},
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			verification: {
				bing: "bing-token",
			},
		});
	});

	it("serializes appLinks defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				appLinks: {
					ios: {
						url: new URL("https://ios.example.com/open"),
					},
					web: {
						url: new URL("https://example.com/path"),
						should_fallback: false,
					},
				},
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			appLinks: {
				ios: {
					url: "https://ios.example.com/open",
				},
				web: {
					url: "https://example.com/path",
					should_fallback: false,
				},
			},
		});
	});

	it("serializes themeColor defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				themeColor: {
					content: "#ffffff",
				},
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			themeColor: {
				content: "#ffffff",
			},
		});
	});

	it("serializes robots defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				robots: {
					nofollow: true,
					"max-video-preview": -1,
				},
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			robots: {
				nofollow: true,
				"max-video-preview": -1,
			},
		});
	});

	it("serializes robots content defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				robots: {
					content: "noindex, nofollow",
				},
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			robots: {
				content: "noindex, nofollow",
			},
		});
	});

	it("serializes generator defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				generator: false,
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			generator: false,
		});
	});

	it("serializes extend defaults in virtual config module", () => {
		const options: IntegrationInput = {
			headTags: {
				extend: {
					link: [{ rel: "dns-prefetch", href: "https://assets.example.com" }],
					meta: [{ property: "custom:token", content: "abc123" }],
					custom: '<script data-test="x"></script>',
				},
			},
		};

		const result = parseSerializedModuleConfig(serializedVirtualConfigModule(options));

		expect(result).toMatchObject({
			...DEFAULT_HEAD_TAGS_OPTIONS,
			extend: {
				link: [{ rel: "dns-prefetch", href: "https://assets.example.com" }],
				meta: [{ property: "custom:token", content: "abc123" }],
				custom: '<script data-test="x"></script>',
			},
		});
	});
});
