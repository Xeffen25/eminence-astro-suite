import type {
  AstroConfig,
  AstroIntegration,
  AstroIntegrationLogger,
} from "astro";
import type { IconsOptions } from "./generate-icons";
import { generateIcons } from "./generate-icons";
import { generateManifest, type WebManifestOptions } from "./manifest";
import { generateRobotsTxt, type RobotsTxtOptions } from "./robots-txt";
import { generateSecurityTxt, type SecurityTxtOptions } from "./security-txt";
import { createSitemapIntegration, type SitemapOptions } from "./sitemap";
import {
  RESOLVED_VIRTUAL_CONFIG_MODULE_ID,
  serializedVirtualConfigModule,
  VIRTUAL_CONFIG_MODULE_ID,
  type HeadTagsOptions,
} from "./virtual-config";

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

export default function createIntegration(
  options: IntegrationInput = {},
): AstroIntegration {
  let config: AstroConfig;

  return {
    name: "eminence-astro-suite",
    hooks: {
      "astro:config:setup": async ({ updateConfig }) => {
        if (options.sitemap !== false) {
          const sitemapIntegration = await createSitemapIntegration(
            options.sitemap ?? {},
          );
          updateConfig({ integrations: [sitemapIntegration] });
        }

        updateConfig({
          vite: {
            plugins: [
              {
                name: "eminence-astro-suite-virtual-config",
                resolveId(id) {
                  return id === VIRTUAL_CONFIG_MODULE_ID
                    ? RESOLVED_VIRTUAL_CONFIG_MODULE_ID
                    : undefined;
                },
                load(id) {
                  return id === RESOLVED_VIRTUAL_CONFIG_MODULE_ID
                    ? serializedVirtualConfigModule(options, config.site)
                    : undefined;
                },
              },
            ],
          },
        });
      },
      "astro:config:done": ({ config: cfg }) => {
        config = cfg;
      },
      "astro:build:done": async ({ dir, logger, assets }) => {
        try {
          if (options.icons !== false)
            await generateIcons({ config, dir, options, logger });
          if (options.manifest !== false)
            await generateManifest({ config, dir, options, logger });
          if (options.robotsTxt !== false)
            await generateRobotsTxt({ config, dir, options, logger });
          if (options.securityTxt !== false)
            await generateSecurityTxt({ config, dir, options, logger });
          if (options.headTags?.humansTxt === undefined) {
            if (!assets.get("/humans.txt"))
              logger.warn(
                "Recommendation: visit eminence-astro-suite.xeffen25.com/guides/humans-txt to learn how to create a humans.txt for your Astro site and why you should do it.",
              );
            else
              logger.warn(
                "Recommendation: humans.txt was found. Set headTags.humansTxt to true to generate the HumansTxt tag, or set it to false to suppress this warning.",
              );
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          logger.error(`The integration encountered an error: ${message}`);
          throw error;
        }
      },
    },
  };
}
