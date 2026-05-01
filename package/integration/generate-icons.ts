import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ResizeOptions } from "sharp";
import type { IntegrationRuntimeContext } from ".";
import { inferImageMimeType, isSvg } from "../utils";

export const SUPPORTED_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "avif",
  "svg",
  "ico",
] as const;

export type SupportedExtensions = (typeof SUPPORTED_EXTENSIONS)[number];
export type RasterSupportedExtensions = Exclude<
  SupportedExtensions,
  "ico" | "svg"
>;
export type IconFileName = `${string}.${SupportedExtensions}`;
export type SharpOptions = ResizeOptions;

export interface IconTag {
  rel: string;
  href: string;
  sizes?: string;
  type?: string;
  media?: "light" | "dark" | (string & {});
  [key: string]: string | undefined;
}

type IconTagInput = Partial<IconTag> & Pick<IconTag, "rel">;

export interface ManifestIconItem {
  src: string;
  sizes?: string;
  type?: string;
  purpose?: string;
}

export interface ManifestIconOptions {
  src?: string;
  sizes?: string;
  type?: string;
  purpose?: string;
}

interface BaseIconDefinition {
  tag?: IconTagInput;
  manifest?: boolean | ManifestIconOptions;
}

export interface IcoIconDefinition extends BaseIconDefinition {
  sizes: number[] | false;
  source?: string;
  sharpOptions?: SharpOptions;
}

export interface SvgIconDefinition extends BaseIconDefinition {
  size?: never;
  source?: never;
  sharpOptions?: never;
}

export interface RasterIconDefinition extends BaseIconDefinition {
  size: number | false;
  source?: string;
  sharpOptions?: SharpOptions;
}

type IconDefinition =
  | IcoIconDefinition
  | SvgIconDefinition
  | RasterIconDefinition;

export type IconsOptions = {
  source: string;
} & {
  [filename: `${string}.ico`]: IcoIconDefinition;
} & {
  [filename: `${string}.svg`]: SvgIconDefinition;
} & {
  [filename: `${string}.${RasterSupportedExtensions}`]: RasterIconDefinition;
};

interface BaseGenerationTask {
  fileName: string;
  href: string;
  source: string;
}

export interface CopyIconTask extends BaseGenerationTask {
  kind: "copy";
}

export interface IcoGenerationTask extends BaseGenerationTask {
  kind: "ico";
  sizes: number[];
  sharpOptions?: SharpOptions;
}

export interface RasterGenerationTask extends BaseGenerationTask {
  kind: "raster";
  size: number;
  format: RasterSupportedExtensions;
  sharpOptions?: SharpOptions;
}

export type IconGenerationTask =
  | CopyIconTask
  | IcoGenerationTask
  | RasterGenerationTask;

export interface ResolvedIconsOptions {
  tags: IconTag[];
  manifestIcons: ManifestIconItem[];
  generationTasks: IconGenerationTask[];
}

const ICONS_UNDEFINED_WARNING =
  "No icons were generated because options.icons is undefined. Set it to false to explicitly disable icon generation or provide a valid configuration.";
const ICON_SOURCE_UNDEFINED_WARNING =
  "No icons were generated because options.icons.source is not defined. Set it to false to explicitly disable icon generation or provide a valid source path to generate icons.";

const SUPPORTED_EXTENSION_SET = new Set<string>(SUPPORTED_EXTENSIONS);

const hasSupportedExtension = (value: string): value is IconFileName => {
  const extension = value.split(".").pop()?.toLowerCase();
  return extension !== undefined && SUPPORTED_EXTENSION_SET.has(extension);
};

const getExtension = (fileName: string): SupportedExtensions | undefined => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === undefined || !SUPPORTED_EXTENSION_SET.has(extension)) {
    return undefined;
  }

  return extension as SupportedExtensions;
};

const getIconFileExtension = (fileName: IconFileName): SupportedExtensions =>
  getExtension(fileName) as SupportedExtensions;

