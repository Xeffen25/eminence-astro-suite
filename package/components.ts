import _AppleItunesApp from "./components/AppleItunesApp.astro";
import _AppLinks from "./components/AppLinks.astro";
import _Archives from "./components/Archives.astro";
import _Assets from "./components/Assets.astro";
import _Author from "./components/Author.astro";
import _Base from "./components/Base.astro";
import _Bookmarks from "./components/Bookmarks.astro";
import _Canonical from "./components/Canonical.astro";
import _Charset from "./components/Charset.astro";
import _ColorScheme from "./components/ColorScheme.astro";
import _Creator from "./components/Creator.astro";
import _Description from "./components/Description.astro";
import _Facebook from "./components/Facebook.astro";
import _Generator from "./components/Generator.astro";
import _Head from "./components/Head.astro";
import _HumansTxt from "./components/HumansTxt.astro";
import _Icons from "./components/Icons.astro";
import _JsonLd from "./components/JsonLd.astro";
import _LanguageAlternates from "./components/LanguageAlternates.astro";
import _Manifest from "./components/Manifest.astro";
import _OpenGraph from "./components/OpenGraph.astro";
import _Pinterest from "./components/Pinterest.astro";
import _Publisher from "./components/Publisher.astro";
import _Robots from "./components/Robots.astro";
import _ThemeColor from "./components/ThemeColor.astro";
import _Title from "./components/Title.astro";
import _Verification from "./components/Verification.astro";
import _Viewport from "./components/Viewport.astro";

/**
 * @summary Renders an Apple iTunes Smart App Banner meta tag.
 * @description
 * Outputs an `apple-itunes-app` meta tag used by iOS Safari to display a
 * Smart App Banner linking to an App Store application.
 *
 * @example
 * <AppleItunesApp id="123456789" />
 * @example
 * <AppleItunesApp id="123456789" argument="myapp://open" />
 * @see {@link https://eminence-astro-suite.xeffen25.com/components/apple-itunes-app AppleItunesApp Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name MDN Meta name reference}
 * @see {@link https://developer.apple.com/documentation/webkit/promoting-apps-with-smart-app-banners Promoting apps with Smart App Banners}
 */
export const AppleItunesApp = _AppleItunesApp;

/**
 * @summary Renders App Links meta tags for iOS, Android, and web fallback.
 * @description
 * Outputs platform-specific App Links metadata so crawlers and clients can
 * associate a web URL with native app destinations. Supports iOS app URL and
 * App Store ID, Android package details, and web fallback controls.
 *
 * @example
 * <AppLinks ios={{ url: "myapp://open", app_store_id: "123456789" }} />
 * @example
 * <AppLinks android={{ package: "com.example.app", app_name: "Example App" }} web={{ url: "https://example.com", should_fallback: true }} />
 * @see {@link https://todo.dev/components/app-links AppLinks Component Documentation}
 * @see {@link https://developers.facebook.com/docs/applinks/web App Links Meta Tag Reference}
 * @see {@link https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html Apple Universal Links}
 */
export const AppLinks = _AppLinks;

/**
 * @summary Renders one or more `<link rel="assets">` tags.
 * @description
 * Outputs resource relationship links using `rel="assets"`. Each entry in
 * `hrefs` is rendered as its own `<link rel="assets">` tag.
 *
 * @example
 * <Assets hrefs={["https://example.com/assets"]} />
 * @example
 * <Assets hrefs={[new URL("https://cdn.example.com/assets"), "https://example.com/assets"]} />
 * @see {@link https://todo.dev/components/assets Assets Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel MDN rel attribute reference}
 */
export const Assets = _Assets;

/**
 * @summary Renders a `<meta name="author">` tag.
 * @description
 * Outputs author metadata for the current document. When `content` is
 * omitted, the component renders nothing.
 *
 * @example
 * <Author content="Jane Doe" />
 * @example
 * <Author />
 * @see {@link https://todo.dev/components/author Author Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name#author MDN meta author reference}
 */
export const Author = _Author;

/**
 * @summary Renders one or more `<link rel="bookmarks">` tags.
 * @description
 * Outputs bookmark relationship links using `rel="bookmarks"`. Each entry in
 * `hrefs` is rendered as its own `<link rel="bookmarks">` tag.
 *
 * @example
 * <Bookmarks hrefs={["https://example.com/bookmarks"]} />
 * @example
 * <Bookmarks hrefs={[new URL("https://cdn.example.com/bookmarks"), "https://example.com/bookmarks"]} />
 * @see {@link https://todo.dev/components/bookmarks Bookmarks Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel MDN rel attribute reference}
 */
export const Bookmarks = _Bookmarks;

/**
 * @summary Renders one or more `<link rel="archives">` tags.
 * @description
 * Outputs archive discovery links for pages such as yearly indexes, post
 * listings, or historical snapshots. Each entry in `hrefs` is rendered as its
 * own `<link rel="archives">` tag.
 *
 * @example
 * <Archives hrefs={["https://example.com/archive/2025"]} />
 * @example
 * <Archives hrefs={[new URL("https://example.com/archive/2024"), "https://example.com/archive/2023"]} />
 * @see {@link https://todo.dev/components/archives Archives Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel#archives MDN rel="archives" reference}
 */
