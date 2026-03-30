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
});
