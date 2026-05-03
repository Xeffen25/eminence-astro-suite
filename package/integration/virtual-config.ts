import type { ComponentProps } from "astro/types";
import type { IntegrationInput } from ".";
import {
  AppleItunesApp,
  Base,
  Charset,
  ColorScheme,
  Extend,
  Generator,
  HumansTxt,
  Manifest,
  OpenGraph,
  Robots,
  ThemeColor,
  Title,
  Verification,
  Viewport,
} from "../components";
import { resolveIconsOptions, type IconTag } from "./generate-icons";

export const VIRTUAL_CONFIG_MODULE_ID =
  "virtual:eminence-astro-suite/head-tags";
export const RESOLVED_VIRTUAL_CONFIG_MODULE_ID = `\0${VIRTUAL_CONFIG_MODULE_ID}`;
const HUMANS_TXT_PATH = "/humans.txt";
const MANIFEST_PATH = "/manifest.webmanifest";

/**
 * The user-facing head tag options accepted by the `head` field in `IntegrationInput`.
 * All fields are optional — users only need to specify what they want to override.
 * This type mirrors the prop surface of the individual tag components.
 */
export type HeadTagsOptions = {
  appleItunesApp?: ComponentProps<typeof AppleItunesApp>;
  base?: ComponentProps<typeof Base>;
  charset?: ComponentProps<typeof Charset>["charset"];
  colorScheme?: ComponentProps<typeof ColorScheme>["content"];
  extend?: ComponentProps<typeof Extend>;
  generator?: ComponentProps<typeof Generator>["generate"];
  humansTxt?: ComponentProps<typeof HumansTxt>["href"] | boolean;
  icons?: IconTag[];
  manifest?: ComponentProps<typeof Manifest>["href"] | boolean;
  openGraphSiteName?: ComponentProps<typeof OpenGraph>["siteName"];
  robots?: ComponentProps<typeof Robots>;
  themeColor?: ComponentProps<typeof ThemeColor>;
  titleTemplate?: ComponentProps<typeof Title>["template"];
  verification?: ComponentProps<typeof Verification>;
  viewport?: ComponentProps<typeof Viewport>["content"];
};

type DefaultedHeadTagsKeys =
  | "charset"
  | "viewport"
  | "titleTemplate"
  | "generator"
  | "manifest"
  | "humansTxt";

/**
 * The resolved shape of the `virtual:eminence-astro-suite/head-tags` virtual module.
 * Differs from `TagInput` in two ways:
 *  1. Fields with known defaults are required and non-nullable — they are always
 *     present in the module, even when the user did not configure them.
 *  2. Only client-safe fields are included. Server-only build options (robotsTxt,
 *     securityTxt, sitemap, etc.) are never serialized into the virtual module.
 */
export type ResolvedHeadTagsConfig = Omit<
  HeadTagsOptions,
  DefaultedHeadTagsKeys
> & {
  [K in DefaultedHeadTagsKeys]-?: NonNullable<HeadTagsOptions[K]>;
} & {
  icons: IconTag[];
  humansTxt: ComponentProps<typeof HumansTxt>["href"];
  manifest: ComponentProps<typeof Manifest>["href"];
};

const resolveDefaultHref = (path: string, site?: string): string => {
  if (!site) {
    return path;
  }

  try {
    return new URL(path, site).toString();
  } catch {
    return path;
  }
};

const resolveHumansTxtHref = (
  humansTxt: HeadTagsOptions["humansTxt"],
  site?: string,
): ComponentProps<typeof HumansTxt>["href"] => {
  if (humansTxt === undefined || humansTxt === false) {
    return undefined;
  }

  if (humansTxt instanceof URL) {
    return humansTxt.toString();
  }

  if (typeof humansTxt === "string") {
    return humansTxt;
  }

  return resolveDefaultHref(HUMANS_TXT_PATH, site);
};

const resolveManifestHref = (
  manifest: HeadTagsOptions["manifest"],
  integrationManifest: IntegrationInput["manifest"],
  site?: string,
): ComponentProps<typeof Manifest>["href"] => {
  if (manifest === false) {
    return undefined;
  }

  if (manifest instanceof URL) {
    return manifest.toString();
  }

  if (typeof manifest === "string") {
    return manifest;
  }

  if (
    manifest === true ||
    (integrationManifest !== undefined && integrationManifest !== false)
  ) {
    return resolveDefaultHref(MANIFEST_PATH, site);
  }

  return undefined;
};

const resolveIcons = (
  icons: HeadTagsOptions["icons"],
  integrationIcons: IntegrationInput["icons"],
): IconTag[] => {
  const iconTagsByHref = new Map<string, IconTag>();

  for (const iconTag of resolveIconsOptions(integrationIcons).tags) {
    iconTagsByHref.set(iconTag.href, iconTag);
  }

  for (const iconTag of icons ?? []) {
    iconTagsByHref.set(iconTag.href, iconTag);
  }

  return Array.from(iconTagsByHref.values());
};

/**
 * Transforms the filtered configuration into a string of JavaScript code.
 * This string becomes the "source code" for the virtual module.
 */
export const serializedVirtualConfigModule = (
  options: IntegrationInput,
  site: string | undefined,
): string => {
  const { headTags } = options;
  const tagConfig = {
    appleItunesApp: headTags?.appleItunesApp,
    base: headTags?.base,
    charset: headTags?.charset ?? "utf-8",
    colorScheme: headTags?.colorScheme,
    extend: headTags?.extend,
    generator: headTags?.generator ?? true,
    humansTxt: resolveHumansTxtHref(headTags?.humansTxt, site),
    icons: resolveIcons(headTags?.icons, options.icons),
    manifest: resolveManifestHref(headTags?.manifest, options.manifest, site),
    openGraphSiteName: headTags?.openGraphSiteName,
    robots: headTags?.robots,
    themeColor: headTags?.themeColor,
    titleTemplate: headTags?.titleTemplate ?? "%s",
    verification: headTags?.verification,
    viewport: headTags?.viewport ?? "width=device-width, initial-scale=1",
  };

  // Converts the JS object into a JSON string and wraps it in a standard export
  return `export default ${JSON.stringify(tagConfig)};`;
};
