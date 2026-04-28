import type { AstroConfig, AstroIntegration, AstroIntegrationLogger } from "astro";
import type { HeadTagsOptions } from "./integration/virtual-config";

import type { IconsOptions } from "./integration/generate-icons";
import { generateIcons } from "./integration/generate-icons";
import { validateHumansTxtInBuildOutput } from "./integration/humans-txt";
import type { WebManifestOptions } from "./integration/manifest";
import { generateManifest } from "./integration/manifest";
import type { RobotsTxtOptions } from "./integration/robots-txt";
import { generateRobotsTxt } from "./integration/robots-txt";
import type { SecurityTxtOptions } from "./integration/security-txt";
import { generateSecurityTxt } from "./integration/security-txt";
import type { SitemapOptions } from "./integration/sitemap";
import { createSitemapIntegration } from "./integration/sitemap";
import {
	RESOLVED_VIRTUAL_CONFIG_MODULE_ID,
	serializedVirtualConfigModule,
	VIRTUAL_CONFIG_MODULE_ID,
} from "./integration/virtual-config";

export type IntegrationInput = {
	headTags?: HeadTagsOptions;
	icons?: IconsOptions | false;
	manifest?: WebManifestOptions | false;
	robotsTxt?: RobotsTxtOptions | false;
	securityTxt?: SecurityTxtOptions | false;
	sitemap?: SitemapOptions | false;
};

export type IntegrationRuntimeContext = {
	config: AstroConfig;
	dir: URL;
	options: IntegrationInput;
	logger: AstroIntegrationLogger;
};

export default function createIntegration(options: IntegrationInput = {}): AstroIntegration {
	let config: AstroConfig;

	return {
		name: "eminence-astro-suite",
		hooks: {
			"astro:config:setup": async ({ updateConfig }) => {
				if (options.sitemap !== false) {
					const sitemapIntegration = await createSitemapIntegration(options.sitemap ?? {});
					updateConfig({ integrations: [sitemapIntegration] });
				}

				updateConfig({
					vite: {
						plugins: [
							{
								name: "eminence-astro-suite-virtual-config",
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
				try {
					if (options.icons !== false) await generateIcons({ config, dir, options, logger });
					if (options.manifest !== false) await generateManifest({ config, dir, options, logger });
					if (options.robotsTxt !== false) await generateRobotsTxt({ config, dir, options, logger });
					if (options.securityTxt !== false) await generateSecurityTxt({ config, dir, options, logger });
					if (options.headTags?.humansTxt !== false)
						await validateHumansTxtInBuildOutput({ config, dir, options, logger });
				} catch (error) {
					const message = error instanceof Error ? error.message : String(error);
					logger.error(`The integration encountered an error: ${message}`);
					throw error;
				}
			},
		},
	};
}
