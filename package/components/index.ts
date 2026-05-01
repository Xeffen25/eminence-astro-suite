import _AppleItunesApp from "./AppleItunesApp.astro";
import _AppLinks from "./AppLinks.astro";
import _Base from "./Base.astro";
import _Canonical from "./Canonical.astro";
import _Charset from "./Charset.astro";
import _ColorScheme from "./ColorScheme.astro";
import _Description from "./Description.astro";
import _Extend from "./Extend.astro";
import _Generator from "./Generator.astro";
import _Head from "./Head.astro";
import _HumansTxt from "./HumansTxt.astro";
import _Icons from "./Icons.astro";
import _JsonLd from "./JsonLd.astro";
import _LanguageAlternates from "./LanguageAlternates.astro";
import _Manifest from "./Manifest.astro";
import _OpenGraph from "./OpenGraph.astro";
import _Robots from "./Robots.astro";
import _ThemeColor from "./ThemeColor.astro";
import _Title from "./Title.astro";
import _Verification from "./Verification.astro";
import _Viewport from "./Viewport.astro";

import type { ComponentProps } from "astro/types";

/**
 * @summary Renders an Apple iTunes Smart App Banner meta tag.
 * @description
 * Outputs an `apple-itunes-app` meta tag used by iOS Safari to display a Smart App Banner linking to an App Store application. Supports both direct `content` prop or building from `id` and `argument` props.
 *
 * @example
 * <AppleItunesApp id="123456789" />
 * @example
 * <AppleItunesApp id="123456789" argument="myapp://open" />
 * @example
 * <AppleItunesApp content="app-id=123456789, app-argument=myapp://open" />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/apple-itunes-app AppleItunesApp Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name MDN Meta name reference}
 * @see {@link https://developer.apple.com/documentation/webkit/promoting-apps-with-smart-app-banners Promoting apps with Smart App Banners}
 */
export const AppleItunesApp = _AppleItunesApp;
export type AppleItunesAppProps = ComponentProps<typeof AppleItunesApp>;

/**
 * @summary Renders App Links meta tags for iOS, Android, and web fallback.
 * @description
 * Outputs platform-specific App Links metadata so crawlers and clients can associate a web URL with native app destinations. Supports iOS app URL and App Store ID, Android package details, and web fallback controls.
 *
 * @example
 * <AppLinks ios={{ url: "myapp://open", app_store_id: "123456789" }} />
 * @example
 * <AppLinks android={{ package: "com.example.app", app_name: "Example App" }} web={{ url: "https://example.com", should_fallback: true }} />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/app-links AppLinks Component Documentation}
 * @see {@link https://developers.facebook.com/docs/applinks/metadata-reference/ App Links Meta Tag Reference}
 */
export const AppLinks = _AppLinks;
export type AppLinksProps = ComponentProps<typeof AppLinks>;

/**
 * @summary Renders a `<base>` tag for relative URL resolution.
 * @description
 * Outputs a `<base>` tag when either or both `href` or `target` are provided. The `href` prop sets the base URL for relative URLs, and `target` sets the default browsing context for links and forms.
 *
 * @example
 * <Base href="https://example.com" />
 * @example
 * <Base target="_blank" />
 * @example
 * <Base />
 * When no props are provided, the component uses the integration configuration if available. If no configuration is set, it renders nothing.
 * @example
 * <Base href="https://example.com" target="_blank" />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/base Base Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base MDN base element reference}
 */
export const Base = _Base;
export type BaseProps = ComponentProps<typeof Base>;

/**
 * @summary Renders a `<link rel="canonical">` tag for the current page.
 * @description
 * Uses the provided `href` value directly when present. If omitted, it tries to generate a canonical URL from `Astro.site` and `Astro.url.pathname`. When `href` is `false`, the component renders nothing.
 *
 * @example
 * <Canonical href="https://example.com/docs/page" />
 * @example
 * Derives canonical URL from Astro.site and Astro.url.pathname
 * <Canonical />
 * @example
 * <Canonical href={new URL("https://example.com/docs/page")} />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/canonical Canonical Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel#canonical MDN rel="canonical" reference}
 */
export const Canonical = _Canonical;
export type CanonicalProps = ComponentProps<typeof Canonical>;