const isIcoDefinition = (
  fileName: IconFileName,
  _definition: IconDefinition,
): _definition is IcoIconDefinition => {
  return getIconFileExtension(fileName) === "ico";
};

const isSvgDefinition = (
  fileName: IconFileName,
  _definition: IconDefinition,
): _definition is SvgIconDefinition => {
  return getIconFileExtension(fileName) === "svg";
};

const isRasterDefinition = (
  fileName: IconFileName,
  _definition: IconDefinition,
): _definition is RasterIconDefinition => {
  const extension = getIconFileExtension(fileName);
  return extension !== "ico" && extension !== "svg";
};

const normalizeHref = (fileName: string): string =>
  fileName.startsWith("/") ? fileName : `/${fileName}`;

const inferRasterSizes = (size: number): string => `${size}x${size}`;

const inferIcoManifestSizes = (sizes: number[]): string | undefined => {
  if (sizes.length === 0) {
    return undefined;
  }

  return sizes.map((size) => `${size}x${size}`).join(" ");
};

const isFalseSizedEntry = (
  fileName: IconFileName,
  definition: IconDefinition,
): boolean => {
  if (isIcoDefinition(fileName, definition)) {
    return definition.sizes === false;
  }

  if (isSvgDefinition(fileName, definition)) {
    return false;
  }

  if (!isRasterDefinition(fileName, definition)) {
    return false;
  }

  return definition.size === false;
};

const getDefinitionSource = (
  definition: IconDefinition,
  fallbackSource: string,
): string => {
  if ("source" in definition && typeof definition.source === "string") {
    return definition.source;
  }

  return fallbackSource;
};

const getDefinitionSharpOptions = (
  definition: IconDefinition,
): SharpOptions | undefined => {
  if ("sharpOptions" in definition) {
    return definition.sharpOptions;
  }

  return undefined;
};

const resolveTagSizes = (
  fileName: IconFileName,
  definition: IconDefinition,
): string | undefined => {
  if (isIcoDefinition(fileName, definition)) {
    return definition.tag?.sizes;
  }

  if (isSvgDefinition(fileName, definition)) {
    return definition.tag?.sizes;
  }

  if (!isRasterDefinition(fileName, definition)) {
    return undefined;
  }

  if (definition.size === false) {
    return undefined;
  }

  return inferRasterSizes(definition.size);
};

const resolveManifestSizes = (
  fileName: IconFileName,
  definition: IconDefinition,
): string | undefined => {
  if (isIcoDefinition(fileName, definition)) {
    return definition.sizes === false
      ? undefined
      : inferIcoManifestSizes(definition.sizes);
  }

  if (isSvgDefinition(fileName, definition)) {
    return undefined;
  }

  if (!isRasterDefinition(fileName, definition)) {
    return undefined;
  }

  if (definition.size === false) {
    return undefined;
  }

  return inferRasterSizes(definition.size);
};

const resolveTagType = (
  fileName: IconFileName,
  definition: IconDefinition,
): string | undefined => {
  return definition.tag?.type ?? inferImageMimeType(fileName);
};

const resolveIconTag = (
  fileName: IconFileName,
  definition: IconDefinition,
): IconTag | undefined => {
  if (
    isFalseSizedEntry(fileName, definition) ||
    definition.tag?.rel === undefined
  ) {
    return undefined;
  }

  const href = normalizeHref(fileName);
  const sizes = resolveTagSizes(fileName, definition);
  const type = resolveTagType(fileName, definition);

  return {
    ...definition.tag,
    rel: definition.tag.rel,
    href,
    sizes,
    type,
  };
};

const resolveManifestIcon = (
  fileName: IconFileName,
  definition: IconDefinition,
): ManifestIconItem | undefined => {
  if (isFalseSizedEntry(fileName, definition) || !definition.manifest) {
    return undefined;
  }

  const manifestOptions =
    definition.manifest === true ? {} : definition.manifest;

  return {
    src: manifestOptions.src ?? normalizeHref(fileName),
    sizes: manifestOptions.sizes ?? resolveManifestSizes(fileName, definition),
    type: manifestOptions.type ?? inferImageMimeType(fileName),
    purpose: manifestOptions.purpose,
  };
};

