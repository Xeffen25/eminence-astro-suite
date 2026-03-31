import type { AstroConfig, AstroIntegration, AstroIntegrationLogger } from "astro";
import type { ClientHeadConfig } from "./integration/virtual-config";

import { validateHumansTxtInBuildOutput } from "./integration/humans-txt";
import type { SecurityTxtOptions } from "./integration/security-txt";
import { generateSecurityTxt } from "./integration/security-txt";
import {
	RESOLVED_VIRTUAL_CONFIG_MODULE_ID,
	serializedVirtualConfigModule,
	VIRTUAL_CONFIG_MODULE_ID,
} from "./integration/virtual-config";

export type IntegrationInput = {
	head?: ClientHeadConfig;
	securityTxt?: SecurityTxtOptions | false;
};

export type IntegrationRuntimeContext = {
	config: AstroConfig;
	outDir: URL;
	options: IntegrationInput;
	logger: AstroIntegrationLogger;
};

export default function createIntegration(options: IntegrationInput = {}): AstroIntegration {
	let config: AstroConfig | undefined;

	return {
		name: "eminence-astro-seo",
		hooks: {
			"astro:config:setup": ({ updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [
							{
								name: "eminence-astro-seo-virtual-config",
								resolveId(id) {
									if (id === VIRTUAL_CONFIG_MODULE_ID) {
										return RESOLVED_VIRTUAL_CONFIG_MODULE_ID;
									}

									return undefined;
								},
								load(id) {
									if (id === RESOLVED_VIRTUAL_CONFIG_MODULE_ID) {
										return serializedVirtualConfigModule(options);
									}

									return undefined;
								},
							},
						],
					},
				});
			},
			"astro:config:done": ({ config: cfg }) => {
				config = cfg;
			},
			"astro:build:done": async ({ dir, logger }) => {
				if (!config) {
					return;
				}

				await generateSecurityTxt({ config, outDir: dir, options, logger });
				await validateHumansTxtInBuildOutput({ config, outDir: dir, options, logger });
			},
		},
	};
}