/**
 * @summary Renders a `<meta charset>` tag for the document.
 * @description
 * Outputs the character encoding meta tag in your `<head>`. If no `charset` prop is provided, it defaults to `utf-8`.
 *
 * @example
 * <Charset charset="iso-8859-1" />
 * @example
 * <Charset />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/charset Charset Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-meta-charset MDN meta charset reference}
 */
export const Charset = _Charset;
export type CharsetProps = ComponentProps<typeof Charset>;

/**
 * @summary Renders a color scheme preference meta tag.
 * @description
 * Outputs `<meta name="color-scheme">` to declare supported page color schemes for UA rendering behavior.
 *
 * @example
 * <ColorScheme content="light dark" />
 * @example
 * <ColorScheme content="dark" />
 * @see {@link https://eminence-astro-suite.xeffen25.com/color-scheme ColorScheme Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme MDN color-scheme reference}
 */
export const ColorScheme = _ColorScheme;
export type ColorSchemeProps = ComponentProps<typeof ColorScheme>;

/**
 * @summary Renders a `<meta name="description">` tag for SEO.
 * @description
 * Outputs the page meta description tag in your `<head>`. This tag is commonly used by search engines and social media platforms to display a preview of your page content.
 *
 * @example
 * <Description content="Learn how to build efficient web applications" />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/description Description Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name#description MDN meta name attributes reference}
 */
export const Description = _Description;
export type DescriptionProps = ComponentProps<typeof Description>;

/**
 * @summary Renders free-form `<link>`, `<meta>`, and custom HTML fragments for head extension.
 * @description
 * Provides a configuration-driven way to append custom head tags. Prefer adding one-off tags directly in the `Head` slot; use this component when shared defaults are needed across many pages. The `extend.custom` value is rendered with Astro `set:html` and is not escaped.
 *
 * @example
 * <Extend link={[{ rel: "preconnect", href: "https://cdn.example.com", prefetch: true }]} />
 * @example
 * <Extend meta={[{ property: "custom:token", content: "abc123" }]} />
 * @example
 * <Extend custom="<meta name=\"custom\" content=\"1\">" />
 * @see {@link https://eminence-astro-suite.xeffen25.com/extend Extend Component Documentation}
 * @see {@link https://docs.astro.build/en/reference/directives-reference/#sethtml Astro set:html reference}
 */
export const Extend = _Extend;
export type ExtendProps = ComponentProps<typeof Extend>;

/**
 * @summary Renders a `<meta name="generator">` tag from `Astro.generator`.
 * @description
 * Uses Astro's built-in generator value when `generate` is enabled. Set `generate` to `false` to disable output.
 *
 * @example
 * <Generator />
 * @example
 * <Generator generate={false} />
 * @see {@link https://eminence-astro-suite.xeffen25.com/generator Generator Component Documentation}
 * @see {@link https://docs.astro.build/en/reference/api-reference/#astrogenerator Astro.generator reference}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/generator MDN generator reference}
 */
export const Generator = _Generator;
export type GeneratorProps = ComponentProps<typeof Generator>;

/**
 * The ultimate `<head>` component for your Astro project.
 * @description
 * Renders a `<head>` element with built-in support for common SEO and metadata tags. Following Capo.js convention as much as possible, allows you to configure site wide defaults via the `head` property in your integration options, and override them on a per-page basis by passing props to the component. With best practices baked in as defaults, you can focus on customizing the essentials and let the component handle the rest.
 *
 * For additional custom tags, it's better to just place the elements directly inside the component slot.
 *
 * The `extend` prop is best suited for configuration-driven defaults shared across multiple pages.
 *
 * `extend.custom` is rendered via Astro `set:html` and is not escaped. Only pass trusted or pre-sanitized HTML.
 *
 * @example
 * <Head title="Home" description="Welcome" />
 * @example
 * <Head title="Home" description="Welcome" extend={{ link: [{ rel: "preconnect", href: "https://cdn.example.com", prefetch: true }] }} />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/head Head Docs Source}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head MDN head element reference}
 */
export const Head = _Head;
export type HeadProps = ComponentProps<typeof Head>;

