import type { IntegrationRuntimeContext } from "@package/integration";
import {
	generateManifest,
	WEB_MANIFEST_RECOMMENDATION,
	WEB_MANIFEST_RELATIVE_PATH,
} from "@package/integration/manifest";
import type { AstroConfig } from "astro";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Integration - WebManifest", () => {
	let outputDir: string;
	let outDirUrl: URL;
	let logger: TestLogger;

	beforeEach(async () => {
		outputDir = join(tmpdir(), `eminence-manifest-${randomUUID()}`);
		outDirUrl = pathToFileURL(outputDir + "/");
		logger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };

		await mkdir(outputDir, { recursive: true });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	const createContext = (
		manifest: IntegrationRuntimeContext["options"]["manifest"],
		extraOptions: Partial<IntegrationRuntimeContext["options"]> = {},
	): IntegrationRuntimeContext => ({
		config: { outDir: outDirUrl } as unknown as AstroConfig,
		dir: outDirUrl,
		options: { manifest, ...extraOptions },
		logger: logger as unknown as IntegrationRuntimeContext["logger"],
	});

	it("writes a valid manifest.webmanifest with all fields", async () => {
		await generateManifest(
			createContext({
				name: "My App",
				short_name: "App",
				start_url: "/",
				display: "standalone",
				icons: [
					{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
					{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
				],
				description: "A great app",
				background_color: "#ffffff",
				theme_color: "#000000",
				scope: "/",
				orientation: "portrait",
				id: "my-app",
				categories: ["productivity"],
				screenshots: [{ src: "/screenshots/home.png", sizes: "1280x720", type: "image/png" }],
				shortcuts: [{ name: "New Note", url: "/notes/new" }],
				related_applications: [{ platform: "play", id: "com.example.app" }],
				prefer_related_applications: false,
				file_handlers: [{ action: "/open-file", accept: { "text/plain": [".txt"] } }],
				protocol_handlers: [{ protocol: "web+example", url: "/handle?url=%s" }],
				share_target: { action: "/share", method: "POST", enctype: "multipart/form-data" },
				launch_handler: { client_mode: "navigate-existing" },
				note_taking: { new_note_shortcut: { url: "/notes/new" } },
				scope_extensions: [{ origin: "https://example.com" }],
				serviceworker: { src: "/sw.js" },
			}),
		);

		const raw = await readFile(join(outputDir, "manifest.webmanifest"), "utf-8");
		const result = JSON.parse(raw);

		expect(result.name).toBe("My App");
		expect(result.short_name).toBe("App");
		expect(result.start_url).toBe("/");
		expect(result.display).toBe("standalone");
		expect(result.icons).toHaveLength(2);
		expect(result.description).toBe("A great app");
		expect(result.background_color).toBe("#ffffff");
		expect(result.theme_color).toBe("#000000");
		expect(result.scope).toBe("/");
		expect(result.orientation).toBe("portrait");
		expect(result.id).toBe("my-app");
		expect(result.categories).toEqual(["productivity"]);
		expect(result.screenshots).toHaveLength(1);
		expect(result.shortcuts).toHaveLength(1);
		expect(result.related_applications).toHaveLength(1);
		expect(result.prefer_related_applications).toBe(false);
		expect(result.file_handlers).toHaveLength(1);
		expect(result.protocol_handlers).toHaveLength(1);
		expect(result.share_target.action).toBe("/share");
		expect(result.launch_handler.client_mode).toBe("navigate-existing");
		expect(result.note_taking.new_note_shortcut.url).toBe("/notes/new");
		expect(result.scope_extensions).toEqual([{ origin: "https://example.com" }]);
		expect(result.serviceworker.src).toBe("/sw.js");
		expect(logger.info).toHaveBeenCalledWith(`Generated "${WEB_MANIFEST_RELATIVE_PATH}"`);
	});

	it("writes a minimal manifest using name and display", async () => {
		await generateManifest(
			createContext({
				name: "Minimal App",
				start_url: "/",
				display: "standalone",
				icons: [
					{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
					{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
				],
			}),
		);

		const raw = await readFile(join(outputDir, "manifest.webmanifest"), "utf-8");
		const result = JSON.parse(raw);

		expect(result.name).toBe("Minimal App");
		expect(result.start_url).toBe("/");
		expect(result.display).toBe("standalone");
		expect(result.icons).toHaveLength(2);
		expect(result).not.toHaveProperty("short_name");
		expect(logger.info).toHaveBeenCalledWith(`Generated "${WEB_MANIFEST_RELATIVE_PATH}"`);
	});

	it("writes a minimal manifest using short_name and display_override", async () => {
		await generateManifest(
			createContext({
				short_name: "App",
				start_url: "/",
				display_override: ["window-controls-overlay", "standalone"],
				icons: [
					{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
					{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
				],
			}),
		);

		const raw = await readFile(join(outputDir, "manifest.webmanifest"), "utf-8");
		const result = JSON.parse(raw);

		expect(result.short_name).toBe("App");
		expect(result.display_override).toEqual(["window-controls-overlay", "standalone"]);
		expect(result).not.toHaveProperty("name");
		expect(result).not.toHaveProperty("display");
		expect(logger.info).toHaveBeenCalledWith(`Generated "${WEB_MANIFEST_RELATIVE_PATH}"`);
	});

	it("auto-populates manifest icons from keyed icon entries when icons are omitted", async () => {
		await generateManifest(
			createContext(
				{
					name: "Auto Icons App",
					start_url: "/",
					display: "standalone",
				},
				{
					icons: {
						source: "/assets/logo.png",
						"icon-192x192.png": { size: 192, tag: { rel: "icon" }, manifest: true },
						"icon.png": { size: 512, tag: { rel: "icon" }, manifest: true },
					},
				},
			),
		);

		const raw = await readFile(join(outputDir, "manifest.webmanifest"), "utf-8");
		const result = JSON.parse(raw);

		expect(result.icons).toEqual([
			{ src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icon.png", sizes: "512x512", type: "image/png" },
		]);
	});

	it("merges explicit manifest icons over auto-populated generated icons", async () => {
		await generateManifest(
			createContext(
				{
					name: "Explicit Icons App",
					start_url: "/",
					display: "standalone",
					icons: [{ src: "/explicit.png", sizes: "1024x1024", type: "image/png" }],
				},
				{
					icons: {
						source: "/assets/logo.png",
						"icon-192x192.png": { size: 192, tag: { rel: "icon" }, manifest: true },
					},
				},
			),
		);

		const raw = await readFile(join(outputDir, "manifest.webmanifest"), "utf-8");
		const result = JSON.parse(raw);

		expect(result.icons).toEqual([
			{ src: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
			{ src: "/explicit.png", sizes: "1024x1024", type: "image/png" },
		]);
	});

	it("overrides auto-populated generated icons when manifest icons share the same src", async () => {
		await generateManifest(
			createContext(
				{
					name: "Explicit Icons App",
					start_url: "/",
					display: "standalone",
					icons: [{ src: "/icon-192x192.png", sizes: "200x200", type: "image/custom" }],
				},
				{
					icons: {
						source: "/assets/logo.png",
						"icon-192x192.png": { size: 192, tag: { rel: "icon" }, manifest: true },
					},
				},
			),
		);

		const raw = await readFile(join(outputDir, "manifest.webmanifest"), "utf-8");
		const result = JSON.parse(raw);

		expect(result.icons).toEqual([{ src: "/icon-192x192.png", sizes: "200x200", type: "image/custom" }]);
	});

	it("logs info when manifest is false and file already exists", async () => {
		await writeFile(join(outputDir, "manifest.webmanifest"), "{}", "utf-8");

		await generateManifest(createContext(false));

		expect(logger.info).toHaveBeenCalledWith(
			`No "${WEB_MANIFEST_RELATIVE_PATH}" file was generated nor modified because it already exists.`,
		);
	});

	it("logs info when manifest is false and no file exists", async () => {
		await generateManifest(createContext(false));

		expect(logger.info).toHaveBeenCalledWith(
			`No "${WEB_MANIFEST_RELATIVE_PATH}" file exists and no file was generated.`,
		);
	});

	it("warns with recommendation when manifest is undefined", async () => {
		await generateManifest(createContext(undefined));

		expect(logger.warn).toHaveBeenCalledWith(
			`No manifest.webmanifest file was generated because manifest is undefined. ${WEB_MANIFEST_RECOMMENDATION}`,
		);
	});

	it("warns and disables generation when manifest.webmanifest already exists", async () => {
		await writeFile(join(outputDir, "manifest.webmanifest"), "{}", "utf-8");
		const context = createContext({
			name: "My App",
			start_url: "/",
			display: "standalone",
			icons: [
				{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
				{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
			],
		});

		await expect(generateManifest(context)).resolves.toBeUndefined();
		expect(context.options.manifest).toBe(false);

		expect(logger.warn).toHaveBeenCalledWith(
			`Could not generate "${WEB_MANIFEST_RELATIVE_PATH}" because it already exists. Disabling manifest generation for this build.`,
		);
	});

	it("output file ends with a newline", async () => {
		await generateManifest(
			createContext({
				name: "My App",
				start_url: "/",
				display: "standalone",
				icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
			}),
		);

		const raw = await readFile(join(outputDir, "manifest.webmanifest"), "utf-8");
		expect(raw.endsWith("\n")).toBe(true);
	});
});
