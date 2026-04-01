import type { ComponentProps } from "astro/types";
import {
	AppleWebApp,
	AppLinks,
	Base,
	Charset,
	ColorScheme,
	Facebook,
	HumansTxt,
	OpenGraph,
	Pinterest,
	Robots,
	ThemeColor,
	Title,
	Verification,
	Viewport,
} from "../components";
import type { IntegrationInput } from "../integration";

export const VIRTUAL_CONFIG_MODULE_ID = "virtual:eminence-astro-seo/config";
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
	appleWebApp?: ComponentProps<typeof AppleWebApp>;
	appLinks?: ComponentProps<typeof AppLinks>;
	facebook?: ComponentProps<typeof Facebook>;
	openGraphSiteName?: ComponentProps<typeof OpenGraph>["siteName"];
	pinterest?: ComponentProps<typeof Pinterest>;
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
	const { head } = options;

	return {
		charset: head?.charset,
		viewport: head?.viewport,
		base: head?.base,
		colorScheme: head?.colorScheme,
		titleTemplate: head?.titleTemplate,
		appleWebApp: head?.appleWebApp,
		appLinks: head?.appLinks,
		facebook: head?.facebook,
		openGraphSiteName: head?.openGraphSiteName,
		pinterest: head?.pinterest,
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
