import { constants } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { IntegrationRuntimeContext } from ".";
import { resolveManifestIconsFromIconsOptions } from "./generate-icons";

export type WebManifestIconItem = {
  src: string;
  sizes?: string;
  type?: string;
  purpose?: string;
};

export type WebManifestScreenshotItem = {
  src: string;
  sizes?: string;
  type?: string;
  label?: string;
  form_factor?: string;
  platform?: string;
};

export type WebManifestShortcutItem = {
  name: string;
  url: string;
  short_name?: string;
  description?: string;
  icons?: WebManifestIconItem[];
};

export type WebManifestRelatedApplication = {
  platform: string;
  url?: string;
  id?: string;
};

export type WebManifestFileHandler = {
  action: string;
  accept: Record<string, string[]>;
};

export type WebManifestProtocolHandler = {
  protocol: string;
  url: string;
};

export type WebManifestShareTarget = {
  action: string;
  method?: string;
  enctype?: string;
  params?: Record<string, string>;
};

export type WebManifestLaunchHandler = {
  client_mode?: string | string[];
};

export type WebManifestServiceWorker = {
  src: string;
  scope?: string;
  type?: string;
  update_via_cache?: string;
};

type NameOrShortName =
  | { name: string; short_name?: string }
  | { short_name: string; name?: never };

type DisplayOrDisplayOverride =
  | { display: string; display_override?: string[] }
  | { display_override: string[]; display?: never };

type WebManifestBase = {
  start_url: string;
  icons?: WebManifestIconItem[];
  prefer_related_applications?: false;
  description?: string;
  background_color?: string;
  theme_color?: string;
  scope?: string;
  orientation?: string;
  id?: string;
  categories?: string[];
  screenshots?: WebManifestScreenshotItem[];
  shortcuts?: WebManifestShortcutItem[];
  related_applications?: WebManifestRelatedApplication[];
  file_handlers?: WebManifestFileHandler[];
  protocol_handlers?: WebManifestProtocolHandler[];
  share_target?: WebManifestShareTarget;
  launch_handler?: WebManifestLaunchHandler;
  note_taking?: { new_note_shortcut?: { url: string } };
  scope_extensions?: Array<{ origin: string }>;
  serviceworker?: WebManifestServiceWorker;
};

export type WebManifestOptions = NameOrShortName &
  DisplayOrDisplayOverride &
  WebManifestBase;

export const WEB_MANIFEST_RECOMMENDATION =
  "Recommendation: follow todo.com/later-create-article to learn why adding a manifest.webmanifest is important.";

export const WEB_MANIFEST_RELATIVE_PATH = "/manifest.webmanifest";

const resolveManifestInput = (
  input: WebManifestOptions,
  options: IntegrationRuntimeContext["options"],
): WebManifestOptions => {
  const autoIcons = resolveManifestIconsFromIconsOptions(options.icons);
  if (autoIcons.length === 0 && input.icons === undefined) {
    return input;
  }

  if (input.icons === undefined) {
    return {
      ...input,
      icons: autoIcons,
    };
  }

  const iconsBySrc = new Map<string, WebManifestIconItem>();

  for (const icon of autoIcons) {
    iconsBySrc.set(icon.src, icon);
  }

  for (const icon of input.icons) {
    iconsBySrc.set(icon.src, icon);
  }

  return {
    ...input,
    icons: Array.from(iconsBySrc.values()),
  };
};

const buildManifest = (options: WebManifestOptions): string => {
  return `${JSON.stringify(options, null, 2)}\n`;
};

const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }

    throw error;
  }
};

export async function generateManifest({
  dir,
  options,
  logger,
}: IntegrationRuntimeContext): Promise<void> {
  const input = options.manifest;
  const outputPath = join(fileURLToPath(dir), "manifest.webmanifest");
  const outputExists = await exists(outputPath);

  if (input === false) {
    if (outputExists) {
      logger.info(
        `No "${WEB_MANIFEST_RELATIVE_PATH}" file was generated nor modified because it already exists.`,
      );
    } else {
      logger.info(
        `No "${WEB_MANIFEST_RELATIVE_PATH}" file exists and no file was generated.`,
      );
    }

    return;
  }

  if (input === undefined) {
    logger.warn(
      `No manifest.webmanifest file was generated because manifest is undefined. ${WEB_MANIFEST_RECOMMENDATION}`,
    );
    return;
  }

  if (typeof input !== "object" || input === null) {
    logger.error(
      "Invalid manifest configuration: expected an object with required PWA fields.",
    );
    throw new Error(
      "Invalid manifest configuration: expected an object with required PWA fields.",
    );
  }

  if (outputExists) {
    logger.warn(
      `Could not generate "${WEB_MANIFEST_RELATIVE_PATH}" because it already exists. Disabling manifest generation for this build.`,
    );
    options.manifest = false;
    return;
  }

  try {
    const normalizedInput = resolveManifestInput(input, options);
    const content = buildManifest(normalizedInput);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, content, "utf-8");
    logger.info(`Generated "${WEB_MANIFEST_RELATIVE_PATH}"`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(
      `Failed to generate "${WEB_MANIFEST_RELATIVE_PATH}": ${message}`,
    );
    throw error;
  }
}
