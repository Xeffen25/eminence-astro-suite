import type {
  AstroConfig,
  AstroIntegration,
  AstroIntegrationLogger,
} from "astro";
import type { HeadTagsOptions } from "./virtual-config";

import type { IconsOptions } from "./generate-icons";
import {
  generateIcons,
  resolveHeadIconTagsFromIconsOptions,
  type IconTag,
} from "./generate-icons";
import { validateHumansTxtInBuildOutput } from "./humans-txt";
import type { WebManifestOptions } from "./manifest";
import { generateManifest } from "./manifest";
import type { RobotsTxtOptions } from "./robots-txt";
import { generateRobotsTxt } from "./robots-txt";
import type { SecurityTxtOptions } from "./security-txt";
import { generateSecurityTxt } from "./security-txt";
import type { SitemapOptions } from "./sitemap";
import { createSitemapIntegration } from "./sitemap";
import {
  RESOLVED_VIRTUAL_CONFIG_MODULE_ID,
  serializedVirtualConfigModule,
  VIRTUAL_CONFIG_MODULE_ID,
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
  let resolvedHeadIconTags: IconTag[] = resolveHeadIconTagsFromIconsOptions(
    options.icons,
  );

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
                  if (id === VIRTUAL_CONFIG_MODULE_ID) {
                    return RESOLVED_VIRTUAL_CONFIG_MODULE_ID;
                  }

                  return undefined;
                },
                async buildStart() {
                  resolvedHeadIconTags = resolveHeadIconTagsFromIconsOptions(
                    options.icons,
                  );
                },
                load(id) {
                  if (id === RESOLVED_VIRTUAL_CONFIG_MODULE_ID) {
                    return serializedVirtualConfigModule(
                      options,
                      resolvedHeadIconTags,
                    );
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
          if (options.icons !== false)
            await generateIcons({ config, dir, options, logger });
          if (options.manifest !== false)
            await generateManifest({ config, dir, options, logger });
          if (options.robotsTxt !== false)
            await generateRobotsTxt({ config, dir, options, logger });
          if (options.securityTxt !== false)
            await generateSecurityTxt({ config, dir, options, logger });
          if (options.headTags?.humansTxt !== false)
            await validateHumansTxtInBuildOutput({
              config,
              dir,
              options,
              logger,
            });
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