/**
 * @summary Renders a `<link rel="author">` tag pointing to `/humans.txt`.
 * @description
 * Uses the provided `href` value directly when present. If omitted, it tries
 * to generate a URL from `Astro.site` by appending `/humans.txt`. If neither
 * source is available, the component renders nothing.
 *
 * @example
 * <HumansTxt href="https://example.com/humans.txt" />
 * @example
 * <HumansTxt href={new URL("https://example.com/humans.txt")} />
 * @example
 * // Derives href from Astro.site by appending /humans.txt
 * <HumansTxt />
 * @see {@link https://eminence-astro-suite.xeffen25.com/humans-txt HumansTxt Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link MDN link element reference}
 * @see {@link https://humanstxt.org/ The Humans.txt Standard}
 */
export const HumansTxt = _HumansTxt;
export type HumansTxtProps = ComponentProps<typeof HumansTxt>;

/**
 * @summary Renders `<link>` tags for favicons, mobile icons, and custom web assets.
 * @description
 * Renders the build-time resolved icon `<link>` tags from the integration virtual module.
 * Accepts a single late-bound `icons` prop to override matching build-time tags by `href` and append new ones at runtime.
 *
 * @example
 * <Icons />
 * @example
 * <Icons icons={[{ rel: "icon", href: "/campaign.ico", type: "image/x-icon" }]} />
 * @see {@link https://eminence-astro-suite.xeffen25.com/icons Icons Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types MDN link rel documentation}
 * @see {@link https://web.dev/icons-and-browser-colors Web.dev icon guide}
 */
export const Icons = _Icons;
export type IconsProps = ComponentProps<typeof Icons>;

/**
 * @summary Renders a single JSON-LD script tag from a pre-serialized string.
 * @description
 * Outputs a `<script type="application/ld+json">` element in your `<head>`.
 * The `jsonLd` prop expects a JSON string, so schema objects can be built and
 * typed in app code (for example with `schema-dts`) before
 * `JSON.stringify(...)` is passed to this component.
 *
 * @example
 * <JsonLd jsonLd='{"@context":"https://schema.org","@type":"WebPage","name":"Home"}' />
 * @example
 * <JsonLd jsonLd={JSON.stringify(websiteSchema)} />
 * @see {@link https://eminence-astro-suite.xeffen25.com/json-ld JsonLd Component Documentation}
 * @see {@link https://json-ld.org/ JSON-LD specification}
 * @see {@link https://schema.org/docs/gs.html Schema.org getting started}
 */
export const JsonLd = _JsonLd;
export type JsonLdProps = ComponentProps<typeof JsonLd>;

/**
 * @summary Renders `<link rel="alternate">` tags for language variants.
 * @description
 * Outputs alternate link tags to support language variants and regional versions. Accepts language variants as a record of language codes to URLs.
 *
 * @example
 * <LanguageAlternates languages={{ es: "https://example.com/es", fr: "https://example.com/fr", "x-default": "https://example.com" }} />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/language-alternates LanguageAlternates Component Documentation}
 */
export const LanguageAlternates = _LanguageAlternates;
export type LanguageAlternatesProps = ComponentProps<typeof LanguageAlternates>;

/**
 * @summary Renders a `<link rel="manifest">` tag for web app metadata.
 * @description
 * Uses the provided `href` value directly when present. If omitted, it tries
 * to generate a URL from `Astro.site` by appending `/manifest.webmanifest`.
 * If neither source is available, the component renders nothing.
 *
 * @example
 * <Manifest href="https://example.com/manifest.webmanifest" />
 * @example
 * <Manifest href={new URL("https://example.com/manifest.webmanifest")} />
 * @example
 * // Derives href from Astro.site by appending /manifest.webmanifest
 * <Manifest />
 * @see {@link https://eminence-astro-suite.xeffen25.com/manifest Manifest Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/manifest MDN rel="manifest" reference}
 */
export const Manifest = _Manifest;
export type ManifestProps = ComponentProps<typeof Manifest>;

