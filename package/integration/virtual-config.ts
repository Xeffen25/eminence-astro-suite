import type { ComponentProps } from "astro/types";
import type { IntegrationInput } from ".";
import {
  AppleItunesApp,
  AppLinks,
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
import {
  resolveHeadIconTagsFromIconsOptions,
  type IconTag,
} from "./generate-icons";

export const VIRTUAL_CONFIG_MODULE_ID =
  "virtual:eminence-astro-suite/head-tags";
export const RESOLVED_VIRTUAL_CONFIG_MODULE_ID = `\0${VIRTUAL_CONFIG_MODULE_ID}`;

/**
 * The user-facing head tag options accepted by the `head` field in `IntegrationInput`.
 * All fields are optional — users only need to specify what they want to override.
 * This type mirrors the prop surface of the individual tag components.
 */
export type HeadTagsOptions = {
  appleItunesApp?: ComponentProps<typeof AppleItunesApp>;
  appLinks?: ComponentProps<typeof AppLinks>;
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
};

const DEFAULT_HEAD_TAGS_CONFIG: Pick<
  ResolvedHeadTagsConfig,
  | "charset"
  | "viewport"
  | "titleTemplate"
  | "generator"
  | "icons"
  | "manifest"
  | "humansTxt"
> = {
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",
  titleTemplate: "%s",
  generator: true,
  icons: [],
  manifest: false,
  humansTxt: false,
};

const mergeIconTagsByHref = (
  base: IconTag[],
  overrides: IconTag[] = [],
): IconTag[] => {
  const iconTagsByHref = new Map<string, IconTag>();

  for (const iconTag of base) {
    iconTagsByHref.set(iconTag.href, iconTag);
  }

  for (const iconTag of overrides) {
    iconTagsByHref.set(iconTag.href, iconTag);
  }

  return Array.from(iconTagsByHref.values());
};

/**
 * Extracts the client-safe tag config from user input and applies defaults.
 * The result is what gets serialized into the virtual module — it is a strict
 * allowlist; server-only build options are never included.
 */
export const extractHeadTagsConfig = (
  options: IntegrationInput,
  resolvedIcons: IconTag[] = resolveHeadIconTagsFromIconsOptions(options.icons),
): ResolvedHeadTagsConfig => {
  const { headTags } = options;
  const mergedIcons = mergeIconTagsByHref(resolvedIcons, headTags?.icons);

  return {
    appleItunesApp: headTags?.appleItunesApp,
    appLinks: headTags?.appLinks,
    base: headTags?.base,
    charset: headTags?.charset ?? DEFAULT_HEAD_TAGS_CONFIG.charset,
    colorScheme: headTags?.colorScheme,
    extend: headTags?.extend,
    generator: headTags?.generator ?? DEFAULT_HEAD_TAGS_CONFIG.generator,
    humansTxt: headTags?.humansTxt ?? DEFAULT_HEAD_TAGS_CONFIG.humansTxt,
    icons: mergedIcons,
    manifest: headTags?.manifest ?? DEFAULT_HEAD_TAGS_CONFIG.manifest,
    openGraphSiteName: headTags?.openGraphSiteName,
    robots: headTags?.robots,
    themeColor: headTags?.themeColor,
    titleTemplate:
      headTags?.titleTemplate ?? DEFAULT_HEAD_TAGS_CONFIG.titleTemplate,
    verification: headTags?.verification,
    viewport: headTags?.viewport ?? DEFAULT_HEAD_TAGS_CONFIG.viewport,
  };
};

/**
 * Transforms the filtered configuration into a string of JavaScript code.
 * This string becomes the "source code" for the virtual module.
 */
export const serializedVirtualConfigModule = (
  options: IntegrationInput,
  resolvedIcons?: IconTag[],
): string => {
  const tagConfig = extractHeadTagsConfig(options, resolvedIcons);

  // Converts the JS object into a JSON string and wraps it in a standard export
  return `export default ${JSON.stringify(tagConfig)};`;
};