export const Archives = _Archives;

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
 * @summary Renders a color scheme preference meta tag.
 * @description
 * Outputs `<meta name="color-scheme">` to declare supported page color
 * schemes for UA rendering behavior.
 *
 * @example
 * <Color content="light dark" />
 * @example
 * <Color content="dark" />
 * @see {@link https://todo.dev/components/color Color Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme MDN color-scheme reference}
 */
export const ColorScheme = _ColorScheme;

/**
 * @summary Renders one or more `<meta name="creator">` tags.
 * @description
 * Accepts an ordered list of creator values. Each entry is rendered as its
 * own `<meta name="creator">` tag.
 *
 * @example
 * <Creator content={["Acme University"]} />
 * @example
 * <Creator content={["Acme University", "Research Lab"]} />
 * @see {@link https://todo.dev/components/creator Creator Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name#creator MDN meta creator reference}
 */
export const Creator = _Creator;

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
 * @summary Renders Facebook Open Graph admin metadata tags.
 * @description
 * Outputs either a single `fb:app_id` meta tag or one or more `fb:admins`
 * meta tags depending on which prop shape is provided.
 *
 * @example
 * <Facebook appId="123456789" />
 * @example
 * <Facebook admins={["10001", "10002"]} />
 * @see {@link https://todo.dev/components/facebook Facebook Component Documentation}
 * @see {@link https://developers.facebook.com/docs/sharing/webmasters#markup Facebook Sharing metadata reference}
 */
export const Facebook = _Facebook;

/**
 * @summary Renders a `<meta name="generator">` tag from `Astro.generator`.
 * @description
 * Uses Astro's built-in generator value when `generate` is enabled. Set
 * `generate` to `false` to disable output.
 *
 * @example
 * <Generator />
 * @example
 * <Generator generate={false} />
 * @see {@link https://todo.dev/components/generator Generator Component Documentation}
 * @see {@link https://docs.astro.build/en/reference/api-reference/#astrogenerator Astro.generator reference}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/generator MDN generator reference}
 */
export const Generator = _Generator;

/**
 * @summary Renders the Pinterest rich pin opt-in meta tag.
 * @description
 * Outputs `<meta name="pinterest-rich-pin">` with `true` or `false` based on
 * `richPin`. Defaults to `true` when omitted.
 *
 * @example
 * <Pinterest richPin={true} />
 * @example
 * <Pinterest richPin={false} />
 * @see {@link https://todo.dev/components/pinterest Pinterest Component Documentation}
 * @see {@link https://developers.pinterest.com/docs/rich-pins/overview/ Pinterest Rich Pins documentation}
 */
export const Pinterest = _Pinterest;

/**
 * @summary Renders a `<meta name="publisher">` tag.
 * @description
 * Outputs publisher metadata for the current document. When `content` is
 * omitted, the component renders nothing.
 *
 * @example
 * <Publisher content="Acme Publishing" />
 * @example
 * <Publisher />
 * @see {@link https://todo.dev/components/publisher Publisher Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name#publisher MDN meta publisher reference}
 */
export const Publisher = _Publisher;

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
 * @see {@link https://todo.dev/components/robots Robots Component Documentation}
 * @see {@link https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag Google robots meta tag reference}
 */
export const Robots = _Robots;

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
 * @see {@link https://todo.dev/components/json-ld JsonLd Component Documentation}
 * @see {@link https://json-ld.org/ JSON-LD specification}
 * @see {@link https://schema.org/docs/gs.html Schema.org getting started}
 */
export const JsonLd = _JsonLd;

/**
 * @summary Renders `<link rel="alternate">` tags for language variants.
 * @description
 * Outputs alternate link tags to support language variants and regional versions. Accepts language variants as a record of language codes to URLs.
 *
 * @example
 * <LanguageAlternates languages={{ es: "https://example.com/es", fr: "https://example.com/fr", "x-default": "https://example.com" }} />
 *
 * @see {@link https://eminence-astro-suite.xeffen25.com/components/language-alternates LanguageAlternates Component Documentation}
 */
export const LanguageAlternates = _LanguageAlternates;

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
 * @see {@link https://todo.dev/components/theme-color ThemeColor Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color MDN theme-color reference}
 */
export const ThemeColor = _ThemeColor;

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
 * @summary Renders a `<link rel="canonical">` tag for the current page.
 * @description
 * Uses the provided `href` value directly when present. If omitted, it tries
 * to generate a canonical URL from `Astro.site` and `Astro.url.pathname`.
 * When `href` is `false`, the component renders nothing.
 *
 * @example
 * <Canonical href="https://example.com/docs/page" />
 * @example
 * <Canonical href={new URL("https://example.com/docs/page")} />
 * @example
 * // Derives canonical URL from Astro.site and Astro.url.pathname
 * <Canonical />
 *
 * @see {@link https://todo.dev/components/canonical Canonical Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel#canonical MDN rel="canonical" reference}
 */
export const Canonical = _Canonical;

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
 * @summary Renders `<link>` tags for favicons, mobile icons, and custom web assets.
 * @description
 * Generates and renders favicon, mobile icon, and PWA asset `<link>` tags with intelligent override handling.
 * Supports automatic asset generation during build and runtime tag injection.
 * Handles media queries for light/dark theme variants and smart SVG detection to prevent tag duplication.
 *
 * @example
 * <Icons source="/public/icon.png" />
 * @example
 * <Icons source="/public/icon.svg" customTags={[{ rel: "alternate icon", href: "/favicon.ico" }]} />
 * @example
 * <Icons source="/public/icon.png" overrides={{ png192: false, appleTouchIcon: "/custom-apple-icon.png" }} />
 * @see {@link https://todo.dev/components/icons Icons Component Documentation}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types MDN link rel documentation}
 * @see {@link https://web.dev/icons-and-browser-colors Web.dev icon guide}
 */
export const Icons = _Icons;

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
 * @see {@link https://todo.dev/components/open-graph OpenGraph Component Documentation}
 * @see {@link https://ogp.me/ Open Graph protocol}
 * @see {@link https://developers.facebook.com/docs/sharing/webmasters Open Graph markup guide}
 */
export const OpenGraph = _OpenGraph;

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