/**
 * @summary Renders Open Graph meta tags for social sharing.
 * @description
 * Outputs `og:*` meta tags following the Open Graph protocol. The `og:type` is
 * inferred from the type-driving object provided: `article` → `"article"`,
 * `book` → `"book"`, `profile` → `"profile"`, `music` → `"music.<subtype>"`,
 * and `videoType` → `"video.<subtype>"`. The separate `video` prop only emits
 * `og:video` structured media tags and does not affect `og:type`. Objects
 * without a canonical OG type (`business`, `place`, `product`) fall back to
 * `"website"` while still outputting their namespace-specific tags. When no
 * type-driving object is provided, `og:type` defaults to `"website"`.
 *
 * The `url` prop is optional and is inferred from `Astro.site` and the current
 * request path when omitted. The `locale` value is emitted as-is, so provide
 * Open Graph formatted locale values such as `en_US`.
 * The `siteName` can be set globally via the integration `head.openGraph.siteName`
 * option; the integration infers it from the Astro site hostname when absent.
 *
 * @example
 * <OpenGraph title="Home" url="https://example.com/" siteName="Example" />
 * @example
 * <OpenGraph title="My Article" url="https://example.com/posts/1" image={{ src: "/og.png", width: 1200, height: 630, alt: "Banner" }} article={{ publishedTime: "2026-01-01T00:00:00Z" }} />
 * @example
 * <OpenGraph title="Feature Film" video={{ src: "https://cdn.example.com/trailer.mp4", width: 1280, height: 720 }} videoType={{ subtype: "movie", directors: ["https://example.com/director"] }} />
 * @see {@link https://eminence-astro-suite.xeffen25.com/open-graph OpenGraph Component Documentation}
 * @see {@link https://ogp.me/ Open Graph protocol}
 * @see {@link https://developers.facebook.com/docs/sharing/webmasters Open Graph markup guide}
 */
export const OpenGraph = _OpenGraph;
export type OpenGraphProps = ComponentProps<typeof OpenGraph>;

/**
 * @summary Renders a robots directives meta tag.
 * @description
 * Supports two mutually exclusive modes: pass a raw `content` string directly,
 * or pass directive props that are serialized into a single
 * `<meta name="robots">` content string. In directive mode, undefined and
 * `false` values are omitted, `true` values render as bare directives, and
 * numeric/string values render as `directive:value`.
 *
 * @example
 * <Robots content="noindex, nofollow" />
 *
 * @example
 * <Robots noindex nofollow />
 * @example
 * <Robots noindex unavailable_after="25 Jun 2026 15:00:00 PST" max-snippet={50} />
 * @see {@link https://eminence-astro-suite.xeffen25.com/robots Robots Component Documentation}
 * @see {@link https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag Google robots meta tag reference}
 */
export const Robots = _Robots;
export type RobotsProps = ComponentProps<typeof Robots>;

/**
 * @summary Renders theme color meta tags for browser UI theming.
 * @description
 * Supports either a single `content` value for all color schemes, or a pair of
 * `light` and `dark` values for scheme-specific theming. The two modes are
 * mutually exclusive.
 *
 * @example
 * <ThemeColor content="#ffffff" />
 * @example
 * <ThemeColor light="#ffffff" dark="#111111" />
 * @see {@link https://eminence-astro-suite.xeffen25.com/theme-color ThemeColor Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color MDN theme-color reference}
 */
export const ThemeColor = _ThemeColor;
export type ThemeColorProps = ComponentProps<typeof ThemeColor>;

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
 * @see {@link https://eminence-astro-suite.xeffen25.com/title Title Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title MDN title element reference}
 */
export const Title = _Title;
export type TitleProps = ComponentProps<typeof Title>;

/**
 * @summary Renders site verification meta tags for search providers.
 * @description
 * Outputs verification `<meta>` tags for Google, Yandex, Bing, and custom
 * providers through `others`. Only defined values are rendered.
 *
 * @example
 * <Verification google="google-token" yandex="yandex-token" bing="bing-token" />
 * @example
 * <Verification others={[{ name: "p:domain_verify", content: "pinterest-token" }]} />
 * @see {@link https://eminence-astro-suite.xeffen25.com/verification Verification Component Documentation}
 * @see {@link https://developers.google.com/search/docs/crawling-indexing/verify-site-owner Google Search Console site verification}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta MDN meta element reference}
 */
export const Verification = _Verification;
export type VerificationProps = ComponentProps<typeof Verification>;

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
 * @see {@link https://eminence-astro-suite.xeffen25.com/viewport Viewport Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-meta-viewport MDN viewport meta tag reference}
 */
export const Viewport = _Viewport;
export type ViewportProps = ComponentProps<typeof Viewport>;
