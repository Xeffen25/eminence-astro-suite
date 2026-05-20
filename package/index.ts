import type {
  AstroConfig,
  AstroIntegration,
  AstroIntegrationLogger,
} from "astro";
import type { IconsOptions } from "./integration/generate-icons";
import { generateIcons } from "./integration/generate-icons";
import {
  generateManifest,
  type WebManifestOptions,
} from "./integration/manifest";
import {
  generateRobotsTxt,
  type RobotsTxtOptions,
} from "./integration/robots-txt";
import {
  generateSecurityTxt,
  type SecurityTxtOptions,
} from "./integration/security-txt";
import {
  createSitemapIntegration,
  type SitemapOptions,
} from "./integration/sitemap";
import {
  RESOLVED_VIRTUAL_CONFIG_MODULE_ID,
  serializedVirtualConfigModule,
  VIRTUAL_CONFIG_MODULE_ID,
  type HeadTagsOptions,
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

export default function createIntegration(
  options: IntegrationInput = {},
): AstroIntegration {
  let config: AstroConfig;

  return {
    name: "eminence-astro-suite",
    hooks: {
      "astro:config:setup": async ({ updateConfig, logger }) => {
        if (options.sitemap !== false) {
          const sitemapIntegration = await createSitemapIntegration(
            options.sitemap ?? {},
            logger,
          );
          if (sitemapIntegration) {
            updateConfig({ integrations: [sitemapIntegration] });
          }
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
            optimizeDeps: { exclude: ["eminence-astro-suite/components"] },
            ssr: {
              optimizeDeps: { exclude: ["eminence-astro-suite/components"] },
            },
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
                "Recommendation: visit eminence-astro-suite.xeffen25.com/recommendations/why-you-should-add-a-humans-txt to learn why adding a humans.txt is useful and when to include it.",
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
