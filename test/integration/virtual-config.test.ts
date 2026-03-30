import type { IntegrationInput } from "@package/integration";
import { extractClientHeadConfig, serializedVirtualConfigModule } from "@package/integration/virtual-config";
import { describe, expect, it } from "vitest";

describe("Integration - Virtual Config", () => {
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
