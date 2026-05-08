import type { SitemapOptions } from "@astrojs/sitemap";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import { createRequire } from "module";
import { fileURLToPath } from "url";

export type { SitemapOptions };

export const SITEMAP_MISSING_PEER_MESSAGE =
  '"@astrojs/sitemap" is not installed but sitemap is enabled. ' +
  "Install it with: pnpm install @astrojs/sitemap";

type SitemapLoader = () => Promise<{
  default: (options?: SitemapOptions) => AstroIntegration;
}>;
const require = createRequire(fileURLToPath(import.meta.url));

const defaultLoader: SitemapLoader = () => {
  const mod = require("@astrojs/sitemap");
  return Promise.resolve(mod);
};

export async function createSitemapIntegration(
  options: SitemapOptions,
  logger: AstroIntegrationLogger,
  loader: SitemapLoader = defaultLoader,
): Promise<AstroIntegration | false> {
  let mod: Awaited<ReturnType<SitemapLoader>>;

  try {
    mod = await loader();
  } catch {
    logger.error(SITEMAP_MISSING_PEER_MESSAGE);
    return false;
  }
  return mod.default(options);
}
