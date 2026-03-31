import type { IntegrationInput } from "@package/integration";
import { extractClientHeadConfig, serializedVirtualConfigModule } from "@package/integration/virtual-config";
import { describe, expect, it } from "vitest";

describe("Integration - Virtual Config", () => {
	it("extracts appleWebApp defaults into client head config", () => {
		const options: IntegrationInput = {
			head: {
				appleWebApp: {
					title: "My App",
					statusBarStyle: "black-translucent",
					startupImage: [
						"/startup/default.png",
						{ url: "https://cdn.example.com/portrait.png", media: "(orientation: portrait)" },
					],
				},
			},
		};

		const result = extractClientHeadConfig(options);

		expect(result).toEqual({
			charset: undefined,
			viewport: undefined,
			appleWebApp: {
				title: "My App",
				statusBarStyle: "black-translucent",
				startupImage: [
					"/startup/default.png",
					{ url: "https://cdn.example.com/portrait.png", media: "(orientation: portrait)" },
				],
			},
			appLinks: undefined,
			facebook: undefined,
			pinterest: undefined,
			themeColor: undefined,
			humansTxt: undefined,
			verification: undefined,
			base: undefined,
			titleTemplate: undefined,
		});
	});

	it("extracts verification defaults into client head config", () => {
		const options: IntegrationInput = {
			head: {
				verification: {
					google: "google-token",
					yandex: "yandex-token",
					others: [{ name: "msvalidate.01", content: "bing-token" }],
				},
			},
		};

		const result = extractClientHeadConfig(options);

		expect(result).toEqual({
			charset: undefined,
			viewport: undefined,
			appleWebApp: undefined,
			appLinks: undefined,
			facebook: undefined,
			pinterest: undefined,
			themeColor: undefined,
			humansTxt: undefined,
			verification: {
				google: "google-token",
				yandex: "yandex-token",
				others: [{ name: "msvalidate.01", content: "bing-token" }],
			},
			base: undefined,
			titleTemplate: undefined,
		});
	});

	it("extracts appLinks defaults into client head config", () => {
		const options: IntegrationInput = {
			head: {
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

		const result = extractClientHeadConfig(options);

		expect(result).toEqual({
			charset: undefined,
			viewport: undefined,
			appleWebApp: undefined,
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
			facebook: undefined,
			pinterest: undefined,
			themeColor: undefined,
			humansTxt: undefined,
			verification: undefined,
			base: undefined,
			titleTemplate: undefined,
		});
	});

	it("extracts facebook defaults into client head config", () => {
		const options: IntegrationInput = {
			head: {
				facebook: {
					admins: ["10001", "10002"],
				},
			},
		};

		const result = extractClientHeadConfig(options);

		expect(result).toEqual({
			charset: undefined,
			viewport: undefined,
			appleWebApp: undefined,
			appLinks: undefined,
			facebook: {
				admins: ["10001", "10002"],
			},
			pinterest: undefined,
			themeColor: undefined,
			humansTxt: undefined,
			verification: undefined,
			base: undefined,
			titleTemplate: undefined,
		});
	});

	it("extracts pinterest defaults into client head config", () => {
		const options: IntegrationInput = {
			head: {
				pinterest: {
					richPin: false,
				},
			},
		};

		const result = extractClientHeadConfig(options);

		expect(result).toEqual({
			charset: undefined,
			viewport: undefined,
			appleWebApp: undefined,
			appLinks: undefined,
			facebook: undefined,
			pinterest: {
				richPin: false,
			},
			themeColor: undefined,
			humansTxt: undefined,
			verification: undefined,
			base: undefined,
			titleTemplate: undefined,
		});
	});

	it("extracts themeColor defaults into client head config", () => {
		const options: IntegrationInput = {
			head: {
				themeColor: {
					light: "#ffffff",
					dark: "#111111",
				},
			},
		};

		const result = extractClientHeadConfig(options);

		expect(result).toEqual({
			charset: undefined,
			viewport: undefined,
			appleWebApp: undefined,
			appLinks: undefined,
			facebook: undefined,
			pinterest: undefined,
			themeColor: {
				light: "#ffffff",
				dark: "#111111",
			},
			humansTxt: undefined,
			verification: undefined,
			base: undefined,
			titleTemplate: undefined,
		});
	});

	it("serializes appleWebApp defaults in virtual config module", () => {
		const options: IntegrationInput = {
			head: {
				appleWebApp: {
					startupImage: [
						new URL("https://cdn.example.com/default.png"),
						{
							url: new URL("https://cdn.example.com/landscape.png"),
							media: "(orientation: landscape)",
						},
					],
				},
			},
		};

		const result = serializedVirtualConfigModule(options);

		expect(result).toBe(
			'export default {"appleWebApp":{"startupImage":["https://cdn.example.com/default.png",{"url":"https://cdn.example.com/landscape.png","media":"(orientation: landscape)"}]}};',
		);
	});

	it("serializes verification defaults in virtual config module", () => {
		const options: IntegrationInput = {
			head: {
				verification: {
					yahoo: "yahoo-token",
				},
			},
		};

		const result = serializedVirtualConfigModule(options);

		expect(result).toBe('export default {"verification":{"yahoo":"yahoo-token"}};');
	});

	it("serializes appLinks defaults in virtual config module", () => {
		const options: IntegrationInput = {
			head: {
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

		const result = serializedVirtualConfigModule(options);

		expect(result).toBe(
			'export default {"appLinks":{"ios":{"url":"https://ios.example.com/open"},"web":{"url":"https://example.com/path","should_fallback":false}}};',
		);
	});

	it("serializes facebook defaults in virtual config module", () => {
		const options: IntegrationInput = {
			head: {
				facebook: {
					appId: "123456789",
				},
			},
		};

		const result = serializedVirtualConfigModule(options);

		expect(result).toBe('export default {"facebook":{"appId":"123456789"}};');
	});

	it("serializes pinterest defaults in virtual config module", () => {
		const options: IntegrationInput = {
			head: {
				pinterest: {
					richPin: false,
				},
			},
		};

		const result = serializedVirtualConfigModule(options);

		expect(result).toBe('export default {"pinterest":{"richPin":false}};');
	});

	it("serializes themeColor defaults in virtual config module", () => {
		const options: IntegrationInput = {
			head: {
				themeColor: {
					content: "#ffffff",
				},
			},
		};

		const result = serializedVirtualConfigModule(options);

		expect(result).toBe('export default {"themeColor":{"content":"#ffffff"}};');
	});
});
