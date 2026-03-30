import _Head from "./components/Head.astro";
import _HumansTxt from "./components/HumansTxt.astro";

export const Head = _Head;

/**
 * @summary Renders a `<link rel="author">` tag pointing to `/humans.txt`.
 * @description
 * The URL is built from the `domain` prop. If omitted, it falls back to
 * `Astro.site` from your config. If neither is available, the component
 * renders nothing.
 *
 * @example
 * <HumansTxt domain="https://example.com" />
 * @example
 * <HumansTxt domain={new URL("https://example.com")} />
 * @example
 * // Uses Astro.site from astro.config.mjs
 * <HumansTxt />
 * @see {@link https://todo.dev/components/humans-txt HumansTxt Component Documentation}
 * @see {@link https://humanstxt.org/ The Humans.txt Standard}
 */
export const HumansTxt = _HumansTxt;
