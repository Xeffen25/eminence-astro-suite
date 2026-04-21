import type { ComponentProps } from "astro/types";
import {
	AppleItunesApp,
	AppLinks,
	Base,
	Charset,
	ColorScheme,
	Generator,
	HumansTxt,
	OpenGraph,
	Robots,
	ThemeColor,
	Title,
	Verification,
	Viewport,
} from "../components";
import type { IntegrationInput } from "../integration";
import type { IconsOptions } from "./generate-icons";

export const VIRTUAL_CONFIG_MODULE_ID = "virtual:eminence-astro-suite/config";
export const RESOLVED_VIRTUAL_CONFIG_MODULE_ID = `\0${VIRTUAL_CONFIG_MODULE_ID}`;

/**
 * Represents the subset of settings that need to be available
 * to the browser/frontend components in the HTML <head>.
 */
export type ClientHeadConfig = {
	charset?: ComponentProps<typeof Charset>["charset"];
	viewport?: ComponentProps<typeof Viewport>["content"];
	base?: ComponentProps<typeof Base>;
	colorScheme?: ComponentProps<typeof ColorScheme>["content"];
	titleTemplate?: ComponentProps<typeof Title>["template"];
	appleItunesApp?: ComponentProps<typeof AppleItunesApp>;
	appLinks?: ComponentProps<typeof AppLinks>;
	generator?: ComponentProps<typeof Generator>["generate"];
	icons?: IconsOptions | false;
	openGraphSiteName?: ComponentProps<typeof OpenGraph>["siteName"];
	robots?: ComponentProps<typeof Robots>;
	themeColor?: ComponentProps<typeof ThemeColor>;
	humansTxt?: ComponentProps<typeof HumansTxt>["href"] | boolean;
	verification?: ComponentProps<typeof Verification>;
};

/**
 * Extracts only the options relevant to the HTML <head> from the full user input.
 * This prevents leaking server-only or build-only settings into the client bundle.
 */
export const extractClientHeadConfig = (options: IntegrationInput): ClientHeadConfig => {
	const { head, icons } = options;

	return {
		charset: head?.charset,
		viewport: head?.viewport,
		base: head?.base,
		colorScheme: head?.colorScheme,
		titleTemplate: head?.titleTemplate,
		appleItunesApp: head?.appleItunesApp,
		appLinks: head?.appLinks,
		generator: head?.generator,
		icons,
		openGraphSiteName: head?.openGraphSiteName,
		robots: head?.robots,
		themeColor: head?.themeColor,
		humansTxt: head?.humansTxt,
		verification: head?.verification,
	};
};

/**
 * Transforms the filtered configuration into a string of JavaScript code.
 * This string becomes the "source code" for the virtual module.
 */
export const serializedVirtualConfigModule = (options: IntegrationInput): string => {
	const clientConfig = extractClientHeadConfig(options);

	// Converts the JS object into a JSON string and wraps it in a standard export
	return `export default ${JSON.stringify(clientConfig)};`;
};
