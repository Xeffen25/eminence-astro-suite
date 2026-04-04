import type { IntegrationRuntimeContext } from "@package/integration";
import { generateIcons } from "@package/integration/generate-icons";
import type { AstroConfig } from "astro";
import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import sharp from "sharp";
import { beforeEach, describe, expect, it, vi } from "vitest";

const ICONS_UNDEFINED_WARNING =
	"No icons were generated because options.icons is undefined. Set it to false to explicitly disable icon generation or provide a valid configuration.";
const ICON_SOURCE_UNDEFINED_WARNING =
	"No icons were generated because options.icons.source is not defined. Set it to false to explicitly disable icon generation or provide a valid source path to generate icons.";

describe("Integration - Generate Icons", () => {
	let outputDir: string;
	let sourceDir: string;
	let logger: TestLogger;

	beforeEach(async () => {
		outputDir = join(tmpdir(), `eminence-astro-suite-output-${randomUUID()}`);
		sourceDir = join(tmpdir(), `eminence-astro-suite-source-${randomUUID()}`);
		logger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };

		await mkdir(outputDir, { recursive: true });
		await mkdir(sourceDir, { recursive: true });
	});

	const createContext = (options: IntegrationRuntimeContext["options"]): IntegrationRuntimeContext => ({
		config: { outDir: pathToFileURL(`${outputDir}/`) } as AstroConfig,
		options,
		logger: logger as unknown as IntegrationRuntimeContext["logger"],
	});

	it("warns when icons options are undefined", async () => {
		await generateIcons(createContext({}));

		expect(logger.warn).toHaveBeenCalledWith(ICONS_UNDEFINED_WARNING);
	});

	it("returns silently when icons is false", async () => {
		await generateIcons(createContext({ icons: false }));

		expect(logger.warn).not.toHaveBeenCalled();
		expect(logger.error).not.toHaveBeenCalled();
	});

	it("warns when icons.source is undefined", async () => {
		await generateIcons(createContext({ icons: {} }));

		expect(logger.warn).toHaveBeenCalledWith(ICON_SOURCE_UNDEFINED_WARNING);
	});

	it("logs an error when source file does not exist", async () => {
		await generateIcons(
			createContext({
				icons: {
					source: join(sourceDir, "missing.png"),
				},
			}),
		);

		expect(logger.error).toHaveBeenCalledWith(
			expect.stringContaining("Icon source validation failed: Icon source file not found:"),
		);
	});

	it("generates default icon files from a png source", async () => {
		const source = join(sourceDir, "source.png");
		await sharp({
			create: {
				width: 1024,
				height: 1024,
				channels: 4,
				background: { r: 12, g: 34, b: 56, alpha: 1 },
			},
		})
			.png()
			.toFile(source);

		await generateIcons(
			createContext({
				icons: {
					source,
				},
			}),
		);

		expect(existsSync(join(outputDir, "favicon.ico"))).toBe(true);
		expect(existsSync(join(outputDir, "favicon.png"))).toBe(true);
		expect(existsSync(join(outputDir, "favicon-48x48.png"))).toBe(true);
		expect(existsSync(join(outputDir, "apple-touch-icon.png"))).toBe(true);
		expect(existsSync(join(outputDir, "icon-192x192.png"))).toBe(true);
		expect(existsSync(join(outputDir, "icon.png"))).toBe(true);
		expect(existsSync(join(outputDir, "favicon.svg"))).toBe(false);
	});

	it("copies favicon.svg when source is svg", async () => {
		const source = join(sourceDir, "source.svg");
		await writeFile(
			source,
			'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="black"/></svg>',
			"utf-8",
		);

		await generateIcons(
			createContext({
				icons: {
					source,
				},
			}),
		);

		expect(existsSync(join(outputDir, "favicon.svg"))).toBe(true);
	});
});