const normalizeSharpFormat = (
  extension: RasterSupportedExtensions,
): keyof import("sharp").FormatEnum => {
  if (extension === "jpg") {
    return "jpeg";
  }

  return extension;
};

const resolveGenerationTask = (
  fileName: IconFileName,
  definition: IconDefinition,
  fallbackSource: string,
): IconGenerationTask | undefined => {
  if (isFalseSizedEntry(fileName, definition)) {
    return undefined;
  }

  const href = normalizeHref(fileName);
  const source = getDefinitionSource(definition, fallbackSource);
  const sharpOptions = getDefinitionSharpOptions(definition);

  if (isSvgDefinition(fileName, definition)) {
    return undefined;
  }

  if (isIcoDefinition(fileName, definition)) {
    if (definition.sizes === false || definition.sizes.length === 0) {
      return undefined;
    }

    return {
      kind: "ico",
      fileName,
      href,
      source,
      sizes: definition.sizes,
      sharpOptions,
    };
  }

  if (!isRasterDefinition(fileName, definition)) {
    return undefined;
  }

  if (definition.size === false) {
    return undefined;
  }

  return {
    kind: "raster",
    fileName,
    href,
    source,
    size: definition.size,
    format: getIconFileExtension(fileName) as RasterSupportedExtensions,
    sharpOptions,
  };
};

const getIconDefinitions = (
  icons: IconsOptions,
): Array<[IconFileName, IconDefinition]> => {
  return Object.entries(icons).filter(
    (entry): entry is [IconFileName, IconDefinition] =>
      entry[0] !== "source" && hasSupportedExtension(entry[0]),
  );
};

export const resolveIconsOptions = (
  icons: IconsOptions | false | undefined,
): ResolvedIconsOptions => {
  if (icons === false || icons === undefined) {
    return { tags: [], manifestIcons: [], generationTasks: [] };
  }

  const explicitDefinitions = getIconDefinitions(icons);
  const explicitFileNames = new Set(
    explicitDefinitions.map(([fileName]) => fileName),
  );
  const tags: IconTag[] = [];
  const manifestIcons: ManifestIconItem[] = [];
  const generationTasks: IconGenerationTask[] = [];

  for (const [fileName, definition] of explicitDefinitions) {
    const tag = resolveIconTag(fileName, definition);
    if (tag) {
      tags.push(tag);
    }

    const manifestIcon = resolveManifestIcon(fileName, definition);
    if (manifestIcon) {
      manifestIcons.push(manifestIcon);
    }

    const generationTask = resolveGenerationTask(
      fileName,
      definition,
      icons.source,
    );
    if (generationTask) {
      generationTasks.push(generationTask);
    }
  }

  if (isSvg(icons.source) && !explicitFileNames.has("favicon.svg")) {
    tags.unshift({
      rel: "icon",
      href: "/favicon.svg",
      sizes: "any",
      type: inferImageMimeType("favicon.svg"),
    });

    generationTasks.unshift({
      kind: "copy",
      fileName: "favicon.svg",
      href: "/favicon.svg",
      source: icons.source,
    });
  }

  return {
    tags,
    manifestIcons,
    generationTasks,
  };
};

export const resolveHeadIconTagsFromIconsOptions = (
  icons: IconsOptions | false | undefined,
): IconTag[] => {
  return resolveIconsOptions(icons).tags;
};

export function resolveManifestIconsFromIconsOptions(
  icons: IconsOptions | false | undefined,
): ManifestIconItem[] {
  return resolveIconsOptions(icons).manifestIcons;
}

function validateSource(sourceFile: string): {
  isValid: boolean;
  isSvg: boolean;
  error?: string;
} {
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
    const sharpModuleId = "sharp";
    const module = await import(sharpModuleId);
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
    const sharpIcoModuleId = "sharp-ico";
    const module = await import(sharpIcoModuleId);
    return module.sharpsToIco;
  } catch (error) {
    logger.error(
      `favicon.ico was not generated because optional dependency \"sharp-ico\" could not be loaded: ${getErrorMessage(error)}. Install it with \"pnpm add sharp-ico\" (or \"npm install sharp-ico\").`,
    );
    return null;
  }
}

