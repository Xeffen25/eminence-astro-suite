import _Base from "./components/Base.astro";
import _Charset from "./components/Charset.astro";
import _Head from "./components/Head.astro";
import _HumansTxt from "./components/HumansTxt.astro";
import _Viewport from "./components/Viewport.astro";

/**
 * The ultimate `<head>` component for your Astro project.
 * @description
 * Renders a `<head>` element with built-in support for common SEO and metadata tags. Following Capo.js convention as much as possible, allows you to configure site wide defaults via the `head` property in your integration options, and override them on a per-page basis by passing props to the component. With best practices baked in as defaults, you can focus on customizing the essentials and let the component handle the rest.
 *
 * @example
 * <Head head={{ charset: "iso-8859-1", viewport: false, humansTxt: false }} />
 *
 * @see {@link https://todo.dev/components/Head Head Docs Source}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head MDN head element reference}
 */
export const Head = _Head;

/**
 * @summary Renders a `<meta charset>` tag for the document.
 * @description
 * Outputs the character encoding meta tag in your `<head>`. If no `charset`
 * prop is provided, it defaults to `utf-8`.
 *
 * @example
 * <Charset charset="iso-8859-1" />
 * @example
 * <Charset />
 * @see {@link https://todo.dev/components/Charset Charset Docs Source}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-meta-charset MDN meta charset reference}
 */
export const Charset = _Charset;

/**
 * @summary Renders a responsive viewport meta tag.
 * @description
 * Outputs the `<meta name="viewport">` tag in your `<head>`. If no `content`
 * prop is provided, it defaults to `width=device-width, initial-scale=1`.
 *
 * @example
 * <Viewport content="width=device-width, initial-scale=1" />
 * @example
 * <Viewport />
 *
 * @see {@link https://todo.dev/components/Viewport Viewport Docs Source}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-meta-viewport MDN viewport meta tag reference}
 */
export const Viewport = _Viewport;

/**
 * @summary Renders a `<base>` tag for relative URL resolution.
 * @description
 * Outputs a `<base>` tag when `href` is provided. The optional `target`
 * prop sets the default browsing context for links and forms.
 *
 * @example
 * <Base href="https://example.com" />
 * @example
 * <Base href="https://example.com" target="_blank" />
 *
 * @see {@link https://todo.dev/components/Base Base Docs Source}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base MDN base element reference}
 */
export const Base = _Base;

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
 *
 * @see {@link https://todo.dev/components/humans-txt.mdx HumansTxt Docs Source}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-link-rel-author MDN link rel="author" reference}
 * @see {@link https://humanstxt.org/ The Humans.txt Standard}
 */
export const HumansTxt = _HumansTxt;
