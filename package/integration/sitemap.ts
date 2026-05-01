import type { SitemapOptions } from "@astrojs/sitemap";
import type { AstroIntegration } from "astro";

export type { SitemapOptions };

export const SITEMAP_MISSING_PEER_MESSAGE =
  '"@astrojs/sitemap" is not installed but sitemap is enabled. ' +
  "Install it with your package manager: npm install @astrojs/sitemap";

type SitemapLoader = () => Promise<{
  default: (options?: SitemapOptions) => AstroIntegration;
}>;

const defaultLoader: SitemapLoader = () => import("@astrojs/sitemap");

export async function createSitemapIntegration(
  options: SitemapOptions,
  loader: SitemapLoader = defaultLoader,
): Promise<AstroIntegration> {
  let mod: Awaited<ReturnType<SitemapLoader>>;

  try {
    mod = await loader();
  } catch {
    throw new Error(SITEMAP_MISSING_PEER_MESSAGE);
  }

  return mod.default(options);
}