async function writeRasterIcon(
  outputDir: string,
  task: RasterGenerationTask,
  sharp: NonNullable<Awaited<ReturnType<typeof loadSharp>>>,
): Promise<void> {
  const outputPath = join(outputDir, task.fileName);
  await mkdir(dirname(outputPath), { recursive: true });

  const buffer = await sharp(task.source)
    .resize(task.size, task.size, task.sharpOptions)
    .toFormat(normalizeSharpFormat(task.format))
    .toBuffer();

  await writeFile(outputPath, buffer);
}

async function writeIcoIcon(
  outputDir: string,
  task: IcoGenerationTask,
  sharp: NonNullable<Awaited<ReturnType<typeof loadSharp>>>,
  sharpsToIco: NonNullable<Awaited<ReturnType<typeof loadSharpsToIco>>>,
): Promise<void> {
  const outputPath = join(outputDir, task.fileName);
  await mkdir(dirname(outputPath), { recursive: true });

  await sharpsToIco([sharp(task.source)], outputPath, {
    sizes: task.sizes,
    resizeOptions: task.sharpOptions ?? {},
  });
}

async function writeCopiedIcon(
  outputDir: string,
  task: CopyIconTask,
): Promise<void> {
  const outputPath = join(outputDir, task.fileName);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, await readFile(resolve(task.source)));
}

export async function generateIcons({
  dir,
  options,
  logger,
}: IntegrationRuntimeContext): Promise<void> {
  const outputDir = fileURLToPath(dir);
  const icons = options.icons;
  if (icons === false) return;

  if (icons === undefined) {
    logger.warn(ICONS_UNDEFINED_WARNING);
    return;
  }

  if (icons.source === undefined) {
    logger.warn(ICON_SOURCE_UNDEFINED_WARNING);
    return;
  }

  const resolvedIcons = resolveIconsOptions(icons);
  if (resolvedIcons.generationTasks.length === 0) {
    return;
  }

  const sourceValidationCache = new Map<
    string,
    ReturnType<typeof validateSource>
  >();
  const getSourceValidation = (sourceFile: string) => {
    const cached = sourceValidationCache.get(sourceFile);
    if (cached) {
      return cached;
    }

    const validation = validateSource(sourceFile);
    sourceValidationCache.set(sourceFile, validation);
    return validation;
  };

  for (const task of resolvedIcons.generationTasks) {
    if (task.kind !== "copy") {
      continue;
    }

    const { isValid, error } = getSourceValidation(task.source);
    if (!isValid) {
      logger.error(`Icon source validation failed: ${error}`);
      continue;
    }

    await writeCopiedIcon(outputDir, task);
  }

  const sharpTasks = resolvedIcons.generationTasks.filter(
    (task): task is IcoGenerationTask | RasterGenerationTask =>
      task.kind !== "copy",
  );

  if (sharpTasks.length === 0) {
    return;
  }

  const validSharpTasks = sharpTasks.filter((task) => {
    const { isValid, error } = getSourceValidation(task.source);
    if (!isValid) {
      logger.error(`Icon source validation failed: ${error}`);
      return false;
    }

    return true;
  });

  if (validSharpTasks.length === 0) {
    return;
  }

  const sharp = await loadSharp(logger);
  if (!sharp) {
    return;
  }

  let sharpsToIco: Awaited<ReturnType<typeof loadSharpsToIco>> | null = null;

  for (const task of validSharpTasks) {
    if (task.kind === "ico") {
      sharpsToIco ??= await loadSharpsToIco(logger);
      if (!sharpsToIco) {
        continue;
      }

      await writeIcoIcon(outputDir, task, sharp, sharpsToIco);
      continue;
    }

    await writeRasterIcon(outputDir, task, sharp);
  }
}
