import _Alternate from "./components/Alternate.astro";
import _Base from "./components/Base.astro";
import _Charset from "./components/Charset.astro";
import _Description from "./components/Description.astro";
import _Head from "./components/Head.astro";
import _HumansTxt from "./components/HumansTxt.astro";
import _Manifest from "./components/Manifest.astro";
import _Title from "./components/Title.astro";
import _Verification from "./components/Verification.astro";
import _Viewport from "./components/Viewport.astro";

/**
 * @summary Renders `<link rel="alternate">` tags for language variants and feed types.
 * @description
 * Outputs alternate link tags to support language variants, regional versions, and RSS/Atom feed discovery. Accepts language variants as a record of language codes to URLs, and optional feed types for RSS and Atom discovery links.
 *
 * @example
 * <Alternate languages={{ "es": "https://example.com/es", "fr": "https://example.com/fr" }} />
 * @example
 * <Alternate types={{ "application/rss+xml": "https://example.com/feed.rss", "application/atom+xml": "https://example.com/feed.atom" }} />
 * @see {@link https://todo.dev/components/alternate Alternate Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel#alternate MDN link rel attribute reference}
 */
export const Alternate = _Alternate;

/**
 * The ultimate `<head>` component for your Astro project.
 * @description
 * Renders a `<head>` element with built-in support for common SEO and metadata tags. Following Capo.js convention as much as possible, allows you to configure site wide defaults via the `head` property in your integration options, and override them on a per-page basis by passing props to the component. With best practices baked in as defaults, you can focus on customizing the essentials and let the component handle the rest.
 *
 * @example
 * <Head head={{ title: "Home" }} />
 * @example
 * <Head head={{ title: "Home", titleTemplate: "%s | My Site", charset: "iso-8859-1" }} />
 *
 * @see {@link https://todo.dev/components/Head Head Docs Source}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head MDN head element reference}
 */
export const Head = _Head;

/**
 * @summary Renders a `<title>` tag with optional template formatting.
 * @description
 * Outputs the document `<title>` tag using the provided `value`. An optional
 * `template` prop containing a `%s` placeholder is replaced with `value` at
 * render time, enabling site-wide suffix or prefix patterns.
 *
 * @example
 * <Title value="Home" template="%s | My Site" />
 * @example
 * <Title value="Home" />
 * @see {@link https://todo.dev/components/title Title Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title MDN title element reference}
 */
export const Title = _Title;

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
 * @summary Renders a `<meta name="description">` tag for SEO.
 * @description
 * Outputs the page meta description tag in your `<head>`. This tag is commonly
 * used by search engines and social media platforms to display a preview of your
 * page content. Defaults to an empty string if no content is provided.
 *
 * @example
 * <Description content="Learn how to build efficient web applications" />
 *
 * @see {@link https://todo.dev/components/description Description Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name#description MDN meta name attributes reference}
 */
export const Description = _Description;

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
 * Uses the provided `href` value directly when present. If omitted, it tries
 * to generate a URL from `Astro.site` by appending `/humans.txt`. If neither
 * source is available, the component renders nothing and logs an error.
 *
 * @example
 * <HumansTxt href="https://example.com/humans.txt" />
 * @example
 * <HumansTxt href={new URL("https://example.com/humans.txt")} />
 * @example
 * // Derives href from Astro.site by appending /humans.txt
 * <HumansTxt />
 *
 * @see {@link https://todo.dev/components/humans-txt HumansTxt Component Documentation}
 * @see {@link https://todo.dev/components/humans-txt.mdx HumansTxt Docs Source}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-link-rel-author MDN link rel="author" reference}
 * @see {@link https://humanstxt.org/ The Humans.txt Standard}
 */
export const HumansTxt = _HumansTxt;

/**
 * @summary Renders a `<link rel="manifest">` tag for web app metadata.
 * @description
 * Uses the provided `href` value directly when present. If omitted, it tries
 * to generate a URL from `Astro.site` by appending `/manifest.webmanifest`.
 * If neither source is available, the component renders nothing and logs an
 * error.
 *
 * @example
 * <Manifest href="https://example.com/manifest.webmanifest" />
 * @example
 * <Manifest href={new URL("https://example.com/manifest.webmanifest")} />
 * @example
 * // Derives href from Astro.site by appending /manifest.webmanifest
 * <Manifest />
 * @see {@link https://todo.dev/components/manifest Manifest Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/manifest MDN rel="manifest" reference}
 */
export const Manifest = _Manifest;

/**
 * @summary Renders site verification meta tags for search providers.
 * @description
 * Outputs verification `<meta>` tags for Google, Yandex, Yahoo, and custom
 * providers through `others`. Only defined values are rendered.
 *
 * @example
 * <Verification google="google-token" yandex="yandex-token" yahoo="yahoo-token" />
 * @example
 * <Verification others={[{ name: "msvalidate.01", content: "bing-token" }]} />
 * @see {@link https://todo.dev/components/verification Verification Component Documentation}
 * @see {@link https://developers.google.com/search/docs/crawling-indexing/verify-site-owner Google Search Console site verification}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta MDN meta element reference}
 */
export const Verification = _Verification;
