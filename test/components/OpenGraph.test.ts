import { OpenGraph } from "@package/components";
import { experimental_AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";

describe("Component OpenGraph", () => {
	let container: experimental_AstroContainer;

	beforeEach(async () => {
		container = await experimental_AstroContainer.create();
	});

	// ── Core tags ────────────────────────────────────────────────────────────

	it("renders og:type=website with no type-driving object", async () => {
		const result = await container.renderToString(OpenGraph, { props: {} });

		expect(result).toBe('<meta property="og:type" content="website">');
	});

	it("renders core tags when title, url, description, and siteName are provided", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				title: "Home",
				url: "https://example.com/",
				description: "Welcome to Example",
				siteName: "Example",
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:title" content="Home"><meta property="og:url" content="https://example.com/"><meta property="og:description" content="Welcome to Example"><meta property="og:site_name" content="Example">',
		);
	});

	it("accepts a URL instance for url", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: { url: new URL("https://example.com/page") },
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:url" content="https://example.com/page">',
		);
	});

	// ── Locale ───────────────────────────────────────────────────────────────

	it("renders og:locale when locale is provided", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: { locale: "en_US" },
		});

		expect(result).toBe('<meta property="og:type" content="website"><meta property="og:locale" content="en_US">');
	});

	it("renders og:locale:alternate tags for an array of locales", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: { localeAlternate: ["fr_FR", "de_DE"] },
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:locale:alternate" content="fr_FR"><meta property="og:locale:alternate" content="de_DE">',
		);
	});

	it("renders a single og:locale:alternate when one locale is provided in the array", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: { localeAlternate: ["fr_FR"] },
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:locale:alternate" content="fr_FR">',
		);
	});

	// ── Image ────────────────────────────────────────────────────────────────

	it("renders og:image tags with all fields", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				image: {
					src: "https://example.com/og.png",
					width: 1200,
					height: 630,
					alt: "Banner",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:image" content="https://example.com/og.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Banner">',
		);
	});

	it("infers og:image:type from the file extension", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: { image: { src: "/images/banner.webp" } },
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:image" content="/images/banner.webp"><meta property="og:image:type" content="image/webp">',
		);
	});

	it("renders og:image from imported ImageMetadata with inferred width, height, and type", async () => {
		const imageMetadata = { src: "/_astro/og.abc123.png", width: 1200, height: 630, format: "png" };
		const result = await container.renderToString(OpenGraph, {
			props: { image: { src: imageMetadata } },
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:image" content="/_astro/og.abc123.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
		);
	});

	it("overrides ImageMetadata dimensions with explicit width and height", async () => {
		const imageMetadata = { src: "/_astro/og.abc123.png", width: 800, height: 400, format: "png" };
		const result = await container.renderToString(OpenGraph, {
			props: { image: { src: imageMetadata, width: 1200, height: 630 } },
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:image" content="/_astro/og.abc123.png"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
		);
	});

	it("renders og:image:secure_url when secureUrl is provided", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				image: {
					src: "http://cdn.example.com/og.png",
					secureUrl: "https://cdn.example.com/og.png",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:image" content="http://cdn.example.com/og.png"><meta property="og:image:secure_url" content="https://cdn.example.com/og.png"><meta property="og:image:type" content="image/png">',
		);
	});

	// ── Audio ─────────────────────────────────────────────────────────────────

	it("renders og:audio tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: { audio: { src: "https://example.com/audio.mp3" } },
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:audio" content="https://example.com/audio.mp3"><meta property="og:audio:type" content="audio/mpeg">',
		);
	});

	it("renders og:audio:secure_url and explicit type when provided", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				audio: {
					src: "http://example.com/sound.ogg",
					secureUrl: "https://example.com/sound.ogg",
					type: "audio/ogg",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:audio" content="http://example.com/sound.ogg"><meta property="og:audio:secure_url" content="https://example.com/sound.ogg"><meta property="og:audio:type" content="audio/ogg">',
		);
	});

	// ── og:type = article ─────────────────────────────────────────────────────

	it("infers og:type=article and renders article tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				title: "My Post",
				article: {
					publishedTime: "2026-01-01T00:00:00Z",
					authors: ["https://example.com/author"],
					section: "Technology",
					tags: ["astro", "seo"],
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="article"><meta property="og:title" content="My Post"><meta property="article:published_time" content="2026-01-01T00:00:00Z"><meta property="article:author" content="https://example.com/author"><meta property="article:section" content="Technology"><meta property="article:tag" content="astro"><meta property="article:tag" content="seo">',
		);
	});

	it("renders article:modified_time and article:expiration_time", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				article: {
					modifiedTime: "2026-02-01T00:00:00Z",
					expirationTime: "2027-01-01T00:00:00Z",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="article"><meta property="article:modified_time" content="2026-02-01T00:00:00Z"><meta property="article:expiration_time" content="2027-01-01T00:00:00Z">',
		);
	});

	// ── og:type = book ────────────────────────────────────────────────────────

	it("infers og:type=book and renders book tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				book: {
					isbn: "978-3-16-148410-0",
					releaseDate: "2026-01-01T00:00:00Z",
					authors: "https://example.com/author",
					tags: "fiction",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="book"><meta property="book:author" content="https://example.com/author"><meta property="book:isbn" content="978-3-16-148410-0"><meta property="book:release_date" content="2026-01-01T00:00:00Z"><meta property="book:tag" content="fiction">',
		);
	});

	// ── og:type = profile ─────────────────────────────────────────────────────

	it("infers og:type=profile and renders profile tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				profile: {
					firstName: "Jane",
					lastName: "Doe",
					username: "janedoe",
					gender: "female",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="profile"><meta property="profile:first_name" content="Jane"><meta property="profile:last_name" content="Doe"><meta property="profile:username" content="janedoe"><meta property="profile:gender" content="female">',
		);
	});

	// ── og:type = music.* ─────────────────────────────────────────────────────

	it("infers og:type=music.song and renders music tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				music: {
					subtype: "song",
					duration: 214,
					musician: "https://example.com/artist",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="music.song"><meta property="music:duration" content="214"><meta property="music:musician" content="https://example.com/artist">',
		);
	});

	it("infers og:type=music.album and renders album tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				music: {
					subtype: "album",
					musician: ["https://example.com/artist1", "https://example.com/artist2"],
					releaseDate: "2026-01-01",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="music.album"><meta property="music:musician" content="https://example.com/artist1"><meta property="music:musician" content="https://example.com/artist2"><meta property="music:release_date" content="2026-01-01">',
		);
	});

	it("infers og:type=music.playlist and renders creator tag", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				music: {
					subtype: "playlist",
					song: "https://example.com/song",
					creator: "https://example.com/user",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="music.playlist"><meta property="music:song" content="https://example.com/song"><meta property="music:creator" content="https://example.com/user">',
		);
	});

	it("infers og:type=music.radio_station and renders creator tag", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				music: {
					subtype: "radio_station",
					creator: "https://example.com/station",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="music.radio_station"><meta property="music:creator" content="https://example.com/station">',
		);
	});

	// ── og:type = video.* ─────────────────────────────────────────────────────

	it("infers og:type=video.movie and renders video type tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				videoType: {
					subtype: "movie",
					directors: ["https://example.com/director"],
					duration: 6900,
					tags: ["action", "drama"],
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="video.movie"><meta property="video:director" content="https://example.com/director"><meta property="video:duration" content="6900"><meta property="video:tag" content="action"><meta property="video:tag" content="drama">',
		);
	});

	it("infers og:type=video.episode and renders series tag", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				videoType: {
					subtype: "episode",
					series: "https://example.com/show",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="video.episode"><meta property="video:series" content="https://example.com/show">',
		);
	});

	it("renders og:video media tags alongside video page type tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				video: {
					src: "https://example.com/movie.mp4",
					width: 1280,
					height: 720,
				},
				videoType: {
					subtype: "movie",
					actors: [{ name: "https://example.com/actor", role: "Lead" }],
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="video.movie"><meta property="og:video" content="https://example.com/movie.mp4"><meta property="og:video:type" content="video/mp4"><meta property="og:video:width" content="1280"><meta property="og:video:height" content="720"><meta property="video:actor" content="https://example.com/actor"><meta property="video:actor:role" content="Lead">',
		);
	});

	it("renders og:video media tags without setting og:type when no subtype", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				video: { src: "https://example.com/clip.webm", width: 640, height: 360 },
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="og:video" content="https://example.com/clip.webm"><meta property="og:video:type" content="video/webm"><meta property="og:video:width" content="640"><meta property="og:video:height" content="360">',
		);
	});

	// ── og:type = website fallback objects ────────────────────────────────────

	it("falls back og:type=website for business and renders business tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				business: {
					contactData: {
						streetAddress: "1 Hacker Way",
						locality: "Menlo Park",
						region: "CA",
						postalCode: "94025",
						countryName: "US",
					},
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="business:contact_data:street_address" content="1 Hacker Way"><meta property="business:contact_data:locality" content="Menlo Park"><meta property="business:contact_data:region" content="CA"><meta property="business:contact_data:postal_code" content="94025"><meta property="business:contact_data:country_name" content="US">',
		);
	});

	it("renders business hours tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				business: {
					hours: [
						{ day: "Monday", start: "09:00", end: "17:00" },
						{ day: "Friday", start: "09:00", end: "15:00" },
					],
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="business:hours:day" content="Monday"><meta property="business:hours:start" content="09:00"><meta property="business:hours:end" content="17:00"><meta property="business:hours:day" content="Friday"><meta property="business:hours:start" content="09:00"><meta property="business:hours:end" content="15:00">',
		);
	});

	it("falls back og:type=website for place and renders place tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				place: { latitude: 37.416343, longitude: -122.153013, altitude: 0 },
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="place:location:latitude" content="37.416343"><meta property="place:location:longitude" content="-122.153013"><meta property="place:location:altitude" content="0">',
		);
	});

	it("falls back og:type=website for product and renders product tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				product: {
					originalPrice: { amount: 29.99, currency: "USD" },
					condition: "new",
					availability: "instock",
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="product:original_price:amount" content="29.99"><meta property="product:original_price:currency" content="USD"><meta property="product:condition" content="new"><meta property="product:availability" content="instock">',
		);
	});

	it("renders product sale price and date range tags", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				product: {
					salePrice: { amount: 19.99, currency: "EUR" },
					salePriceDates: { start: "2026-01-01", end: "2026-01-31" },
				},
			},
		});

		expect(result).toBe(
			'<meta property="og:type" content="website"><meta property="product:sale_price:amount" content="19.99"><meta property="product:sale_price:currency" content="EUR"><meta property="product:sale_price_dates:start" content="2026-01-01"><meta property="product:sale_price_dates:end" content="2026-01-31">',
		);
	});

	// ── Priority: article > book > profile ────────────────────────────────────

	it("article takes priority in og:type inference when multiple type objects are provided", async () => {
		const result = await container.renderToString(OpenGraph, {
			props: {
				article: { section: "Tech" },
				profile: { username: "user" },
			},
		});

		expect(result).toContain('<meta property="og:type" content="article">');
		expect(result).toContain('<meta property="article:section" content="Tech">');
		expect(result).toContain('<meta property="profile:username" content="user">');
	});
});
