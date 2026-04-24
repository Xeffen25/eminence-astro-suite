import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { IntegrationRuntimeContext } from "../integration";
import { isSvg } from "../utils";

export interface IconTag {
	rel: string;
	href: string;
	sizes?: string;
	type?: string;
	media?: "light" | "dark" | (string & {});
}

export interface GeneratedIconTag extends Omit<IconTag, "href"> {
	fileName: string;
	size: number; // Sizes and size are related but size is used for generation while sizes is used for the link tag. For example, size can be 32 but sizes can be "16x16 32x32" or "any" so must keep separate.
	format: "png" | "jpg" | "jpeg" | "gif" | "webp" | "avif";
}

export interface IconsOptions {
	source?: string | false;
	overrides?: {
		ico?: string | false;
		svg?: string | false;
		png32?: string | false;
		png48?: string | false;
		png192?: string | false;
		png512?: string | false;
		appleTouchIcon?: string | false;
	};
	customGeneration?: GeneratedIconTag[];
	customTags?: IconTag[];
}

// Default icons configuration except svg as handled separately due to its unique nature (no resizing needed, just copy).
const DEFAULT_ICONS = {
	png32: {
		fileName: "favicon.png",
		size: 32,
		format: "png",
		rel: "icon",
		type: "image/png",
		sizes: "32x32",
	},
	png48: {
		fileName: "favicon-48x48.png",
		size: 48,
		format: "png",
		rel: "icon",
		type: "image/png",
		sizes: "48x48",
	},
	appleTouchIcon: {
		fileName: "apple-touch-icon.png",
		size: 180,
		format: "png",
		rel: "apple-touch-icon",
		type: "image/png",
		sizes: "180x180",
	},
	png192: {
		fileName: "icon-192x192.png",
		size: 192,
		format: "png",
		rel: "icon",
		type: "image/png",
		sizes: "192x192",
	},
	png512: {
		fileName: "icon.png",
		size: 512,
		format: "png",
		rel: "icon",
		type: "image/png",
		sizes: "512x512",
	},
} satisfies Record<string, GeneratedIconTag>;

function validateSource(sourceFile: string): { isValid: boolean; isSvg: boolean; error?: string } {
	const resolvedPath = resolve(sourceFile);
	if (!existsSync(resolvedPath)) {
		return {
			isValid: false,
			isSvg: false,
			error: `Icon source file not found: ${sourceFile}`,
		};
	}

	return {
		isValid: true,
		isSvg: isSvg(sourceFile),
	};
}

function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

async function loadSharp(logger: IntegrationRuntimeContext["logger"]) {
	try {
		const module = await import("sharp");
		return module.default;
	} catch (error) {
		logger.error(
			`Icon generation skipped because optional dependency \"sharp\" could not be loaded: ${getErrorMessage(error)}. Install it with \"pnpm add sharp\" (or \"npm install sharp\").`,
		);
		return null;
	}
}

async function loadSharpsToIco(logger: IntegrationRuntimeContext["logger"]) {
	try {
		const module = await import("sharp-ico");
		return module.sharpsToIco;
	} catch (error) {
		logger.error(
			`favicon.ico was not generated because optional dependency \"sharp-ico\" could not be loaded: ${getErrorMessage(error)}. Install it with \"pnpm add sharp-ico\" (or \"npm install sharp-ico\").`,
		);
		return null;
	}
}

async function writeIcon(
	outputDir: string,
	sourceFile: string,
	icon: GeneratedIconTag,
	sharp: NonNullable<Awaited<ReturnType<typeof loadSharp>>>,
): Promise<void> {
	const outputPath = join(outputDir, icon.fileName);
	await mkdir(dirname(outputPath), { recursive: true });

	const buffer = await sharp(sourceFile).resize(icon.size, icon.size).toFormat(icon.format).toBuffer();

	await writeFile(outputPath, buffer);
}

async function writeFaviconIco(
	outputDir: string,
	sourceFile: string,
	sharp: NonNullable<Awaited<ReturnType<typeof loadSharp>>>,
	sharpsToIco: NonNullable<Awaited<ReturnType<typeof loadSharpsToIco>>>,
): Promise<void> {
	const outputPath = join(outputDir, "favicon.ico");
	await mkdir(dirname(outputPath), { recursive: true });

	await sharpsToIco([sharp(sourceFile)], outputPath, {
		sizes: [16, 32, 48],
		resizeOptions: {},
	});
}

export async function generateIcons({ dir, options, logger }: IntegrationRuntimeContext): Promise<void> {
	const outputDir = fileURLToPath(dir);
	const icons = options.icons;
	if (icons === false) return;

	if (icons === undefined) {
		logger.warn(
			"No icons were generated because options.icons is undefined. Set it to false to explicitly disable icon generation or provide a valid configuration.",
		);
		return;
	}

	const source = icons.source;
	if (source === false) return;

	if (source === undefined) {
		logger.warn(
			"No icons were generated because options.icons.source is not defined. Set it to false to explicitly disable icon generation or provide a valid source path to generate icons.",
		);
		return;
	}

	const resolvedSource = resolve(source);

	const { isValid, isSvg, error } = validateSource(source);

	if (!isValid) {
		logger.error(`Icon source validation failed: ${error}`);
		return;
	}

	if (isSvg && icons.overrides?.svg !== false && typeof icons.overrides?.svg !== "string") {
		const outputPath = join(fileURLToPath(dir), "favicon.svg");
		await mkdir(dirname(outputPath), { recursive: true });
		await writeFile(outputPath, await readFile(resolvedSource));
	}

	const iconsToGenerate: GeneratedIconTag[] = [];
	const overrides = icons.overrides ?? {};

	// Determine which icons to generate based on overrides.
	for (const [key, defaultIcon] of Object.entries(DEFAULT_ICONS)) {
		const overrideValue = overrides[key as keyof typeof overrides];
		// If override is not defined, use default icon. If it is defined then no icon will be generated for that key, as it's either a custom path or explicitly disabled.
		if (overrideValue === undefined) {
			iconsToGenerate.push(defaultIcon);
		}
	}

	// Add any custom icons specified in the configuration.
	for (const customIcon of icons.customGeneration ?? []) {
		iconsToGenerate.push(customIcon);
	}

	const shouldGenerateIco = icons.overrides?.ico === undefined;
	const shouldGenerateRasterIcons = iconsToGenerate.length > 0;

	if (!shouldGenerateIco && !shouldGenerateRasterIcons) {
		return;
	}

	const sharp = await loadSharp(logger);
	if (!sharp) {
		return;
	}

	if (shouldGenerateIco) {
		const sharpsToIco = await loadSharpsToIco(logger);
		if (sharpsToIco) {
			await writeFaviconIco(outputDir, resolvedSource, sharp, sharpsToIco);
		}
	}

	for (const icon of iconsToGenerate) {
		await writeIcon(outputDir, resolvedSource, icon, sharp);
	}
}
